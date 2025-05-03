const phonePattern = new RegExp(/^1?\s?(([(]\d{3}[)])|(\d{3}))[\s-]?\d{3}[\s-]?\d{4}$/);

function telephoneCheck(number) {
    return phonePattern.test(number.toString());
}