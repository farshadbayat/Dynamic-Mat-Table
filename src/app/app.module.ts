import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PersianLanguage } from './persian.language';
/* import { DynamicMatTableModule } from 'dynamic-mat-table'; */
import { DynamicMatTableModule, TableIntl } from 'dynamic-mat-table';

export function languageIntl() {
  return new TableIntl(); /* For EN */
  // return new PersianLanguage(); /* For FA */
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    DynamicMatTableModule,
  ],
  providers: [
    { provide: TableIntl, useFactory: languageIntl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
