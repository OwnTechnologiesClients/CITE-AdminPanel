"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, Image as ImageIcon, User, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FamilyMediaTab({ media }) {
  return (
    <div className="space-y-6">
      {/* Folders Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Folders</h3>
        {media.folders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No folders found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {media.folders.map((folder) => (
              <Card key={folder.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Folder className="size-12 text-blue-600" />
                    <div>
                      <p className="font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {folder.imageCount} {folder.imageCount === 1 ? "image" : "images"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="size-3" />
                      <span>{folder.createdBy.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Images Outside Folders */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Images</h3>
        {media.images.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No images found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {media.images.map((image) => (
              <Card key={image.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="size-12 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate">{image.name}</p>
                      <p className="text-xs text-muted-foreground">{image.size}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="size-3" />
                        <span>{image.uploadedBy.name}</span>
                      </div>
                      <span>{formatDate(image.uploadedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

