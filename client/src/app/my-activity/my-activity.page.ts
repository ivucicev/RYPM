import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
 

@Component({
    selector: 'app-my-activity',
    templateUrl: './my-activity.page.html',
    styleUrls: ['./my-activity.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class MyActivityPage implements OnInit {

  constructor(private route: Router) { }
  ngOnInit() {
  }
    
  @ViewChild('barChart', { static: false }) barChart; 	
  bars: any;
  colorArray: any;
  ionViewDidEnter() {
    this.createBarChart();
  }
    
  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S',],
        datasets: [{
          label: 'Viewers in millions',
         data: [45, 53, 50, 55, 50, 80, 100],
          backgroundColor: 'rgba(28, 229, 193, 0.38)',
          borderColor: '#1ce5c1',
          borderWidth: 2,
          pointColor : "#fff",
          pointStrokeColor : "#ff6c23"    
        },
        {
          label: 'Viewers in millions',
          data: [40, 50, 50, 45, 45, 50,],
          backgroundColor: 'rgba(28, 229, 193, 0.38)',
          borderColor: '#fff',
          borderWidth: 2,
         fill: false,    
        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
             point:{
                 radius: 0
             }
          },  
        legend: { 
          display: false,
        },  
        layout: {  
            padding: {
             left: 0,
             right: 0,
             top: 0,
             bottom: 0
            }
        }, 
        scales: {
          yAxes: [{
            display: false,
            ticks: {
              beginAtZero: false
            },
            gridLines: {
              drawBorder: false,
            }
          }],
          xAxes: [{
            display: true, 
            labelFontWeight: "bold",
            gridLines: {
              display: true,
              color: '#000',
              zeroLineColor: '#000'    
            },
            ticks: {
              fontColor: "#8C8C8C",
              fontSize: "15", 
              labelFontWeight: "bold",    
              fontFamily: "Google Sans",
            //  lineWidth: 2, 
            },
          }]
        },
          
      }
    });
  }

 stretch_workouts() {
    this.route.navigate(['./stretch-workouts']);
  }  
}
