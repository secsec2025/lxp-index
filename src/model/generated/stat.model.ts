import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Stat {
    constructor(props?: Partial<Stat>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    tokenName!: string

    @Column_("text", {nullable: false})
    tokenSymbol!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    decimals!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalSupply!: bigint
}
