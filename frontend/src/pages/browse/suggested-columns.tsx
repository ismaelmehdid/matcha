import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Heart } from "lucide-react";
import type { UserListItem } from "@/types/browse";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export function createSuggestedColumns(
  onLike: (userId: string) => void,
  onUnlike: (userId: string) => void
): ColumnDef<UserListItem>[] {
  return [
    {
      accessorKey: "profilePicture",
      header: "Profile Picture",
      cell: ({ row }) => {
        return (
          <Avatar className="size-10">
            <AvatarImage
              src={row.original.profilePicture}
              alt={`${row.original.firstName} ${row.original.lastName}`}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(row.original.firstName, row.original.lastName)}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      filterFn: (row, id, value) => {
        const firstName = row.getValue(id) as string;
        return firstName?.toLowerCase().includes(value.toLowerCase()) ?? false;
      },
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "age",
      enableSorting: true,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Age" />;
      },
      filterFn: (row, id, value) => {
        const age = row.getValue(id) as number;
        if (
          !value ||
          typeof value !== "object" ||
          !("min" in value) ||
          !("max" in value)
        ) {
          return true;
        }
        const { min, max } = value as { min: number; max: number };
        return age >= min && age <= max;
      },
    },
    {
      accessorKey: "fameRating",
      enableSorting: true,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Fame Rating" />;
      },
      cell: ({ row }) => {
        return <div>{`${row.original.fameRating}`}</div>;
      },
      filterFn: (row, id, value) => {
        const fameRating = row.getValue(id) as number;
        if (
          !value ||
          typeof value !== "object" ||
          !("min" in value) ||
          !("max" in value)
        ) {
          return true;
        }
        const { min, max } = value as { min: number; max: number };
        return fameRating >= min && fameRating <= max;
      },
    },
    {
      id: "location",
      header: "Location",
      accessorFn: (row) => {
        const city = row.cityName || "";
        const country = row.countryName || "";
        if (city && country) {
          return `${city}, ${country}`;
        }
        return city || country || "-";
      },
      cell: ({ row }) => {
        const city = row.original.cityName || "";
        const country = row.original.countryName || "";
        const value =
          city && country ? `${city}, ${country}` : city || country || "-";
        return <div>{value}</div>;
      },
      filterFn: (row, _id, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return true;
        }
        const city = row.original.cityName || "";
        const country = row.original.countryName || "";
        const location =
          city && country ? `${city}, ${country}` : city || country || "-";
        return value.includes(location);
      },
    },
    {
      accessorKey: "interests",
      enableSorting: true,
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Interests"
            firstSortingOption="least common"
            secondSortingOption="most common"
          />
        );
      },
      cell: ({ row }) => {
        return (
          <div className="min-w-[400px] overflow-x-auto">
            {row.original.interests.map((interest) => (
              <Badge key={interest.id} className="mr-2">
                {interest.name}
              </Badge>
            ))}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return true;
        }
        const interests = row.getValue(id) as Array<{
          id: string;
          name: string;
        }>;
        const interestNames = interests.map((i) => i.name);
        return value.some((tag: string) => interestNames.includes(tag));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Toggle
              onPressedChange={(pressed) => {
                if (pressed) {
                  onLike(user.id);
                } else {
                  onUnlike(user.id);
                }
              }}
              pressed={user.liked}
              variant="outline"
              className="data-[state=on]:bg-red-400 data-[state=on]:text-white transition-colors duration-200"
            >
              <Heart className="w-4 h-4" />
            </Toggle>
          </div>
        );
      },
    },
  ];
}
