function genMsg(from, text) {
    return {
        from,
        text,
        date: new Date().getTime()
    }
}
module.exports = { genMsg };