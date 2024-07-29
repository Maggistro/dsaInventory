import { InteractionResponseType } from "discord-interactions";
import { getInventory } from "../data/getInventory.js";
import { getDb } from "../data/getDb.js";

const CREATE_INVENTORY = 'createinventory';

const createInventoryDefinition = {
    name: CREATE_INVENTORY,
    description: 'Add new Inventory by name',
    options: [
      {
        type: 3,
        name: 'name',
        description: 'Inventar Name',
        required: true,
      },
      {
        type: 5,
        name: 'shared',
        description: 'Gemeinsames Inventar',
        required: false
      },
    ],
    type: 1,
  };
  

const createInventory = (data, userId, res) => {
    const name = data.options[0].value;
    if (getInventory(userId, name)) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
            content: 'Inventar existiert bereits',
            },
        });
    }

    getDb().inventories[name] = {
        name,
        userId,
        items: []
    };

    console.log(JSON.stringify(getDb()));
    getDb().activeInventories[userId] = name;
    console.log(JSON.stringify(getDb()));

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Inventar ${name} angelegt`,
        },
      });
}

export { CREATE_INVENTORY, createInventoryDefinition, createInventory }