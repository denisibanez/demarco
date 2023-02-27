import { ordemItem } from './ordemItem.model';

export class orders {
  constructor(
    public id: number,
    public total: number,
    public customerId: number,
    public items: ordemItem[]
  ) {}
}
