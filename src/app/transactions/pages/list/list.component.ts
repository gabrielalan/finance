import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';
import * as moment from 'moment';
import { IngTransaction } from '../../../core/models/transaction/ing-transaction.model';

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
    this.loadData({
      startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      finalDate: moment().format('YYYY-MM-DD')
    });
  }

  onFilter(filter) {
    this.loadData(filter);
  }

  filterResult(data, { startDate, finalDate }) {
    const start = moment(startDate, 'YYYY-MM-DD');
    const final = moment(finalDate, 'YYYY-MM-DD');

    return data.filter((transaction: IngTransaction) =>
      (transaction.date.isSameOrBefore(final) && transaction.date.isSameOrAfter(start))
    );
  }

  loadData(filter) {
    this.db
      .load()
      .then(result => this.filterResult(result, filter))
      .then(result => {
        this.transactions = result;
        this.loading = false;
      });
  }

}
