import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Chart } from 'chart.js';

import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var chart = new Chart('chart-0', {
			type: 'line',
			data: {
				labels: ["0a", "1a", "2a", "3a", "4a", "5a", "6a", "7a"],
				datasets: [{
					backgroundColor: '#FF3784',
					borderColor: '#FF3784',
					data: [11.51277435, 73.4529321, 66.15440672, 46.40732167, 45.07587449, 11.54278121, 24.82038752, 71.3284465]
				}, {
					backgroundColor: '#36A2EB',
					borderColor: '#36A2EB',
          data: [53.02854938, 91.10039438, 38.94590192, 60.76260288, 39.26654664, 86.80341221, 23.12628601, 19.84010631]
				}]
			},
			options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Monthly In/Out',
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
				},
				scales: {
					yAxes: [{
						stacked: true
					}]
				}
			}
		});
  }

}
