<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>

    <el-dialog
      title="优惠券"
      width="550px"
      append-to-body
      :close-on-click-modal="false"
      :visible="formVisible"
      :before-close="close"
    >
      <div v-loading="loading">
        <el-form ref="model" :model="model" size="small" label-position="right" label-width="120px">
          <el-form-item label="优惠券规则名称" prop="ruleName" :rules="[{required:true,message:'该项为必填项'}]">
            <el-input v-model="model.ruleName" class="coupon-input"></el-input>
            <el-popover width="150" style="color:red!important" placement="top-start" trigger="hover" content="例：满99减2">
              <el-button class="msg-popu-error" icon="el-icon-warning-outline" slot="reference"></el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="优惠券标题" prop="couponTitle" :rules="[{required:true,message:'该项为必填项'}]">
            <el-input v-model="model.couponTitle" class="coupon-input"></el-input>
            <el-popover width="150" style="color:red!important" placement="top-start" trigger="hover" content="例：五一活动优惠券">
              <el-button class="msg-popu-error" icon="el-icon-warning-outline" slot="reference"></el-button>
            </el-popover>
          </el-form-item>

          <el-form-item label="使用范围" prop="couponScope" :rules="[{required:true, message:'该项为必填项'}]">
            <div>
              <el-radio v-model="model.couponScope" :label="201">所有商品</el-radio>
              <el-radio v-model="model.couponScope" :label="204">指定商品</el-radio>
            </div>
          </el-form-item>
          <el-form-item v-if="model.couponScope == 204" label="选择商品" prop="referenceIdList" :rules="[{required:true,message:'该项为必填项'}]">
            <div class="product-list">
              <div v-for='(item, index) in referenceIdList' :key="index" class="product-item">
                <el-button class="remove-btn" type="danger" icon="el-icon-delete" circle @click="onRemeoveProduct(item)"></el-button>
                <QcProductItem :img="imgHost + item.cover" :title="item.title"></QcProductItem>
              </div>
            </div>
            <QcProductPicker
              :type="['product']"
              :module="['Mall']"
              :visible="productPickerVisible"
              @close="onQcProductPickerClose"
            ></QcProductPicker>
            <el-button @click="productPickerVisible = true">请选择</el-button>
          </el-form-item>

          <el-form-item label="可见性" prop="visibility" :rules="[{required:false, message:'该项为必填项'}]">
            <div>
              <el-radio v-model="model.visibility" label="public">无限制</el-radio>
              <el-radio v-model="model.visibility" label="store-directional-give">定向赠送</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="允许赠送" prop="enableGive" :rules="[{required:false, message:'该项为必填项'}]">
            <div>
              <el-radio v-model="model.enableGive" label="disable">不允许</el-radio>
              <el-radio v-model="model.enableGive" label="enable">允许</el-radio>
            </div>
          </el-form-item>

          <!-- <el-form-item label="图片" prop="couponIcon" :rules="[{ required: true, message: '该字段不能为空'}]">
            <QcImageUpload
              :data="{imageType:'attachment'}"
              width="100px"
              height="100px"
              v-model="model.couponIcon"
            ></QcImageUpload>
            <p>建议尺寸750 * 320，大小不超过3M</p>
          </el-form-item> -->
          <el-form-item label="优惠券面值" prop="couponAmount" :rules="[{required:true,message:'该项为必填项'}]">
            <!-- <p v-if="model.couponType === 2" style="color: #888;">注意：折扣券时，面值填80表示8折</p> -->
            <el-input v-if="model.couponType === 2" v-model="model.couponAmount" class="coupon-input">
              <template slot="append">%</template>  
            </el-input>
            <el-input v-else v-model="model.couponAmount" class="coupon-input">
              <template slot="append">元</template>  
            </el-input>
          </el-form-item>
          <el-form-item
            label="需满足订单金额"
            prop="couponOrderAmount"
            :rules="[{required:true,message:'该项为必填项'}]"
          >
            <el-input v-model="model.couponOrderAmount" class="coupon-input" placeholder="0代表无门槛">
              <template slot="append">元</template> 
            </el-input>
          </el-form-item>
          <el-form-item label="发放总量" prop="totalQuantity" :rules="[{required:true,message:'该项为必填项'}]">
            <el-input v-model="model.totalQuantity" class="coupon-input">
              <template slot="append">张</template> 
            </el-input>
          </el-form-item>
          <el-form-item
            label="每人限领次数"
            prop="memberReceiveQuantity"
            :rules="[{required:true,message:'该项为必填项'}]"
          >
            <el-input-number v-model="model.memberReceiveQuantity" style="width: 200px;">
              <template slot="append">张</template> 
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="每日限领次数"
            prop="memberReceiveQuantityPerDay"
            :rules="[{required:true,message:'该项为必填项'}]"
          >
            <el-input-number v-model="model.memberReceiveQuantityPerDay" style="width: 200px;">
              <template slot="append">张</template>
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="领取时间"
            prop="ruleStartTimeAndruleEndTime"
            :rules="[{ required: true, message: '该字段不能为空'}]"
          >
            <el-date-picker
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              v-model="model.ruleStartTimeAndruleEndTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="有效期"
            prop="validTimeAndExpireTime"
            :rules="[{ required: true, message: '该字段不能为空'}]"
          >
            <el-date-picker
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              v-model="model.validTimeAndExpireTime"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button size="small" @click="close()">关闭</el-button>
        <el-button size="small" type="primary" :loading="loading" @click="success()">保存</el-button>
      </span>
    </el-dialog>
    <RecordList :visible="formVisibleson" :id="updateId" @onClose="formVisibleson = false"></RecordList>
  </div>
</template>

<script>
import RecordList from './RecordList'
import couponApi from '@/modules/shopping/api/coupon'
export default {
  components: { RecordList },
  data() {
    return {
      loading: false,
      formVisibleson: false,
      productPickerVisible: false,
      // 优惠券关联的商品id
      referenceIdList: [],
      radio: '1',
      list: [],
      model: {
        ruleStartTime: '',
        // 领券开始时间，格式为yyyy-MM-dd HH:mm:ss
        ruleEndTime: '',
        // 领券结束时间，格式为yyyy-MM-dd HH:mm:ss
        ruleType: 1,
        // 券种类：1商品，4运费 默认：1
        ruleName: '',
        // 领券活动名称
        ruleDescription: '',
        // 规则描述
        totalQuantity: '',
        // 总发券数量
        quantityPerDay: '',
        // 每日发券数量
        memberReceiveQuantity: '',
        // 每人可领数量
        memberReceiveQuantityPerDay: '',
        // 每人每天可领数量
        content: '',
        // 内容详情
        couponAmount: '',
        // 优惠券面值
        couponOrderAmount: '',
        // 订单金额，达到此值才能用
        couponDescription: '',
        // 优惠券说明
        couponIcon: '',
        // 券图标
        couponTitle: '',
        // 优惠券标题
        couponScope: 201,
        // 优惠券适用范围：201店内所有商品，204指定商品，203指定分类
        couponType: 1,
        // 优惠券类型：1抵扣2折扣
        couponValidDaysType: 1,
        // 优惠券有效天数类型：1指定时间段2固定天数
        couponValidTime: '',
        // 优惠券生效时间
        couponExpireTime: '',
        // 优惠券失效时间
        couponValidDays: '',
        // 有效天数
        referenceIdList: '',
        // 范围对象id，如果couponScope==201可不填，couponScope=204则填对应商品id，203则填对应分类id, 多个id使用英文逗号拼接
        visibility: 'public',
        // 可见性：public=无限制，vip-only=vip专享,store-directional-give=商户定向赠送
        enableGive: 'disable',
        // 允许赠送：disable=不允许，enable=允许
        validTimeAndExpireTime: [], // 本地用，提交时会删除
        ruleStartTimeAndruleEndTime: [] // 本地用，提交时会删除
      },
      updateId: '',
      tableRow: {},
      formVisible: false,
      option: {
        url: 'api/admin/v1.1/coupon-rule/store-page?ruleType=1'
        //,showSearchAndReset: false
      },
      searchForm: [
        { value: '', formName: 'couponTitle', type: 'input', label: '券标题' },
        {
          label: '状态',
          type: 'select',
          formName: 'status',
          option: [
            { value: '', label: '全部' },
            { value: 'published', label: '已发布' },
            { value: 'not-published', label: '待发布' },
            { value: 'end', label: '已结束'},
            { value: 'not-start', label: '未开始'},
            { value: 'aborted', label: '已停用'}
          ],
          value: ''
        }
      ],
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.formVisible = true
          }
        }
      ],
      column: [
        //{ type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '优惠规则名称',
          width: '150px',
          prop: 'ruleName'
        },
        {
          label: '优惠券标题',
          width: '150px',
          prop: 'couponTitle'
        },
        {
          label: '优惠内容',
          width: '120px',
          formatter: row => {
            return (
              <div>
                {row.couponOrderAmount == 0 ? '无门槛' : '满' + row.couponOrderAmount / 100} 减{' '}
                {row.couponAmount / 100}
              </div>
            )
          }
        },
        {
          label: '发放总量（张）',
          prop: 'totalQuantity',
          width: '100px'
        },
        {
          label: '领取限制',
          width: '100px',
          formatter: row => {
            return (
              <div>
                {row.memberReceiveQuantity == 0
                  ? '不限'
                  : '限领' + row.memberReceiveQuantity + '张'}
              </div>
            )
          }
        },
        {
          label: '已领取/剩余',
          width: '100px',
          formatter: row => {
            return (
              <div>
                {row.receivedQuantity}/{row.totalQuantity - row.receivedQuantity}
              </div>
            )
          }
        },
        {
          label: '领取时间',
          formatter: row => {
            return (
              <div>
                {row.ruleStartTime.split(' ')[0] || row.ruleStartTime}至{row.ruleEndTime.split(' ')[0] || row.ruleEndTime}
              </div>
            )
          }
        },
        {
          label: '有效时间',
          formatter: row => {
            return (
              <div>
                {row.couponValidTime.split(' ')[0] || row.couponValidTime}至{row.couponExpireTime.split(' ')[0] || row.couponExpireTime}
              </div>
            )
          }
        },
        {
          label: '状态',
          prop: 'status',
          width: '80px',
          formatter: row => {
            if (row.isAborted) {
              return '已停用'
            } else {
              if (new Date(row.ruleStartTime).getTime() > new Date().getTime()) {
                return '未开始'
              } else if (new Date(row.ruleEndTime).getTime() < new Date().getTime()) {
                return '已结束'
              } else if (!row.isPublished) {
                return '待发布'
              } else {
                return '已发布'
              }
            }
          }
        },
        {
          label: '操作',
          align: 'center',
          width: '150px',
          fixed: 'right',
          formatter: row => {
            return (
              <div>
                {!row.isPublished && !row.isAborted && (new Date(row.ruleEndTime).getTime() > new Date().getTime()) && (
                  <el-button type="text" onClick={this.publish.bind(this, row.id)}>
                    发布
                  </el-button>
                )}

                {!row.isPublished &&
                (!row.isAborted ||
                  new Date(row.couponExpireTime).getTime() < new Date().getTime()) && (
                  <el-button type="text" onClick={this.getTree.bind(this, row)}>
                    修改
                  </el-button>
                )}

                {new Date(row.couponExpireTime).getTime() > new Date().getTime() &&
                  new Date().getTime() > new Date(row.couponValidTime).getTime() &&
                  !row.isAborted && (
                    <el-button type="text" style="color: #F56C6C;" onClick={this.abort.bind(this, row.id)}>
                      停用
                    </el-button>
                  )}

                {(row.visibility == 'store-directional-give') && (
                  <el-button type="text" onClick={this.couponMobileSend.bind(this, row.id)}>
                    指定手机号发券
                  </el-button>
                )}
                <el-button type="text" onClick={this.couponRecord.bind(this, row.id)}>
                  领取记录
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    referenceIdList(val) {
      if (val) {
        let list = val.map(item => item.id)
        this.model.referenceIdList = list.join(',')
      } else {
        this.model.referenceIdList = ''
      }
    }
  },
  methods: {
    couponRecord(id) {
      this.formVisibleson = true
      this.updateId = id
    },
    couponMobileSend(id) {
      this.$prompt('请输入手机号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^1(3|5|6|7|8|9)[0-9]{9}$/,
        inputErrorMessage: '手机号格式不正确'
      }).then(async ({ value }) => {
        await couponApi.couponStoreSend({ruleId: id, phone: value})
        this.$message.success('发送成功')
      })
    },
    publish(id) {
      this.$confirm('是否发布该优惠券?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        couponApi.publishCoupon({ id }).then(() => {
          this.$message.success('发布成功')
          this.$refs.table.onSearch()
        })
      })
    },
    abort(id) {
      this.$confirm('是否停用该优惠券?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        couponApi.abortCoupon({ id }).then(() => {
          this.$message.success('已停用')
          this.$refs.table.onSearch()
        })
      })
    },
    async getTree(row) {
      this.formVisible = true;
      this.loading = true
      try {
        const res = await couponApi.getCoupon({id: row.id});
        // this.model = JSON.parse(JSON.stringify(row))
        let model = res.data.data;
        model.couponOrderAmount /= 100;
        model.couponAmount /= 100;
        model.validTimeAndExpireTime = [
          model.couponValidTime,
          model.couponExpireTime
        ];
        model.ruleStartTimeAndruleEndTime = [
          model.ruleStartTime,
          model.ruleEndTime
        ];
        if (model.referenceIdList && model.referenceIdList.join) {
          model.referenceIdList = model.referenceIdList.join(',')
        }
        if (model.couponScope == 204) this.couponProductList(model.referenceIdList) 
        this.model = model;
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    // 获取优惠券关联的商品
    async couponProductList(referenceIdList) {
      let res = await couponApi.couponProductList({referenceIdList})
      this.referenceIdList = res.data.data
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.couponValidTime = model.validTimeAndExpireTime[0]
          model.couponExpireTime = model.validTimeAndExpireTime[1]
          model.ruleStartTime = model.ruleStartTimeAndruleEndTime[0]
          model.ruleEndTime = model.ruleStartTimeAndruleEndTime[1]
          model.couponOrderAmount = parseFloat(model.couponOrderAmount) * 100
          model.couponAmount = parseFloat(model.couponAmount) * 100
          model.quantityPerDay = model.quantityPerDay || model.totalQuantity
          model.memberReceiveQuantityPerDay = model.memberReceiveQuantityPerDay || model.memberReceiveQuantity
          delete model.validTimeAndExpireTime
          delete model.ruleStartTimeAndruleEndTime
          if (model.couponScope == 201) model.referenceIdList = ''
          this.loading = true 
          this.saveModel(model.id ? 'updateStoreCoupon' : 'addStoreCoupon', model)
        }
      })
    },
    saveModel(type, model) {
      couponApi[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'updateStoreCoupon' ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(type) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.formVisible = false
      this.referenceIdList = []
      if (type) this.$refs.table.onSearchKeep()
      this.clearForm('model')
    },
    onQcProductPickerClose(data) {
      this.productPickerVisible = false
      if (data) {
        let obj = {
          id: data.id,
          title: data.name,
          cover: data.iconUrl
        }
        this.referenceIdList.push(obj)
      }
    },
    onRemeoveProduct(val) {
      // 上面的watch里面会监听referenceIdList 进行model的赋值
      let index = this.referenceIdList.findIndex(item => item.id === val.id)
      this.referenceIdList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-input {
  width: 200px;
}

.product-list {
  max-height: 100px;
  overflow: auto;
}
.product-item {
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  width: 150px;
  .remove-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
  }
}
</style>

