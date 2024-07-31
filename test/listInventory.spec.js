import { InteractionResponseFlags } from 'discord-interactions'
import { LIST_ITEMS } from '../commands/listItems.js'
import { handleRequest } from '../handleRequest.js'
import { jest } from '@jest/globals'
import { LIST_INVENTORIES } from '../commands/listInventories.js'

describe('items', () => {
    it('should get all inventories', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.flags).toBe(InteractionResponseFlags.EPHEMERAL)
                expect(blob.data.content).toContain('private-inactive')
                expect(blob.data.content).toContain('private-active')
                expect(blob.data.content).toContain('shared')
            },
        }
        await handleRequest(LIST_INVENTORIES, { options: [] }, 'user1', res)
    })
})
