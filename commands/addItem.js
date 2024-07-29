import { InteractionResponseType } from "discord-interactions";
import { getInventory } from "../data/getInventory.js";
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
      },
      {
        type: 4,
        name: 'count',
        description: 'Neue Anzahl der Items',
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
  

const addItem = (data, userId, res) => {
    const optionalName = data.options[4] ? data.options[4].value : null;
    let inventory = getInventory(userId, optionalName);

    if (!inventory) {
      return res.status(404).json({ error: "Inventar nicht gefunden"})
    }

    if(userId !== inventory.userId && !inventory.shared) {
      return res.status(404).json({ error: "Dieses Inventar gehört einem anderen Nutzer"})
    }

    if (data.options[1].value === 0) {
      data.options[1] = data.options[2];
      return deleteItem(data, userId, res);
    }
    
    let item = inventory.items.find(item => item.name === data.options[0].value);

    if (!item) {
      inventory.items.push({
          name: data.options[0].value,
          count: data.options[1].value,
          weight: data.options ? Number.parseFloat(data.options[2].value) : 0,
      });
    } else {
      inventory.items = inventory.items.map(item => {
        if (item.name === data.options[0].value) {
          item.count = item.count + data.options[1].value
          item.weight = data.options[2] ? Number.parseFloat(data.options[2].value): 0;
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