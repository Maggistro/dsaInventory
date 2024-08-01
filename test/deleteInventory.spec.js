import { handleRequest } from '../handleRequest.js';
import { jest } from '@jest/globals';
import { DELETE_INVENTORY } from '../commands/deleteInventory.js';
import { getInventory } from '../data/inventory.js';
import { CREATE_INVENTORY } from '../commands/createInventory.js';
import { ACTIVATE_INVENTORY } from '../commands/activateInventory.js';

describe('deleteInventory', () => {
    it('should delete an inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            CREATE_INVENTORY,
            {
                options: [
                    { value: 'delete-inventory' }, //name
                ],
            },
            'user1',
            res,
        );

        expect(await getInventory('user1', 'delete-inventory')).toBeTruthy();
        await handleRequest(
            DELETE_INVENTORY,
            {
                options: [
                    { value: 'delete-inventory' }, //name
                ],
            },
            'user1',
            res,
        );

        expect(await getInventory('user1', 'delete-inventory')).not.toBeTruthy();

        // reset to old active
        await handleRequest(
            ACTIVATE_INVENTORY,
            {
                options: [
                    { value: 'private-active' }, //name
                ],
            },
            'user1',
            res,
        );
    });

    it('should not delete an inventory of another user', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            CREATE_INVENTORY,
            {
                options: [
                    { value: 'delete-inventory' }, //name
                ],
            },
            'user2',
            res,
        );

        expect(await getInventory('user1', 'delete-inventory')).toBeTruthy();
        await handleRequest(
            DELETE_INVENTORY,
            {
                options: [
                    { value: 'delete-inventory' }, //name
                ],
            },
            'user1',
            res,
        );

        expect(await getInventory('user1', 'delete-inventory')).toBeTruthy();
    });
});
