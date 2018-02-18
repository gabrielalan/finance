import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  loading = true;

  transactions: any;

  constructor(private db: TransactionsService) { }

  ngOnInit() {
    this.db
      .load()
      .then(result => {
        this.transactions = result;
        this.loading = false;
      });
  }

}
