import {
  AbstractField,
  TableField,
  TablePagination,
  TableSetting,
  VisibleActionMenu,
} from "../../../projects/dynamic-mat-table/src/public-api";

export const tableColumnsConfig: TableField<any>[] = [
  {
    name: "row",
    type: "number",
    cellStyle: { "background-color": "#3f51b5", color: "#ffffff" },
  },
  {
    name: "order",
    header: "Row Order",
    sticky: "start",
    option: 1,
    clickable: false,
    rowSelectable: false,
  },
  {
    name: "name",
    header: "Element Name",
    sticky: "start",
  },
  { name: "weight" },
  { name: "color" },
  { name: "brand" },
  {
    name: "setting",
    icon: "chrome_reader_mode",
    iconColor: "blue",
    option: 2,
    clickable: false,
    rowSelectable: false,
  },
];

const actionMenu: VisibleActionMenu = {
  json: true,
  csv: true,
  print: true,
  columnSettingPin: true,
  columnSettingFilter: true,
  clearFilter: true,
};

export const tableSettingsConfig: TableSetting = {
  direction: "ltr",
  visibleActionMenu: actionMenu,
  // rowStyle: {
  //   "background-color": "#70e181",
  //   color: "ffffff",
  // },
  // alternativeRowStyle: {
  //   "background-color": "afafaf",
  //   color: "55fab3",
  // },
  autoHeight: true,
};

export const paginationConfig: TablePagination = {
  length: 100,
  pageIndex: 1,
  pageSize: 10,
  pageSizeOptions: [5, 10, 15, 20],
  showFirstLastButtons: true,
};
