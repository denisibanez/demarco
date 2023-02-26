import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

// Services
import { HomeHttpService } from '../../../services/httpRequest/home-http.service';

// Store
import { Select, Store } from '@ngxs/store';
import { SnackbarSelectors } from '../../../store/snackbar/snackbar.selectors';
import { finalize, Observable } from 'rxjs';
import { ChangeSnackbarState } from '../../../store/snackbar/snackbar.actions';

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.scss'],
  providers: [HomeHttpService],
})
export class DialogAddComponent implements OnInit {
  @Output() closeClick = new EventEmitter<any>();
  @Select(SnackbarSelectors.snackbar) snackbar$!: Observable<any>;

  public loader = false;

  public inputs = {
    name: {
      id: 0,
      label: 'Nome',
      type: 'text',
      control: 'name',
      placeholder: 'Digite o título',
      disabled: false,
    },
    city: {
      id: 1,
      label: 'Cidade',
      type: 'text',
      control: 'city',
      placeholder: 'Digite a descrição',
      disabled: false,
    },
    age: {
      id: 1,
      label: 'Idade',
      type: 'number',
      control: 'age',
      placeholder: 'Digite a idade',
      disabled: false,
    },
  };

  public formAtribute: FormGroup = new FormGroup({
    name: new FormControl(
      { value: null, disabled: this.inputs.name.disabled },
      [Validators.required]
    ),
    age: new FormControl({ value: null, disabled: this.inputs.age.disabled }, [
      Validators.required,
    ]),
    city: new FormControl(
      { value: null, disabled: this.inputs.city.disabled },
      [Validators.required]
    ),
  });

  constructor(private store: Store, private homeHttpService: HomeHttpService) {}

  ngOnInit(): void {}

  closeDialog() {
    this.closeClick.emit();
  }

  submit() {
    const payload = {
      name: this.formAtribute.controls['name'].value,
      age: this.formAtribute.controls['age'].value,
      city: this.formAtribute.controls['city'].value,
      id: uuidv4(),
    };

    this.loader = true;

    this.homeHttpService
      .postCustomer(payload)
      .pipe(
        finalize(() => {
          this.store.dispatch(
            new ChangeSnackbarState({
              duration: 5000,
              icon: 'error',
              theme: 'error-theme',
              message:
                'Desculpe, a requisição falhou! Por favor, Tente novamente.',
              horizontalPosition: 'bottom',
              verticalPosition: 'center',
              show: false,
            })
          );
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);

          this.loader = false;

          this.store.dispatch(
            new ChangeSnackbarState({
              duration: 5000,
              icon: 'check_circle',
              theme: 'success-theme',
              message: 'Operação efetuada com sucesso!',
              horizontalPosition: 'bottom',
              verticalPosition: 'center',
              show: true,
            })
          );

          this.closeDialog();
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
          this.store.dispatch(
            new ChangeSnackbarState({
              duration: 5000,
              icon: 'error',
              theme: 'error-theme',
              message:
                'Desculpe, a requisição falhou! Por favor, Tente novamente.',
              horizontalPosition: 'bottom',
              verticalPosition: 'center',
              show: true,
            })
          );
        },
      });
  }
}
