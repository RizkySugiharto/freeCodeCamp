const alphabets = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z'
];

function rot13(value) {
    let cipher = '';
    
    for (const char of value) {
        const charIndex = alphabets.indexOf(char);
        const cipherIndex = ((charIndex - 13) < 0) ? (alphabets.length + charIndex - 13) : charIndex - 13;
        cipher += (charIndex != -1 ? alphabets[cipherIndex] : char);
    }

    return cipher;
}