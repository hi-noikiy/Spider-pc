import fetch from '@/api/config'

export default {
  disposeGet(params) {
    return fetch.get('api/admin/v1/cropApp/get', params)
  },
  disposeAdd(params) {
    return fetch.json('api/admin/v1/cropApp/add', params)
  },
  disposeUpdate(params) {
    return fetch.json('api/admin/v1/cropApp/update', params)
  },
  disposeDelete(params) {
    return fetch.post('api/admin/v1/cropApp/delete', params)
  },
  disposePage(params) {
    return fetch.get('api/admin/v1/cropApp/page', params)
  }
}
