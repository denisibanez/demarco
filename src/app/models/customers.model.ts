import { customersActions } from './customersActions.model';

export class customers {
  constructor(
    public name: string,
    public id: number,
    public age: number,
    public city: string,
    public actions?: customersActions[]
  ) {}
}
