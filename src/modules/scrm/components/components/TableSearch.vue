<template>
  <!-- 表格搜索 -->
  <!-- 说明：小于三个搜索项，多于三个请使用另一个组件<HugeTableSearch> -->
  <!-- 
    使用方式
    1. 引入组件 
    示例：
    import TableSearch from '../../../components/components/TableSearch.vue'
    2. 使用组件
    示例：
    <TableSearch :operationButton="operationButton" :searchInput="searchInput"></TableSearch>
    参数：
    名称                类型                      示例                                                      说明
    operationButton     array          [{ title: '新建', on: () => {console.log('aaa')} }                   必选
    => title            string                  按钮标题                                                    必选
    => type             string                  按钮类型                                                    可选，默认primary
    => on               function                按钮方法                                                    必选
    => size             string                  按钮尺寸                                                    可选，默认small
    searchInput         array          [{title: '姓名',type: 'text',size: 'small',value: '',                必选
                                      placeholder: '请输入姓名',on: (val) => {console.log(val)}}]  
    => title            string                    姓名                                                      必选
    => type             string          输入框类型，text，selectOptions,selectTime                          可选，默认为text
    => size             string                 输入框尺寸                                                   可选，默认为small
    => value            string                 输入框值                                                     必选
    => placeholder      string                 输入框提示                                                   可选，默认为请输入内容
    => on               function               输入框搜索方法                                               必选, 返回值为搜索的内容
 -->
  <div>
    <div class="tableSearch">
      <div class="operationButton">
        <el-button
          v-for="(item, index) in operationButton"
          :key="index"
          :type="item.type || 'primary'"
          :size="item.size || 'small'"
          @click="item.on()"
          >{{ item.title }}</el-button
        >
      </div>
      <div class="searchInput">
        <el-form label-position="right" label-width="auto" :inline="true">
          <el-form-item :label="item.title" v-for="(item, index) in searchInput" :key="index">
            <el-input
              v-model="item.value"
              :placeholder="item.placeholder || '请输入内容'"
              @input="item.on(item.value)"
              :size="item.size || 'small'"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    operationButton: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchInput: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tableSearch {
  display: flex;
  padding: 20px;
  align-items: center;
}
.operationButton {
}
.searchInput {
  margin-left: auto;
  &::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>