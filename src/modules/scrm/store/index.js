const state = {
  isNeedUseTalkingPage: false, // 是否使用缓存话术列表页的数据
  talkingPageData: {} // 用来存放talking列表页data中的数据
}
const getters = {}
const mutations = {
  isNeedUseTalkingPage(state, data) {
    state.isNeedUseTalkingPage = data
  },
  updateTalkingPage(state, data) {
    state.talkingPageData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}