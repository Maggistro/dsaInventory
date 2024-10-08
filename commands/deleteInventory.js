import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions';
import { getInventory, removeInventory } from '../data/inventory.js';
import { getOptionByName, OPTIONS } from '../utils.js';

const DELETE_INVENTORY = 'deleteinventory';

const deleteInventoryDefinition = {
    name: DELETE_INVENTORY,
    description: 'Lösche ein inventar',
    options: [
        {
            type: 3,
            name: 'inventory',
            description: 'Inventarname',
            required: true,
        },
    ],
    type: 1,
};

const deleteInventory = async (data, userId, res) => {
    const inventory = await getInventory(userId, getOptionByName(data.options, OPTIONS.INVENTORY));
    if (!inventory.shared && inventory.userId !== userId) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                error: 'Inventar gehört anderem Nutzer',
            },
        });
    }

    await removeInventory(userId, getOptionByName(data.options, OPTIONS.INVENTORY));
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Inventar gelöscht`,
        },
    });
};

export { DELETE_INVENTORY, deleteInventoryDefinition, deleteInventory };
