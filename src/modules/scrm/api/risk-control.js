import fetch from '@/api/config'
export default {
  getPermitUserPage(params) {
    return fetch.get('api/admin/v1/conversation-persistence/permit-user-page', params)
  },
  getPageByUser(params) {
    return fetch.get('api/admin/v1/conversation-persistence/page-by-user', params)
  },
  getConverSationMessage(params) {
    return fetch.get('api/admin/v1/conversation-persistence/message-page', params)
  }
}
