import { DataGrid, DataGridProps, GridToolbar } from "@mui/x-data-grid";

const CustomTable = ({ rows, slotProps, ...props }: DataGridProps) => (
  <div className="relative m-0 w-full overflow-y-auto bg-white">
    <div style={{ width: "100%" }} className="h-[80vh]">
      <DataGrid
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        rows={rows}
        pageSizeOptions={[100]}
        {...{ rowLength: 5 }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: { showQuickFilter: true, csvOptions: { utf8WithBom: true } },
          ...slotProps,
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterExcludeHiddenColumns: true,
            },
          },
        }}
        {...props}
      />
    </div>
  </div>
);

export default CustomTable;
