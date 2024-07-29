import { InteractionResponseType } from "discord-interactions";
import { getDb } from "../data/getDb.js";
import { getInventoryByName } from "../data/getInventoryByName.js";
import { deleteItem } from "./deleteItem.js";
import { createInventoryChoices, createItemChoices } from "./choices.js";

const ADD_ITEM = 'additem';

const addItemDefinition = {
    name: ADD_ITEM,
    description: 'Add or Increase Item',
    options: [
      {
        type: 3,
        name: 'item',
        description: 'Itemname',
        required: true,
        choices: createItemChoices(),
      },
      {
        type: 4,
        name: 'count',
        description: 'Neue Anzahl der Items',
        required: true,
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
  

const addItem = (data, userId, res) => {
    let inventoryName = getDb().activeInventories[userId];
    if (data.options[2]) {
        if (!getInventoryByName(data.options[2].value)) {
            return res.status(404).json({ error: "Alternatives Inventar nicht gefunden"})
        }

        inventoryName = getDb().inventories[data.options[2].value];
    }

    if (data.options[1].value === 0) {
      data.options[1] = data.options[2];
      return deleteItem(data, userId, res);
    }
    
    let item = getInventoryByName(inventoryName).items.find(item => item.name === data.options[0].value);

    if (!item) {
      getInventoryByName(inventoryName).items.push({
          name: data.options[0].value,
          count: data.options[1].value
      });
    } else {
      getInventoryByName(inventoryName).items = getInventoryByName(inventoryName).items.map(item => {
        if (item.name === data.options[0].value) {
          item.count = data.options[1].value
        }
        return item;
      });
    }

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Item ${data.options[0].value} mit Anzahl ${data.options[1].value} aktualisiert`,
      },
  });
}

export { ADD_ITEM, addItemDefinition, addItem }