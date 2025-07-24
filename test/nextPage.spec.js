import { nextPage } from "../commands/nextPage.js";
import { previousPage } from "../commands/previousPage.js";

describe('nextPage', () => {
    it('should get the second page items from BigMom inventory', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.content).toContain('elf dolch');
                expect(blob.data.components[0].type).toBe(1); // Action Row
                expect(blob.data.components[0].components.length).toBe(2);
                expect(blob.data.components[0].components[0].custom_id).toBe('previouspage:BigMom:0');
                expect(blob.data.components[0].components[1].custom_id).toBe('nextpage:BigMom:40');
            },
        };
        await nextPage("nextpage:BigMom:20", res);
    });
    it('should get the last page items from BigMom inventory', async () => {
        const res = {
            send: (blob) => {
                expect(blob.data.content).toContain('taueBauprojekt');
                expect(blob.data.components[0].type).toBe(1); // Action Row
                expect(blob.data.components[0].components.length).toBe(1);
                expect(blob.data.components[0].components[0].custom_id).toBe('previouspage:BigMom:20');
            },
        };
        await nextPage("nextpage:BigMom:40", res);
    });
});
