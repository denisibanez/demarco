import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Services
import { HomeHttpService } from '../../../services/httpRequest/home-http.service';

// Store
import { Select, Store } from '@ngxs/store';
import { LoaderSelectors } from '../../../store/loading/loading.selectors';
import { SnackbarSelectors } from '../../../store/snackbar/snackbar.selectors';
import { SelectedItemSelectors } from '../../../store/selectedItem/selectedItem.selectors';

import { Observable } from 'rxjs';
import { ChangeLoaderState } from '../../../store/loading/loading.actions';
import { ChangeSnackbarState } from '../../../store/snackbar/snackbar.actions';

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

  customer: any = null;
  orders: any[] = [];
  loading: boolean = false;

  constructor(private store: Store, private homeHttpService: HomeHttpService) {}

  ngOnInit(): void {
    this.selectedITem$.subscribe((u) => {
      this.selectedITem = u;
      this.title = `Detalhe do cliente - ${this.selectedITem?.key?.name}`;
      this.customer = this.selectedITem?.key;

      if (this.selectedITem) {
        this.getOrders(this.selectedITem?.key?.id);
      }
    });
  }

  closeDialog() {
    this.closeClick.emit();
  }

  getOrders(id: string) {
    this.loading = true;

    if (id) {
      this.homeHttpService.getOrders(id).subscribe({
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
              duration: 15000,
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
