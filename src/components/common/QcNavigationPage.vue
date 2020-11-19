<template>
  <div class="naviagetion-page" ref="naviagetionPage"  :class="{ 'naviagetion-page--full': full }" :style="{ background }">
    <div class="naviagetion-page__header">
      <el-page-header @back="onBack" :title="title" :content="content"></el-page-header>
    </div>
    <div class="naviagetion-page__body">
      <slot></slot>
    </div>
    <div class="naviagetion-page__footer" v-if="full" :style="{width: naviagetionPageWidth}">
      <slot name="footer"></slot>
    </div>
    <div style="height:100px"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '返回'
    },
    content: String,
    background: {
      type: String,
      default: '#fff'
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      naviagetionPageWidth: '1000px'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPageWidth()
      window.onresize = () => {
        this.getPageWidth()
      }
    })
    
  },
  methods: {
    getPageWidth() {
      if (this.$refs.naviagetionPage) {
        this.naviagetionPageWidth = this.$refs.naviagetionPage.offsetWidth+'px'
      }
    },
    onBack() {
      this.$router.back()
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.naviagetion-page {
  &__header {
    padding: 20px;
  }
  &__body {
    padding: 20px 20px 20px;
  }
  &__footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
    // left: 250px;
    padding: 15px;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    background: #fff;
    z-index: 20;
    text-align: center;
  }
}
.naviagetion-page--full {
  height: 100%;
  overflow: auto;
}
</style>
