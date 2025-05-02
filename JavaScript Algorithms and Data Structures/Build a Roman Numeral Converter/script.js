const romanNumerals = {
    1000: 'M',
    900: 'CM',
    500: 'D',
    400: 'CD',
    100: 'C',
    90: 'XC',
    50: 'L',
    40: 'XL',
    10: 'X',
    9: 'IX',
    5: 'V',
    4: 'IV',
    1: 'I'
};

function convert() {
    const number = document.getElementById('number');
    const output = document.getElementById('output');
    let value = parseInt(number.value);
    let result = '';
    
    if (number.value.length < 1) {
        output.innerText = 'Please enter a valid number';
        return false;
    } else if (value < 1) {
        output.innerText = 'Please enter a number greater than or equal to 1';
        return false;
    } else if (value > 3999) {
        output.innerText = 'Please enter a number less than or equal to 3999';
        return false;
    }

    for (const key of Object.keys(romanNumerals).reverse()) {
        while (value >= key) {
            result += romanNumerals[key];
            value -= key;
        }
    }

    output.innerText = result;
    return false;
}