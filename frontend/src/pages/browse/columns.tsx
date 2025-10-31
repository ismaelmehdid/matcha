import type { Interest } from "@/types/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Heart } from "lucide-react";

export type UserRow = {
  id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  age: number;
  fameRating: number;
  location: string;
  interests: Interest[];
};

export const columns: ColumnDef<UserRow>[] = [
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
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "fameRating",
    header: "Fame Rating",
    cell: ({ row }) => {
      return <div>{`${row.original.fameRating} ⭐`}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "interests",
    header: "Interests",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] overflow-x-auto">
          {row.original.interests.map((interest) => (
            <Badge key={interest.id} className="mr-2">
              {interest.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Toggle
            variant="outline"
            className="data-[state=on]:bg-red-400 data-[state=on]:text-white transition-colors duration-200"
            onClick={() => console.log("thumbs up on user", row.original.id)}
          >
            <Heart className="w-4 h-4" />
          </Toggle>
        </div>
      );
    },
  },
];
