import fetch from '@/api/config'

export default {
  // 部门-列表
  getDepartmentPage(params) {
    return fetch.get('api/admin/v1/wxCropDept/page', params)
  },
  // 部门-详情
  getDepartmentDetail(params) {
    return fetch.get('api/admin/v1/wxCropDept/get', params)
  },
  // 成员-列表
  getMemberPage(params) {
    return fetch.get('api/admin/v1/wxCropUser/page', params)
  },
  // 成员-详情
  getMemberDetail(params) {
    return fetch.get('api/admin/v1/wxCropUser/get', params)
  },
  // 标签-列表
  getInnerTagPage(params) {
    return fetch.get('api/admin/v1/wxCropTag/page', params)
  },
  // 标签-详情
  getInnerTagDetail(params) {
    return fetch.get('api/admin/v1/wxCropTag/get', params)
  },
  // 部门-树形结构（带成员信息）
  getDepartmentTree() {
    return fetch.get('api/admin//v1/wxCropDept/trees')
  },
  // -fo-
  // 部门树节点数据
  getDepartmentTreeData(params) {
    return fetch.get('api/admin/v1/wxCropDept/treeDept', params)
  },
  // 获取部门chengyuan
  getDepartmentTreeMember(params) {
    return fetch.get('api/admin/v1/wxCropUser/page', params)
  },
  //批量设置成员对外展示信息
  updateUserExternalAttr(params) {
    return fetch.json('api/admin/v1/userExternalAttr/update', params)
  },
  //对外信息展示--列表
  getUserExternalPage(params) {
    return fetch.get('api/admin/v1/userExternalAttr/listJoinUser', params)
  }
}
