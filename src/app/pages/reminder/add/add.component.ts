import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Reminder } from "../../../interfaces/reminder";


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent{

  reminder:Reminder;
  form;
  formError = false;
  added = false;

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
    this.reminder = form.value;
    let current = localStorage.getItem("reminder_" + this.reminder.date);
    if(current === null) {
      localStorage.setItem("reminder_" + this.reminder.date, JSON.stringify([this.reminder]));
    } else {
      let reminders = JSON.parse(current);
      reminders.push(this.reminder);
      reminders.sort((a, b) => (a.time > b.time) ? 1 : -1)
      localStorage.setItem("reminder_" + this.reminder.date, JSON.stringify(reminders));
    }

    form.reset();

    this.added = true;
    setTimeout(() => { this.added = false}, 1700);
  }

  closeModal() {
    this.activeModal.close()
  }

}
