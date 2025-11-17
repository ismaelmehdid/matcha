import {
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  type ChangeEvent,
} from "react";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconMinus, IconPlus, IconRuler3 } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
function RangeField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleAdjustment = useCallback(
    (adjustment: number) => {
      onChange(Math.max(min, Math.min(max, value + adjustment)));
    },
    [onChange, min, max, value]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (newValue === "") {
        return;
      }

      const numValue = parseInt(newValue, 10);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue);
      }
    },
    [onChange, min, max]
  );

  const handleBlur = useCallback(() => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString());
    } else {
      onChange(numValue);
    }
  }, [inputValue, value, min, max, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  }, [handleBlur]);

  return (
    <Field orientation="horizontal" className="items-center">
      <FieldLabel htmlFor={label} className="items-center">
        {label}
      </FieldLabel>
      <FieldContent>
        <ButtonGroup className="flex items-center">
          <Input
            id={label}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            size={3}
            className="h-8 !w-14 font-mono text-center"
            maxLength={3}
          />
          <Button
            variant="outline"
            size="icon-sm"
            type="button"
            aria-label="Decrement"
            onClick={() => handleAdjustment(-1)}
            value={value}
            disabled={value < min}
          >
            <IconMinus />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            type="button"
            aria-label="Increment"
            onClick={() => handleAdjustment(1)}
            value={value}
            disabled={value > max}
          >
            <IconPlus />
          </Button>
        </ButtonGroup>
      </FieldContent>
    </Field>
  );
}

interface DataTableRangeFilterProps {
  title?: string;
  setFilter?: (filter: { from: number; to: number }) => void;
  min: number;
  max: number;
  currentFrom?: number;
  currentTo?: number;
}

export interface DataTableRangeFilterRef {
  getValue: () => { from: number; to: number };
}

export const DataTableRangeFilter = forwardRef<
  DataTableRangeFilterRef,
  DataTableRangeFilterProps
>(({ title, setFilter, min, max, currentFrom, currentTo }, ref) => {
  const appliedFrom = currentFrom !== undefined ? currentFrom : min;
  const appliedTo = currentTo !== undefined ? currentTo : max;
  const isActive = currentFrom !== undefined || currentTo !== undefined;

  const [localFrom, setLocalFrom] = useState(appliedFrom);
  const [localTo, setLocalTo] = useState(appliedTo);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalFrom(appliedFrom);
    setLocalTo(appliedTo);
  }, [appliedFrom, appliedTo]);

  useImperativeHandle(ref, () => ({
    getValue: () => ({ from: localFrom, to: localTo }),
  }));

  const handleFromChange = useCallback(
    (newFrom: number) => {
      let newTo = localTo;
      if (newFrom > localTo) {
        newTo = newFrom;
        setLocalTo(newTo);
      }
      setLocalFrom(newFrom);
      const finalTo = newFrom > localTo ? newFrom : localTo;
      setFilter?.({ from: newFrom, to: finalTo });
    },
    [localTo, setFilter]
  );

  const handleToChange = useCallback(
    (newTo: number) => {
      let newFrom = localFrom;
      if (newTo < localFrom) {
        newFrom = newTo;
        setLocalFrom(newFrom);
      }
      setLocalTo(newTo);
      setFilter?.({ from: newFrom, to: newTo });
    },
    [localFrom, setFilter]
  );

  const handleClear = useCallback(() => {
    setLocalFrom(min);
    setLocalTo(max);
    setFilter?.({ from: min, to: max });
  }, [min, max, setFilter]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  const hasChanges = localFrom !== appliedFrom || localTo !== appliedTo;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IconRuler3 />
          {title}
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal lg:hidden"
          >
            1
          </Badge>
          <div className="hidden gap-1 lg:flex">
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              from {localFrom} to {localTo}
            </Badge>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandList>
            <CommandGroup>
              <div className="p-2 space-y-2">
                <RangeField
                  label="From"
                  value={localFrom}
                  onChange={handleFromChange}
                  min={min}
                  max={Math.min(max, localTo)}
                />
                <RangeField
                  label="To"
                  value={localTo}
                  onChange={handleToChange}
                  min={Math.max(min, localFrom)}
                  max={max}
                />
              </div>
            </CommandGroup>
            {(hasChanges || isActive) && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    Clear filters
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

DataTableRangeFilter.displayName = "DataTableRangeFilter";
