<template>
  <!-- 上传文件 -->
  <!-- 
  import UploadFile from '../../../components/components/UploadFile'
  
  <UploadFile
        :api="'api/admin/v1.2/upload-file'"  // 接口地址
        :accept="'text/plain'"               // 文件选择预览类型
        :size="5"                            // 文件大小
        @success="UploadFileSuccess"         // 上传成功后回调函数 val 为返回值
      ></UploadFile>

   UploadFileSuccess(val) {
      console.log(val)
    },

    val 返回值
    {fileId: 1605702574375 
    name: "aaa.txt"
    url: "https://athena-1255600302.cos.ap-guangzhou.myqcloud.com"}
 -->
  <div>
    <el-upload
      class="upload-demo"
      :action="action"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :show-file-list="false"
      :accept="accept"
      :disabled="isUpload && !isSuccessUpload"
    >
      <el-button size="small" plain icon="el-icon-plus" :loading="isUpload && !isSuccessUpload">上传文件</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <div class="percent" v-show="isUpload && !isSuccessUpload">上传进度：{{ percent }} %</div>
  </div>
</template>

<script>
export default {
  props: {
    api: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 5
    },
    accept: {
      type: String,
      default: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    }
  },
  data() {
    return {
      percent: 0,
      isUpload: false,
      isSuccessUpload: false,
      action: ''
    }
  },
  methods: {
    beforeUpload(file) {
      this.isUpload = false
      this.isSuccessUpload = false
      const TXT = 'text/plain',
        PDF = 'application/pdf',
        WORD = 'application/msword'
      let reg = new RegExp('(' + TXT + '|' + PDF + '|' + WORD + ')')
      const isFile = reg.test(file.type)
      const isSize = file.size / 1024 / 1024 < this.size
      if (!isFile) {
        return this.$message.error('请上传TXT、PDF、WORD格式文件')
      }
      if (!isSize) {
        return this.$message.error(`请上传文件大小小于${this.size}M`)
      }
      return isSize && isFile
    },
    onProgress(event, file) {
      this.isUpload = true
      this.percent = event.percent.toFixed(0)
      console.log(event.percent)
    },
    onSuccess(res, file) {
      this.isSuccessUpload = true
      console.log(res)
      let result = {
        name: file.name,
        url: res.data.host,
        fileId: file.uid
      }
      this.$emit('success', result)
    }
  },
  mounted() {
    this.action = `${this.baseUrl}/${this.api}`
  }
}
</script>

<style lang="scss" scoped>
.percent {
  font-size: 12px;
  color: #606266;
  margin-top: 10px;
}
</style>