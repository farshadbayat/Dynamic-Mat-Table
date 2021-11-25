import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, Output, ViewChild,
         Input, EventEmitter, OnInit, ChangeDetectorRef, QueryList, ViewChildren, OnDestroy, ContentChildren } from '@angular/core';
import { TableField } from './../../../models/table-field.model';
import { TableService } from '../../dynamic-mat-table.service';
import { TextFilter } from './compare/text-filter';
import { NumberFilter } from './compare/number-filter';
import { AbstractFilter } from './compare/abstract-filter';
import { transition, trigger, query, style, stagger, animate } from '@angular/animations';
import { TableIntl } from '../../../international/table-Intl';
import { MatInput } from '@angular/material/input';
import { MatMenuTrigger } from '@angular/material/menu';
import { isNullorUndefined } from '../../../cores/type';
import { Subscription } from 'rxjs';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('10ms', animate('400ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
  ])
]);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'header-filter',
  templateUrl: './header-filter.component.html',
  styleUrls: ['./header-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [listAnimation]
})
export class HeaderFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() field?: TableField<any>;
  @Output() filterChanged: EventEmitter<AbstractFilter[]> = new EventEmitter<AbstractFilter[]>();

  @ContentChildren('filterInput') filterInputList !: QueryList<MatInput>;
  @ViewChild(MatMenuTrigger, { static: true }) menu !: MatMenuTrigger;

  private filterList: AbstractFilter[] = [];
  private eventsSubscription: Subscription;
  @Input()
  get filters(): AbstractFilter[] {
    if ( isNullorUndefined(this.filterList) === true || this.filterList.length === 0) {
      this.filterList = [];
      this.addNewFilter(this.field.type || 'text');
    }
    return this.filterList;
  }
  set filters(values: AbstractFilter[]) {
    this.filterList = values;
  }

  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return this.filterList && this.filterList.filter( f => f.hasValue() === true).length > 0;
  }

  @HostBinding('class.show-trigger')
  get showTrigger(): boolean {
    if(this.menu === undefined) {
      return false;
    } else {
      return this.menu.menuOpen || this.hasValue;
    }
  }

  constructor(public languagePack: TableIntl, public service: TableService, private cdr: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (isNullorUndefined(this.filters)) {
      this.filters = [];
      this.addNewFilter(this.field.type);
    }
  }

  addNewFilter(type: string = 'text') {
    switch (type || 'text') {
      case 'text': {
        this.filterList.push(new TextFilter(this.languagePack));
        break;
      }
      case 'number': {
        this.filterList.push(new NumberFilter(this.languagePack));
        break;
      }
      case 'date': {
        // this.compare = new DateCompare(service);
        break;
      }
      case 'boolean': {
        // this.compare = new BooleanCompare(service);
        break;
      }
      default: this.filterList.push(new TextFilter(this.languagePack));
    }
    this.filters[this.filters.length - 1].selectedIndex = 0;
    return this.filters[this.filters.length - 1];
  }

  ngAfterViewInit() {
    if (this.menu) {
      this.eventsSubscription = this.menu.menuOpened.subscribe(() => this.focusToLastInput());
    }
  }

  focusToLastInput() {
    setTimeout(() => {
      if (this.filterInputList.length > 0) {
        this.filterInputList.last.focus();
      }
    });
  }

  filterAction_OnClick(index, action) {
    if (action === 0 || action === 1) { // and or
      this.filters[index].type = action === 0 ? 'and' : 'or';
      if (this.filters.length === index + 1) {
        this.addNewFilter(this.field.type);
        this.focusToLastInput();
      }
    } else if (action === 2 && this.filters.length > 1) { // delete
      setTimeout(() => {
        this.filters.splice(index, 1);
        this.cdr.detectChanges();
        this.focusToLastInput();
      }); // bug for delete filter item(unwanted reaction close menu)
    }
  }

  clearColumn_OnClick() {
    this.filterList = [];
    this.filterChanged.emit(this.filterList);
  }

  applyFilter_OnClick() {
    this.filterChanged.emit(this.filterList);
  }

}

