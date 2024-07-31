import { handleRequest } from '../handleRequest.js'
import { jest } from '@jest/globals'
import { getInventory } from '../data/inventory.js'
import { ACTIVATE_INVENTORY } from '../commands/activateInventory.js'

describe('items', () => {
    it('should activate a different inventory', async () => {
        const res = { send: jest.fn() }
        await handleRequest(
            ACTIVATE_INVENTORY,
            {
                options: [
                    { value: 'private-inactive' }, //name
                ],
            },
            'user1',
            res
        )

        let inventory = await getInventory('user1', 'private-inactive')
        expect(inventory.active).toBe(1)

        inventory = await getInventory('user1', 'private-active')
        expect(inventory.active).toBe(0)

        // revert for other tests
        await handleRequest(
            ACTIVATE_INVENTORY,
            {
                options: [
                    { value: 'private-active' }, //name
                ],
            },
            'user1',
            res
        )
    })
})
