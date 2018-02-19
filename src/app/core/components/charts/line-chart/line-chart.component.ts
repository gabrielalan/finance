import { Component, OnChanges, ViewEncapsulation, Input } from '@angular/core';
import { Chart } from 'chart.js';

import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnChanges {

  @Input() id: String;

  @Input() title: String;

  @Input() labels: Array<String> = [];

  @Input() datasets: any;

  constructor() { }

  ngOnChanges() {
    var chart = new Chart('chart-0', {
			type: 'line',
			data: {
				labels: this.labels,
				datasets: this.datasets
			},
			options: {
        // legend: { display: false },
        title: {
          display: true,
          text: this.title,
          fontSize: 16
        },
        tooltips: false,
        layout: {
          padding: {
            top: 42,
            right: 16,
            bottom: 32,
            left: 8
          }
        },
        elements: {
          line: {
            fill: false
          }
        },
				plugins: {
					datalabels: {
            align: 'end',
						anchor: 'end',
						backgroundColor: function(context) {
							return context.dataset.backgroundColor;
						},
						borderRadius: 4,
						color: 'white',
						font: {
							weight: 'bold'
						},
						formatter: Math.round
					}
				}
			}
		});
  }

}
