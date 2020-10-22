import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddComponent } from "../reminder/add/add.component";
import * as moment from 'moment';
import { UpdateComponent } from "../reminder/update/update.component";
import { WeatherService } from "../../services/weather.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  monthGrid: any;
  dates:any;
  year:number = new Date().getFullYear();
  month:number = new Date().getMonth();
  textMonth:string;
  todayNum = new Date().getDate();

  constructor( private modalService: NgbModal, private _ws: WeatherService ) { }

  ngOnInit(): void {
    this.getMonth(this.year, this.month)
  }

  getMonth(year, month) {
    this.monthGrid = [];
    this.dates = [];
    let date = new Date(year, month, 1);
    this.textMonth = date.toLocaleString('default', { month: 'long' })
    while (date.getMonth() === month) {
      let day = new Date(date);
      let moment_date =  moment(day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate());
      this.dates.push({
        day : day.getDay(),
        date : moment_date,
        reminders: this.getReminders(moment_date.format('YYYY-MM-DD'))
      });
      date.setDate(date.getDate() + 1);
    }

    let start = this.dates[0].day;
    let week = 0;
    let num_day = 0;
    for(let d = 0; d < 6; d++) {
      if(!this.monthGrid[week]) {
        this.monthGrid[week] = [];
      }
      for(let wd = 0; wd < 7; wd++) {
        if(!this.monthGrid[week][wd]) {
          this.monthGrid[week][wd] = [];
        }
        if(week < 1) {
          if((wd - start) >= 0 && this.dates[(wd - start)] ){
            this.monthGrid[week][wd] = this.dates[(wd - start)];

            num_day = (wd-start == 1) ? 1 : num_day;
          }
        } else {
          if(this.dates[num_day] ) {
            this.monthGrid[week][wd] = this.dates[num_day];
          }
        }

        num_day++;
      }

      week++;
    }

  }

  nextMonth() {
    this.month++;

    if(this.month ==12) {
      this.year++;
      this.month = 0;
    }

    this.getMonth(this.year, this.month)
  }

  prevMonth() {
    this.month--;

    if(this.month < 0) {
      this.year--;
      this.month = 11;
    }

    this.getMonth(this.year, this.month)
  }

  getReminders(idx) {
    let reminders = localStorage.getItem("reminder_" + idx);

    if(reminders !== null) {
      let items = JSON.parse(reminders)

      items.forEach((item) => {
        item.weather = this.getWeather(item.city);

      })

      reminders = items;
    }
    console.log(reminders);
    return reminders;
  }

  add() {
    const modalRef = this.modalService.open(AddComponent);

    modalRef.result.then((data) => {
      this.getMonth(this.year, this.month);
    }, (reason) => {
      this.getMonth(this.year, this.month);
    });
  }

  edit(day, idx) {
    const modalRef = this.modalService.open(UpdateComponent);
    modalRef.componentInstance.day = day;
    modalRef.componentInstance.idx = idx;

    modalRef.result.then((data) => {
      this.getMonth(this.year, this.month);
    }, (reason) => {
      this.getMonth(this.year, this.month);
    });
  }

  deleteOne(day, idx) {
    if(confirm("Are you sure to delete this reminder?")) {
      let current = JSON.parse(localStorage.getItem('reminder_' + day));
      current.splice(idx, 1);
      localStorage.setItem('reminder_' + day, JSON.stringify(current));
      this.getMonth(this.year, this.month);
    }
  }

  delete(day) {
    if(confirm("Are you sure to delete all reminders on this day?")) {
      localStorage.removeItem('reminder_' + day);

      this.getMonth(this.year, this.month);
    }
  }

  getWeather(city) {

    this._ws.getWeather(city).subscribe((data) => {
      if(data['weather'][0]['main']) {
        return data['weather'][0]['main'];
      }
      return 'N/A';
    })
  }
}
