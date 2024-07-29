import 'dotenv/config';
import { InstallGlobalCommands } from '../utils.js';
import { addItemDefinition } from './addItem.js';
import { createInventoryDefinition } from './createInventory.js';
import { deleteItemDefinition } from './deleteItem.js';
import { listItemsDefinition } from './listItems.js';

const allCommands = [addItemDefinition, createInventoryDefinition, deleteItemDefinition, listItemsDefinition];

InstallGlobalCommands(process.env.APP_ID, allCommands);
