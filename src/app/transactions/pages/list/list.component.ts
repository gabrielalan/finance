import { Component, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';
import * as moment from 'moment';
import { IngTransaction } from '../../../core/models/transaction/ing-transaction.model';
import { GroupsService } from '../../../core/services/groups.service';

declare type Total = {
  spent: Number;
  received: Number;
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent {

  loading = true;

  total: Total = { spent: 0, received: 0 };

  transactions: any;

  constructor(private db: TransactionsService, private groups: GroupsService) { }

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

  sumTotalSpent(data: Array<IngTransaction>): Total {
    const sumTotal = (total: Total, transaction) => (
      {
        spent: transaction.operation === '-'
          ? Number(total.spent) + Number(transaction.value)
          : total.spent,
        received: transaction.operation === '+'
          ? Number(total.received) + Number(transaction.value)
          : total.received
      }
    );

    return data.reduce(sumTotal, { spent: 0, received: 0 });
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
