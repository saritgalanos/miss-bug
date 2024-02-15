
import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}


async function query(filterBy = {}) {
    var { data: bugs } = await axios.get(BASE_URL , {params:filterBy})
	 return bugs
}

async function getById(bugId) {
    const url = BASE_URL + bugId
    var { data: bug } = await axios.get(url)
    return bug
}


async function remove(bugId) {
    const url = BASE_URL + bugId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(bug) {
  const method = bug._id ? 'put' : 'post'
    const { data: savedbug } = await axios[method](BASE_URL, bug)
    return savedbug

}


function getDefaultFilter() {
	return { txt: '', sortBy: '', minSeverity: '' , description:'',pageIdx: undefined }
}