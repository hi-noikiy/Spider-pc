<template>
  <el-dialog
    :title="id ? '编辑视频' : '新建视频'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="80px" label-position="left">
      <el-form-item label="视频分类" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
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
      <el-form-item label="视频" prop="videoUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
        <div class="video-add" v-if="showupdata">
          <video-upload @onSuccess="getUploadVideo"></video-upload>
        </div>
        <el-input v-if="!showupdata" v-model="model.name" style="width:200px"></el-input>
        <el-button type="primary" v-if="!showupdata" @click="showupdata=true" style='margin-left:10px'>重新上传</el-button>
        <!-- <video-player v-else  class="pic"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player> -->
      </el-form-item>
      <el-form-item label="视频摘要" prop="content" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input  v-model="model.content"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import VideoUpload from '../../../components/common/VideoUpload'
import VideoPreview from '../../../components/common/VideoPreview'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  components: {
    VideoUpload,
    VideoPreview,
    videoPlayer
  },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      showupdata:true,
      model: {
        name:'',
        groupId:'',
        videoUrl:'',
        imageUrl:'',
        type:'video',
      },
      data:[],
      loading:false,
      playerOptions:{
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:16', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          src: 'http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/7c91912e5285890809428211638/fmhJD2mAmBIA.mp4',  // 路径
          type: 'video/mp4'  // 类型
        }],
        poster: "http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/7c91912e5285890809428211638/5285890809428211639.jpg", //你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
    }
  },

  watch: {
    visible(val) {
      this.getDepartmentTreeData()
      if (val) {
        if (this.id) {
          this.showupdata=false
          this.getCarousel()
        }
      }
    }
  },

  methods: {
    // 详情
    getCarousel() {
      this.$http.materialDetail({ id: this.id }).then(res => {
        this.model = res.data.data
        this.playerOptions.sources[0].src=this.model.videoUrl
        this.playerOptions.poster=this.model.imageUrl
        console.log(this.playerOptions)
      })
    },
    // 获取分类数据
    getDepartmentTreeData() {
      this.$http.getMateTree({ type:'video' }).then((res) => {
        this.data = res.data.data
        this.data.forEach((item) => {
          if (item.childs.length == 0) {
            item.childs = null
          }
        })
      })
    },

    // 视频上传成功
    getUploadVideo(e){
      console.log(e)
      this.model.name=e.file.name
      this.model.videoUrl=e.video.videoUrl
      this.model.imageUrl=e.video.coverUrl
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
      this.$emit('closeVidel', flag)
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
