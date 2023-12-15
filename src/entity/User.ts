import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn({name: "user_id"})
    userId: number

    @Column({name: "username"})
    username: string

    @Column({name: "password"})
    password: string

    @Column({name: "name"})
    name: string

    @Column({name: "name2"})
    name2: string

    @Column({name: "class"})
    class: string

    @Column({name: "department_id"})
    departmentId: string

    @Column({name: "tel"})
    tel: string

    @Column({name: "is_active"})
    isActive: string

}
