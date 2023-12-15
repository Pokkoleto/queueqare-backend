import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Queue {

    @PrimaryGeneratedColumn({name: "queue_id"})
    queueId: number

    @Column({name: "department_id"})
    departmentId: string

    @Column({name: "user_id"})
    userId: string
}
