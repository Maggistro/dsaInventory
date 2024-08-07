import 'dotenv/config';
import { InstallGlobalCommands } from '../utils.js';
import { upsertItemDefinition } from './upsertItem.js';
import { createInventoryDefinition } from './createInventory.js';
import { deleteItemDefinition } from './deleteItem.js';
import { listItemsDefinition } from './listItems.js';
import { deleteInventoryDefinition } from './deleteInventory.js';
import { activateInventoryDefinition } from './activateInventory.js';
import { listInventoriesDefinition } from './listInventories.js';

const allCommands = [
    activateInventoryDefinition,
    upsertItemDefinition,
    createInventoryDefinition,
    deleteInventoryDefinition,
    deleteItemDefinition,
    listInventoriesDefinition,
    listItemsDefinition,
];

InstallGlobalCommands(process.env.APP_ID, allCommands);
