import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './pages/list/list.component';
import { ImportComponent } from './pages/import/import.component';
import { OverviewComponent } from './pages/overview/overview.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModule
  ],
  declarations: [ListComponent, ImportComponent, OverviewComponent]
})
export class TransactionsModule { }
