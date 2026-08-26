import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerUserSchema } from "@/lib/validations/users";
import { z } from "zod/v4";

export async function POST(request: NextRequest) {
    try{
        const body = await request.json()
        const validatedData = registerUserSchema.parse(body) 
        const{name, email, password} = validatedData

        

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
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
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
        if(error instanceof z.ZodError){
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation Failed",
                    details: error.issues
                },
                {status:400}                
            )
        }
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Something went wrong. Please try again.' },
            {status: 500}
        )
    }
}