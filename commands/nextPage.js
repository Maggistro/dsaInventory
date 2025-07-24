import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { buildTable } from '../format/buildTable.js';
import { ITEM_LIMIT } from './listItems.js';
import { PREVIOUS_PAGE } from './previousPage.js';

const NEXT_PAGE = 'nextpage';

const nextPage = async (reactionId, res) => {
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

    let inventory = await getInventory("", inventoryId);


    var components = [];
    if (parseInt(offset) > 0) {
        components.push({
            type: 2, // Button
            style: 2, // Secondary style
            emoji: {        
                name: '⬅️'
            },
            custom_id: `${PREVIOUS_PAGE}:${inventory.id}:${parseInt(offset) - ITEM_LIMIT}`,
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
            custom_id: `${NEXT_PAGE}:${inventory.id}:${parseInt(offset) + ITEM_LIMIT}`,
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

export { NEXT_PAGE, nextPage };
