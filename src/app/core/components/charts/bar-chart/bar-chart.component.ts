import { Component, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnChanges {

  @Input() id: String;
  @Input() title: String;

  @Input() bgColors: Array<String> = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)'
  ];

  @Input() labels: Array<String> = [];

  @Input() dataset: any;

  constructor() {}

  generateColors(length) {
    let colorsCopy = this.bgColors.slice();

    return Array.apply(null, { length }).map(() => {
      if (!colorsCopy.length) {
        colorsCopy = this.bgColors.slice();
      }

      return colorsCopy.pop();
    });
  }

  generateDatasets() {
    const set = { ...this.dataset, backgroundColor: this.generateColors(this.labels.length) }
    return [set];
  }

  ngOnChanges() {
    var myChart = new Chart(this.id, {
      type: 'horizontalBar',
      data: {
        labels: this.labels,
        datasets: this.generateDatasets()
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: this.title,
          fontSize: 16
        },
        plugins: {
          datalabels: {
            align: 'end',
            formatter: (value) => `$${value}`
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }
}
