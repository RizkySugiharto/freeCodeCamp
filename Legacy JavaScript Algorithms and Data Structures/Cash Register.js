const currencyUnits = {
    'ONE HUNDRED': 100,
    'TWENTY': 20,
    'TEN': 10,
    'FIVE': 5,
    'ONE': 1,
    'QUARTER': 0.25,
    'DIME': 0.1,
    'NICKEL': 0.05,
    'PENNY': 0.01,
}
const cidIndices = {
    'ONE HUNDRED': 8,
    'TWENTY': 7,
    'TEN': 6,
    'FIVE': 5,
    'ONE': 4,
    'QUARTER': 3,
    'DIME': 2,
    'NICKEL': 1,
    'PENNY': 0,
}
const emptyUsedCid = JSON.stringify({
    'ONE HUNDRED': 0,
    'TWENTY': 0,
    'TEN': 0,
    'FIVE': 0,
    'ONE': 0,
    'QUARTER': 0,
    'DIME': 0,
    'NICKEL': 0,
    'PENNY': 0,
})

function checkCashRegister(price, cash, cid) {
    let copiedCid = JSON.parse(JSON.stringify(cid));
    let totalAmountCopiedCid = 0;
    let usedCid = JSON.parse(emptyUsedCid);
    let currentChange = parseFloat((cash - price).toPrecision(7));
    const result = {status: '', change: []};

    for (const key in currencyUnits) {
        if (currentChange == 0) break;
        const cidIndex = cidIndices[key];

        if (cid[cidIndex][1] == 0) continue;
        const maxTaken = Math.floor(copiedCid[cidIndex][1] / currencyUnits[key]);
        let unitsTaken = Math.floor(currentChange / currencyUnits[key]);
        unitsTaken = maxTaken < unitsTaken ? maxTaken : unitsTaken;

        if (unitsTaken == 0) continue;
        const amountTaken = parseFloat((currencyUnits[key] * unitsTaken).toPrecision(7));

        if (copiedCid[cidIndex][1] > 0 || (copiedCid[cidIndex][1] - amountTaken) > 0) {
            currentChange = parseFloat((currentChange - amountTaken).toPrecision(7));
            copiedCid[cidIndex][1] = parseFloat((copiedCid[cidIndex][1] - amountTaken).toPrecision(7));
            usedCid[key] = parseFloat((usedCid[key] + amountTaken).toPrecision(7));
        }
        
        if (copiedCid[cidIndex][0] == cid[0][0] && copiedCid[cidIndex][1] <= 0 && currentChange > 0) {
            result.status = 'INSUFFICIENT_FUNDS'
            return result;
        }
    }

    for (const arr of copiedCid) {
        totalAmountCopiedCid += arr[1];
    }

    if (currentChange > 0) {
        result.status = 'INSUFFICIENT_FUNDS'
        return result;
    } else if (totalAmountCopiedCid <= 0) {
        result.status = 'CLOSED'
    } else {
        result.status = 'OPEN'
    }

    for (const label in usedCid) {
        if (result.status == 'OPEN' && usedCid[label] == 0) continue;
        result.change.push([label, usedCid[label]]);
    }
    if (result.status == 'CLOSED') {
        result.change.reverse();
    }

    return result;
}