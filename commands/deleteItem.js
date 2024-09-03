import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { removeItemByName } from '../data/item.js';
import { getOptionByName, OPTIONS } from '../utils.js';

const DELETE_ITEM = 'deleteitem';

const deleteItemDefinition = {
    name: DELETE_ITEM,
    description: 'Lösche ein item',
    options: [
        {
            type: 3,
            name: 'item',
            description: 'Itemname',
            required: true,
        },
        {
            type: 3,
            name: 'inventory',
            description: 'Alternatives Inventar',
            required: false,
        },
    ],
    type: 1,
};

const deleteItem = async (data, userId, res) => {
    const optionalName = getOptionByName(data.options, OPTIONS.INVENTORY);
    let inventory = await getInventory(userId, optionalName);

    if (!inventory) {
        return res.status(404).json({
            error: 'Inventar nicht gefunden',
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res.status(404).json({
            error: 'Dieses Inventar gehört einem anderen Nutzer',
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }

    await removeItemByName(inventory.id, getOptionByName(data.options, OPTIONS.ITEM));

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Item ${getOptionByName(data.options, OPTIONS.ITEM)} gelöscht`,
        },
    });
};

export { DELETE_ITEM, deleteItemDefinition, deleteItem };
