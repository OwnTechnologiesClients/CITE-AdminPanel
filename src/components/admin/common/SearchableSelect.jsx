"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Generic searchable select component
 * @param {Function} fetchData - Async function that returns array of items
 * @param {Function} getLabel - Function to get display label from item: (item) => string
 * @param {Function} getValue - Function to get value from item: (item) => string
 * @param {Function} getSearchValue - Function to get searchable text from item: (item) => string
 * @param {Function} renderItem - Optional custom render function for items
 * @param {string} value - Selected value
 * @param {Function} onValueChange - Callback when value changes
 * @param {string} placeholder - Placeholder text
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {boolean} disabled - Whether select is disabled
 * @param {string} preSelectedValue - Pre-selected value (will auto-select on mount)
 * @param {string} emptyText - Text when no items found
 * @param {string} loadingText - Text while loading
 */
export default function SearchableSelect({
  fetchData,
  getLabel,
  getValue,
  getSearchValue,
  renderItem,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled = false,
  preSelectedValue = null,
  emptyText = "No items found.",
  loadingText = "Loading...",
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchData();
        setItems(data);
        
        // If preSelectedValue is provided, set it as the value
        if (preSelectedValue && !value) {
          const item = data.find(i => getValue(i) === preSelectedValue);
          if (item) {
            onValueChange(getValue(item));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedValue]);

  const selectedItem = items.find((item) => getValue(item) === value);

  const defaultRenderItem = (item) => {
    const label = getLabel(item);
    if (typeof label === "string") {
      return <span>{label}</span>;
    }
    return label;
  };

  const render = renderItem || defaultRenderItem;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {selectedItem ? (
            <span className="truncate">{getLabel(selectedItem)}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>
              {loading ? loadingText : emptyText}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemValue = getValue(item);
                const searchText = getSearchValue ? getSearchValue(item) : getLabel(item);
                
                return (
                  <CommandItem
                    key={itemValue}
                    value={searchText}
                    onSelect={() => {
                      onValueChange(itemValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === itemValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {render(item)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

