import { ChangeDetectionStrategy, Component, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TableService } from '../../dynamic-mat-table.service';
import { TableSetting } from '../../../models/table-setting.model';
import { TableIntl } from '../../../international/table-Intl';
import { clone, deepClone, isNullorUndefined } from '../../../cores/type';
import { AbstractField } from '../../../models/table-field.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMenuComponent {
  @Output() menuActionChange: EventEmitter<TableMenuActionChange> = new EventEmitter<TableMenuActionChange>();
  @Input()
  get tableSetting(): TableSetting {
    return this.currentTableSetting;
  }
  set tableSetting(value: TableSetting) {
    value.settingList = value.settingList === undefined ? [] : value.settingList;
    this.originalTableSetting = value;
    this.reverseDirection = value.direction === 'rtl' ? 'ltr' : 'rtl';
    this.currentTableSetting = value;
  }

  @Output() tableSettingChange = new EventEmitter<TableSetting>();
  @ViewChild('newSetting', {static: false}) newSettingElement: ElementRef;

  newSettingName = '';
  showNewSetting = false;

  currentColumn: number = null;
  reverseDirection: string = null;
  originalTableSetting: TableSetting;
  currentTableSetting: TableSetting;

  constructor(public languagePack: TableIntl, public tableService: TableService) {
  }

  screenMode_onClick() {
    this.menuActionChange.emit({
      type: 'FullScreenMode',
      data: this.currentTableSetting,
    });
  }

  /***** Column Setting ******/
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.currentTableSetting.columnSetting,
      event.item.data.columnIndex,
      event.currentIndex
    );
  }

  toggleSelectedColumn(column: AbstractField) {
    // const colFound = this.currentTableSetting.columnSetting.find(c => c === column);
    column.display = column.display === 'visible' ? 'hiden' : 'visible';
  }

  apply_onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.menuActionChange.emit({
      type: 'TableSetting',
      data: this.currentTableSetting,
    });
    this.tableService.saveColumnInfo(this.currentTableSetting.columnSetting);
    // setTimeout(() => {
    //   this.menuActionChange.emit({
    //     type: 'TableSetting',
    //     data: this.currentTableSetting,
    //   });
    //   this.tableService.saveColumnInfo(this.currentTableSetting.columnSetting);
    // });
  }

  setting_onClick(i) {
    this.currentColumn = i;
  }

  cancel_onClick() {
    this.currentTableSetting = deepClone(this.originalTableSetting);
  }

  isVisible(visible: boolean) {
    return isNullorUndefined(visible) ? true : visible;
  }

  /*****  Save ********/
  saveSetting_onClick(e, setting) {
    e.stopPropagation();
    this.menuActionChange.emit({ type: 'SaveSetting', data: setting.settingName });
  }

  newSetting_onClick(e) {
    this.showNewSetting = true;
    this.newSettingName ='';
    window.requestAnimationFrame(() =>{
      this.newSettingElement.nativeElement.focus();
    });
    e.stopPropagation();
  }

  selectSetting_onClick(e, setting: TableSetting) {
    e.stopPropagation();
    this.menuActionChange.emit({ type: 'SelectSetting', data: setting.settingName });
  }

  favorite_onClick(e, setting) {
    e.stopPropagation();
    this.menuActionChange.emit({ type: 'FavoriteSetting', data: setting.settingName });
  }

  applySaveSetting_onClick(e) {
    e.stopPropagation();
    this.menuActionChange.emit({ type: 'SaveSetting', data: this.newSettingName });
    this.showNewSetting = false;
  }

  cancleSaveSetting_onClick(e) {
    e.stopPropagation();
    this.newSettingName='';
    this.showNewSetting = false;
  }

  deleteSetting_onClick(e, setting) {
    e.stopPropagation();
    this.menuActionChange.emit({ type: 'DeleteSetting', data: setting });
    this.newSettingName ='';
    this.showNewSetting = false;
  }




  /*****  Filter ********/
  clearFilter_onClick() {
    setTimeout(() => {
      this.menuActionChange.emit({ type: 'FilterClear' });
    });
  }

  /******* Save File ***********/
  download_onClick(type: string) {
    setTimeout(() => {
      this.menuActionChange.emit({ type: 'Download', data: type });
    });
  }

  print_onClick(menu) {
    menu._overlayRef._host.parentElement.click();
    setTimeout(() => {
      this.menuActionChange.emit({ type: 'Print', data: null });
    });
  }
}

export interface TableMenuActionChange {
  type: 'FilterClear' | 'TableSetting' | 'Download' | 'SaveSetting' | 'DeleteSetting' | 'SelectSetting' | 'FavoriteSetting' | 'Print' | 'FullScreenMode';
  data?: any;
}
