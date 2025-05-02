const phonePattern = new RegExp(/^1?\s?(([(]\d{3}[)])|(\d{3}))[\s-]?\d{3}[\s-]?\d{4}$/);
const resultsDiv = document.getElementById('results-div');

function check() {
    const userInput = document.getElementById('user-input');
    
    if (userInput.value.length < 1) {
        alert('Please provide a phone number');
        return false;
    }
    
    const result = document.createElement('p');
    resultsDiv.appendChild(result);
    result.classList.add('results-text');

    if (phonePattern.test(userInput.value)) {
        result.innerText = `Valid US number: ${userInput.value}`;
        result.classList.add('valid');
    } else {
        result.innerText = `Invalid US number: ${userInput.value}`;
        result.classList.add('invalid');
    }
    
    return false;
}

function clearList() {
    resultsDiv.replaceChildren([]);
}