// src/app/api/recipes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { recipeSchema } from '@/lib/validations/recipe'
import z from 'zod/v4'
import { getRecipesForUser } from '@/lib/db/recipes'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No user ID' },
        { status: 401 }
      )
    }

        const userIdNumber = parseInt(userId)
        if (isNaN(userIdNumber)) {
          return NextResponse.json(
            { success: false, error: 'Invalid user ID' },
            { status: 401 }
        )
        }

    // 2. Parse request body
    const body = await request.json()
    const validatedData = recipeSchema.parse(body)

    const { 
      title, 
      duration,  
      img,
      ingredients, 
      categories,
      steps
    } = validatedData

    

    // 4. Use a transaction for atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // 4a. Create the recipe
      const recipe = await tx.recipe.create({
        data: {
          title,
          duration,
          img: img || null,
          isPublic: false,
          userId: userIdNumber
        }
      })

      // 4b. Handle Procedure Steps (if provided)
      if (steps && steps.length > 0) {
        await tx.procedureStep.createMany({
          data: steps.map((step: { stepNumber: number; description: string }) => ({
            stepNumber: step.stepNumber,
            description: step.description,
            recipeId: recipe.id
          }))
        })
      }

      // 4c. Handle Ingredients (connect or create)
      if (ingredients && ingredients.length > 0) {
        for (const item of ingredients) {
          // Normalize ingredient name
          const normalizedName = item.name.toLowerCase().trim()
          
          // Find or create ingredient
          let ingredient = await tx.ingredient.findFirst({
            where: {
              name: {
                equals: normalizedName,
                mode: 'insensitive'
              }
            }
          })

          if (!ingredient) {
            ingredient = await tx.ingredient.create({
              data: { name: normalizedName }
            })
          }

          // Connect to recipe
          await tx.recipeIngredient.create({
            data: {
              recipeId: recipe.id,
              ingredientId: ingredient.id,
              quantity: item.quantity || null
            }
          })
        }
      }

      // 4d. Handle Categories (connect or create)
      if (categories && categories.length > 0) {
        for (const categoryName of categories) {
          // Normalize category name
          const normalizedName = categoryName.trim()
          
          // Find or create category
          let category = await tx.category.findFirst({
            where: {
              title: {
                equals: normalizedName,
                mode: 'insensitive'
              }
            }
          })

          if (!category) {
            category = await tx.category.create({
              data: { title: normalizedName }
            })
          }

          // Connect to recipe
          await tx.recipeCategory.create({
            data: {
              recipeId: recipe.id,
              categoryId: category.id
            }
          })
        }
      }

      // 4e. Return the full recipe with all relations
      return await tx.recipe.findUnique({
        where: { id: recipe.id },
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' }
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

    // 5. Return success with full data
    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 })

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
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

// GET /api/recipes - List all recipes for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const result = await getRecipesForUser(parseInt(session.user.id), {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      sort: searchParams.get("sort") || "createdAt",
      order: searchParams.get("order") || "desc",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recipes" }, { status: 500 })
  }
}