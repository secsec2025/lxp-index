module.exports = class Data1711048485246 {
    name = 'Data1711048485246'

    async up(db) {
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "stat" ("id" character varying NOT NULL, "token_name" text NOT NULL, "token_symbol" text NOT NULL, "decimals" numeric NOT NULL, "total_supply" numeric NOT NULL, CONSTRAINT "PK_132de903d366f4c06cd586c43c0" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "stat"`)
    }
}
