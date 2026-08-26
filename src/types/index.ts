// src/types/index.ts
import { Prisma } from '@prisma/client'

// Type for recipe where clause
export type RecipeWhereInput = Prisma.RecipeWhereInput

// Type for recipe order by
export type RecipeOrderByInput = Prisma.RecipeOrderByWithRelationInput
export type RecipeWithRelations = Prisma.RecipeGetPayload<{
  include: {
    ingredients: {
      include: {
        ingredient: true
      }
    }
    categories: {
      include: {
        category: true
      }
    }
    steps: true
  }
}>
export interface RecipesResponse{
    success: true
    data: RecipeWithRelations[]
    userName: string|null
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
  }
}
export interface RecipesErrorResponse {
  success: false
  error: string
}
export interface RecipeResponse {
  success: true
  data: RecipeWithRelations
}

export interface RecipeErrorResponse {
  success: false
  error: string
}
export interface SideBarProps {
  user?: {
    name?: string | null;
    id?: string;
    email?: string | null;
  };
}

export interface RecipesPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    order?: string
    page?: string
  }>
}