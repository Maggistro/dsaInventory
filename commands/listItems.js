import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { getOptionByName, OPTIONS } from '../utils.js';
import { buildTable } from '../format/buildTable.js';

const LIST_ITEMS = 'listitems';
const ITEM_LIMIT = 20;

const listItemsDefinition = {
    name: LIST_ITEMS,
    description: 'Liste des Inventar Inhalts',
    options: [
        {
            type: 3,
            name: 'inventory',
            description: 'Alternatives Inventar',
            required: false,
        },
    ],
    type: 1,
};


const listItems = async (data, userId, res, offset = 0, limit = ITEM_LIMIT) => {
    const optionalName = getOptionByName(data.options, OPTIONS.INVENTORY);
    let inventory = await getInventory(userId, optionalName, offset, limit);

    if (!inventory) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                content: 'Inventar nicht gefunden',
            },
        });
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res.status(404).json({ error: 'Dieses Inventar gehört einem anderen Nutzer' });
    }

    var components = [];
    if (offset > 0) {
        components.push({
            type: 2, // Button
            style: 2, // Secondary style
            emoji: {        
                name: '⬅️'
            },
            custom_id: `inventory_prev_page:${inventory.id}:${offset}`,
            label: 'Zurück'
        });
    }   
    if (inventory.items.length > limit + offset) {
        components.push({
            type: 2, // Button
            style: 2, // Secondary style
            emoji: {
                name: '➡️'
            },
            custom_id: `inventory_next_page:${inventory.id}:${limit}`,
            label: 'Weiter'
        });
    }

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
            content: buildTable(inventory),
            components: [
                {
                    type: 1, // Action Row
                    components
                }
            ]
        },
    });
};

export { LIST_ITEMS, listItemsDefinition, listItems, ITEM_LIMIT};
