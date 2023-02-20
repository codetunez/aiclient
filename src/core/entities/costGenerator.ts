
const costMap = [
    { model: "ada", cost: .0004 },
    { model: "babbage", cost: .0005 },
    { model: "curie", cost: .0020 },
    { model: "davinci", cost: .02 }
];

const imageCostMap = [
    { size: "256x256", cost: .016 },
    { size: "512x512", cost: .018 },
    { size: "1024x1024", cost: .020 },
]

export const estimateCost = (tokens: number, model: string): number | string => {

    let item: any = null;
    for (const c in costMap) {
        if (model.indexOf(costMap[c].model) > -1) { item = costMap[c]; break; };
    }

    if (!item) { return -1; }

    const total = tokens === -1 ? 0 : ((tokens * item.cost) / 1000).toFixed(7);
    return total ?? -1;
}

export const estimateImageCost = (size: string, count: number): number | string => {

    const item = imageCostMap.find((c: any) => {
        return c.size === size
    });

    if (!item) { return -1; }

    const total = count === -1 ? 0 : ((count * item.cost)).toFixed(3);
    return total ?? -1;
}