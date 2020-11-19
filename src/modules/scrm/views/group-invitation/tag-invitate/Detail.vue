<template>
  <div class="tag-invitate-detail">
    <go-back title="详情"></go-back>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack'
export default {
  components: { GoBack },
  data() {
    return {
      tagInvitateId: '', // 标签建群id
    }
  },
  created() {
    if (this.$route.query.id) {
      this.tagInvitateId = this.$route.query.id
      this.getGroupInvitationDetail()
    }
  },
  methods: {
    getGroupInvitationDetail() {
      this.$http.getGroupInvitationDetail({ id: this.tagInvitateId }).then(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>