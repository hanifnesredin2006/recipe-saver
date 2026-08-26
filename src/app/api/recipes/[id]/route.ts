//api/recipes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { updateRecipeSchema } from '@/lib/validations/recipe'
import z from 'zod/v4'
import { getRecipeForUser } from '@/lib/db/recipes'


export async function GET(request:NextRequest, {params}: {params:Promise<{id:string}>} ) {
    try {
        const session = await auth()
        if (!session?.user?.id){
            return NextResponse.json(
                {success: false, error: "Unauthorized"},
                {status: 401}
            )
        }

        const urlId = (await params).id
        const recipeId = Number(urlId)
        if (!Number.isInteger(recipeId)){
            return NextResponse.json(
                {success: false, error: "Bad Request"},
                {status: 400}
            )
        }

        const recipe = await getRecipeForUser(parseInt(session.user.id), recipeId)

        if (!recipe){
            return NextResponse.json(
                {success: false, error: "Not Found"},
                {status: 404}
            )
        }

        return NextResponse.json(
            {success: true, data: recipe}
        )

    } catch (error){
        console.error('Error fetching recipe:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch recipe' },
            { status: 500 }
        )
    }
}

export async function PUT(request:NextRequest, {params}: {params:Promise<{id: string}>}){
    try{
        const session = await auth()
        if (!session?.user?.id){
            return NextResponse.json(
                {success: false, error: "Unauthorized"},
                {status: 401}
            )
        }

        const urlId = (await params).id
        const recipeId = Number(urlId)
        if (!Number.isInteger(recipeId)){
            return NextResponse.json(
                {success: false, error: "Bad Request"},
                {status: 400}
            )
        }

        const body = await request.json()
        const validatedData = updateRecipeSchema.parse(body)
        const { 
            title, 
            duration,  
            img,
            ingredients, 
            categories,
            steps
        } = validatedData

        const updateData = {
            ...(title !== undefined ? { title } : {}),
            ...(duration !== undefined ? { duration } : {}),
            ...(img !== undefined ? { img } : {})
        }

        const recipe = await prisma.recipe.findFirst({
            where: {
                id: recipeId,
                userId: parseInt(session.user.id)
            }
        })

        if (!recipe){
            return NextResponse.json(
                {success: false, error: "Not Found"},
                {status: 404}
            )
        }

        const result = await prisma.$transaction(async (tx)=>{
            await tx.recipe.update({
                where: {
                    id: recipeId
                },
                data: updateData
            })

            if (ingredients !== undefined){
                await tx.recipeIngredient.deleteMany({
                    where: {
                        recipeId: recipeId
                    }
                })

                for (const item of ingredients){
                    const normalizedName = item.name.toLowerCase().trim()

                    let ingredient = await tx.ingredient.findFirst({
                        where: {
                            name: {
                                equals: normalizedName,
                                mode: 'insensitive'
                            }
                        }
                    })
                    if (!ingredient){
                        ingredient = await tx.ingredient.create({
                            data: {name: normalizedName}
                        })
                    }

                    await tx.recipeIngredient.create({
                        data: {
                            recipeId: recipeId,
                            ingredientId: ingredient.id,
                            quantity: item.quantity || null
                        }
                    })
                }
            }
            
            if(categories !== undefined) {
                await tx.recipeCategory.deleteMany({
                    where: {
                        recipeId: recipeId
                    }
                })

                for (const categoryName of categories){
                    const normalizedName = categoryName.trim()

                    let category = await tx.category.findFirst({
                        where: {
                            title: {
                                equals: normalizedName,
                                mode: 'insensitive'
                            }
                        }
                    })
                    if(!category){
                        category = await tx.category.create({
                            data: {title: normalizedName}
                        })
                    }

                    await tx.recipeCategory.create({
                        data: {
                            recipeId: recipeId,
                            categoryId: category.id,
                        }
                    })
                }
            }

            if (steps !== undefined){
                await tx.procedureStep.deleteMany({
                    where: {
                        recipeId: recipeId
                    }
                })

                await tx.procedureStep.createMany({
                    data: steps.map((step: {stepNumber: number, description: string}) =>({
                        stepNumber: step.stepNumber,
                        description: step.description,
                        recipeId: recipeId
                    }))
                })
            }

            return await tx.recipe.findUnique({
                where: {id: recipeId},
                include: {
                    steps: {
                        orderBy: {stepNumber: 'asc'}
                    },
                    ingredients: {
                        include: {
                            ingredient: true
                        }
                    },
                    categories: {
                        include: {
                            category: true
                        }
                    }
                }
            })

        })

        
        return NextResponse.json(
            {success: true, data: result}
        )



    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
            {
                success: false,
                error: 'Validation failed',
                details: error.issues
            },
            { status: 400 }
            )
        }
        console.error('error updating recipe' , error)
        return NextResponse.json(
            {success: false, error: 'Failed to update recipe'},
            { status: 500 }
        )
    }
}

export async function DELETE(request:NextRequest, {params}: {params:Promise<{id:string}>} ) {
    try {
        const session = await auth()
        if (!session?.user?.id){
            return NextResponse.json(
                {success: false, error: "Unauthorized"},
                {status: 401}
            )
        }

        const urlId = (await params).id
        const recipeId = Number(urlId)
        if (!Number.isInteger(recipeId)){
            return NextResponse.json(
                {success: false, error: "Bad Request"},
                {status: 400}
            )
        }

        const recipe = await prisma.recipe.findFirst({
            where: {
                id: recipeId,
                userId: parseInt(session.user.id)
            }
        })

        if (!recipe){
            return NextResponse.json(
                {success: false, error: "Not Found"},
                {status: 404}
            )
        }

        const deleteRecipe = await prisma.recipe.delete({
            where:{id: recipeId}
        })

        return NextResponse.json(
            {success: true, data: deleteRecipe, "message": "Recipe deleted successfully"}
        )

    } catch (error){
        console.error('Error deleting recipe:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete recipe' },
            { status: 500 }
        )
    }
}