"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clock, User, UtensilsCrossed, Calendar, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RecipeDetailModal({ open, onOpenChange, recipe }) {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{recipe.title || recipe.name || "Recipe"}</DialogTitle>
          <DialogDescription>
            {recipe.description || "View complete recipe details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <div className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {recipe.type || recipe.category || "other"}
                </Badge>
                {recipe.isFavorite && (
                  <Badge variant="default" className="ml-2 text-xs">⭐ Favorite</Badge>
                )}
                {recipe.hasBeenTried && (
                  <Badge variant="secondary" className="ml-2 text-xs">Tried</Badge>
                )}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Prep Time</Label>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.prepTime ? `${recipe.prepTime} min` : "N/A"}</span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Cook Time</Label>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.cookTime ? `${recipe.cookTime} min` : "N/A"}</span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Servings</Label>
              <div className="mt-1 flex items-center gap-2">
                <UtensilsCrossed className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.servings || "N/A"}</span>
              </div>
            </div>

            {recipe.difficulty && (
              <div>
                <Label className="text-muted-foreground">Difficulty</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
            )}

            {recipe.totalCalories && (
              <div>
                <Label className="text-muted-foreground">Total Calories</Label>
                <div className="mt-1">
                  <span className="font-medium">{recipe.totalCalories} cal</span>
                </div>
              </div>
            )}

            {recipe.createdBy && (
              <div>
                <Label className="text-muted-foreground">Created By</Label>
                <div className="mt-1 flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="font-medium">
                    {recipe.createdBy.fullName || recipe.createdBy.username || "N/A"}
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label className="text-muted-foreground">Created At</Label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(recipe.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <Label className="text-muted-foreground flex items-center gap-2 mb-2">
                <BookOpen className="size-4" />
                Ingredients
              </Label>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {recipe.ingredients.map((ingredient, index) => {
                  // Handle both object and string formats
                  if (typeof ingredient === 'string') {
                    return (
                      <li key={index} className="text-foreground">
                        {ingredient}
                      </li>
                    );
                  }
                  // Handle object format with name, amount, unit, etc.
                  let ingredientText = ingredient.name || '';
                  if (ingredient.amount) {
                    ingredientText += ` - ${ingredient.amount}`;
                    if (ingredient.unit) {
                      ingredientText += ` ${ingredient.unit}`;
                    }
                  }
                  if (ingredient.calories) {
                    ingredientText += ` (${ingredient.calories} cal)`;
                  }
                  if (ingredient.notes) {
                    ingredientText += ` - ${ingredient.notes}`;
                  }
                  return (
                    <li key={index} className="text-foreground">
                      {ingredientText || 'N/A'}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <Label className="text-muted-foreground mb-2">Instructions</Label>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-foreground">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

