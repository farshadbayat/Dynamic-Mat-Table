import { TableRow, TableSelectionMode } from '../models/table-row.model';
import { TableVirtualScrollDataSource } from './table-data-source';
import { MatSort, MatTable, MatPaginator } from '@angular/material';
import { ViewChild, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, HostBinding } from '@angular/core';
import { TableMenu, TableSetting } from '../models/table-menu.model';
import { TableField } from '../models/table-field.model';
import { titleCase } from '../utilies/text.utility';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { TableService } from '../dynamic-mat-table/dynamic-mat-table.service';
import { TablePagination } from '../models/table-pagination.model';
import { Utils } from './utils';


export class TableCore<T extends TableRow> implements OnInit {
  @ViewChild(MatSort, { static: true }) // sort: MatSort;
  set sort(value: MatSort) {
    if (value && value !== null) {
      if (this.tvsDataSource === undefined || this.tvsDataSource === null) {
        this.tvsDataSource = new TableVirtualScrollDataSource<T>([]);
      }
      this.tvsDataSource.sort = value;
    }
  }
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (value && value !== null) {
      if (this.tvsDataSource === undefined || this.tvsDataSource === null) {
        this.tvsDataSource = new TableVirtualScrollDataSource<T>([]);
      }
      (this.tvsDataSource as any)._paginator = value;
    }
    this.updatePagination();
  }

  @HostBinding('style.direction')
  get direction(): 'rtl' | 'ltr' {
    return this.tableSetting.direction;
  }
  set direction(value: 'rtl' | 'ltr') {
    this.tableSetting.direction = value;
  }

  @Input()
  get setting() {
    return this.tableSetting;
  }
  set setting(value: TableSetting) {
    this.tableSetting = value;
  }

  @Input()
  get pagingEnable() {
    return this.tablePagingEnable;
  }
  set pagingEnable(value: boolean) {
    this.tablePagingEnable = value;
    this.updatePagination();
  }

  @Input()
  get pagination() {
    return this.tablePagination;
  }
  set pagination(value: TablePagination) {
    if (value && value !== null) {
      this.tablePagination = value;
      if ( Utils.isNull(this.tablePagination.pageSizeOptions)) {
        this.tablePagination.pageSizeOptions = [5, 10, 25, 100];
      }
      if ( Utils.isNull(this.tablePagination.pageSizeOptions)) {
        this.tablePagination.pageSize = this.tablePagination.pageSizeOptions[0];
      }
      this.updatePagination();
    }
  }

  @Input()
  get rowSelection() {
    return this.tableSelection;
  }
  set rowSelection(value: SelectionModel<T>) {
    this.tableSelection = value;
  }

  @Input()
  get selection() {
    return this.selectionRow;
  }
  set selection(selection: TableSelectionMode) {
    this.selectionRow = selection || 'none';
    this.tableSelection = this.selectionRow === 'none' ? null : new SelectionModel<T>(this.selectionRow === 'multi', []);
    this.setDisplayedColumns();
    this.rowSelectionChange.emit(this.tableSelection);
  }

  @Input()
  get tableName() {
    return this.tableService.tableName;
  }
  set tableName(value: string) {
    this.tableService.tableName = value;
  }

  @Input()
  get showProgress() {
    return this.progressColumn.length > 0;
  }
  set showProgress(value: boolean) {
    this.progressColumn = [];
    if (value === true) {
      this.progressColumn.push('progress');
    }
  }

  @Input()
  get dataSource() {
    return this.tvsDataSource;
  }
  set dataSource(value: TableVirtualScrollDataSource<T>) {
    this.clear();
    if (value && value != null) {
      this.tvsDataSource.data = value.data;
      this.cdr.detectChanges();
    }
  }

  @Input()
  get menu() {
    return this.menus;
  }
  set menu(menus: TableMenu[]) {
    this.menus = menus;
  }
  @Input()
  get columns() {
    return this.tableColumns;
  }
  set columns(fields: TableField<T>[]) {
    fields.forEach(f => {
      // default value for fields
      f.header = f.header ? f.header : titleCase(f.name);
      f.display = f.display ? f.display : 'visible';
      f.filter = f.filter ? f.filter : 'client-side';
      f.sort = f.sort ? f.sort : 'client-side';
      f.sticky = f.sticky ? f.sticky : 'none';
    });
    this.tableColumns = fields;
    this.tableSetting.columnSetting = Utils.clone(fields);
    this.setDisplayedColumns();
  }

  constructor(public tableService: TableService, public cdr: ChangeDetectorRef) {
    this.showProgress = true;
  }
  // Variables //
  progressColumn: string[] = [];
  displayedColumns: string[] = [];
  private selectionRow: TableSelectionMode;
  private menus: TableMenu[] = [];
  public tableColumns: TableField<T>[];
  private previousIndex: number; // Drag & Drop
  public tvsDataSource: TableVirtualScrollDataSource<T>;
  private tableSelection = new SelectionModel<T>(true, []);
  private tablePagination: TablePagination = { pageSizeOptions: [] };
  public tablePagingEnable = false;
  public viewportClass: 'viewport' | 'viewport-with-pagination' = 'viewport-with-pagination';
  public tableSetting: TableSetting = {};
  // private direction: 'ltr' | 'rtl';
  /**************************************** Refrence Variables ***************************************/
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;
  // @ViewChildren(HeaderFilterComponent) headerFilterList: QueryList<HeaderFilterComponent>;

  /************************************ Input & Output parameters ************************************/
  @Input()
  get dir(): 'ltr' | 'rtl' {
    return this.direction;
  }
  set dir( value: 'ltr' | 'rtl') {
    this.direction = value;
    // update in menu
    this.tableSetting = {
      direction: value,
      visibaleActionMenu: this.tableSetting.visibaleActionMenu || null,
      columnSetting: this.tableColumns
    };
  }
  @Input() pending: boolean;
  @Input() rowHeight = 48;
  @Input() headerHeight = 56;
  @Input() footerHeight = 48;
  @Input() headerEnable = true;
  @Input() footerEnable = false;
  @Input() sticky: boolean;
  @Output() settingChange: EventEmitter<any> = new EventEmitter();
  @Output() paginationChange: EventEmitter<TablePagination> = new EventEmitter();
  @Output() rowSelectionChange: EventEmitter<SelectionModel<T>> = new EventEmitter();
  @Input() showNoData: boolean;

  /**************************************** Methods **********************************************/

  updatePagination() {
    window.requestAnimationFrame(() => {
      if (this.tablePagingEnable === true) {
        this.viewportClass = 'viewport-with-pagination';
        if ( !Utils.isNull(this.tvsDataSource.paginator)) {
          this.tvsDataSource.paginator.length = this.dataSource.data.length;
        }
      } else {
        this.viewportClass = 'viewport';
        if ((this.tvsDataSource as any)._paginator !== undefined) {
          console.log('delete');
          delete (this.tvsDataSource as any)._paginator;
        }
      }
      this.tvsDataSource.refreshFilterPredicate();
    });
  }

  ngOnInit(): void {
  }

  clear() {
    if (this.dataSource && this.dataSource !== null) {
      this.viewport.scrollTo({ top: 0, behavior: 'auto' });
      this.dataSource.clearData();
    }
    // this.dataSource = new TableVirtualScrollDataSource<T>([]);
  }

  trackBy = (_: number, item: any) => {
    return item.Id;
  }

  setDisplayedColumns() {
    if (this.columns) {
      this.displayedColumns = [];
      this.columns.forEach((colunm, index) => {
        colunm.index = index;
        if (colunm.display === undefined || colunm.display === 'visible' || colunm.display === 'prevent-hidden') {
          this.displayedColumns.push(colunm.name);
        }
        // this.displayedColumns[index] = colunm.name;
      });

      if (this.selection === 'multi' || this.selection === 'single') {
        this.displayedColumns = ['table-select', ...this.displayedColumns];
      }
      this.displayedColumns.push('table-menu');
    }
    this.updatePagination();
  }


  /************************************ Drag & Drop Column *******************************************/

  dragStarted(event: CdkDragStart, index: number) {
    this.previousIndex = index;
    const offset = this.viewport.measureScrollOffset();
  }

  dropListDropped(event: CdkDropList, index: number) {
    if (event) {
      this.moveColumn(this.previousIndex, index);
    }
  }

  moveColumn(from: number, to: number) {
    window.requestAnimationFrame(() => {
      moveItemInArray(this.columns, from, to);
      this.refreshColumn(this.columns);
    });
  }

  refreshColumn(columns: TableField<T>[]) {
    const currentOffset = this.viewport.measureScrollOffset();
    this.columns = columns;
    this.setDisplayedColumns();
    setTimeout(() => this.viewport.scrollTo({ top: currentOffset, behavior: 'auto' }), 0);
  }

  saveSetting(tableSetting: TableSetting, raiseEvent: boolean = false) {
    console.log(tableSetting);
    if (tableSetting !== null) {
      this.tableSetting = tableSetting;
      this.refreshColumn(tableSetting.columnSetting);
    }
    if (raiseEvent === true) {
      this.settingChange.emit(this.tableSetting);
    }
  }

  /************************************ Selection Table Row *******************************************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.tableSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.rowSelection.clear() :
      this.dataSource.data.forEach(row => this.rowSelection.select(row));
    this.rowSelectionChange.emit(this.rowSelection);
  }

  onRowSelectionChange(e, row) {
    console.log(e);
    if (e) {
      this.rowSelection.toggle(row);
      this.rowSelectionChange.emit(this.rowSelection);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.rowSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
