"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, UtensilsCrossed, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import RecipeDetailModal from "@/components/admin/modals/RecipeDetailModal";

export default function FamilyRecipesTab({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };
  return (
    <div className="space-y-4">
      {recipes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No recipes found
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipe Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Prep Time</TableHead>
              <TableHead>Cook Time</TableHead>
              <TableHead>Servings</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell className="font-medium">{recipe.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {recipe.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{recipe.prepTime}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{recipe.cookTime}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="size-4 text-muted-foreground" />
                    <span>{recipe.servings}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="font-medium">{recipe.createdBy.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(recipe.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewRecipe(recipe)}
                  >
                    <Eye className="size-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
}

