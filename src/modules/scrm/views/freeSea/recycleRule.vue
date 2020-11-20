<template>
  <el-dialog
    :title="id ? '修改客户回收规则' : '添加客户回收规则'"
    :visible.sync="visible"
    width="890px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class='tips1'>当客户满足回收条件后，将其自动回收至公海池，交给新员工认领。</div>
    <el-form :model="model" ref="model" label-width="140px" label-position="right">
      <el-form-item label="生效成员：" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-radio v-model="radio" label="1">通用</el-radio>
        <el-radio v-model="radio" label="2">仅企业成员适用</el-radio>
        <el-cascader
        style='width:150px'
          placeholder="请选择成员"
          :options="clioptions"
          :props="{ multiple: true }"
          clearable>
        </el-cascader>
        <el-select v-model="branch" multiple placeholder="请选择部门" style='margin-left:15px;'>
          <el-option
            v-for="item in branchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-tooltip effect="dark" placement="top">
          <div style='line-height:20px' slot="content">企业成员和动态部门必须选择一个。<br/>选择部门后，如原来某部门是5人，后<br/>新增1人，则对这6位企业成员分别发<br/>送提醒。</div>
          <i class='el-icon-question' style='font-size:20px;margin-left:10px'></i>
        </el-tooltip>
        <div>（针对不同员工配置不同的客户回收规则）</div>
      </el-form-item>
      <div>
        <el-form-item v-for="(item,index) in rules" :key="index" :label="'规则'+Number(index+1)+'：'">
          <span>进入</span>
          <el-select v-model="type" clearable placeholder="请选择" class='gapsel'>
            <el-option
              v-for="item in typeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>阶段</span>
          <el-input class='blank' :min="0" type='number' v-model="rulesDay"></el-input>
          <span>天未添加跟进记录，自动回收至公海池</span>
          
          <div style='margin-top:10px'>
            <span>在回收前</span>
            <el-input class='blank' :min="0" type='number' v-model="rulesDay"></el-input>
            <span>天提醒员工</span>
            <el-tooltip effect="dark" placement="top">
              <div style='line-height:20px' slot="content">比如进入某阶段，3个自然日未添加记<br/>录自动回收至公海池，在回收前1天提<br/>醒，那么在1号 10:30客户跟进，在5<br/>号00:00自动回收至公海池，4号早上9<br/>点发送即将回收通知给该员工</div>
              <i class='el-icon-question' style='font-size:20px;margin-left:10px'></i>
            </el-tooltip>
            <el-button v-if="rules.length>1" size="small" type="primary" plain style='margin-left:50px' @click="deleteRule(index)">删除</el-button>
          </div>
        </el-form-item>
      </div>
      <el-button size="medium" type='primary' class='affix' @click="addRules">添加规则</el-button>
      <!-- <el-form-item label="员工提醒应用：" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-select v-model="type" clearable placeholder="请选择" >
          <el-option
            v-for="item in typeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <div class='botbor'>
        <el-form-item label="非企微客户数量：" prop="rulesDay" :rules="[{ required: true, message: '该字段不能为空',trigger:  ['blur', 'change']}]">
          <span>每个员工个人所持有的非企微客户上限数量</span>
          <el-input class='blank' :min="0" type='number' v-model="rulesDay"></el-input>
          <span>位</span>
          <div>(在【公海池】->【非企微客户】列表，员工录入/批量导入客户数量不计入在其中。)</div>
        </el-form-item>
        <el-form-item label="允许延期：">
          <el-switch
            v-model="postpone"
            active-color="#294A7B"
            inactive-color="#999">
          </el-switch>
        </el-form-item>
        <el-form-item label="员工捡回：" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
          <span>自回收至公海池</span>
          <el-input class='blank' :min="0" type='number' v-model="rulesDay"></el-input>
          <span>天后可重新捡回（在某员工手上丢失的客户，回收至公海池，只可在规定的时间后才可重新认领。如设置7天后可重新捡回，1号回收至公海池，8号00：00该员工才能重新认领。）</span>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {

  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      postpone:false,
      typeoptions:[
        {label:'未跟进',value:'11'},
        {label:'跟进中',value:'22'},
        {label:'已拒绝',value:'33'},
        {label:'已成交',value:'44'}
      ],
      rulesDay:'',
      type:'',
      radio:'1',
      clioptions: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
          }, {
            value: 7,
            label: '江苏',
          }, {
            value: 12,
            label: '浙江',
          }]
        }, {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
          }]
      }],
      branchOptions:[{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      branch:[],
      model: {
        content:'',
        groupId:'',
        type:'text',
      },
      productPickerVisible: false,
      loading: false,
      data:[],
      rules:[{}]
    }
  },

  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
          console.log(this.id)
        }
      }
    }
  },

  methods: {
    addRules(){
      this.rules.push({})
    },
    close(flag) {
      this.model = this.$options.data().model
      console.log(this.model)
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
    },
    deleteRule(index){
      this.rules.splice(index,1)
    },
    elCascaderOnlick(e){
      let that = this;
      setTimeout(function() {
        document.querySelectorAll(".el-cascader-node__label").forEach(el => {
          el.onclick = function() {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          };
        });
        document.querySelectorAll(".el-cascader-panel .el-radio").forEach(el => {
          el.onclick = function() {
              // that.$refs.elcascader.dropDownVisible = false;
            };
          });
      }, 100);
    },
  }
}
</script>
<style lang="scss" scoped>
.botbor {
  border: 1px dashed #999;
  padding: 15px 15px 0 15px;
}
.affix {
  margin-left: 120px;
  margin-bottom: 20px;
}
.gapsel {
  display: inline-block;
  width: 150px;
  margin: 0 5px;
}
.blank {
  display: inline-block;
  width: 75px;
  margin: 0 5px;
}
.tips1 {
  color: red;
  margin-bottom: 10px;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
