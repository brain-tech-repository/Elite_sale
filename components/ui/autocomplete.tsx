"use client";

import { Check, ChevronDownIcon } from "lucide-react";
import * as React from "react";
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
import { cn } from "@/lib/utils";

export interface AutoCompleteOption {
  value: string | number;
  label: string;
}

export interface AutoCompleteProps {
  options: AutoCompleteOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  onSearch?: (search: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  width?: string;
  disabled?: boolean;
  enableSelectAll?: boolean; // ⭐ NEW
}

export function AutoComplete({
  options,
  value,
  onChange,
  onSearch,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  width = "w-full",
  disabled = false,
  enableSelectAll = false,
}: AutoCompleteProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = React.useMemo(() => {
    if (value === "0") return "All Selected";
    return options.find((option) => option.value === value)?.label;
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(width, "justify-between shadow-xm overflow-hidden")}
          disabled={disabled}
        >
          {/* TRUNCATE LONG TEXT */}
          <span className="truncate max-w-[180px] text-left">
            {selectedLabel || placeholder}
          </span>

          <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            onValueChange={(value) => onSearch?.(value)}
          />

          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            <CommandGroup>
              {/* SELECT ALL OPTION */}

              {enableSelectAll && (
                <CommandItem
                  onSelect={() => {
                    onChange("0");
                    setOpen(false);
                  }}
                >
                  Select All
                </CommandItem>
              )}

              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={String(option.label)}
                  onSelect={() => {
                    onChange(option.value === value ? "" : option.value);
                    setOpen(false);
                  }}
                >
                  <span className="truncate">{option.label}</span>

                  <Check
                    className={cn(
                      "ml-auto size-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
