import { handleRequest } from '../handleRequest.js';
import { jest } from '@jest/globals';
import { autocomplete, UPSERT_ITEM } from '../commands/upsertItem.js';
import { getItemByName } from '../data/item.js';
import { InteractionResponseType } from 'discord-interactions';

describe('upsertItem', () => {
    it('should add a new item to active inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'new-item', name: 'item' }, //name
                    { value: 2, name: 'count' }, //count
                    { value: 1.5, name: 'weight' }, //weight
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
                    { value: 'new-item-shared', name: 'item' }, //name
                    { value: 2, name: 'count' }, //count
                    { value: 'shared', name: 'inventory' }, //inventory
                    { value: 1.5, name: 'weight' } //weight
                ],
            },
            'user1',
            res,
        );

        expect(await getItemByName(3, 'new-item-shared')).toBeTruthy();
    });

    it('should add a new item to shared inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(
            UPSERT_ITEM,
            {
                options: [
                    { value: 'new-item-shared', name: 'item' }, //name
                    { value: 2, name: 'count' }, //count
                    { value: 1.5, name: 'weight' }, //weight
                    { value: 'shared', name: 'inventory' }, //inventory
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
                    { value: 'updated-item', name: 'item' }, //name
                    { value: 2, name: 'count' }, //count
                    { value: 1.5, name: 'weight' }, //weight
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
                    { value: 'updated-item', name: 'item' }, //name
                    { value: 3, name: 'count' }, //count
                    { value: 2, name: 'weight' }, //weight
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
        const res = {
            send: (blob) => {
                expect(blob.type).toBe(InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT),
                    expect(blob.data.choices).toStrictEqual([
                        {
                            value: 'private-item-active-1',
                            name: 'private-item-active-1'
                        }, {
                            value: 'private-item-active-2',
                            name: 'private-item-active-2'
                        }
                    ]);
            }
        }
        await autocomplete(
            {
                options: [
                    { value: 'private', name: 'item' }, //name
                ],
            },
            'user1',
            res
        );
    });
});
