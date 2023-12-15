import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class NavigatePoint {

    @PrimaryGeneratedColumn({name: "point_id"})
    pointId: number

    @Column({name: "token"})
    token: string

    @Column({name: "name"})
    name: string

    @Column({name: "floor"})
    floor: number

    @Column({name: "x"})
    x: number

    @Column({name: "y"})
    y: number
}
