import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { insertItem, suggestItems, updateItem } from '../data/item.js';

const UPSERT_ITEM = 'upsertitem';

const upsertItemDefinition = {
    name: UPSERT_ITEM,
    description: 'Add or Increase Item',
    options: [
        {
            type: 3,
            name: 'item',
            description: 'Itemname',
            required: true,
            autocomplete: true
        },
        {
            type: 4,
            name: 'count',
            description: 'Anzahl zum herausnehmen/hineinlegen',
            required: true,
        },
        {
            type: 3,
            name: 'weight',
            description: 'Gewicht einer Einheit',
            required: false,
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

const autocomplete = async (data, userId, res) => {
    const items = await suggestItems(userId, data.options[0].value);
    return res.send({
        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: {
            choices: items.map((item) => item.name),
        },
    });
}

const upsertItem = async (data, userId, res) => {
    const optionalName = data.options[3] ? data.options[3].value : null;
    let inventory = await getInventory(userId, optionalName);
    
    console.log(`found ${inventory?.name}`);

    if (!inventory) {
        return res.status(404).json({
            error: 'Inventar nicht gefunden',
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res.status(404).json({
            error: 'Dieses Inventar gehört einem anderen Nutzer',
            data: {
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }

    let item = inventory.items.find((item) => item.name === data.options[0].value);

    if (!item) {
        await insertItem(
            inventory.id,
            data.options[0].value,
            data.options[1].value,
            data.options[2] ? Number.parseFloat(data.options[2].value) : 0,
        );
    } else {
        await updateItem(
            item.id,
            (item.count = item.count + data.options[1].value),
            (item.weight = data.options[2] ? Number.parseFloat(data.options[2].value) : item.weight),
        );
    }

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Item ${data.options[0].value} mit Anzahl ${data.options[1].value} aktualisiert`,
        },
    });
};

export { UPSERT_ITEM, upsertItemDefinition, upsertItem, autocomplete };
