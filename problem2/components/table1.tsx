"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";

import { tokens } from "../public/data";
console.log(tokens);

const columns = [
  { name: "CURRENCY", uid: "currency", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
];

type Token = (typeof tokens)[0];

export default function Table1() {
  const [filterValue, setFilterValue] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredTokens = [...tokens];

    if (hasSearchFilter) {
      filteredTokens = filteredTokens.filter((token) =>
        token.currency.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredTokens;
  }, [tokens, filterValue]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Token, b: Token) => {
      const first = a[sortDescriptor.column as keyof Token] as number;
      const second = b[sortDescriptor.column as keyof Token] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  const itemsToDisplay = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const renderCell = React.useCallback((token: Token, columnKey: React.Key) => {
    const cellValue = token[columnKey as keyof Token];

    switch (columnKey) {
      case "currency":
        return (
          <p className="text-bold text-small capitalize">{token.currency}</p>
        );
      case "price":
        return (
          <p className="text-bold text-small capitalize">
            {Number(cellValue).toFixed(3)}
          </p>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {sortedItems.length} tokens
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onRowsPerPageChange, sortedItems.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div>
        <span className="flex text-default-400 text-small justify-end">
          As of {tokens[0].date.toLocaleString("en-US")}
        </span>
        <div className="py-2 flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        </div>
      </div>
    );
  }, [page, pages]);

  return (
    <Table
      aria-label="Tokens table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className="max-h-[650px]"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "price" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No data found"} items={itemsToDisplay}>
        {(item) => (
          <TableRow key={item.currency}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
