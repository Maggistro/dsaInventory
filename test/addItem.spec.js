import { InteractionResponseFlags } from "discord-interactions"
import { LIST_ITEMS } from "../commands/listItems.js"
import { handleRequest } from "../handleRequest.js"
import { jest } from '@jest/globals'
import { ADD_ITEM } from "../commands/addItem.js"
import { getItemByName } from "../data/item.js"

describe('items', () => {
    it('should add a new item to active inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(ADD_ITEM, { options: [
            { value: "new-item" }, //name
            { value: 2 }, //count
            { value: 1.5 } //weight
        ] }, 
        'user1', 
        res);

        expect(getItemByName(2, "new-item")).not.toBeNull();
    });
    
    it('should add a new item to shared inventory', async () => {
        const res = { send: jest.fn() };
        await handleRequest(ADD_ITEM, { options: [
            { value: "new-item-shared" }, //name
            { value: 2 }, //count
            { value: 1.5 }, //weight
            { value: 'shared' } //inventory
        ] }, 
        'user1', 
        res);

        expect(getItemByName(3, "new-item-shared")).not.toBeNull();
    });
    
    it('should update an item', async () => {
        const res = { send: jest.fn() };
        await handleRequest(ADD_ITEM, { options: [
            { value: "updated-item" }, //name
            { value: 2 }, //count
            { value: 1.5 } //weight
        ] }, 
        'user1', 
        res);

        let item = await getItemByName(2, "updated-item");
        expect(item.count).toBe(2);
        expect(item.weight).toBe(1.5);

        await handleRequest(ADD_ITEM, { options: [
            { value: "updated-item" }, //name
            { value: 3 }, //count
            { value: 2 }, //weight
        ] }, 
        'user1', 
        res);

        item = await getItemByName(2, "updated-item");
        expect(item.count).toBe(5);
        expect(item.weight).toBe(2);
    });
})
