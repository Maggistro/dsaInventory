import { getAllInventories } from "../data/getAllInventories.js";
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
    let inventory = db.activeInventories[userId];
    if (data.options[2]) {
        if (!getInventoryByName(data.options[2].value)) {
            return res.status(404).json({ error: "Alternatives Inventar nicht gefunden"})
        }

        inventory = db.inventories[data.options[2].value];
    }
    
    let item = data[inventory].items.find(item => item.name === data.options[0].value);

    if (!item) {
        item = {
            name: data.options[0].value,
            count: data.options[1].value
        }
    }
}

export { ADD_ITEM, addItemDefinition, addItem }