import { Component, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';
import { IngTransaction } from '../../../core/models/transaction/ing-transaction.model';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent {

  loading = true;

  labels: Array<String> = [];

  dataset: any = {};

  monthly: any = {};

  constructor(private db: TransactionsService) { }

  onFilter(data) {
    this.loadAllData(data);
  }

  loadAllData(filter) {
    const promises = [
      this.getOutboundData(filter),
      this.getMonthlyHistoryData()
    ];

    this.loading = true;

    Promise.all(promises).then(() => {
      this.loading = false;
    });
  }

  getMonthlyHistoryData() {
    return this.db.loadMonthlyInOut()
      .then(({ inbound, outbound }) => {
        this.monthly = {
          labels: Object.keys(inbound),
          datasets: [
            {
              label: 'Inbound',
              backgroundColor: '#36A2EB',
              borderColor: '#36A2EB',
              data: Object.values(inbound)
            }, {
              label: 'Outbound',
              backgroundColor: '#FF3784',
              borderColor: '#FF3784',
              data: Object.values(outbound)
            }
          ]
        };
      });
  }

  getOutboundData(filter) {
    const dateFilter = this.filterByDate(filter);

    return this.db.loadOutbound(dateFilter)
      .then(groups => groups.map(this.sumTransactions))
      .then(groups => this.removeZeroOutboundGroups(groups))
      .then(groups => groups.sort(this.sortGroup))
      .then(groups => this.formatOutbound(groups))
      .then(({ labels, dataset }) => {
        this.labels = labels;
        this.dataset = dataset;
      });
  }

  removeZeroOutboundGroups(groups) {
    return groups.filter(group => group.value > 0);
  }

  formatOutbound(groups): { labels: any, dataset: any } {
    return groups.reduce(
      this.formatForChart,
      { labels: [], dataset: { data: [] } }
    );
  }

  filterByDate({ startDate, finalDate }) {
    const start = moment(startDate, 'YYYY-MM-DD');
    const final = moment(finalDate, 'YYYY-MM-DD');

    return (transaction: IngTransaction) =>
      (transaction.date.isSameOrBefore(final) && transaction.date.isSameOrAfter(start));
  }

  formatForChart(result, current) {
    return {
      labels: [...result.labels, current.name],
      dataset: {
        label: 'Value spent',
        data: [...result.dataset.data, current.value]
      }
    };
  }

  sortGroup(a, b) {
    return b.value - a.value;
  }

  sumTransactions({ name, transactions }) {
    const value = transactions.reduce((result, current) => result + current.value, 0).toFixed(2);
    return { name, value };
  }
}
