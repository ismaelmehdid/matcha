import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useUsers } from "@/hooks/useUsers";
import type { Filters } from "@/hooks/useUsers";

const DEFAULT_FILTERS: Filters = {
  minAge: 18,
  maxAge: 99,
  minFame: 0,
  maxFame: 100,
  locations: [],
  tags: [],
  firstName: "",
};

export function Browse() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { users, isLoading, hasMore, fetchNextPage, isFetchingNextPage } =
    useUsers(filters);

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          hasMore={hasMore}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          setFilters={setFilters}
          filters={filters}
        />
      </div>
    </AppLayout>
  );
}
