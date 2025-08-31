import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
  from '@/components/ui/table';
import { IDType } from '@/store/types';
import { ReactNode } from 'react';

type RenderableKeys<T> = {
  [K in keyof T]: T[K] extends ReactNode ? K : never;
}[keyof T] & string;

type BaseColumn = {
  className?: string;
};

type CustomRenderColumn<T> = BaseColumn & {
  key?: keyof T & string;
  label: string;
  cell: (object: T) => ReactNode;
};

type KeyRenderColumn<T> = BaseColumn & {
  key: RenderableKeys<T>;
  label?: string;
  cell?: never;
};

export type Column<T> = CustomRenderColumn<T> | KeyRenderColumn<T>;

type Props<T extends IDType> = {
  columns: Column<T>[];
  data: T[];
};

export function DataTable<T extends IDType>({ columns, data }: Props<T>) {
  return (
    <div className="w-full p-2">
      <Table parentClassName="rounded-md border">
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead
                key={col.key ?? col.label}
                className={col.className}
              >
                {col.label ?? ''}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length
            ? (
                data.map(row => (
                  <TableRow key={row.id}>
                    {columns.map(col => (
                      <TableCell
                        key={`${row.id}${col.key ?? col.label}`}
                        className={col.className}
                      >
                        {col.cell ? col.cell(row) : (row[col.key] as ReactNode)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
            : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>

    </div>
  );
}
