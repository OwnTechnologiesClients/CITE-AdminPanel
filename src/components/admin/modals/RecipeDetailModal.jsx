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
          <DialogTitle className="text-2xl">{recipe.name}</DialogTitle>
          <DialogDescription>
            View complete recipe details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <div className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {recipe.category}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Prep Time</Label>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.prepTime}</span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Cook Time</Label>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.cookTime}</span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Servings</Label>
              <div className="mt-1 flex items-center gap-2">
                <UtensilsCrossed className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.servings}</span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Created By</Label>
              <div className="mt-1 flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">{recipe.createdBy.name}</span>
              </div>
            </div>

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
              <ul className="list-disc list-inside space-y-1 text-sm">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-foreground">
                    {ingredient}
                  </li>
                ))}
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

