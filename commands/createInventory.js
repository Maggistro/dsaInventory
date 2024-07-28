import { InteractionResponseType } from "discord-interactions";
import { getInventoryByName } from "../data/getInventoryByName.js";

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
    if (getInventoryByName(name)) {
        return res.status(400).json({ error: 'Inventar existiert bereits' });
    }

    db.inventories[name] = {
        userId,
        items: []
    };

    db.activeInventory[userId] = name;

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Inventar ${name} angelegt`,
        },
      });
}

export { CREATE_INVENTORY, createInventoryDefinition, createInventory }