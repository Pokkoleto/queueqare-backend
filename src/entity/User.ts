import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  userId: number;

  @Column({ name: "username" })
  username: string;

  @Column({ name: "password" })
  password: string;

  @Column({ name: "name", nullable: true })
  name: string;

  @Column({ name: "name2" })
  name2: string;

  @Column({ name: "role" })
  role: string;

  @Column({ name: "department_id" })
  departmentId: number;

  @Column({ name: "tel", nullable: true  })
  tel: string;

  @Column({ name: "is_active" })
  isActive: number;
}
