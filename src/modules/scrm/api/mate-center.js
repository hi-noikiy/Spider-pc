import fetch from '@/api/config'

export default {
  // 海报分类树
  getMateTree(params) {
    return fetch.get('api/admin/v1/materialGroup/list', params)
  },
  // 新增海报分类
  dynamicMateAdd(params) {
    return fetch.json('api/admin/v1/materialGroup/add', params)
  },
  // 修改海报分类
  dynamicMateUpdate(params) {
    return fetch.json('api/admin/v1/materialGroup/update', params)
  },
  // 删除分类
  dynamicMateDelete(params) {
    return fetch.post('api/admin/v1/materialGroup/delete', params)
  },
  tabList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/page', params)
  },
  // 海报列表
  matePosterList(params) {
    return fetch.get('api/admin/v1/material/page', params)
  },
  // 海报下架
  matePosteroffShelf(params) {
    return fetch.post('api/admin/v1/material/offShelf', params)
  },
  // 新增海报
  mateAddPoster(params) {
    return fetch.json('api/admin/v1/materialPoster/addPoster', params)
  },
  // 海报详情
  mateDetailPoster(params) {
    return fetch.get('api/admin/v1/materialPoster/getDetail', params)
  },
  // 修改海报
  mateUpdatePoster(params) {
    return fetch.json('api/admin/v1/materialPoster/updatePoster', params)
  },
  // 删除海报
  mateDeletePoster(params) {
    return fetch.post('api/admin/v1/materialPoster/deletePoster', params)
  },
  // 批量删除海报、文本、图片等
  mateBatchDeletePoster(params) {
    return fetch.json('api/admin/v1/material/delete', params)
  },
  // 确认分组
  matemovePoster(params) {
    return fetch.json('api/admin/v1/material/moveGroup', params)
  },
  // 图片上传
  upLoadImg(params) {
    return fetch.postImg("api/v1/attachments/images/tencent_cloud", params);
  },


  // 新增文本、图片、视频、小程序、文件、图文
  materialAdd(params) {
    return fetch.json("api/admin/v1/material/add", params);
  },
  // 修改文本、图片、视频、小程序、文件、图文
  materialUpdate(params) {
    return fetch.json("api/admin/v1/material/update", params);
  },
  // 详情
  materialDetail(params) {
    return fetch.get("api/admin/v1/material/get", params);
  },
  // 冻结/解冻
  freezeAccount(params) {
    return fetch.post("api/admin/v1/account/frozen", params);
  },
  // 绑定分组李彪
  BoundListGroup(params) {
    return fetch.get("api/admin/v1/materialGroup/getBindList", params);
  },
  // 绑定分组
  BoundCouunt(params) {
    return fetch.json("api/admin/v1/materialGroup/bindSysAccount", params);
  },
}
