import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { DynamicMatTableModule } from "../../projects/dynamic-mat-table/src/public-api";
import { MatSliderModule } from "@angular/material/slider";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { DemoTableComponent } from "./simple-table/simple-table.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@NgModule({
  declarations: [AppComponent, DemoTableComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    DynamicMatTableModule.forRoot({
      //visibleActionMenu: { csv: false, json: false, print: false }
    }),
    MatSliderModule,
    DragDropModule,
    MatTableModule,
    MatIconModule,
    MatBadgeModule,
    MatTabsModule,
    MatButtonToggleModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
