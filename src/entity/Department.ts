import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Department {

    @PrimaryGeneratedColumn({name: "department_id"})
    departmentId: number

    @Column({name: "departmentname"})
    departmentName: string

    @Column({name: "departmentname2"})
    departmentName2: string

    @Column({name: "floor"})
    Floor: number
}
