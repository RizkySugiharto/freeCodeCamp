const regex = RegExp(/[.,\/#!$%\^&\*;:{}=\-_`~()<>\[\]\\+\|]|\s/g);

function palindrome(text) {
    const serializedText = text.toLowerCase().replaceAll(regex, '');

    for (let i = 0; i < Math.floor(serializedText.length / 2); i++) {
        if (serializedText[i] !== serializedText[serializedText.length - 1 - i]) {
            return false;
        }
    }
    
    return true;
}