import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

const TableContainer = ({
  list = [],
  columns = [],
  count = 0,
  rows = 10,
  first = 0,
  onPageChange = null,
  selectedItems = null,
  setSelectedItems = null,
  selectionMode = "multiple",
  actions = null,
  ActionTemplate = "Actions",
  tableClass = "",
}) => {
  return (
    <>
      <DataTable
        value={list}
        className={`mt-4 ${tableClass}`}
        selectionMode={selectionMode}
        selection={selectedItems}
        onSelectionChange={(e) => setSelectedItems?.(e.value)}
        dataKey="id"
        showGridlines
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
      >
        {selectionMode !== "none" && (
          <Column
            selectionMode={selectionMode}
            headerStyle={{ width: "3rem" }}
            exportable={false}
          />
        )}

        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.accessor}
            header={col.name}
            body={col.body}
            sortable={col.sortable}
            style={col.style || { width: "auto" }}
          />
        ))}

        {actions && (
          <Column
            header={ActionTemplate}
            body={actions}
            style={{ width: "10%" }}
            exportable={false}
          />
        )}
      </DataTable>

      {onPageChange && (
        <Paginator
          first={Number(first)}
          rows={Number(rows)}
          totalRecords={Number(count)}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 50]}
          className="mt-3 justify-content-center"
        />
      )}
    </>
  );
};

export default TableContainer;
