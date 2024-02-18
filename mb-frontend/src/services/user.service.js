
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'




//const BASE_URL = '//localhost:3030/api/user/'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyUser
}

window.userService = userService

async function getUsers(filterBy = {}) {
    var { data: users } = await axios.get(BASE_USER_URL, { params: filterBy })

    return users

}

async function getById(userId) {
    const url = BASE_USER_URL + userId
    var { data: user } = await axios.get(url)
    return user
}


async function remove(userId) {
    const url = BASE_USER_URL + userId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(user) {
    console.log('saving user' + user)
    const method = user._id ? 'put' : 'post'
    const { data: saveduser } = await axios[method](BASE_USER_URL, user)
    return saveduser

}


function getDefaultFilter() {
    return { txt: '', pageIdx: undefined }
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
    console.log('user', user);
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(credentials) {

    const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    return saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
