import { InteractionResponseType } from 'discord-interactions';
import { insertInventory, getInventory } from '../data/inventory.js';
import { getOptionByName, OPTIONS } from '../utils.js';

const CREATE_INVENTORY = 'createinventory';

const createInventoryDefinition = {
    name: CREATE_INVENTORY,
    description: 'Add new Inventory by name',
    options: [
        {
            type: 3,
            name: 'inventory',
            description: 'Inventar Name',
            required: true,
        },
        {
            type: 5,
            name: 'shared',
            description: 'Gemeinsames Inventar',
            required: false,
        },
    ],
    type: 1,
};

const createInventory = async (data, userId, res) => {
    const name = getOptionByName(data.options, OPTIONS.INVENTORY);
    if (await getInventory(userId, name)) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Inventar existiert bereits',
            },
        });
    }

    await insertInventory(userId, name, getOptionByName(data.options, OPTIONS.SHARED) ?? false);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Inventar ${name} angelegt`,
        },
    });
};

export { CREATE_INVENTORY, createInventoryDefinition, createInventory };
