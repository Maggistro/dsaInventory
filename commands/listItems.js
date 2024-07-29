import { InteractionResponseType, MessageComponentTypes } from "discord-interactions";
import { createInventoryChoices } from "./choices.js";

const LIST_ITEMS = 'listitems';

const listItemsDefinition = {
    name: LIST_ITEMS,
    description: 'Liste des Inventar Inhalts',
    options: [
        {
          type: 3,
          name: 'inventory',
          description: 'Alternatives Inventar',
          required: false,
          choices: createInventoryChoices(userId),
        }
    ],
    type: 1,
};

const listItems = (data, userId, res) => {
    return res.send({
        type: InteractionResponseType.MODAL,
        data: {
        custom_id: 'my_modal',
        title: 'Modal title',
        components: [
            {
            // Text inputs must be inside of an action component
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                // See https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure
                type: MessageComponentTypes.INPUT_TEXT,
                custom_id: 'my_text',
                style: 1,
                label: 'Type some text',
                },
            ],
            },
            {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                type: MessageComponentTypes.INPUT_TEXT,
                custom_id: 'my_longer_text',
                // Bigger text box for input
                style: 2,
                label: 'Type some (longer) text',
                },
            ],
            },
        ],
        },
    });
}

export { LIST_ITEMS, listItemsDefinition, listItems };