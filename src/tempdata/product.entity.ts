import { Entity, Column } from 'typeorm';

@Entity({ schema: 'tempdata' })
export class Product {
  @Column({ primary: true })
  device: string;

  @Column()
  entity: string;

  @Column()
  customer: string;

  @Column()
  lat_lng: string;

  @Column()
  service_product: string;

  @Column()
  qty: number;

  @Column()
  price: number;

  @Column()
  status_lat_lng: string;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column()
  region: string;
}
