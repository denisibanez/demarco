import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.scss'],
})
export class DialogAddComponent implements OnInit {
  @Output() closeClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  closeDialog() {
    this.closeClick.emit();
  }
}
