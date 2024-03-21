import {TypeormDatabase} from '@subsquid/typeorm-store';
import {processor} from './processor';
import {LXP_CONTRACT_ADDRESS} from "./constants";

import {events as LXPEvents} from './abi/LXP';
import {handleTransfer} from "./handler";
import {EntityCache} from "./entity-cache";

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    ctx.log.info(`Batch Size - ${ctx.blocks.length} blocks`);

    const entityCache: EntityCache = new EntityCache(ctx);

    for (let c of ctx.blocks) {
        for (let e of c.logs) {

            // Transfer
            if (e.address.toLowerCase() === LXP_CONTRACT_ADDRESS && e.topics[0] === LXPEvents.Transfer.topic) {
                const {from, to, value} = LXPEvents.Transfer.decode(e);
                await handleTransfer(from.toLowerCase(), to.toLowerCase(), value, ctx, e, entityCache);
            }

        }
    }


    await entityCache.persistCacheToDatabase(false);

});
