"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, Image as ImageIcon, User, Calendar, ArrowLeft, Maximize2 } from "lucide-react";
import { formatDate, getImageUrl } from "@/lib/utils";

export default function FamilyMediaTab({ media = [], folders = [] }) {
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Separate media by type
  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video');

  // Get folder info
  const selectedFolder = selectedFolderId 
    ? folders.find(f => f._id === selectedFolderId || f.id === selectedFolderId)
    : null;

  // Filter media based on view:
  // - If viewing a folder, show only media in that folder
  // - If not viewing a folder, show only unassigned media (no folderId)
  const displayedMedia = useMemo(() => {
    if (selectedFolderId) {
      // Show media in selected folder
      return media.filter(item => {
        const itemFolderId = item.folderId?._id || item.folderId;
        return itemFolderId === selectedFolderId;
      });
    } else {
      // Show only unassigned media (no folderId)
      return media.filter(item => {
        const itemFolderId = item.folderId?._id || item.folderId;
        return !itemFolderId || itemFolderId === 'unassigned';
      });
    }
  }, [media, selectedFolderId]);

  // Count images in folders
  const foldersWithCounts = folders.map(folder => {
    const folderId = folder._id || folder.id;
    const itemsInFolder = media.filter(item => {
      const itemFolderId = item.folderId?._id || item.folderId;
      return itemFolderId === folderId;
    });
    return {
      ...folder,
      itemCount: itemsInFolder.length,
      imageCount: itemsInFolder.filter(i => i.type === 'image').length,
      videoCount: itemsInFolder.filter(i => i.type === 'video').length,
      thumbnail: itemsInFolder.find(i => i.type === 'image')?.fileUrl || itemsInFolder[0]?.fileUrl || null
    };
  });

  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleBackClick = () => {
    setSelectedFolderId(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb/Back button when viewing folder */}
      {selectedFolderId && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Media
          </Button>
          {selectedFolder && (
            <span className="text-muted-foreground">/ {selectedFolder.name}</span>
          )}
        </div>
      )}

      {/* Media Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Folder className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Videos</p>
                <p className="text-2xl font-bold">{videos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {selectedFolderId ? 'Items in Folder' : 'Total Media'}
                </p>
                <p className="text-2xl font-bold">
                  {selectedFolderId ? displayedMedia.length : media.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Folders (only show when not viewing a specific folder) */}
      {!selectedFolderId && foldersWithCounts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Folders</h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {foldersWithCounts.map((folder) => (
              <Card
                key={folder._id || folder.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleFolderClick(folder._id || folder.id)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                      {folder.thumbnail ? (
                        <img
                          src={getImageUrl(folder.thumbnail)}
                          alt={folder.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const errorDiv = e.target.nextElementSibling;
                            if (errorDiv) errorDiv.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center ${folder.thumbnail ? 'hidden' : ''}`}>
                        <Folder className="size-12 text-primary" />
                      </div>
                      {folder.itemCount > 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {folder.itemCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate">{folder.name || "Untitled Folder"}</p>
                      {folder.description && (
                        <p className="text-xs text-muted-foreground truncate">{folder.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {folder.imageCount > 0 && (
                          <span>{folder.imageCount} image{folder.imageCount !== 1 ? 's' : ''}</span>
                        )}
                        {folder.videoCount > 0 && (
                          <span>{folder.videoCount} video{folder.videoCount !== 1 ? 's' : ''}</span>
                        )}
                        {folder.itemCount === 0 && (
                          <span className="text-muted-foreground">Empty</span>
                        )}
                      </div>
                    </div>
                    {folder.createdBy && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="size-3" />
                          <span className="truncate">
                            {folder.createdBy.fullName || folder.createdBy.username || "N/A"}
                          </span>
                        </div>
                        {folder.createdAt && (
                          <span>{formatDate(folder.createdAt)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Media Items */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {selectedFolderId 
            ? `${selectedFolder?.name || 'Folder'} - Media Items` 
            : 'Unassigned Media Items'}
        </h3>
        {displayedMedia.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {selectedFolderId 
                ? "This folder is empty"
                : "No unassigned media found"}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {displayedMedia.map((item) => (
              <Card key={item._id} className="cursor-pointer hover:shadow-md transition-shadow group">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                      {item.type === 'image' && item.fileUrl ? (
                        <>
                          <img
                            src={getImageUrl(item.fileUrl)}
                            alt={item.title || "Media"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const errorDiv = e.target.nextElementSibling;
                              if (errorDiv) errorDiv.style.display = 'flex';
                            }}
                          />
                          <div className="hidden absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getImageUrl(item.fileUrl), '_blank');
                              }}
                              className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Maximize2 className="size-4" />
                              View
                            </Button>
                          </div>
                        </>
                      ) : item.type === 'video' ? (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Folder className="size-12 text-primary" />
                          </div>
                          <Badge className="absolute bottom-2 right-2" variant="secondary">
                            Video
                          </Badge>
                        </>
                      ) : (
                        <ImageIcon className="size-12 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate">{item.title || "Untitled"}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      )}
                      {item.isFavorite && (
                        <Badge variant="default" className="mt-1 text-xs">⭐ Favorite</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {item.uploadedBy && (
                        <div className="flex items-center gap-1">
                          <User className="size-3" />
                          <span className="truncate">
                            {item.uploadedBy.fullName || item.uploadedBy.username || "N/A"}
                          </span>
                        </div>
                      )}
                      {item.createdAt && (
                        <span>{formatDate(item.createdAt)}</span>
                      )}
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
