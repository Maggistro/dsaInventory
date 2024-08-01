import { handleRequest } from '../handleRequest.js';
import { jest } from '@jest/globals';
import { UPSERT_ITEM } from '../commands/upsertItem.js';
import { getItemByName, suggestItems } from '../data/item.js';
import { InteractionResponseType } from 'discord-interactions';
import { getInventory } from '../data/inventory.js';

describe('upsertItem', () => {
    it('should add a new item to active inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'new-item' }, //name
                    { value: 2 }, //count
                    { value: 1.5 }, //weight
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(2, 'new-item')).toBeTruthy();
    });

    it('should add a new item to shared inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'new-item-shared' }, //name
                    { value: 2 }, //count
                    { value: 1.5 }, //weight
                    { value: 'shared' }, //inventory
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(3, 'new-item-shared')).toBeTruthy();
    });

    it('should update an item', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'updated-item' }, //name
                    { value: 2 }, //count
                    { value: 1.5 }, //weight
                ],
            },
            'user1',
            res,
        );

        let item = await getItemByName(2, 'updated-item');
        expect(item.count).toBe(2);
        expect(item.weight).toBe(1.5);

        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'updated-item' }, //name
                    { value: 3 }, //count
                    { value: 2 }, //weight
                ],
            },
            'user1',
            res,
        );

        item = await getItemByName(2, 'updated-item');
        expect(item.count).toBe(5);
        expect(item.weight).toBe(2);
    });

    it('should suggest items', async () => {
        const response = await suggestItems('user1', 'private');
        
        expect(response.body.type).toBe(InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT),
        expect(response.body.data.choices).toStrictEqual(['private-item-active-1', 'private-item-active-2']);

        // no changes, just suggest
        expect(currentState).toStrictEqual(await getInventory('user1'));
    });
});
