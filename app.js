import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { ADD_ITEM, addItem } from './commands/addItem.js';
import { saveDbMiddleware } from './data/saveDbMiddleware.js';
import { CREATE_INVENTORY, createInventory } from './commands/createInventory.js';
import { DELETE_ITEM, deleteItem } from './commands/deleteItem.js';
import { LIST_ITEMS, listItems } from './commands/listItems.js';
import { DELETE_INVENTORY, deleteInventory } from './commands/deleteInventory.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

app.get('/interactions', (req, res) => {
  res.status(200).json({ "Hello ngrok": true });
});


app.use(saveDbMiddleware);

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    const userId = req.body.member.user.id;

    switch (name) {
      case ADD_ITEM:
        return addItem(req.body.data, userId, res);
      case CREATE_INVENTORY:
        return createInventory(req.body.data, userId, res);
      case DELETE_ITEM:
        return deleteItem(req.body.data, userId, res);
      case LIST_ITEMS:
        return listItems(req.body.data, userId, res);
      case DELETE_INVENTORY:
        return deleteInventory(req.body.data, userId, res);
      default:
        return res.status(400).json({ error: `${name} ist keine gültige Anweisung`});
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
