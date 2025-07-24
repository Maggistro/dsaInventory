import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { getOptionByName, OPTIONS } from '../utils.js';

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
        },
    ],
    type: 1,
};

const buildTable = (inventory) => {
    const columnSizes = [8, 6, 7];
    inventory.items.forEach((item) => {
        if (columnSizes[0] < item.name.length) {
            columnSizes[0] = item.name.length;
        }

        if (columnSizes[1] < item.count.toString().length) {
            columnSizes[1] = item.count.toString().length;
        }

        if (columnSizes[2] < item.weight.toString().length) {
            columnSizes[2] = item.weight.toString().length;
        }
    });

    const header =
        'Itemname'.padEnd(columnSizes[0]) +
        ' | ' +
        'Anzahl'.padEnd(columnSizes[1]) +
        ' | ' +
        'Gewicht'.padEnd(columnSizes[2]) +
        '\n';

    return (
        `Inventar ${inventory.name}: \n` +
        '```' +
        inventory.items.reduce(
            (table, item) =>
                table +
                item.name.padEnd(columnSizes[0]) +
                ' | ' +
                item.count.toString().padEnd(columnSizes[1]) +
                ' | ' +
                item.weight.toString().padEnd(columnSizes[2]) +
                '\n',
            header,
        ) +
        '```'
    );
};

const listItems = async (data, userId, res) => {
    const optionalName = getOptionByName(data.options, OPTIONS.INVENTORY);
    let inventory = await getInventory(userId, optionalName, 0, 20);

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

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
            content: buildTable(inventory),
            components: [
                {
                    type: 1, // Action Row
                    components: [
                        {
                            type: 2, // Button
                            style: 2, // Secondary style
                            emoji: {
                                name: '⬅️'
                            },
                            custom_id: 'inventory_prev_page',
                            label: 'Zurück'
                        },
                        {
                            type: 2, // Button
                            style: 2, // Secondary style
                            emoji: {
                                name: '➡️'
                            },
                            custom_id: 'inventory_next_page',
                            label: 'Weiter'
                        }
                    ]
                }
            ]
        },
    });
};

export { LIST_ITEMS, listItemsDefinition, listItems };
