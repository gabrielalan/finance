import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';
import * as moment from 'moment';
import { IngTransaction } from '../../../core/models/transaction/ing-transaction.model';
import { GroupsService } from '../../../core/services/groups.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  loading = true;

  total: Number;

  transactions: any;

  constructor(private db: TransactionsService, private groups: GroupsService) { }

  ngOnInit() {
    this.loadData({
      startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      finalDate: moment().format('YYYY-MM-DD')
    });
  }

  onFilter(filter) {
    this.loadData(filter);
  }

  filterResult(data, { startDate, finalDate, group }) {
    const start = moment(startDate, 'YYYY-MM-DD');
    const final = moment(finalDate, 'YYYY-MM-DD');

    const dateFilter = (transaction) =>
      (transaction.date.isSameOrBefore(final) && transaction.date.isSameOrAfter(start));

    const groupFilter = !group
      ? () => true
      : (transaction) => transaction.group === group;

    return data.filter((transaction: IngTransaction) =>
      dateFilter(transaction) && groupFilter(transaction)
    );
  }

  sumTotalSpent(data: Array<IngTransaction>): Number {
    return data.reduce((total: Number, transaction) =>
      transaction.operation === '-'
        ? Number(total) + Number(transaction.value)
        : total,
    0);
  }

  addGroup(data) {
    return data.map(item => {
      const group = this.groups.getAppliedGroup(item);
      item.group = group ? group.name : 'Others';
      return item;
    });
  }

  loadData(filter) {
    this.db
      .load()
      .then(result => this.filterResult(result, filter))
      .then(result => this.addGroup(result))
      .then(result => {
        this.transactions = result;
        this.total = this.sumTotalSpent(result);
        this.loading = false;
      });
  }

}
