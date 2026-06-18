"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { CardTable } from "./CardTable"
import { cn } from "@/lib/utils"

export interface Column<T> {
  header: React.ReactNode
  render: (item: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  delay?: "none" | "100" | "200" | "300" | "400" | "500" | "600" | "700"
  className?: string
  rowClassName?: string
}

/**
 * A highly reusable, premium DataTable component.
 * Abstracts the boilerplate of Shadcn tables and CardTable wrapping.
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  delay = "300",
  className,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <CardTable delay={delay} className={className}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-b border-border/40">
            {columns.map((column, i) => (
              <TableHead 
                key={i} 
                className={cn(
                  "font-bold uppercase tracking-wider text-[11px] text-muted-foreground/80 py-4",
                  i === 0 && "pl-6",
                  i === columns.length - 1 && "pr-6 text-right",
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow 
              key={keyExtractor(item)}
              className={cn(
                "group transition-colors duration-200 hover:bg-muted/10 border-b border-border/20 last:border-0",
                rowClassName
              )}
            >
              {columns.map((column, colIndex) => (
                <TableCell 
                  key={colIndex}
                  className={cn(
                    "py-4 align-middle",
                    colIndex === 0 && "pl-6",
                    colIndex === columns.length - 1 && "pr-6 text-right",
                    column.className
                  )}
                >
                  {column.render(item, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardTable>
  )
}
