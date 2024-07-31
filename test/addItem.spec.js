import { InteractionResponseFlags } from "discord-interactions"
import { LIST_ITEMS } from "../commands/listItems.js"
import { handleRequest } from "../handleRequest.js"

describe('items', () => {
    it('should get all items', async () => {
        const res = {
            send: (data => {
                expect(data.flag).toBe(InteractionResponseFlags.EPHEMERAL);
                expect(data.content).toContain('private-item-active-1');
                expect(data.content).toContain('private-item-active-2');
                expect(data.content).toContain('duplicate-item');
            })
        }
        await handleRequest(LIST_ITEMS, { options: [] }, 'user1', res);
    });
})
