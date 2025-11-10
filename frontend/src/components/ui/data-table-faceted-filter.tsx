import * as React from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  selectedValues: string[];
  onSelectionChange?: (selected: string[]) => void;
}

export interface DataTableFacetedFilterRef {
  getValue: () => string[];
}

export const DataTableFacetedFilter = forwardRef<
  DataTableFacetedFilterRef,
  DataTableFacetedFilterProps
>(({ title, options, selectedValues, onSelectionChange }, ref) => {
  const [localSelectedValues, setLocalSelectedValues] = React.useState<
    Set<string>
  >(new Set(selectedValues || []));
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalSelectedValues(new Set(selectedValues || []));
  }, [selectedValues]);

  const appliedValues = new Set(selectedValues || []);

  useImperativeHandle(ref, () => ({
    getValue: () => Array.from(localSelectedValues),
  }));

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {appliedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {appliedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {appliedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {appliedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => appliedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = localSelectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newSelected = new Set(localSelectedValues);
                      if (isSelected) {
                        newSelected.delete(option.value);
                      } else {
                        newSelected.add(option.value);
                      }
                      setLocalSelectedValues(newSelected);
                      onSelectionChange?.(Array.from(newSelected));
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input [&_svg]:invisible"
                      )}
                    >
                      <Check className="text-primary-foreground size-3.5" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground size-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {localSelectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setLocalSelectedValues(new Set());
                      onSelectionChange?.([]);
                    }}
                    className="justify-center text-center"
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

DataTableFacetedFilter.displayName = "DataTableFacetedFilter";
