const buildTable = (inventory, offset, limit) => {
    const columnSizes = [8, 6, 7];
    const items = inventory.items.slice(offset, limit);
    items.forEach((item) => {
        if (columnSizes[0] < item.name.length) {
            columnSizes[0] = item.name.length;
        }

        if (columnSizes[1] < item.count.toString().length) {
            columnSizes[1] = item.count.toString().length;
        }

        if (columnSizes[2] < item.weight.toString().length) {
            columnSizes[2] = item.weight.toString().length;
        }
    });

    const header =
        'Itemname'.padEnd(columnSizes[0]) +
        ' | ' +
        'Anzahl'.padEnd(columnSizes[1]) +
        ' | ' +
        'Gewicht'.padEnd(columnSizes[2]) +
        '\n';

    return (
        `Inventar ${inventory.name}: \n` +
        '```' +
        items.reduce(
            (table, item) =>
                table +
                item.name.padEnd(columnSizes[0]) +
                ' | ' +
                item.count.toString().padEnd(columnSizes[1]) +
                ' | ' +
                item.weight.toString().padEnd(columnSizes[2]) +
                '\n',
            header,
        ) +
        '```'
    );
};

export { buildTable };