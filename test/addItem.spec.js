import { InteractionResponseFlags } from "discord-interactions"
import { LIST_ITEMS } from "../commands/listItems.js"
import { handleRequest } from "../handleRequest.js"
import { jest } from '@jest/globals'
import { ADD_ITEM } from "../commands/addItem.js"
import { getItem } from "../data/item.js"

describe('items', () => {
    it('should add a new item to active inventory', async () => {
        const res = jest.fn();
        await handleRequest(ADD_ITEM, { options: [
            { value: "new-item" }, //name
            { value: 2 }, //count
            { value: 1.5 } //weight
        ] }, 
        'user1', 
        res);

        expect(getItem(1, "new-item")).not.toBeNull();
    });
    
    it('should get all items from inactive inventory', async () => {
        const res = {
            send: (blob => {
                expect(blob.data.flags).toBe(InteractionResponseFlags.EPHEMERAL);
                expect(blob.data.content).toContain('shared-item');
            })
        }
        await handleRequest(LIST_ITEMS, { options: [{ value: 'shared' }] }, 'user1', res);
    });
})
