import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Measure {
  @PrimaryGeneratedColumn("uuid")
  measure_uuid!: string;

  @Column({ length: 64, nullable: false })
  customer_code!: string;

  @Column({ type: "timestamptz", nullable: false })
  measure_datetime!: Date;

  @Column({ type: "enum", enum: ["WATER", "GAS"], nullable: false })
  measure_type!: string;

  @Column({ type: "int", nullable: true })
  measure_value!: number | null;

  @Column({ type: "boolean", default: false })
  has_confirmed!: boolean;

  @Column({ type: "text", nullable: false })
  image_url!: string;
}
