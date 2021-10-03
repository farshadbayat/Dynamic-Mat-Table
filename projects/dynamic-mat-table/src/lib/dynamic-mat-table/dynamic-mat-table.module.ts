import { Compiler, CompilerFactory, COMPILER_OPTIONS, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { TableIntl } from '../international/table-Intl';
import { TableCoreDirective } from '../cores/table.core.directive';
import { RowMenuModule } from './extensions/row-menu/row-menu.module';
import { DynamicMatTableComponent } from './dynamic-mat-table.component';
import { TableMenuModule } from './extensions/table-menu/table-menu.module';
import { HeaderFilterModule } from './extensions/filter/header-filter.module';
import { TableVirtualScrollModule } from '../cores/table-virtual-scroll.module';
import { PrintTableDialogComponent } from './extensions/print-dialog/print-dialog.component';
import { DynamicCellDirective } from '../cores/dynamic-cell/dynamic-cell.directive';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from './extensions/toolbar/toolbar.component';
import { MatRippleModule } from '@angular/material/core';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { TemplateOrStringDirective } from '../tooltip/template-or-string.directive';
import { FormsModule } from '@angular/forms';

export function createCompiler(compilerFactory: CompilerFactory): Compiler {
  return compilerFactory.createCompiler();
}

export function paginatorLabels(tableIntl: TableIntl) {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.firstPageLabel = tableIntl?.paginatorLabels?.firstPageLabel;
  paginatorIntl.getRangeLabel = tableIntl?.paginatorLabels?.getRangeLabel;
  paginatorIntl.itemsPerPageLabel = tableIntl?.paginatorLabels?.itemsPerPageLabel;
  paginatorIntl.lastPageLabel = tableIntl?.paginatorLabels?.lastPageLabel;
  paginatorIntl.nextPageLabel = tableIntl?.paginatorLabels?.nextPageLabel;
  paginatorIntl.previousPageLabel = tableIntl?.paginatorLabels?.previousPageLabel;
  return paginatorIntl || null;
}

const ExtentionsModule = [HeaderFilterModule, RowMenuModule];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatProgressBarModule,
    MatIconModule,
    DragDropModule,
    TableMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule,
    OverlayModule,
    ExtentionsModule,
    // NoopAnimationsModule
  ],
  exports: [DynamicMatTableComponent, ToolbarComponent],
  providers: [
    // bugfixed in library compiler not load and must create library
    {provide: COMPILER_OPTIONS, useValue: {}, multi: true},
    {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
    {provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory]},
    TableIntl,
    {
      provide: MatPaginatorIntl,
      useFactory: paginatorLabels,
      deps: [TableIntl],
    },
  ],
  declarations: [
    DynamicMatTableComponent,
    PrintTableDialogComponent,
    ToolbarComponent,
    TableCoreDirective,
    DynamicCellDirective,
    TooltipComponent,
    TooltipDirective,
    TemplateOrStringDirective
  ],
  entryComponents: [PrintTableDialogComponent, TooltipComponent],
})
export class DynamicMatTableModule {}
