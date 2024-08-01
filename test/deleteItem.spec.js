import { handleRequest } from '../handleRequest.js';
import { jest } from '@jest/globals';
import { UPSERT_ITEM } from '../commands/upsertItem.js';
import { getItemByName } from '../data/item.js';
import { DELETE_ITEM } from '../commands/deleteItem.js';

describe('deleteItem', () => {
    it('should delete an item from active inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'delete-item' }, //name
                    { value: 2 }, //count
                    { value: 1.5 }, //weight
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(2, 'delete-item')).toBeTruthy();
        await handleRequest(
            DELETE_ITEM,
            {
                options: [
                    { value: 'delete-item' }, //name
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(2, 'delete-item')).not.toBeTruthy();
    });

    it('should delete an item from shared inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'delete-item' }, //name
                    { value: 2 }, //count
                    { value: 1.5 }, //weight
                    { value: 'shared' }, //inventory
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(3, 'delete-item')).toBeTruthy();
        await handleRequest(
            DELETE_ITEM,
            {
                options: [
                    { value: 'delete-item' }, //name
                    { value: 'shared' }, //inventory
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(3, 'delete-item')).not.toBeTruthy();
    });
});
