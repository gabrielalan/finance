import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/database.service';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TransactionsService } from './services/transactions.service';
import { LoadingComponent } from './components/loading/loading.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';

const components = [
  HeaderComponent,
  LoadingComponent,
  PageTitleComponent,
  BarChartComponent,
  LineChartComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: components,
  exports: components,
  providers: [TransactionsService]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [
        DatabaseService
      ]
    }
  }
}
