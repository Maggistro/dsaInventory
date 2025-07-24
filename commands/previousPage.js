import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { buildTable } from '../format/buildTable.js';
import { ITEM_LIMIT } from './listItems.js';

const PREVIOUS_PAGE = 'previouspage';

const previousPage = async (reactionId, res) => {
    const [_, inventoryId, offset] = reactionId.split(':');
    
    if (!inventoryId) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                content: 'Inventar nicht gefunden',
            },
        });
    }

    let inventory = await getInventory("", inventoryId, offset, ITEM_LIMIT);


    var components = [];
    if (parseInt(offset) > 0) {
        components.push({
            type: 2, // Button
            style: 2, // Secondary style
            emoji: {        
                name: '⬅️'
            },
            custom_id: `${PREVIOUS_PAGE}:${inventory.name}:${parseInt(offset) - ITEM_LIMIT}`,
            label: 'Zurück'
        });
    }   
    if (inventory.items.length > ITEM_LIMIT + offset) {
        components.push({
            type: 2, // Button
            style: 2, // Secondary style
            emoji: {
                name: '➡️'
            },
            custom_id: `${NEXT_PAGE}:${inventory.name}:${parseInt(offset) + ITEM_LIMIT}`,
            label: 'Weiter'
        });
    }

    return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: buildTable(inventory, offset, ITEM_LIMIT),
            components: [
                {
                    type: 1, // Action Row
                    components
                }
            ]
        },
    });
};

export { PREVIOUS_PAGE, previousPage };
