import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Queue } from "./Queue";

@Entity()
export class Department {
  @PrimaryGeneratedColumn({ name: "department_id" })
  departmentId: number;

  @Column({ name: "departmentname" })
  departmentName: string;

  @Column({ name: "departmentname2" })
  departmentName2: string;

  @Column({ name: "floor" })
  floor: number;

  @Column({ name: "member", default: 0 })
  member: number;

  @Column({ name: "is_default", default: 0 })
  isDefault: number;

  @OneToMany(() => Queue, (queue) => queue.department)
  queue: Queue[];
}
