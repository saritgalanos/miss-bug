//import { httpService } from './http.service'

import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/msg/' :
    '//localhost:3030/api/msg/'


export const msgService = {
    add,
    getById,
    query,
    remove
}


async function query(filterBy = {}) {
    var { data: msgs } = await axios.get(BASE_URL , {params:filterBy})
	 return msgs
}

async function getById(msgId) {
    const url = BASE_URL + msgId
    var { data: msg } = await axios.get(url)
    return msg
}


async function remove(msgId) {
    const url = BASE_URL + msgId
    var { data: res } = await axios.delete(url)
    return res
}

async function add(msg) {
  //const method = msg._id ? 'put' : 'post'
    const { data: addedMsg } = await axios.post(BASE_URL, msg)
    return addedMsg

}






// function query(filterBy) {
//     var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
//     return httpService.get(`msg${queryStr}`)
// }

// async function remove(reviewId) {
//     await httpService.delete(`msg/${reviewId}`)
// }

// async function add({ txt, aboutBugId }) {
//     const addedReview = await httpService.post(`review`, { txt, aboutUserId })
//     return addedReview
// }