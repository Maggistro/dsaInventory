import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';
import { insertItem, suggestItems, updateItem } from '../data/item.js';
import { getOptionByName, OPTIONS } from '../utils.js';

const UPSERT_ITEM = 'upsertitem';

const upsertItemDefinition = {
    name: UPSERT_ITEM,
    description: 'Add or Increase Item',
    options: [
        {
            type: 3,
            name: OPTIONS.ITEM,
            description: 'Itemname',
            required: true,
            autocomplete: true
        },
        {
            type: 4,
            name: OPTIONS.COUNT,
            description: 'Anzahl zum herausnehmen/hineinlegen',
            required: true,
        },
        {
            type: 3,
            name: OPTIONS.WEIGHT,
            description: 'Gewicht einer Einheit',
            required: false,
        },
        {
            type: 3,
            name: OPTIONS.INVENTORY,
            description: 'Alternatives Inventar',
            required: false,
        },
    ],
    type: 1,
};

const autocomplete = async (data, userId, res) => {
    if (data.options[0] && data.options[0].value.length > 2) {
        const items = await suggestItems(userId, data.options[0].value);
        return res.send({
            type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
            data: {
                choices: items.map((item) => ({
                    value: item.name,
                    name: item.name
                })),
            },
        });
    }
}

const upsertItem = async (data, userId, res) => {
    const optionalName = getOptionByName(data.options, OPTIONS.INVENTORY);
    let inventory = await getInventory(userId, optionalName);

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

    let item = inventory.items.find((item) => item.name === getOptionByName(data.options, OPTIONS.ITEM));

    if (!item) {
        await insertItem(
            inventory.id,
            getOptionByName(data.options, OPTIONS.ITEM),
            getOptionByName(data.options, OPTIONS.COUNT),
            Number.parseFloat(getOptionByName(data.options, OPTIONS.WEIGHT) ?? 0),
        );
    } else {
        await updateItem(
            item.id,
            (item.count = item.count + getOptionByName(data.options, OPTIONS.COUNT)),
            (item.weight = Number.parseFloat(getOptionByName(data.options, OPTIONS.WEIGHT) ?? item.weight)),
        );
    }

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Anzahl Item ${getOptionByName(data.options, OPTIONS.ITEM)} um ${getOptionByName(data.options, OPTIONS.COUNT)} aktualisiert`,
        },
    });
};

export { UPSERT_ITEM, upsertItemDefinition, upsertItem, autocomplete };
