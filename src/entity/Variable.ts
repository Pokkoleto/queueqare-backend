import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Variable {
  @PrimaryGeneratedColumn({ name: "variable_id" })
  userId: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "int" })
  int: number;

  @Column({ name: "string", nullable: true })
  string: string;
}
