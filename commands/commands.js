import 'dotenv/config';
import { InstallGlobalCommands } from '../utils.js';
import { addItemDefinition } from './addItem.js';
import { createInventoryDefinition } from './createInventory.js';
import { deleteItemDefinition } from './deleteItem.js';

const allCommands = [addItemDefinition, createInventoryDefinition, deleteItemDefinition];

InstallGlobalCommands(process.env.APP_ID, allCommands);
