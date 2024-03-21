import {DataHandlerContext} from "@subsquid/evm-processor";
import {Store} from "@subsquid/typeorm-store";
import {Account, Stat} from "./model";


export class EntityCache {
    private accounts!: Map<string, Account>;
    private stats!: Map<string, Stat>;

    public ctx: DataHandlerContext<Store, {}>;

    constructor(ctx: DataHandlerContext<Store, {}>) {
        this.ctx = ctx;
        this.initializeMaps();
    }

    private initializeMaps = () => {
        this.accounts = new Map<string, Account>();
        this.stats = new Map<string, Stat>();
    }

    getAccount = async (id: string): Promise<Account | undefined> => {
        // Check if entity exists in cache
        if (this.accounts.has(id)) return this.accounts.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Account, id);
        if (a) this.accounts.set(id, a);
        return a;
    }

    saveAccount = (t: Account) => {
        this.accounts.set(t.id, t);
    }

    getStat = async (id: string): Promise<Stat | undefined> => {
        // Check if entity exists in cache
        if (this.stats.has(id)) return this.stats.get(id);

        // Check if exists in DB and save it to cache
        const a = await this.ctx.store.get(Stat, id);
        if (a) this.stats.set(id, a);
        return a;
    }

    saveStat = (t: Stat) => {
        this.stats.set(t.id, t);
    }

    // Persist Cache to DB
    persistCacheToDatabase = async (flushCache: boolean) => {
        await this.ctx.store.upsert([...this.stats.values()]);
        await this.ctx.store.upsert([...this.accounts.values()]);

        if (flushCache) {
            this.initializeMaps();
        }
    }

}