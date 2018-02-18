import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './transactions/pages/list/list.component';
import { ImportComponent } from './transactions/pages/import/import.component';
import { OverviewComponent } from './transactions/pages/overview/overview.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'transactions', component: ListComponent },
  { path: 'import', component: ImportComponent },
  { path: '',
    redirectTo: '/overview',
    pathMatch: 'full'
  }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
