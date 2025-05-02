const regex = RegExp(/[.,\/#!$%\^&\*;:{}=\-_`~()<>\[\]\\+\|]|\s/g);

function check() {
    const textInput = document.getElementById('text-input');
    const result = document.getElementById('result');
    
    if (textInput.value.length < 1) {
        alert('Please input a value');
    }

    const serializedValue = textInput.value.toLowerCase().replaceAll(regex, '');

    if (isPalindrome(serializedValue)) {
        result.innerText = `${textInput.value} is a palindrome`;
    } else {
        result.innerText = `${textInput.value} is not a palindrome`;
    }

    return false;
}

function isPalindrome(text) {
    for (let i = 0; i < Math.floor(text.length / 2); i++) {
        if (text[i] !== text[text.length - 1 - i]) {
            return false;
        }
    }

    return true;
}