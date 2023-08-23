import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Box,
} from "@mui/material";
import { useTable, useFilters, usePagination } from "react-table";
import { TablePagination } from "components/third-party/ReactTable";

export default function ReactTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // @ts-ignore
    page,
    prepareRow,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useFilters,
    usePagination
  );

  return (
    <Stack>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, index) => (
            <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <TableCell
                  key={i}
                  {...column.getHeaderProps({ className: column.className })}
                  sx={{
                    py: 1.5,
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <b>{column.render("Header")}</b>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <TableCell
                    key={index}
                    {...cell.getCellProps({ className: cell.column.className })}
                    sx={{ py: 1.5 }}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {page?.length === 0 && (
            <TableRow>
              <TableCell colSpan={20} sx={{ textAlign: "center" }}>
                There are no accounts
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ py: 3 }}>
        <TablePagination
          gotoPage={gotoPage}
          rows={rows}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Box>
    </Stack>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
};
