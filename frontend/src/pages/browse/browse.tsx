import { AppLayout } from "@/components/layouts/AppLayout";
import { columns, type UserRow } from "./columns";
import { DataTable } from "./data-table";

function getData(): UserRow[] {
  // Fetch data from API here.
  return [
    {
      id: "728ed52f",
      profilePicture: "https://randomuser.me/api/portraits/women/32.jpg",
      firstName: "John",
      lastName: "Doe",
      age: 25,
      fameRating: 4.5,
      location: "Paris, France",
      interests: [
        { id: "1", name: "music" },
        { id: "2", name: "reading" },
        { id: "3", name: "traveling" },
        { id: "4", name: "cooking" },
        { id: "5", name: "dancing" },
        { id: "6", name: "singing" },
        { id: "7", name: "playing guitar" },
        { id: "8", name: "playing piano" },
        { id: "9", name: "playing drums" },
        { id: "10", name: "playing violin" },
        { id: "11", name: "playing cello" },
        { id: "12", name: "playing flute" },
        { id: "13", name: "playing saxophone" },
        { id: "14", name: "playing trumpet" },
        { id: "15", name: "playing clarinet" },
        { id: "16", name: "playing bass" },
        { id: "17", name: "playing drums" },
        { id: "18", name: "playing violin" },
        { id: "19", name: "playing cello" },
        { id: "20", name: "playing flute" },
        { id: "21", name: "playing saxophone" },
        { id: "22", name: "playing trumpet" },
        { id: "23", name: "playing clarinet" },
        { id: "24", name: "playing bass" },
        { id: "25", name: "playing drums" },
        { id: "26", name: "playing violin" },
        { id: "27", name: "playing cello" },
      ],
    },
    // ...
  ];
}

export function Browse() {
  // TODO: Place use users here
  const data = getData();

  return (
    <AppLayout>
      <DataTable columns={columns} data={data} />
    </AppLayout>
  );
}
