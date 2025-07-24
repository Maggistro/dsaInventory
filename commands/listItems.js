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
    console.log('listItems called with userId:', userId, 'offset:', offset);
    const startTime = Date.now();
    
    const optionalName = getOptionByName(data.options, OPTIONS.INVENTORY);
    let inventory = await getInventory(userId, optionalName, offset, limit);
    
    console.log('getInventory took:', Date.now() - startTime, 'ms');

    if (!inventory) {
        console.log('No inventory found for user:', userId, 'name:', optionalName);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                content: 'Inventar nicht gefunden',
            },
        });
    }

    if (userId !== inventory.userId && !inventory.shared) {
        console.log('User', userId, 'tried to access inventory owned by', inventory.userId);
        return res.status(404).json({ error: 'Dieses Inventar gehört einem anderen Nutzer' });
    }

    const content = buildTable(inventory);
    console.log('Table content length:', content.length);
    
    if (content.length > 1900) {
        console.warn('Content length exceeds safe limit:', content.length);
    }

    var components = [];
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
            content: content,
            components: components.length > 0 ? [
                {
                    type: 1, // Action Row
                    components
                }
            ] : []
        },
    });
};

export { LIST_ITEMS, listItemsDefinition, listItems, ITEM_LIMIT};
