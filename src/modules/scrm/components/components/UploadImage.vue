<template>
  <!-- 
  上传图片
  @success(val){}  成功后的回调 val为上传成功返回的数据，
  例如
  [{
    fileId: 1604656037644,
    name: "u=1593106255,4245861836&fm=26&gp=0.jpg",
    url: "/attachments/null/f903fa0ec5e9465284dc521d0cabd954.jpg"
  }]
  :fileList  上传的文件列表, 
  例如: 
  [{
    name: 'food.jpg', 
    url: 'https://xxx.cdn.com/xxx.jpg'
  }]    
 -->
  <div>
    <el-upload
      :action="baseUrl + '/api/v1/attachments/images/tencent_cloud'"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="success"
      :data="{ imageType: imageType }"
      :limit="maxLength"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-exceed="onExceed"
    >
      <i class="el-icon-plus myIcon"></i>
      <span class="tips">{{ tips }}</span>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" width="600px">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { string } from 'clipboard'
export default {
  props: {
    // 最大上传限制
    maxLength: {
      type: Number,
      default: 1
    },
    // 是否支持多传
    multiple: {
      type: Boolean,
      default: true
    },
    // 上传按钮名称
    tips: {
      type: String,
      default: '上传图片'
    },
    // 限制大小
    size: {
      type: Number,
      default: 5
    },
    // 上传后所属文件夹
    imageType: {
      type: String,
      default: 'scrm'
    },
    // 图片上传列表
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    fileList: {
      handler: function () {
        this.$nextTick(function () {
          this.showUploadButton(this.fileList)
        })
      },
      immediate: true
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.showUploadButton(fileList)
      let result = this.formatImageData(fileList)
      this.$emit('success', result)
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      if (file.url.includes('http')) {
        this.dialogImageUrl = file.url
      } else {
        this.dialogImageUrl = this.imgHost + file.url
      }
    },
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isSize = file.size / 1024 / 1024 < this.size
      if (!isImage) {
        this.$message.error('请上传正确格式图片')
      }
      if (!isSize) {
        this.$message.error(`请上传小于${this.size}M大小图片`)
      }
      return isImage && isSize
    },
    onExceed() {
      this.$message.error(`请上传小于${this.maxLength}张图片`)
    },
    success(res, file, fileList) {
      this.showUploadButton(fileList)
      let result = this.formatImageData(fileList)
      this.$emit('success', result)
    },
    formatImageData(option) {
      let arr = []
      let reg = new RegExp(this.imgHost)
      option.forEach((item) => {
        if (!item.response) {
          let url = ''
          if (reg.test(item.url)) {
            url = item.url.split(reg)[1]
          } else {
            url = item.url || ''
          }
          arr.push({
            name: item.name || '',
            fileId: item.uid || '',
            url
          })
          return
        } else {
          arr.push({
            name: item.name || '',
            fileId: item.uid || '',
            url: item.response.data.imageUrl || ''
          })
        }
      })
      return arr
    },
    showUploadButton(option) {
      if (option.length >= this.maxLength) {
        document.querySelector('.el-upload--picture-card').style.display = 'none'
      } else {
        document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload--picture-card i {
  font-size: 14px;
}
.tips {
  width: 100%;
  height: 16px;
  font-size: 14px;
  line-height: 16px;
  color: #8c939d;
}
</style>