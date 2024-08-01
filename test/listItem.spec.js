import { InteractionResponseFlags } from 'discord-interactions';
import { LIST_ITEMS } from '../commands/listItems.js';
import { handleRequest } from '../handleRequest.js';

describe('listItem', () => {
    it('should get all items', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.flags).toBe(InteractionResponseFlags.EPHEMERAL);
                expect(blob.data.content).toContain('private-item-active-1');
                expect(blob.data.content).toContain('private-item-active-2');
                expect(blob.data.content).toContain('duplicate-name');
            },
        };
        await handleRequest(LIST_ITEMS, { options: [] }, 'user1', res);
    });

    it('should get all items from inactive inventory', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.flags).toBe(InteractionResponseFlags.EPHEMERAL);
                expect(blob.data.content).toContain('shared-item');
            },
        };
        await handleRequest(LIST_ITEMS, { options: [{ value: 'shared' }] }, 'user1', res);
    });
});
