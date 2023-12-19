function generateRandomString(length, useChars) {
    let characters = '';

    if(useChars.includes('num')) {
        characters += '0123456789'
    }

    if(useChars.includes('lwr')) {
        characters += 'abcdefghijklmnopqrstuvwxyz'
    }

    if(useChars.includes('upr')) {
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export default generateRandomString