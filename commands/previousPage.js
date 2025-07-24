import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { buildTable } from '../format/buildTable.js';
import { ITEM_LIMIT } from './listItems.js';
import { NEXT_PAGE } from './nextPage.js';

const PREVIOUS_PAGE = 'previouspage';

const previousPage = async (reactionId, res) => {
    const [_, inventoryName, offset] = reactionId.split(':');
    
    if (!inventoryName) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
                content: 'Inventar nicht gefunden',
            },
        });
    }

    let inventory = await getInventory("", inventoryName);


    var components = [];
    if (parseInt(offset) > 0) {
        components.push({
            type: 1,
            components: [
            {
                type: 2, // Button
                style: 2, // Secondary style
                emoji: {        
                    name: '⬅️'
                },
                custom_id: `${PREVIOUS_PAGE}:${inventory.name}:${parseInt(offset) - ITEM_LIMIT}`,
                label: 'Zurück'
            }]
        });
    }   
    components.push({
        type: 1,
        components: [{
            type: 2, // Button
            style: 2, // Secondary style
            emoji: {
                name: '➡️'
            },
            custom_id: `${NEXT_PAGE}:${inventory.name}:${parseInt(offset) + ITEM_LIMIT}`,
            label: 'Weiter'
        }]
    });
    return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: buildTable(inventory, offset, ITEM_LIMIT),
            components,
        },
    });
};

export { PREVIOUS_PAGE, previousPage };
