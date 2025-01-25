# dynamic-mat-table

test
Dynamic tables built with angular material.

## Getting Started

A full demo can be found on the github repository.

Install with npm:

`npm i dynamic-mat-table`

After installation include `DynamicMatTableModule` in your module imports:

```javascript
import { DynamicMatTableModule } from 'dynamic-mat-table';
...
imports: [
    DynamicMatTableModule
  ],
...
```

Column types are defined as follow:

```javascript
export interface AbstractField {
  index?: number;
  name: string; // The key of the data
  type?: "text" | "number" | "date" | "category"; // Type of data in the field
  width?: number; // width of column
  header?: string; // The title of the column
  print?: boolean; // disply in printing view by defualt is true
  isKey?: boolean;
  inlineEdit?: boolean;
  display?: "visible" | "hidden" | "prevent-hidden"; // Hide and visible this column
  sticky?: "start" | "end" | "none"; // sticky this column to start or end
  filter?: "client-side" | "server-side" | "none";
  sort?: "client-side" | "server-side" | "none";
  cellClass?: string; // Apply a class to a cell, class name must be in the data
}
```

Data row is extend from TableRow:

```javascript
export interface TableRow {
  id?: number;
  isOpen?: boolean;
  rowClass?: string;
  actionMenu?: { [key: string]: ActionMenu };
}
```

Source data must be an TableVirtualScrollDataSource:

```javascript
let data = [
  { "row": 1, "name": "Element #4", "weight": "65 KG", "color": "Magenta", "brand": "Zanjan Benz", "type": "Van" }, ...];

this.dataSource = new TableVirtualScrollDataSource(data);
```

In the HTML add the selector:

```html
<dynamic-mat-table tableName="demo_table" [columns]="fields" [dataSource]="dataSource" [sticky]="stickyHeader" [showNoData]="showNoData" [showProgress]="showProgress" [pending]="pending" [selection]="tableSelection" [pagination]="pagination" [pagingMode]="'server'" [class.conditional-class]="conditinalClass" [setting]="setting" [dir]="direction" [printConfig]="printConfig" [actionMenu]="actionMenu" (settingChange)="table_onChangeSetting($event)" (rowActionMenuChange)="table_onRowActionChange($event)" (rowClick)="table_onRowClick($event)"> </dynamic-mat-table>
```

Inputs:

`columns` = Column definitions
`dataSource` = Table data in TableVirtualScrollDataSource
`sticky` = Enable the sticky on header
`showNoData` = show custom text on center if there is not any record
`showProgress` = active progress on table
`pending` = pending progress on table
`selection` = active selection row ('single' | 'multi' | 'none')
`pagination` = configuration for pagination. eg: { pageIndex: 0, pageSize: 10, pageSizeOptions: [ 5, 10, 100, 1000], showFirstLastButtons: true }
`pagingMode` = paging mode ('none' | 'client' | 'server')

`class.conditional-class` = apply custom style. eg:

```style
  /* Conditional Class & Overwrite Style */
  :host ::ng-deep .conditional-class .mat-table .row-selection{
    background-color:rgb(7, 140, 163) !important; /* for over write */
    border-radius: 5px;
    .mat-cell {
      color: white !important;
    }
  }

  /* Style Element Inside Table */
  :host ::ng-deep dynamic-mat-table .mat-table mat-row{
    cursor: pointer;
  }
```

`setting` = can restore column setting(width, order, visible, ...) with this parameter.
`dir` = rtl/ltr.
`printConfig` = print configuration. eg: { title: 'Print All Test Data' , showParameters: true }
`actionMenu` = show action menu on each row and can change menu parameters: suppose

```javascript
  this.actionMenu.push(
    { name: 'Edit', text: 'Edit', color: 'primary', icon: 'edit', disabled: false, visible: true},
    { name: 'Delete',text: 'Delete Record', color: 'warn', icon: 'delete', disabled: false, visible: true});
  Customize for one record:
  this.dataSource.allData[0].actionMenu = { Edit: { text: 'View', color: 'primary', icon: 'build_circle'}, Delete: {visible: false}};
```

`settingChange` = Output all configuration of columns
`rowActionMenuChange` = Output for action menu that clicked
`rowClick` = Output for the click event on the row

For more examples run the demo application.
