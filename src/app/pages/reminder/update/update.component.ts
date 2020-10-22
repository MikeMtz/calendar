import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Reminder } from "../../../interfaces/reminder";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  reminder:Reminder;
  form;
  formError = false;
  saved = false;

  @Input() day;
  @Input() idx;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,) {
    this.form = this.formBuilder.group({
      name: '',
      date: '',
      city: '',
      color: '',
      time: ''
    });

  }

  save(form) {
    this.formError = false;
    if(!form.valid) {
      this.formError = true;
      return;
    }
    let reminders = JSON.parse(localStorage.getItem('reminder_' + this.day));
    reminders.splice(this.idx, 1);
    reminders.sort((a, b) => (a.time > b.time) ? 1 : -1)
    localStorage.setItem('reminder_' + this.day, JSON.stringify(reminders));

    reminders = JSON.parse(localStorage.getItem('reminder_' + this.reminder.date));
    if(reminders === null) {
      reminders = [];
    }
    reminders.push(this.reminder);
    reminders.sort((a, b) => (a.time > b.time) ? 1 : -1)
    localStorage.setItem('reminder_' + this.reminder.date, JSON.stringify(reminders));

    this.saved = true;
    setTimeout(() => { this.closeModal()}, 1700);
  }

  closeModal() {
    this.activeModal.close()
  }

  ngOnInit(): void {
    let current = JSON.parse(localStorage.getItem('reminder_' + this.day));
    this.reminder = current[this.idx]
  }

}
