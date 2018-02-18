import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  loading = true;

  labels: Array<String> = [];

  dataset: any = {};

  constructor(private db: TransactionsService) { }

  ngOnInit() {
    this.db.loadOutbound()
      .then(this.sortAndFilter.bind(this))
      .then(({ labels, dataset }) => {
        this.loading = false;
        this.labels = labels;
        this.dataset = dataset;
      });
  }

  sortAndFilter(groups): { labels: any, dataset: any } {
    return groups
      .map(this.sumTransactions)
      .sort(this.sortGroup)
      .reduce(
        this.formatForChart,
        { labels: [], dataset: { data: [] } }
      );
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
