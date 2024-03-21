import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'

import {events as LXPEvents} from './abi/LXP';
import {LXP_CONTRACT_ADDRESS} from "./constants";

export const processor = new EvmBatchProcessor()
    .setGateway(lookupArchive('linea-mainnet'))
    .setRpcEndpoint({
        url: process.env.RPC_NODE_URL!,
        rateLimit: Number(process.env.RPC_RATE_LIMIT)
    })
    .setFinalityConfirmation(10)
    .setFields({
        log: {
            address: true,
            data: true,
            topics: true
        }
    }).addLog({
        range: {from: 854425 },
        address: [LXP_CONTRACT_ADDRESS],
        topic0: [LXPEvents.Transfer.topic]
    });