"use client";

import { useState, useMemo } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";
import RecipeDetailModal from "@/components/admin/modals/RecipeDetailModal";

const ITEMS_PER_PAGE = 10;

export default function FamilyRecipesTab({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(recipes.length / ITEMS_PER_PAGE));
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return recipes.slice(start, start + ITEMS_PER_PAGE);
  }, [recipes, currentPage]);

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
        <>
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
              {paginatedRecipes.map((recipe) => (
              <TableRow key={recipe._id}>
                <TableCell className="font-medium">{recipe.title || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {recipe.type || "other"}
                    </Badge>
                    {recipe.isFavorite && (
                      <Badge variant="default" className="text-xs">⭐ Favorite</Badge>
                    )}
                    {recipe.hasBeenTried && (
                      <Badge variant="secondary" className="text-xs">Tried</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{recipe.prepTime ? `${recipe.prepTime} min` : "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{recipe.cookTime ? `${recipe.cookTime} min` : "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="size-4 text-muted-foreground" />
                    <span>{recipe.servings || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {recipe.createdBy ? (
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {recipe.createdBy.fullName || recipe.createdBy.username || "N/A"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
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
          {recipes.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, recipes.length)} of {recipes.length}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
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

