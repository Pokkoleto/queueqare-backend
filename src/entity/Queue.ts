import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Department } from "./Department";

@Entity()
export class Queue {
  @PrimaryGeneratedColumn({ name: "queue_id" })
  queueId: number;

  @Column({ name: "queue_number", nullable: true })
  queueNumber: number;

  @Column({ name: "department_id" })
  departmentId: number;

  @Column({ name: "user_id", nullable: true })
  userId: string;

  @Column({ name: "status" })
  status: string;

  @Column({ name: "token", nullable: true })
  token: string;

  @Column({ name: "tel", nullable: true })
  tel: string;

  @ManyToOne(() => Department, (department) => department.departmentId)
  department: Department;
}
