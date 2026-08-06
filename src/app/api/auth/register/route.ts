import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

interface RegisterRequest{
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try{
        const body = await request.json()
        const{email, password} = body as RegisterRequest

        if(!email || !password){
            return NextResponse.json(
                {success: false, error: "Email and Password are required"},
                {status: 400}
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please provide a valid email address' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 8 characters' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })
        if(existingUser){
            return NextResponse.json(
                { success: false, error: 'Email already registered' },
                {status: 409}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json(
            {success: true, message: "User registered successfully", user},
            {status: 201}
        )
    } catch(error){
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Something went wrong. Please try again.' },
            {status: 500}
        )
    }
}