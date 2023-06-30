import { Entity, Column } from 'typeorm';

@Entity({ schema: 'tempdata' })
export class Transaction {
  @Column()
  phone: string;
  
  @Column()
  entity: string;
  
  @Column({ primary: true })
  device: string;

  @Column()
  service: string;

  @Column()
  sub_service: string;

  @Column()
  amount: number;

  @Column()
  main_wallet: string;

  @Column()
  user_last_use: string;

  @Column()
  device_last_use: string;
}