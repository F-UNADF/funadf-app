import route from './route'

const token = document.head.querySelector('meta[name="csrf-token"]')
const axios = require('axios')

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}

axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        config.withCredentials = true
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    },
)

export default {
    get(routeName, routeParameters = {}, query = {}, onSuccess, onError, config = {}) {
        axios.get(route(routeName, routeParameters, query), config).then(response => onSuccess(response), error => onError(error))
    },

    post(routeName, routeParameters = {}, datas, onSuccess, onError, config = {}) {
        axios.post(route(routeName, routeParameters), datas, config).then(response => onSuccess(response), error => onError(error))
    },

    put(routeName, routeParameters = {}, datas, onSuccess, onError) {
        axios.put(route(routeName, routeParameters), datas).then(response => onSuccess(response), error => onError(error))
    },

    patch(routeName, routeParameters = {}, datas, onSuccess, onError) {
        axios.put(route(routeName, routeParameters), datas).then(response => onSuccess(response), error => onError(error))
    },

    delete(routeName, routeParameters = {}, onSuccess, onError, config) {
        axios.delete(route(routeName, routeParameters), config).then(response => onSuccess(response), error => onError(error))
    },
}