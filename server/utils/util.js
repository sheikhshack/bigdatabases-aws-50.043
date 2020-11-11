
const asinStringGenerator = (length) => {
    let result = Math.random().toString(36).substring(length);
    return result.toUpperCase()
}

const ridStringGenerator = (length) => {
    let result = Math.random().toString(36).substring(length-1);
    console.log(result)
    return result.toUpperCase()
}



module.exports = {
    asinStringGenerator,
    ridStringGenerator
}