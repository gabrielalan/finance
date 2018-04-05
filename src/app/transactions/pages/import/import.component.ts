import { Component, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportComponent {

  loading = false;

  constructor(private base: TransactionsService) {}

  onFileChange(evt) {
    const reader = new FileReader();
    const finish = this.importFinished.bind(this);

    this.loading = true;

    reader.onload = (e: any) => this.base
      .importFromCSV(e.target.result)
      .subscribe(finish, finish);

    reader.readAsText(evt.target.files[0]);
  }

  importFinished(response) {
    this.loading = false;

    console.log(response);
  }
}
