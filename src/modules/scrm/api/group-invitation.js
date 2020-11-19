import fetch from '@/api/config'

export default {
  // 标签建群-获取列表
  getGroupInvitationPage(params) {
    return fetch.get('api/admin/v1/groupInvitation/page', params)
  },
  // 标签建群-详情
  getGroupInvitationDetail(params) {
    return fetch.get('api/admin/v1/groupInvitation/get', params)
  },
  // 标签建群-新增
  addGroupInvitation(params) {
    return fetch.json('api/admin/v1/groupInvitation/add', params)
  },
  // 标签建群-修改
  updateGroupInvitation(params) {
    return fetch.json('api/admin/v1/groupInvitation/update', params)
  },
  // 标签建群-删除
  deleteGroupInvitation(params) {
    return fetch.post('api/admin/v1/groupInvitation/delete', params)
  }
}