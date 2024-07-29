import { InteractionResponseType } from "discord-interactions";
import { getAllInventories } from "../data/getAllInventories.js";

const LIST_INVENTORIES = 'listinventories';

const listInventoriesDefinition = {
    name: LIST_INVENTORIES,
    description: 'Inventarliste',
    type: 1,
}

const listInventories = (data, userId, res) => {
    const list = Object.values(getAllInventories())
        .filter(inventory => inventory.userId === userId || inventory.shared)
        .reduce(
            (list, inventory) => list + inventory.name + '\n', 
            'Inventarliste: \n'
        );
    
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: list,
        }
    });
}

export { LIST_INVENTORIES, listInventoriesDefinition, listInventories };