import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MaterialModule } from '../../../plugins/material.module';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxsModule } from '@ngxs/store';

import { SnackbarState } from '../../../store/snackbar/snackbar.state';
import { LoaderState } from '../../../store/loading/loading.state';
import { ChangeSelectedItemState } from '../../../store/selectedItem/selectedItem.actions';

import { HttpClientModule } from '@angular/common/http';

import { DialogAddComponent } from './dialog-add.component';

describe('DialogAddComponent', () => {
  let component: DialogAddComponent;
  let fixture: ComponentFixture<DialogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAddComponent],
      imports: [
        NgxsModule.forRoot([SnackbarState, LoaderState]),
        RouterTestingModule,
        MaterialModule,
        CommonModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
