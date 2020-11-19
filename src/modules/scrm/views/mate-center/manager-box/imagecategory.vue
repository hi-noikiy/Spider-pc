<template>
  <el-dialog
    :title="id ? '编辑图片' : '新建图片'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="80px" label-position="left">
      <el-form-item label="图片名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="图片文案" prop="content">
        <el-input type="textarea" v-model="model.content"></el-input>
      </el-form-item> -->
      <el-form-item label="图片分类" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-cascader
          :options="data"
          :props="{ value: 'id', label: 'name', children: 'childs' }"
          :show-all-levels="true"
          v-model="model.groupId"
          style="width: 420px"
          @change="changeCascader"
          ref="elcascader"
          @visible-change="elCascaderOnlick"
          @expand-change="elCascaderOnlick"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="图片" prop="imageUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
        <QcImageUpload v-model="model.imageUrl" width="100px" height="100px"></QcImageUpload>
      </el-form-item>
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
      model: {
        name:'',
        groupId:'',
        imageUrl:'',
        type:'image',
      },
      data:[],
      loading:false
    }
  },

  watch: {
    visible(val) {
      this.getDepartmentTreeData()
      if (val) {
        if (this.id) {
          this.getCarousel()
        }
      }
    }
  },

  methods: {
    // 获取分类数据
    getDepartmentTreeData() {
      this.$http.getMateTree({ type:'image' }).then((res) => {
        this.data = res.data.data
        this.data.forEach((item) => {
          if (item.childs.length == 0) {
            item.childs = null
          }
        })
      })
    },
    // 获取分类id
    changeCascader(e){
      if(e.length==1){
        this.model.groupId=e[0]
      }
      if(e.length==2){
        this.model.groupId=e[1]
      }
    },
    
    getCarousel() {
      this.$http.materialDetail({ id: this.id }).then(res => {
        this.model = res.data.data
      })
    },
    success() {
      if(this.model.type==''){
        this.$message.error('请选择文本分类')
        return
      }
      if(this.model.content==""){
        this.$message.error('请填写文本内容')
        return
      }
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          this.loading = true
          this.saveModel(this.id ? 'materialUpdate' : 'materialAdd', model)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'materialUpdate' ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('closeImage', flag)
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
<style>
</style>
