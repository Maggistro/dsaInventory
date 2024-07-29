import { InteractionResponseType } from "discord-interactions";
import { getAllInventories } from "../data/getAllInventories.js";
import { getDb } from "../data/getDb.js";
import { getInventoryByName } from "../data/getInventoryByName.js";

const createItemChoices = (name) => {
    return getInventoryByName(name)?.items?.map(item => ({
        name: item.name,
        value: item.name
    })) && [];
}

const createInventoryChoices = () => {
    return Object.keys(getAllInventories()).map(inventoryName => ({
        name: inventoryName,
        value: inventoryName
    }));
}

const DELETE_ITEM = 'deleteitem';

const deleteItemDefinition = {
    name: DELETE_ITEM,
    description: 'Lösche ein item',
    options: [
      {
        type: 3,
        name: 'item',
        description: 'Itemname',
        required: true,
        choices: createItemChoices(),
      },
      {
        type: 3,
        name: 'inventory',
        description: 'Alternatives Inventar',
        required: false,
        choices: createInventoryChoices(),
      },
    ],
    type: 1,
  };
  

const deleteItem = (data, userId, res) => {
    let inventoryName = getDb().activeInventories[userId];
    if (data.options[2]) {
        if (!getInventoryByName(data.options[2].value)) {
            return res.status(404).json({ error: "Alternatives Inventar nicht gefunden"})
        }

        inventoryName = getDb().inventories[data.options[2].value];
    }

    let item = getInventoryByName(inventoryName).items
        .find(item => item.name === data.options[0].value);

    if (!item) {
        return res.status(404).json({ error: "Item nicht gefunden" });
    }

    getInventoryByName(inventoryName).items = getInventoryByName(inventoryName).items
        .filter(item => item.name !== data.options[0].value);

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Item ${data.options[0].value} gelöscht`,
      },
  });
}

export { DELETE_ITEM, deleteItemDefinition, deleteItem }