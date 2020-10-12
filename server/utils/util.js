
const asinStringGenerator = (length) => {
    let result = Math.random().toString(36).substring(length);
    return result.toUpperCase()
}


module.exports = {
    asinStringGenerator
}