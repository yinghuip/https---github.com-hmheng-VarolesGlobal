import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Invoice } from '../model/invoice.model';
import { ChartService } from '../services/chart.service';
declare let google: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  private data: Invoice[];
  private dataTable: any[][];
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.chartService.getData()
      .subscribe((result) => {
        this.data = this.getLastSixMonth(result);
        this.dataTable = this.convertToDateTable(this.data)
        console.log(this.dataTable)
        this.generateChart(this.dataTable,this.data);
      })
  }

  //   @HostListener('window:resize', ['$event'])
  //   onResize(event:Event) {
  //     this.generateChart(this.data);
  // }

  //   ngAfterViewInit(): void {
  //   this.generateChart(this.data);

  // }

  generateChart(dataTable: any[][],invoice:Invoice[]) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      
      let data = new google.visualization.DataTable();
      data.addColumn('string', 'Month');
      data.addColumn('number', 'Amount');
      data.addRows(dataTable)
    
      let options = {
        width: '100%',
        heigth: '100%',
        vAxis: { title: 'KWH' },
        theme: 'material',
        seriesType: 'bars',
        legend: {
          position: 'none'
        },
        tooltip: {
          trigger: 'none'
        },
        enableInteractivity: false
      };
    
      const chartDiv = document.getElementById('bar_chart_div');
      if (chartDiv) {
        var chart = new google.visualization.ComboChart(chartDiv);
        google.visualization.events.addListener(chart, 'ready', placeMarker.bind(chart, data));
        chart.draw(data, options);
        function placeMarker(dataTable: any) {
          var cli = chart.getChartLayoutInterface();
          var chartArea = cli.getChartAreaBoundingBox();
          console.log(chartArea)
          for (let i = 0; i <= dataTable.Wf.length; i++) {
            let label = chart.getContainer().appendChild(document.createElement('span'))
            var yPos = Math.floor(chartArea.top + chartArea.height + 20);
            if (i == 0) {
              let xPos = 53;
              label.style.top = yPos + "px";
              label.style.left = xPos + "px";
              label.style.position = 'absolute';
              label.innerHTML = 'Bill';
            }
            else {
              let xPos = cli.getXLocation(i - 1) - 20;
              label.style.top = yPos + "px";
              label.style.left = xPos + "px";
              label.style.position = 'absolute';
              label.innerHTML = `$${invoice[i-1].Cost}`;
            }
    
          }
        }
      }
    }

  }





  private getLastSixMonth(data: Invoice[]) {
    return data.sort((a, b) => this.sort(a, b))
      .slice(0, 6).map((i) => {
        i.Month = new Date(i.Date).toLocaleString('en-us', { month: "short" });
        return i;
      }).reverse();
  }
  private sort(a: Invoice, b: Invoice) {
    return new Date(b.Date).getTime() - new Date(a.Date).getTime();
  }
  private convertToDateTable(data: Invoice[]) {
    return data.map((i,) => {
      let dataTable: any[] = [];
      ['Month', 'KWH'].forEach((k) => dataTable.push((i as any)[k]));
      return dataTable;
    });
  }
}

