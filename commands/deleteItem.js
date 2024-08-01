import { InteractionResponseType } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { removeItemByName } from '../data/item.js';

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
    const optionalName = data.options[1] ? data.options[1].value : null;
    let inventory = await getInventory(userId, optionalName);

    if (!inventory) {
        return res.status(404).json({ error: 'Inventar nicht gefunden' });
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res.status(404).json({ error: 'Dieses Inventar gehört einem anderen Nutzer' });
    }

    await removeItemByName(inventory.id, data.options[0].value);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Item ${data.options[0].value} gelöscht`,
        },
    });
};

export { DELETE_ITEM, deleteItemDefinition, deleteItem };
