
const costMap = [
    { model: "ada", cost: .0004},
    { model: "babbage", cost: .0005},
    { model: "curie", cost: .0020},
    { model: "davinci", cost: .02}
];

export const estimateCost = (tokens: number, model: string): number | string => {

    const item = costMap.find(c => {
        return model.indexOf(c.model);
    })
    
    if (!item?.cost) {
        return -1;
    }
    const total = tokens === -1 ? 0 : ((tokens * item?.cost) / 1000).toFixed(7);
    return total ?? -1;
}