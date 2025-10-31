import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCallback, useState, useEffect, type ChangeEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

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

  // Sync input value when external value changes (e.g., from buttons)
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

      // Allow empty string while typing
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
      // Reset to current value if invalid
      setInputValue(value.toString());
    } else {
      onChange(numValue);
    }
  }, [inputValue, value, min, max, onChange]);

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

function RangePopover({
  buttonLabel,
  min,
  max,
}: {
  buttonLabel: string;
  min: number;
  max: number;
}) {
  const [from, setFrom] = useState(min);
  const [to, setTo] = useState(max);

  const handleFromChange = useCallback(
    (newFrom: number) => {
      setFrom(newFrom);
      // If "From" becomes >= "To", update "To" to be one greater
      if (newFrom >= to) {
        const newTo = Math.min(max, newFrom + 1);
        if (newTo <= max) {
          setTo(newTo);
        }
      }
    },
    [to, max]
  );

  const handleToChange = useCallback(
    (newTo: number) => {
      setTo(newTo);
      // If "To" becomes <= "From", update "From" to be one less
      if (newTo <= from) {
        const newFrom = Math.max(min, newTo - 1);
        if (newFrom >= min) {
          setFrom(newFrom);
        }
      }
    },
    [from, min]
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" type="button" size="sm">
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="space-y-2 mb-4">
          <h4 className="leading-none font-medium">{buttonLabel}</h4>
          <Separator />
        </div>
        <FieldSet>
          <FieldGroup className="flex flex-col gap-2">
            <RangeField
              label="From"
              value={from}
              onChange={handleFromChange}
              min={min}
              max={Math.min(max, to - 1)}
            />
            <RangeField
              label="To"
              value={to}
              onChange={handleToChange}
              min={Math.max(min, from + 1)}
              max={max}
            />
          </FieldGroup>
        </FieldSet>
      </PopoverContent>
    </Popover>
  );
}

const locations = [
  { label: "New York", value: "new-york" },
  { label: "Los Angeles", value: "los-angeles" },
  { label: "Chicago", value: "chicago" },
  { label: "Houston", value: "houston" },
  { label: "Miami", value: "miami" },
];

const interests = [
  { label: "Music", value: "music" },
  { label: "Reading", value: "reading" },
  { label: "Traveling", value: "traveling" },
  { label: "Cooking", value: "cooking" },
  { label: "Dancing", value: "dancing" },
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeTab, setActiveTab] = useState<string>("browse-all");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 pt-2"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="browse-all">Browse all</SelectItem>
            <SelectItem value="suggested">Suggested</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="browse-all">Browse all</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex row gap-2">
        <div className="flex items-center">
          <Input
            placeholder="Search by first name..."
            value={
              (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("firstName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <RangePopover buttonLabel="Age range" min={18} max={99} />
        <RangePopover buttonLabel="Fame rating range" min={0} max={100} />
        {table.getColumn("location") && (
          <DataTableFacetedFilter
            column={table.getColumn("location")}
            title="Location"
            options={locations}
          />
        )}
        {table.getColumn("interests") && (
          <DataTableFacetedFilter
            column={table.getColumn("interests")}
            title="Interests"
            options={interests}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <TabsContent value="browse-all">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="suggested">
        <div>
          <h1>Suggested</h1>
        </div>
      </TabsContent>
    </Tabs>
  );
}
