import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions'
import { getAllInventories } from '../data/inventory.js'

const LIST_INVENTORIES = 'listinventories'

const listInventoriesDefinition = {
    name: LIST_INVENTORIES,
    description: 'Inventarliste',
    type: 1,
}

const listInventories = async (data, userId, res) => {
    const list = (await getAllInventories())
        .filter((inventory) => inventory.userId === userId || inventory.shared)
        .reduce(
            (list, inventory) => list + inventory.name + '\n',
            'Inventarliste: \n'
        )

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
            content: list,
        },
    })
}

export { LIST_INVENTORIES, listInventoriesDefinition, listInventories }
