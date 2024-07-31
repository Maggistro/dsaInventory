import {
    InteractionResponseType,
    InteractionResponseFlags,
} from 'discord-interactions'
import { createInventoryChoices } from './choices.js'
import { getInventory } from '../data/getInventory.js'

const LIST_ITEMS = 'listitems'

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
}

const buildTable = (inventory) => {
    const columnSizes = [8, 6, 7]
    inventory.items.forEach((item) => {
        if (columnSizes[0] < item.name.length) {
            columnSizes[0] = item.name.length
        }

        if (columnSizes[1] < item.count.toString().length) {
            columnSizes[1] = item.count.toString().length
        }

        if (columnSizes[2] < item.weight.toString().length) {
            columnSizes[2] = item.weight.toString().length
        }
    })

    const header =
        'Itemname'.padEnd(columnSizes[0]) +
        ' | ' +
        'Anzahl'.padEnd(columnSizes[1]) +
        ' | ' +
        'Gewicht'.padEnd(columnSizes[2]) +
        '\n'

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
            header
        ) +
        '```'
    )
}

const listItems = (data, userId, res) => {
    const optionalName = data.options ? data.options[0].value : null
    let inventory = getInventory(userId, optionalName)

    if (!inventory) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Inventar nicht gefunden',
            },
        })
    }

    if (userId !== inventory.userId && !inventory.shared) {
        return res
            .status(404)
            .json({ error: 'Dieses Inventar gehört einem anderen Nutzer' })
    }

    const table = buildTable(inventory)

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
            content: buildTable(inventory),
        },
    })
}

export { LIST_ITEMS, listItemsDefinition, listItems }
