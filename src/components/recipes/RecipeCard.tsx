import type { RecipeWithRelations } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipeInfo: RecipeWithRelations;
}

export default function RecipeCard({ recipeInfo }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipeInfo.id}`}>
      <article className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className=" overflow-hidden">
        {recipeInfo.img ? (
          <Image
            src={recipeInfo.img}
            alt={recipeInfo.title}
            width={300}
            height={200}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center text-8xl font-extrabold bg-emerald-50 text-emerald-600">
            <ChefHat size={100} />
          </div>
        )}
        
      </div>

      {/* Recipe information */}
      <div className="space-y-5 px-5 py-5">
        <h2 className="line-clamp-1 text-2xl font-bold text-slate-800">
            {recipeInfo.title}
        </h2>

        {/* Duration + ingredients */}
        <div className="flex items-center gap-6 text-base text-slate-600">
            <span className="flex items-center gap-2">
            🕐
            {recipeInfo.duration}
            </span>

            <span className="flex items-center gap-2">
            🍴
            {recipeInfo.ingredients.length} ingredients
            </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
            {recipeInfo.categories.map((item) => (
            <span
                key={item.categoryId}
                className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
            >
                {item.category.title}
            </span>
            ))}
        </div>
       </div>
      
    </article>
    </Link>
  );
}