import { InteractionResponseType } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { switchInventory } from '../data/inventory.js';
import { getOptionByName, OPTIONS } from '../utils.js';

const ACTIVATE_INVENTORY = 'activateinventory';

const activateInventoryDefinition = {
    name: ACTIVATE_INVENTORY,
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

const activateInventory = async (data, userId, res) => {
    const inventory = await getInventory(userId, getOptionByName(data.options, OPTIONS.INVENTORY));

    if (inventory) {
        await switchInventory(userId, data.options[0].value);

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Inventar ${inventory.name} aktiviert`,
            },
        });
    }

    return res.status(404).json({
        error: 'inventar nicht gefunden',
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
        },
    });
};

export { ACTIVATE_INVENTORY, activateInventoryDefinition, activateInventory };
