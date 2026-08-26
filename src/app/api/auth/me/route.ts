import { NextResponse, NextRequest } from "next/server";
import {auth} from '@/lib/auth-config'
import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validations/users";
import bcrypt from "bcryptjs";
import z from "zod/v4";

export async function Get(){
    try {
        const session = await auth()

        if (!session?.user?.id){
            return NextResponse.json(
                {success: false, error: 'Not authenticated'},
                {status: 401}
            )
        }
        const userId = parseInt(session.user.id)

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id:true,
                email:true,
                createdAt: true,
                updatedAt: true
            }
        })

        if(!user){
            return NextResponse.json(
                {success: false, error: 'User not found'},
                {status: 404}
            )
        }

        return NextResponse.json({
            success: true,
            user
        })
    } catch(error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            {success: false, error: 'Something went wrong'},
            {status: 500}
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            )
        }

        const userId = parseInt(session.user.id)

        const body = await request.json()
        const validatedData = updateUserSchema.parse(body)

        const { name, password } = validatedData

        const updatedUserData = {
            ...(name !== undefined ? { name } : {}),
            ...(password !== undefined
                ? { password: await bcrypt.hash(password, 10) }
                : {}),
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: updatedUserData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json(
            {
                success: true,
                data: updatedUser
            }
        )

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: error.issues
                },
                { status: 400 }
            )
        }

        console.error("Error updating user", error)

        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        )
    }
}

export async function DELETE(){
    try{
        const session = await auth()
        
        if(!session?.user?.id){
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                {status: 401}
            )
        }

        const userId = parseInt(session.user.id)
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        await prisma.user.delete({
            where: {id: userId},
        })

        return NextResponse.json(
            {success: true, message: "Account deleted successfully"}
        )

    } catch(error){
        console.error("Error deleting user", error)
        return NextResponse.json(
            {success: false, error: "Failed to delete user"},
            {status: 500}
        )
    }
}