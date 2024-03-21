import {Contract as LXPContract} from '../abi/LXP';

type ContractMetaData = {
    name: string;
    symbol: string;
    decimals: number;
}

export const getLXPMetaData = async (contractAddress: string, ctx: any): Promise<ContractMetaData> => {
    const lastBlock = ctx.blocks[ctx.blocks.length - 1];
    const contract = new LXPContract(ctx, {height: lastBlock.header.height}, contractAddress);

    return {
        name: await contract.name(),
        symbol: await contract.symbol(),
        decimals: await contract.decimals()
    }
}

