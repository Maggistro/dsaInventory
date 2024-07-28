import 'dotenv/config';
import { InstallGlobalCommands } from '../utils.js';
import { addItemDefinition } from './addItem.js';
import { createInventoryDefinition } from './createInventory.js';

const allCommands = [addItemDefinition, createInventoryDefinition];

InstallGlobalCommands(process.env.APP_ID, allCommands);
