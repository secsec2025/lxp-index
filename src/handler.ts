import {EntityCache} from "./entity-cache";
import {Account, Stat} from "./model";
import {getLXPMetaData} from "./helpers/contracts-helper";
import {LXP_CONTRACT_ADDRESS, ZERO_ADDRESS} from "./constants";


export const handleTransfer = async (from: string, to: string, value: bigint, ctx: any, e: any, entityCache: EntityCache) => {
    const stat = await getStats(ctx, entityCache);

    if (from === ZERO_ADDRESS) {
        // Mint
        const toAccount = await getAccount(to, entityCache);
        toAccount.balance += value;
        stat.totalSupply += value;
        entityCache.saveAccount(toAccount);

    } else if (to === ZERO_ADDRESS) {
        // Burn
        const fromAccount = await getAccount(from, entityCache);
        fromAccount.balance -= value;
        stat.totalSupply -= value;
        entityCache.saveAccount(fromAccount);

    } else {
        // Regular Transfer
        const fromAccount = await getAccount(from, entityCache);
        const toAccount = await getAccount(to, entityCache);
        fromAccount.balance -= value;
        toAccount.balance += value;
        entityCache.saveAccount(fromAccount);
        entityCache.saveAccount(toAccount);
    }

    entityCache.saveStat(stat);
}


const getAccount = async (address: string, entityCache: EntityCache): Promise<Account> => {
    let account = await entityCache.getAccount(address);
    if (!account) {
        account = new Account({
            id: address,
            balance: 0n
        });
    }
    entityCache.saveAccount(account);
    return account;
}

const getStats = async (ctx: any, entityCache: EntityCache): Promise<Stat> => {
    let stat = await entityCache.getStat('');
    if (!stat) {
        const contractMetaData = await getLXPMetaData(LXP_CONTRACT_ADDRESS, ctx);

        stat = new Stat({
            id: '',
            tokenName: contractMetaData.name,
            tokenSymbol: contractMetaData.symbol,
            decimals: BigInt(contractMetaData.decimals),
            totalSupply: 0n
        });
    }
    entityCache.saveStat(stat);
    return stat;
}

