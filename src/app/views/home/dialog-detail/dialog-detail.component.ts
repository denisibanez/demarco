import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Services
import { HomeHttpService } from '../../../services/httpRequest/home-http.service';

// Store
import { Select, Store } from '@ngxs/store';
import { LoaderSelectors } from '../../../store/loading/loading.selectors';
import { SnackbarSelectors } from '../../../store/snackbar/snackbar.selectors';
import { SelectedItemSelectors } from '../../../store/selectedItem/selectedItem.selectors';

import { finalize, Observable } from 'rxjs';
import { ChangeLoaderState } from '../../../store/loading/loading.actions';
import { ChangeSnackbarState } from '../../../store/snackbar/snackbar.actions';

//model
import { customers } from 'src/app/models/customers.model';
import { ordemItem } from 'src/app/models/ordemItem.model';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss'],
  providers: [HomeHttpService],
})
export class DialogDetailComponent implements OnInit {
  @Output() closeClick = new EventEmitter<any>();
  @Select(SelectedItemSelectors.selectedItem) selectedITem$!: Observable<any>;
  @Select(LoaderSelectors.loader) load$!: Observable<boolean>;
  @Select(SnackbarSelectors.snackbar) snackbar$!: Observable<any>;

  public chargeLoader!: boolean;
  public snackbar!: boolean;

  public selectedITem!: any;
  public title: string = `Detalhe do cliente`;

  customer: customers = {
    name: '',
    id: 0,
    age: 0,
    city: '',
  };
  orders: ordemItem[] = [
    {
      item: '',
      value: 0,
    },
    {
      item: '',
      value: 0,
    },
  ];
  loading: boolean = false;

  constructor(private store: Store, private homeHttpService: HomeHttpService) {}

  ngOnInit(): void {
    this.selectedITem$.subscribe((u) => {
      this.selectedITem = u;
      this.title = `Detalhe do cliente - ${this.selectedITem?.item?.key?.name}`;
      this.customer = this.selectedITem?.item?.key;

      if (this.selectedITem?.key === 'SHOW_DETAIL') {
        this.getOrders(this.selectedITem?.item?.key?.id);
      }
    });
  }

  closeDialog() {
    this.orders = [];
    this.closeClick.emit();
  }

  getOrders(id: string) {
    this.loading = true;

    if (id) {
      this.homeHttpService
        .getOrders(id)
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
            this.loading = false;
            this.orders = response.items;
          },
          error: (error) => {
            console.log(error);
            this.loading = false;

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
}
