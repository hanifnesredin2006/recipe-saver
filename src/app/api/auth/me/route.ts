import { NextResponse } from "next/server";
import {auth} from '@/lib/auth-config'
import prisma from "@/lib/prisma";

export async function Get(){
    try {
        const session = await auth()

        if (!session?.user?.email){
            return NextResponse.json(
                {success: false, error: 'Not authenticated'},
                {status: 401}
            )
        }

        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
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