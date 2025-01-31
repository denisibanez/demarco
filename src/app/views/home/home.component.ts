import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// Services
import { HomeHttpService } from '../../services/httpRequest/home-http.service';

// Store
import { Select, Store } from '@ngxs/store';
import { LoaderSelectors } from '../../store/loading/loading.selectors';
import { SnackbarSelectors } from '../../store/snackbar/snackbar.selectors';
import { SelectedItemSelectors } from '../../store/selectedItem/selectedItem.selectors';
import { finalize, Observable } from 'rxjs';
import { ChangeLoaderState } from '../../store/loading/loading.actions';
import { ChangeSnackbarState } from '../../store/snackbar/snackbar.actions';
import { ChangeSelectedItemState } from '../../store/selectedItem/selectedItem.actions';

// models
import { customers } from '../../models/customers.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeHttpService],
})
export class HomeComponent implements OnInit {
  @Select(LoaderSelectors.loader) load$!: Observable<boolean>;
  @Select(SnackbarSelectors.snackbar) snackbar$!: Observable<any>;
  @Select(SelectedItemSelectors.selectedItem) selectedITem$!: Observable<any>;

  public chargeLoader!: boolean;
  public snackbar!: boolean;
  public selectedITem!: any;

  public displayedColumns = ['id', 'city', 'age', 'name', 'actions'];
  public columns = [
    {
      columnDef: 'id',
      header: '',
      cell: (element: any) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: '',
      cell: (element: any) => `${element.name}`,
    },
    {
      columnDef: 'age',
      header: '',
      cell: (element: any) => `${element.age}`,
    },
    {
      columnDef: 'city',
      header: '',
      cell: (element: any) => `${element.city}`,
    },
    {
      columnDef: 'actions',
      header: '',
      cell: (element: any) => element.actions,
    },
  ];
  public customers = [];

  public inputs = {
    name: {
      id: 0,
      label: '',
      type: 'text',
      control: 'name',
      placeholder: '',
      disabled: false,
    },
    city: {
      id: 1,
      label: '',
      type: 'text',
      control: 'city',
      placeholder: '',
      disabled: false,
    },
  };

  public loader: boolean = false;

  public formAtribute: FormGroup = new FormGroup({
    name: new FormControl(
      { value: null, disabled: this.inputs.name.disabled },
      [Validators.required]
    ),
    city: new FormControl(
      { value: null, disabled: this.inputs.city.disabled },
      [Validators.required]
    ),
  });

  public customerListLabel: string = '';
  public clearLabel: string = '';
  public filterLabel: string = '';
  public addCustomerLabel: string = '';

  constructor(
    private translate: TranslateService,
    private store: Store,
    private homeHttpService: HomeHttpService
  ) {}

  ngOnInit(): void {
    this.load$.subscribe((u) => {
      this.chargeLoader = u;
    });

    this.selectedITem$.subscribe((u) => {
      this.selectedITem = u;
    });

    this.getList();
  }

  openDialog($event: string) {
    window.location.hash = $event;
  }

  ActionBtnClick($event: any) {
    this.store.dispatch(
      new ChangeSelectedItemState({
        item: $event,
        key: $event.men,
      })
    );
    if ($event.men === 'SHOW_DETAIL') {
      this.openDialog('open-modal');
    }

    if ($event.men === 'DELETE') {
      this.openDialog('open-delete');
    }
  }

  cleanItemSelect() {
    this.store.dispatch(new ChangeSelectedItemState({}));
  }

  setTranslates() {
    // NGX Translate parece só funcionar após todo o ciclo de vida do Angular
    // Por isso estou setando as traduções em variaveis que são instanciadas
    // Antes do render do lifecicle do angular aqui,acho que não é melhor método
    this.inputs.city.label = this.translate.instant('LABEL_CITY');
    this.inputs.city.placeholder = this.translate.instant('PLACEHOLDER_CITY');
    this.inputs.name.label = this.translate.instant('LABEL_NAME');
    this.inputs.name.placeholder = this.translate.instant('PLACEHOLDER_NAME');
    this.columns[0].header = this.translate.instant('CODE');
    this.columns[1].header = this.translate.instant('NAME');
    this.columns[2].header = this.translate.instant('AGE');
    this.columns[3].header = this.translate.instant('CITY');
    this.columns[4].header = this.translate.instant('ACTIONS');
    this.customerListLabel = this.translate.instant('CUSTOMER_LIST');
    this.clearLabel = this.translate.instant('CLEAR');
    this.filterLabel = this.translate.instant('FILTER');
    this.addCustomerLabel = this.translate.instant('ADD_CUSTOMER');
  }

  getList() {
    this.store.dispatch(new ChangeLoaderState(true));
    let payload;
    if (this.formAtribute.controls['name'].valid) {
      payload = `name=${this.formAtribute.controls['name'].value}&`;
    }

    if (this.formAtribute.controls['city'].valid) {
      payload = `city=${this.formAtribute.controls['city'].value}&${
        payload ? payload : ''
      }`;
    }

    this.cleanItemSelect();

    this.homeHttpService
      .getCustomers(payload ? payload : '')
      .pipe(
        finalize(() => {
          this.setTranslates();
          this.store.dispatch(
            new ChangeSnackbarState({
              duration: 5000,
              icon: 'error',
              theme: 'error-theme',
              message: this.translate.instant('ERROR_MESSAGE'),
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
          this.customers = response.map((item: any) => {
            const { id, name, age, city } = item;

            const newItem: customers = {
              id,
              name,
              age,
              city,
              actions: [
                {
                  icon: 'visibility',
                  action: 'SHOW_DETAIL',
                  label: this.translate.instant('LABEL_DETAIL'),
                },
                {
                  icon: 'delete',
                  action: 'DELETE',
                  label: this.translate.instant('LABEL_DELETE'),
                },
              ],
            };
            return newItem;
          });
          this.store.dispatch(new ChangeLoaderState(false));
          this.formAtribute.reset();
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(new ChangeLoaderState(false));
          this.store.dispatch(
            new ChangeSnackbarState({
              duration: 5000,
              icon: 'error',
              theme: 'error-theme',
              message: this.translate.instant('ERROR_MESSAGE'),
              horizontalPosition: 'bottom',
              verticalPosition: 'center',
              show: true,
            })
          );
        },
      });
  }

  clear() {
    this.formAtribute.reset();
    this.getList();
  }
}
