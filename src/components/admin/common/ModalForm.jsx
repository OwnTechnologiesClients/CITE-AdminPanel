"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Generic Modal Form Component
 * Handles common modal form patterns (add/edit)
 * 
 * @param {boolean} open - Whether modal is open
 * @param {Function} onOpenChange - Callback when modal open state changes
 * @param {Object} initialData - Initial form data (for edit mode)
 * @param {Function} onSave - Callback when form is submitted: (formData) => void
 * @param {string} title - Modal title (will append "Edit" or "Add New" based on initialData)
 * @param {string} description - Modal description
 * @param {Function} children - Render function that receives { formData, handleChange, loading }
 * @param {Object} defaultValues - Default form values
 * @param {string} submitLabel - Submit button label
 */
export default function ModalForm({
  open,
  onOpenChange,
  initialData = null,
  onSave,
  title,
  description,
  children,
  defaultValues = {},
  submitLabel = "Save",
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultValues);
    }
  }, [initialData, open, defaultValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        await onSave(formData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isEdit = !!initialData;
  const modalTitle = isEdit ? `Edit ${title}` : `Add New ${title}`;
  const modalDescription = description || (isEdit ? `Update ${title.toLowerCase()} details` : `Create a new ${title.toLowerCase()}`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {children({ formData, handleChange, loading })}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? `Update ${submitLabel}` : `Create ${submitLabel}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

