import { InteractionResponseType } from "discord-interactions";
import { getDb } from "../data/getDb.js";
import { getInventoryByName } from "../data/getInventoryByName.js";
import { createInventoryChoices, createItemChoices } from "./choices.js";

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
        choices: createInventoryChoices(userId),
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

        if(!getInventoryByName(data.options[2].value).shared) {
          return res.status(404).json({ error: "Dieses Inventar gehört einem anderen Nutzer"})
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