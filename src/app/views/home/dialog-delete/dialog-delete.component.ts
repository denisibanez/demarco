import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// Services
import { HomeHttpService } from '../../../services/httpRequest/home-http.service';

// Store
import { Select, Store } from '@ngxs/store';
import { SnackbarSelectors } from '../../../store/snackbar/snackbar.selectors';
import { SelectedItemSelectors } from '../../../store/selectedItem/selectedItem.selectors';

import { Observable } from 'rxjs';
import { ChangeSnackbarState } from '../../../store/snackbar/snackbar.actions';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.scss'],
})
export class DialogDeleteComponent implements OnInit {
  @Output() closeClick = new EventEmitter<any>();

  @Select(SelectedItemSelectors.selectedItem) selectedITem$!: Observable<any>;
  @Select(SnackbarSelectors.snackbar) snackbar$!: Observable<any>;

  public snackbar!: boolean;

  public selectedITem!: any;

  public clientName: string = '';
  public title: string = '';
  public loading: boolean = false;

  constructor(private store: Store, private homeHttpService: HomeHttpService) {}

  ngOnInit(): void {
    this.selectedITem$.subscribe((u) => {
      this.selectedITem = u;
      this.title = `Detalhe do cliente - ${this.selectedITem?.key?.name}`;
      this.clientName = this.selectedITem?.key?.name;
    });
  }

  closeDialog() {
    this.closeClick.emit();
  }

  deleteCustomer() {
    this.loading = true;
    this.homeHttpService.deleteClient(this.selectedITem?.key.id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.loading = false;
        this.store.dispatch(
          new ChangeSnackbarState({
            duration: 15000,
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
