"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera, X, Upload } from "lucide-react";

export default function CompleteTaskModal({ open, onOpenChange, task, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (task.photoProof && !photoFile) {
      alert("Photo proof is required for this task");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onComplete) {
      onComplete({
        taskId: task.id,
        photoProof: photoFile,
        completedAt: new Date().toISOString(),
      });
    }
    
    setLoading(false);
    onOpenChange(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Task as Complete</DialogTitle>
          <DialogDescription>
            {task?.photoProof 
              ? "Please upload photo proof to complete this task"
              : "Confirm completion of this task"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {task?.photoProof && (
            <div className="space-y-2">
              <Label htmlFor="photo">Photo Proof *</Label>
              {photoPreview ? (
                <div className="relative rounded-lg border p-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Photo proof preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handleRemovePhoto}
                  >
                    <X className="mr-2 size-4" />
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
                  <Camera className="mb-4 size-12 text-muted-foreground" />
                  <Label htmlFor="photo" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="mr-2 size-4" />
                        Upload Photo
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required={task?.photoProof}
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a photo as proof of task completion
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (task?.photoProof && !photoFile)}>
              {loading ? "Completing..." : "Mark as Complete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

