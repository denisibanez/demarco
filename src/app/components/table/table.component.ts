import {
  OnChanges,
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() title?: string = '';
  @Input() activeClass: string = '';
  @Input() displayedColumns: any = [];
  @Input() columns: any = [];
  @Input() items: any = [];
  @Output() ActionBtnClick = new EventEmitter<any>();
  @Output() changeValueComment = new EventEmitter<any>();
  @Output() checkboxLabelValue = new EventEmitter<any>();
  @Output() checkboxAlllValue = new EventEmitter<any>();
  @Output() itemsSelected = new EventEmitter<any>();
  @Output() switchStatus = new EventEmitter<any>();

  dataSource: any = [];
  selection = new SelectionModel<any>(true, []);

  selectItems: any = [];

  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.items);
  }

  ngOnChanges(changes: any) {
    this.dataSource = new MatTableDataSource<any>(this.items);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Actions
  actionClick(item: any, men: any) {
    // console.log({
    // key: item,
    // value: item,
    // men: men ? men : ''
    // })
    this.ActionBtnClick.emit({
      key: item,
      value: item,
      men: men ? men : '',
    });
  }

  //actionLink
  onLinkActionClick(item: any, men: any) {
    /* console.log({
      key: item,
      value: item,
      men: men ? men : ''
    })*/
    this.ActionBtnClick.emit({
      key: item,
      value: item,
      men: men ? men : '',
    });
  }

  // comments
  changeComment($event: any) {
    // console.log($event)
    this.changeValueComment.emit($event);
  }

  // checkbox
  changeCheckbox(row: any, $event: any) {
    if ($event.checked) {
      this.selectItems.push(row);
    } else {
      this.selectItems = this.selectItems.filter(function (el: any) {
        return el.codigo != row.codigo;
      });
    }
    this.itemsSelected.emit(this.selectItems);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      this.checkboxLabelValue.emit(
        `${this.isAllSelected() ? 'deselect' : 'select'} all`
      );
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    this.checkboxLabelValue.emit(
      `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
        row.codigo + 1
      }`
    );
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.codigo + 1
    }`;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectItems = [];

      this.itemsSelected.emit(this.selectItems);
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.selectItems = this.dataSource.data;
    this.itemsSelected.emit(this.selectItems);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.checkboxAlllValue.emit(numSelected === numRows);
    return numSelected === numRows;
  }

  slideChange($event: MatSlideToggleChange, item: any, row: any) {
    item.checked = $event.checked;
    // console.log(item, row)
    this.switchStatus.emit({
      item,
      row,
    });
  }
}
