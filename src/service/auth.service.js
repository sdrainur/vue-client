const item = localStorage.getItem('accessToken')

const authToken = item ?
    JSON.parse(localStorage.getItem('accessToken'))
    : null


module.exports = {
    authToken,
}