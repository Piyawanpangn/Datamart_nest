import { Entity, Column } from 'typeorm';

@Entity({ schema: 'tempdata' })
export class typecon{
  @Column({ primary: true })
  device: string;

  @Column()
  lat_lng: string;

  @Column()
  status_lat_lng: string;
  
  @Column()
  service: string;

  @Column()
  sub_service: string;

  @Column()
  amount: number;

  @Column()
  hour: number;

  @Column()
  minute: number;

  @Column()
  second: number;

  @Column()
  dofweek: number;

  @Column()
  day: number;

  @Column()
  month: number;
}