const changeDue = document.getElementById('change-due');
const numFormat = new Intl.NumberFormat('en-US', {
    currencyDisplay: 'symbol',
    currency: 'USD',
    style: 'currency',
    minimumFractionDigits: 0,
});
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
let price = 3.26;
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];

init()

function init() {
    document.getElementById('price').innerText = `Total Price: ${numFormat.format(price)}`;
    loadCashInDrawer();
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function purchase() {
    let copiedCid = JSON.parse(JSON.stringify(cid));
    let totalAmountCopiedCid = 0;
    let usedCid = JSON.parse(emptyUsedCid);
    const currentCash = parseFloat(document.getElementById('cash').value);
    let currentChange = parseFloat((currentCash - price).toPrecision(7));

    if (currentCash < price) {
        alert('Customer does not have enough money to purchase the item');
        return false;
    } else if (currentCash == price) {
        changeDue.innerText = 'No change due - customer paid with exact cash';
        return false;
    }

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
            changeDue.innerText = 'Status: INSUFFICIENT_FUNDS';
            return false;
        }
    }

    for (const arr of copiedCid) {
        totalAmountCopiedCid += arr[1];
    }

    if (currentChange > 0) {
        changeDue.innerText = 'Status: INSUFFICIENT_FUNDS';
        return false;
    } else if (totalAmountCopiedCid <= 0) {
        changeDue.innerText = 'Status: CLOSED';
    } else {
        changeDue.innerText = 'Status: OPEN';
    }

    cid = copiedCid;
    for (const label in usedCid) {
        if (usedCid[label] <= 0) continue;
        changeDue.innerText += `\n${label}: ${numFormat.format(usedCid[label])}`;
    }

    loadCashInDrawer();

    return false;
}

function loadCashInDrawer() {
    document.getElementById('cash-in-drawer').innerText = cid.map(([label, value]) => {
        return `${capitalize(label)}: ${numFormat.format(value)}`
    }).join('\n');
}