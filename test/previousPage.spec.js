import { previousPage } from "../commands/previousPage.js";

describe('previousPage', () => {
    it('should the first page items from BigMom inventory', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.content).toContain('angel');
                expect(blob.data.components[0].type).toBe(1); // Action Row
                expect(blob.data.components[0].components.length).toBe(1);
                expect(blob.data.components[0].components[0].custom_id).toBe('nextpage:BigMom:20');
            },
        };
        await previousPage("previouspage:BigMom:0", res);
    });
    it('should the second page items from BigMom inventory', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.content).toContain('elf dolch');
                expect(blob.data.components[0].type).toBe(1); // Action Row
                expect(blob.data.components[0].components.length).toBe(2);
                expect(blob.data.components[0].components[0].custom_id).toBe('previouspage:BigMom:0');
                expect(blob.data.components[0].components[1].custom_id).toBe('nextpage:BigMom:40');
            },
        };
        await previousPage("previouspage:BigMom:20", res);
    });
});
