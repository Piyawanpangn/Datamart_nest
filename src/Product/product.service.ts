import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../tempdata/product.entity';
import { typecon } from 'src/tempdata/table.entitiy';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async findAll(): Promise<Product[]> {
    console.log();
    return this.productRepository.find();
  }

  // async findAllWithSelect(): Promise<Product[]> {
  //   const query = `SELECT device, entity, customer, lat_lng, service_product, qty, price FROM tempdata.product`;
  //   console.log('product query =>', query);
  //   return this.productRepository.query(query);
  // }

  // แผนที่
  async findAlllat_lng_VDC(): Promise<typecon[]> {
    const query = `SELECT distinct entity,device,
                    SUBSTRING(lat_lng FROM 1 FOR POSITION(',' IN lat_lng) - 1) AS lat,
                    SUBSTRING(lat_lng FROM POSITION(',' IN lat_lng) + 1) AS lng
                    FROM tempdata.product
                    WHERE lat is not null and lat <> ''  and entity='VDC'
                    ORDER BY lat desc;`;
    return this.productRepository.query(query);
  }
  async findAlllat_lng_VDP(): Promise<typecon[]> {
    const query = `SELECT distinct entity,device,
                    SUBSTRING(lat_lng FROM 1 FOR POSITION(',' IN lat_lng) - 1) AS lat,
                    SUBSTRING(lat_lng FROM POSITION(',' IN lat_lng) + 1) AS lng
                    FROM tempdata.product
                    WHERE lat is not null and lat <> ''  and entity='VDP'
                    ORDER BY device asc;`;
    return this.productRepository.query(query);
  }

  // ที่ตั้งตามภูมิภาค Donut chartjs
  async findAllregion(): Promise<typecon[]> {
    const query = `SELECT sub_p.entity,sub_p.region,count(*)
                    FROM(
                        SELECT distinct entity,device,region
                        FROM tempdata.product
                        )AS sub_p
                    WHERE entity='VDC' or entity='VDP'
                    GROUP BY sub_p.entity,sub_p.region;`;
    return this.productRepository.query(query);
  }

  // กราฟเขียวจัดอันดับ service ของตู้
  async findAllService_VDC(): Promise<typecon[]> {
    const query = `SELECT entity,service,sub_service,sum(amount),count(*)
                    FROM tempdata.transaction
                    WHERE entity='VDC'
                    GROUP BY entity,service,sub_service
                    ORDER BY sum(amount) desc`;
    return this.productRepository.query(query);
  }
  async findAllService_VDP(): Promise<typecon[]> {
    const query = `SELECT entity,service,sub_service,sum(amount),count(*)
                    from tempdata.transaction
                    where entity='VDP'
                    group by entity,service,sub_service
                    order by sum(amount) desc`;
    return this.productRepository.query(query);
  }


  // หน้าแยกของแต่ละ entity
  async findAllVDC(): Promise<typecon[]> {
    const query = `SELECT sub_t.device,
                    SUBSTRING(lat_lng FROM 1 FOR POSITION(',' IN lat_lng) - 1) AS lat,
                    SUBSTRING(lat_lng FROM POSITION(',' IN lat_lng) + 1) AS lng,
                    region,service,sub_service,sum_amount,count_amount,
                    date_part('hour', user_last_use) as hour,
                    date_part('minute', user_last_use) as minute,
                    date_part('dow', user_last_use) as dofweek,
                    date_part('day', user_last_use) as day,
                    date_part('month', user_last_use) as month
                  FROM(
                      SELECT entity,device,service,sub_service,sum(amount)as sum_amount,count(*)as count_amount,user_last_use
                      from tempdata.transaction
                      group by entity,device,service,sub_service,user_last_use
                      )as sub_t
                  INNER JOIN( 
                      SELECT distinct device,lat_lng,region
                      FROM tempdata.product
                      )as sub_p  on  sub_t.device=sub_p.device
                  WHERE sub_t.entity='VDC'
                  ORDER BY count_amount desc;`;
    return this.productRepository.query(query);
  }
  async findAllVDP(): Promise<typecon[]> {
    const query = `SELECT sub_t.device,type_device,
                      SUBSTRING(lat_lng FROM 1 FOR POSITION(',' IN lat_lng) - 1) AS lat,
                      SUBSTRING(lat_lng FROM POSITION(',' IN lat_lng) + 1) AS lng,
                      region,service,sub_service,sum_amount,count_amount,
                      date_part('hour', user_last_use) as hour,
                      date_part('minute', user_last_use) as minute,
                      date_part('dow', user_last_use) as dofweek,
                      date_part('day', user_last_use) as day,
                      date_part('month', user_last_use) as month
                    FROM(
                        SELECT entity,device,service,sub_service,sum(amount)as sum_amount,count(*)as count_amount,user_last_use
                        from tempdata.transaction
                        group by entity,device,service,sub_service,user_last_use
                        )as sub_t
                    INNER JOIN( 
                        SELECT distinct device,type_device,lat_lng,region
                        FROM tempdata.product
                        )as sub_p  on  sub_t.device=sub_p.device
                    WHERE sub_t.entity='VDP'
                    ORDER BY count_amount desc;`;
    //VFE น้ำ , VFS ขนม
    return this.productRepository.query(query);
  }

}


// - มุม ลูกค้า
// -- - ใช้งานตู้ไหน -> อยู่แถวไหน
// --      :: entity, service, sub_service
// --      :: entity, device
// -- - ใช้งานสินค้าอะไร -> กลุ่มสินค้า
// -- มุม สินค้า :: VDP dont know which product
// -- - ชิ้นไหนขายดี alltime, time period
// -- มุมตู้
// -- - ตู้ไหนขายได้เยอะ -> location ขายได้เยอะ -> ช่วงเวลา
// -- - ตู้ไหนขายอะไรได้ -> location ขายได้เยอะ -> ช่วงเวลา

// UPDATE product
// SET status = lat_lng

// เซตstatus
// UPDATE product
// SET status_lat_lng = 'null'
// WHERE lat_lng is null;


// แยกlat_lng
// UPDATE product
// SET lat = TRIM(SPLIT_PART(lat_lng, ',', 1)),
//     lng = TRIM(SPLIT_PART(lat_lng, ',', 2));

// SELECT entity, device,lat,lng,
//        CASE
//            WHEN CAST(lat AS numeric) BETWEEN 5.65 AND 20.10 AND CAST(lng AS numeric) BETWEEN 97.35 AND 105.63 THEN 'ภาคเหนือ'
//            WHEN CAST(lat AS numeric) BETWEEN 13.56 AND 20.46 AND CAST(lng AS numeric) BETWEEN 99.65 AND 104.64 THEN 'ภาคตะวันตก'
//            WHEN CAST(lat AS numeric) BETWEEN 5.72 AND 9.44 AND CAST(lng AS numeric) BETWEEN 99.37 AND 102.15 THEN 'ภาคตะวันออก'
//            WHEN CAST(lat AS numeric) BETWEEN 12.46 AND 20.45 AND CAST(lng AS numeric) BETWEEN 100.05 AND 105.64 THEN 'ภาคตะวันออกเฉียงเหนือ'
//            WHEN CAST(lat AS numeric) BETWEEN 6.87 AND 14.98 AND CAST(lng AS numeric) BETWEEN 100.10 AND 105.63 THEN 'ภาคใต้'
//            ELSE 'ไม่ระบุภาค'
//        END AS region
// FROM product
// WHERE lat <> '' AND lng <> '';


//อัพเดทภาค
// UPDATE tempdata.product
// SET region = 'ภาคกลาง'
// WHERE lat <> '' AND lng <> '' AND CAST(lat AS numeric) 
// BETWEEN 13.00 AND 16.50 AND CAST(lng AS numeric) BETWEEN 99.50 AND 103.00;


// คิวรี่ข้างบน
// `SELECT distinct entity, device,lat,lng,
//               CASE
//                   WHEN CAST(lat AS numeric) BETWEEN 5.65 AND 20.10 AND CAST(lng AS numeric) BETWEEN 97.35 AND 105.63 THEN 'ภาคเหนือ'
//                   WHEN CAST(lat AS numeric) BETWEEN 13.56 AND 20.46 AND CAST(lng AS numeric) BETWEEN 99.65 AND 104.64 THEN 'ภาคตะวันตก'
//                   WHEN CAST(lat AS numeric) BETWEEN 5.72 AND 9.44 AND CAST(lng AS numeric) BETWEEN 99.37 AND 102.15 THEN 'ภาคตะวันออก'
//                   WHEN CAST(lat AS numeric) BETWEEN 12.46 AND 20.45 AND CAST(lng AS numeric) BETWEEN 100.05 AND 105.64 THEN 'ภาคตะวันออกเฉียงเหนือ'
//                   WHEN CAST(lat AS numeric) BETWEEN 6.87 AND 14.98 AND CAST(lng AS numeric) BETWEEN 100.10 AND 105.63 THEN 'ภาคใต้'
//                   WHEN CAST(lat AS numeric) BETWEEN 13.00 AND 16.50 AND CAST(lng AS numeric) BETWEEN 99.50 AND 103.00 THEN 'ภาคกลาง'
//                   ELSE 'ไม่ระบุภาค'
//               END AS region
//               FROM tempdata.product
//               WHERE lat <> '' AND lng <> '' and entity='VDC' or entity='VDP';`;