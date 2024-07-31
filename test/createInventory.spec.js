import { handleRequest } from '../handleRequest.js'
import { jest } from '@jest/globals'
import { getInventory } from '../data/inventory.js'
import { CREATE_INVENTORY } from '../commands/createInventory.js'
import { ACTIVATE_INVENTORY } from '../commands/activateInventory.js'

describe('items', () => {
    it('should add a new private inventory and activate it', async () => {
        const res = { send: jest.fn() }
        await handleRequest(
            CREATE_INVENTORY,
            {
                options: [
                    { value: 'new-inventory' }, //name
                ],
            },
            'user1',
            res
        )

        const inventory = await getInventory('user1', 'new-inventory')
        expect(inventory.items.length).toBe(0)
        expect(inventory.userId).toBe('user1')
        expect(inventory.active).toBe(1)
        expect(inventory.shared).toBe(0)

        const oldInventory = await getInventory('user1', 'private-active')
        expect(oldInventory.active).toBe(0)

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
    
    it('should add a new shared inventory and NOT activate it', async () => {
        const res = { send: jest.fn() }
        await handleRequest(
            CREATE_INVENTORY,
            {
                options: [
                    { value: 'new-shared-inventory' }, //name
                    { value: 1 }, //shared
                ],
            },
            'user1',
            res
        )

        const inventory = await getInventory('user1', 'new-shared-inventory')
        expect(inventory.items.length).toBe(0)
        expect(inventory.userId).toBe('user1')
        expect(inventory.active).toBe(0)
        expect(inventory.shared).toBe(1)

        const oldInventory = await getInventory('user1', 'private-active')
        expect(oldInventory.active).toBe(1)
    })
})
