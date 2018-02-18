import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportComponent implements OnInit {

  constructor(private base: TransactionsService) {}

  onFileChange(evt) {
    const reader = new FileReader();

    reader.onload = (e: any) => this.base.importFromCSV(e.target.result).then(console.log);

    reader.readAsText(evt.target.files[0]);
  }

  ngOnInit() {
  }

}
