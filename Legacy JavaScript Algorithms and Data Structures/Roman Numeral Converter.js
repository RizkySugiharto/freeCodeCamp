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

function convertToRoman(num) {
    let result = '';

    for (const key of Object.keys(romanNumerals).reverse()) {
        while (num >= key) {
            result += romanNumerals[key];
            num -= key;
        }
    }

    return result;
}