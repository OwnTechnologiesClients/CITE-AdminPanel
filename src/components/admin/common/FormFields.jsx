"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Status Select Field - Reusable status dropdown
 */
export function StatusSelect({ value, onValueChange, id = "status", label = "Status *", required = true }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Task Status Select Field - For task statuses
 */
export function TaskStatusSelect({ value, onValueChange, id = "status", label = "Status *" }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Text Input Field - Reusable text input
 */
export function TextField({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  required = false,
  type = "text",
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

/**
 * Number Input Field - Reusable number input
 */
export function NumberField({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  required = false,
  min = undefined,
  max = undefined,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
}

/**
 * Date Input Field - Reusable date input
 */
export function DateField({ 
  id, 
  label, 
  value, 
  onChange, 
  required = false,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

/**
 * Textarea Field - Reusable textarea
 */
export function TextareaField({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  rows = 3,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

/**
 * Form Actions - Reusable form footer buttons
 */
export function FormActions({ 
  onCancel, 
  loading = false, 
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isEdit = false
}) {
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
      >
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEdit ? `Update ${submitLabel}` : `Create ${submitLabel}`}
      </Button>
    </div>
  );
}

