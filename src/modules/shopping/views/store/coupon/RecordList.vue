<template>
  <el-dialog
    title="优惠券领取情况"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    :before-close="onCloseson"
  >
    <QcTable
      ref="tableson"
      :option="optionson"
      :search-form="searchFormson"
      :column="columnson"
      v-if="visible"
    ></QcTable>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      optionson: {
        url: 'api/admin/v1/coupon/page',
        height: 500,
        isFull: false,
        showSearchAndReset: false
      },
      searchFormson: [
        { value: this.id, formName: 'ruleId' },
        //{ value: '', formName: 'mobile', type: 'input', label: '手机号' },
        //{ value: '', formName: 'name', type: 'input', label: '姓名' },
      ],
      columnson: [
        {
          prop: 'memberHeadImage',
          label: '头像',
          align: 'center',
          formatter: row => {
            return (
              <el-image src={row.memberHeadImage} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            )
          }
        },
        {
          label: '手机号',
          prop: 'memberMobile'
        },
        // { label: '昵称', prop: 'appellation' },
        { label: '姓名', prop: 'memberName' },
        { label: '领取时间', prop: 'createTime' },
        { label: '使用时间', prop: 'useTime' },
        {
          label: '面值（元）',
          prop: 'amount',
          formatter: row => {
            return row.amount / 100
          }
        },
        {
          label: '订单详情',
          align: 'center',
          formatter: row => {
            return (
              <div>
                {row.useObjectId && (
                  <el-button
                    type="text"
                    onClick={() => {
                      this.$router.push(`/main/mall/order/product/detail?id=${row.useObjectId}`)
                    }}
                  >
                    查看订单
                  </el-button>
                )}
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.searchFormson[0].value = this.id
      }
    }
  },
  methods: {
    onCloseson() {
      this.$emit('onClose')
    }
  }
}
</script>
