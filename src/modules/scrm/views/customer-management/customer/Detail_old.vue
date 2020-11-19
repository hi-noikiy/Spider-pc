<template>
  <div class="customer-detail">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">详情</el-button>
    </div>
    <div class="customer_title">
      <div class="tab_bar">
        <div class="title_div" v-for="(item, index) in catrgrouList" :key="index">
          <div :class="['title_name', { isActive: index == nowIndex }]" @click="relationClick(index)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-if="nowIndex === 0">
      <div class="content">
        <div class="customer-digest">
          <div class="image-text">
            <el-avatar shape="square" :size="60" fit="fit" :src="customerData.avatar"></el-avatar>
            <div class="left-info">
              <div class="info-name">{{ customerData.name }}</div>
              <div class="info-live">
                生命周期:{{ customerLifeCycle.cycleName || '暂无' }}
                <i class="el-icon-edit deit-icon" @click="openEditLifeCycle"></i>
              </div>
              <!-- <div class="info-desc">客户信息</div> -->
            </div>
            <!-- <div class="edit-icon"></div> -->
          </div>
          <!-- <el-button type="primary" icon="el-icon-chat-dot-square" @click="checkChatHistory">聊天记录</el-button> -->
        </div>
        <div class="customer-info">
          <div class="info-item">性别：&nbsp;&nbsp;{{ customerData.genderName }}</div>
          <div class="info-item">手机号：&nbsp;&nbsp;{{ customerData.mobile || '--' }}</div>
          <div class="info-item">邮箱：&nbsp;&nbsp;{{ customerData.email || '--' }}</div>
          <div class="info-item">职务：&nbsp;&nbsp;{{ customerData.position || '--' }}</div>
          <div class="info-item">企业：&nbsp;&nbsp;{{ customerData.corpFullName || '--' }}</div>
          <div class="info-item">备注：&nbsp;&nbsp;{{ customerData.remarks || '--' }}</div>
          <div class="info-item">描述：&nbsp;&nbsp;{{ customerData.description || '--' }}</div>

          <!-- <div class="info-item" v-for="(item, index) in newShowData" :key="index">
            {{ item.name }}：&nbsp;&nbsp;{{ item.value || '--' }}
          </div> -->

          <div class="info-item">创建时间：&nbsp;&nbsp;{{ customerData.createAtToTime }}</div>
          <div class="info-item">更新时间：&nbsp;&nbsp;{{ customerData.updateTime }}</div>
          <div class="info-item">所属成员：&nbsp;&nbsp;{{ customerData.cropUserList | cropUserListFilter }}</div>
        </div>
        <div class="eidt-btn">
          <el-button @click="editBtn()" size="small">编辑信息</el-button>
          <!-- <el-button @click="addNewsBtn()">新增信息</el-button> -->
        </div>
      </div>
      <div class="title-bar">扩展信息</div>
      <div class="content">
        <div class="customer-info">
          <div class="info-item" v-for="(customer, index) in newShowData" :key="index">
            {{ customer.name }}：&nbsp;&nbsp;{{ customer.value || '--' }}
          </div>
        </div>
        <div class="eidt-btn" v-if="newCustomerList.length != 0">
          <el-button @click="editExtendBtn()" size="small">编辑信息</el-button>
          <!-- <el-button @click="addExtendBtn()">新增信息</el-button> -->
        </div>
        <div class="edit-text" v-if="newCustomerList.length == 0">暂无数据</div>
      </div>
      <div class="title-bar">基础信息</div>
      <div class="content">
        <div class="customer-info">
          <div class="info-item">客户类型：&nbsp;&nbsp;{{ customerData.typeName || '--' }}</div>
          <div class="info-item">添加时间：&nbsp;&nbsp;{{ customerData.createAtToTime }}</div>
          <div class="info-item">更新时间：&nbsp;&nbsp;{{ customerData.updateTime }}</div>
          <div class="info-item">
            客户分组：&nbsp;&nbsp;<span
              v-for="(item, index) in customerData.groupName"
              :key="index"
              class="groupName"
              >{{ item + '、' || '--' }}</span
            >&nbsp;&nbsp;
          </div>
          <!-- <div class="info-item">
            客户备注：&nbsp;&nbsp;{{ customerData.remarks || '--'
            }}<i class="el-icon-edit-outline" @click="editRemark"></i>
          </div> -->
          <div class="info-item">客户状态：&nbsp;&nbsp;{{ customerData.statusName || '--' }}</div>
        </div>
      </div>
      <div class="title-bar">客户标签</div>
      <div class="content">
        <div class="customer-info tag-info">
          <div class="info-item company_item">
            企业标签：&nbsp;&nbsp;

            <span class="info-itemtag" v-for="(item, EnertTag) in newArrsCustomer" :key="EnertTag">
              {{ item || '--' }}
            </span>
            <el-button @click="editEnterTag()" size="small">编辑</el-button>
          </div>
          <div class="info-item company_item">
            个人标签：&nbsp;&nbsp;

            <span class="info-itemtag" v-for="(items, personTag) in newPersonlTagList" :key="personTag">
              {{ items || '--' }}
            </span>
            <el-button @click="editPersonTag()" size="small">编辑</el-button>
          </div>
          <div class="info-item company_item">
            行为标签：&nbsp;&nbsp;
            <span class="info-itemtag" v-for="(items, personTag) in behaviorTagList" :key="personTag">
              {{ items.name }}
            </span>
            <span class="info-itemnone" v-if="behaviorTagList.length == 0">暂无行为标签</span>
          </div>
        </div>
      </div>
    </div>
    <!--跟进记录-->
    <div class="container" v-if="nowIndex === 1">
      <div class="content">
        <el-form label-position="right">
          <el-form-item label="跟进内容">
            <el-input
              class="record_input"
              type="textarea"
              width="600px"
              maxlength="100"
              show-word-limit
              size="small"
              placeholder="最多可输入100字"
              height="400px"
              :rows="3"
              resize="none"
              v-model="recordContent"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" class="record-button" @click="addRecord()">添加</el-button>
          </el-form-item>
        </el-form>
        <div class="record-table">
          <com-table :tableData="recordData" :column="recordColumn"></com-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </div>
    </div>
    <com-dialog :config="editDialog.config" @closeDialog="editClose()">
      <div class="edit-content">
        <el-form label-position="right" label-width="auto" ref="models" :model="models">
          <el-form-item label="企业" prop="corpFullName">
            <el-input
              maxlength="20"
              show-word-limit
              width="200px"
              placeholder="请输入企业"
              v-model="models.corpFullName"
            ></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="position">
            <el-input maxlength="128" show-word-limit placeholder="请输入职务" v-model="models.position"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input
              type="text"
              v-on:input="models.mobile = models.mobile.replace(/[^\d]/g, '')"
              maxlength="40"
              show-word-limit
              placeholder="请输入电话"
              v-model="models.mobile"
            ></el-input>
            <!-- <el-input
              type="text"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              maxlength="11"
              placeholder="请输入电话"
              v-model="models.mobile"
            ></el-input> -->
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input maxlength="40" show-word-limit placeholder="请输入邮箱" v-model="models.email"></el-input>
          </el-form-item>
          <el-form-item label="备注名" prop="remarks">
            <el-input maxlength="20" show-word-limit placeholder="请输入备注" v-model="models.remarks"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              class="textarea-input"
              type="textarea"
              :rows="3"
              resize="none"
              maxlength="150"
              show-word-limit
              placeholder="请输入描述"
              v-model="models.description"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item v-for="(item, index) in showExternal" :key="index" :label="showExternal[index].name">
            <el-row :gutter="24">
              <el-col :span="20">
                <el-input v-model="showExternal[index].value" maxlength="30" show-word-limit></el-input>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-minus iconMinu" @click="deteleRow(item, index)"></i>
              </el-col>
            </el-row>
          </el-form-item> -->
        </el-form>
      </div>
      <div class="submit_btn" style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog
      :config="selectEnterDialog.config"
      @closeDialog="selectEnterDialog.config.visible = false"
      class="dialogSelect"
    >
      <div class="selectGroup">
        <div class="leftTitle"></div>
        <div class="rightTags">
          <el-tag
            v-for="(tag, index) in spanName"
            :key="index"
            closable
            type="info"
            :disable-transitions="true"
            @close="closeTagList(tag, index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <div class="select-div-dispose">
        <div v-for="(item, index) in tagNameList" :key="index">
          <div class="tagGroupTitle">{{ item.name }}</div>
          <div class="tagChange">
            <div
              @click="changeTag(items.tagId, items.id, items.name)"
              v-for="(items, indexs) in item.tagList"
              :key="indexs"
              :class="{ active: spanIndex.indexOf(items.id) > -1 }"
            >
              {{ items.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button type="info" @click="closeTagDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog
      :config="selectPersonalDialog.config"
      @closeDialog="selectPersonalDialog.config.visible = false"
      class="dialogSelect"
    >
      <div class="selectGroup">
        <div class="leftTitle"></div>
        <div class="rightTags">
          <el-tag
            v-for="(tag, index) in tagNamePerName"
            :key="index"
            closable
            type="info"
            :disable-transitions="true"
            @close="closePerList(tag, index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <div>
        <div class="tagGroupTitle">个人标签</div>
        <div class="tagChange">
          <div class="tagIndex" @click="addPersonalTag()">添加</div>
          <div
            @click="changePerTag(items.id, items.name)"
            v-for="(items, indexs) in personList"
            :key="indexs"
            :class="{ active: spanPerIndex.indexOf(items.id) > -1 }"
          >
            {{ items.name }}
          </div>
        </div>
      </div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button type="info" @click="closePerDialog()">取消</el-button>
        <el-button type="primary" @click="sumbitPerDialog()">确定</el-button>
      </div>
    </com-dialog>
    <div>
      <com-dialog :config="addPersonalDialog.config" @closeDialog="closePerTagDialog()" class="dialogSelect">
        <el-form label-position="right" label-width="auto" ref="tagModel">
          <el-form-item label="标签名称" :model="tagModel">
            <el-input placeholder="请输入标签名称" v-model="tagModel.name"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit_btn" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="sumbitAddPerTagDialog()">确定</el-button>
        </div>
      </com-dialog>
    </div>
    <com-dialog :config="eidtExtendlDialog.config" @closeDialog="closePerExtendDialog()" class="dialogSelect">
      <el-form
        label-position="right"
        label-width="auto"
        ref="eidtExtendModel"
        v-for="(customer, index) in newCustomerList"
        :key="index"
      >
        <el-form-item :label="customer.name">
          <el-input placeholder="请输入字段名称" maxlength="30" show-word-limit v-model="customer.value"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit_btn" style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="sumbitExtend()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog :config="addExtendlDialog.config" @closeDialog="closeAddExtendDialog()" class="dialogSelect">
      <el-form label-position="right" label-width="auto" ref="addExtendModel" :model="listExternalProfile">
        <el-form-item label="字段名称">
          <el-input
            placeholder="请输入字段名称"
            maxlength="30"
            show-word-limit
            v-model="listExternalProfile.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            placeholder="请输入字段内容"
            maxlength="30"
            show-word-limit
            v-model="listExternalProfile.value"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="submit_btn" style="display: flex; justify-content: flex-end">
        <el-button type="primary" @click="sumbitAddExtend()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog
      :config="editRecordDialog.config"
      @closeDialog="editRecordDialog.config.visible = false"
      class="editRecordCom"
    >
      <div class="remark-content">
        <el-form label-position="right" label-width="auto">
          <el-form-item label="跟进内容" prop="remark">
            <el-input
              type="textarea"
              size="small"
              height="200px"
              :rows="6"
              resize="none"
              v-model="editRecordContent"
              placeholder="请输入跟进内容"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="submit_btn" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="submitEditRecord()">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <com-dialog
      :config="editCustomerLifeCycleDialog.config"
      @closeDialog="editCustomerLifeCycleDialog.config.visible = false"
    >
      <div class="remark-content-edit">
        <el-form label-position="right" label-width="auto" class="sumbit-form-item">
          <el-form-item label="客户生命周期">
            <!-- <el-input v-model="editLifeCycleContent" placeholder="请输入客户生命周期" maxlength="10" show-word-limit>
            </el-input> -->
            <el-select
              v-model="lifeCycleIdList"
              clearable
              class="customer-selection"
              placeholder="请选择生命周期"
              style="width: 350px"
            >
              <el-option
                v-for="(LifeCycleItem, CycleIndex) in customerLifeCycleList"
                :key="CycleIndex"
                :label="LifeCycleItem.cycleName"
                :value="LifeCycleItem.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="submit_btn" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="submitEditCustomerLife()">确定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComDialog, ComTable, ComPagination },
  inject: ['reload'],
  data() {
    return {
      catrgrouList: [
        {
          name: '客户管理',
          id: 0
        },
        { name: '动态记录', id: 1 }
      ],
      nowIndex: 0,
      newShowData: [],
      customerData: {},
      customerId: '',
      customerLifeCycleList: [],
      lifeCycleIdList: '',
      // chatDialog: {
      //   config: {
      //     width: '800px',
      //     title: '聊天记录',
      //     visible: false
      //   },
      //   search: {
      //     startTime_endTime: '',
      //     content: ''
      //   },
      //   date: {
      //     type: 'datetimerange',
      //     'value-format': 'yyyy-MM-dd HH:mm:ss'
      //   },
      //   tabs: [
      //     { name: 'total', label: '全部记录' },
      //     { name: 'imgVideo', label: '图片视频' }
      //   ],
      //   activeName: 'total'
      // },
      editRecordDialog: {
        config: {
          width: '600px',
          title: '修改跟进内容',
          visible: false
        }
      },
      editCustomerLifeCycleDialog: {
        config: {
          width: '500px',
          title: '修改客户生命周期',
          visible: false
        }
      },
      editDialog: {
        config: {
          width: '500px',
          title: '编辑信息',
          visible: false
        }
      },
      addDialog: {
        config: {
          width: '600px',
          title: '新增信息',
          visible: false
        }
      },
      eidtExtendlDialog: {
        config: {
          width: '600px',
          title: '编辑信息',
          visible: false
        }
      },
      remarkForm: {
        remark: ''
      },
      models: {
        id: '',
        corpFullName: '',
        position: '',
        mobile: '',
        email: '',
        remarks: '',
        description: ''
      },
      externalProfileList: {
        // name: '',
        // value: ''
      },
      showExternal: {},

      /*企业标签开始*/
      enterpriseList: [], //企业标签
      personalList: {}, //个人标签
      //编辑企业标签弹窗
      selectEnterDialog: {
        config: {
          width: '600px',
          title: '编辑企业客户标签',
          visible: false
        }
      },
      spanIndex: [], //点击标签颜色会变得数组
      tagList: [], //获取到的企业列表存放的地方
      tagNameList: [], //获取编辑整个分组的信息
      newArr: [],
      spanId: [],
      spanName: [],
      tagNewList: '',
      zanCunSpanIndex: [],
      listName: [],
      /*企业标签结束*/
      /**个人标签开始 */
      selectPersonalDialog: {
        config: {
          width: '600px',
          title: '编辑个人客户标签',
          visible: false
        }
      },

      personList: [],
      spanPerIndex: [], //存储点击的个人标签
      tagNamePerName: [], //存储点击后放在上边的标签列表
      zanCunPerIndex: [], //暂存的数据
      listPerName: [],
      perNameList: [], //首页存储的个人标签
      /**个人标签结束 */

      /*添加个人标签*/
      addPersonalDialog: {
        config: {
          width: '600px',
          title: '添加个人客户标签',
          visible: false
        }
      },
      addExtendlDialog: {
        config: {
          width: '600px',
          title: '新增字段',
          visible: false
        }
      },
      tagModel: {
        name: '', //名称
        sequence: 0, //排序号
        describe: '' //备注
      },
      listExternalProfile: {
        id: '',
        name: '',
        value: '',
        sequence: ''
      },
      newCustomerList: [],
      newArrsCustomer: [],
      newShowArr: [],
      newPersonlTagList: [],
      newPerShowArr: [],
      behaviorTagList: [],

      /**跟进记录数据 */
      recordData: [],
      recordColumn: [
        {
          label: '动态内容',
          minWidth: '150px',
          align: 'center',
          prop: 'content'
        },
        {
          label: '添加时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },

        {
          label: '添加人',
          minWidth: '150px',
          align: 'center',
          prop: 'createBy'
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteRow.bind(this, row)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      recordContent: '',
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      editRecordContent: '',
      editLifeCycleContent: '',
      customerLifeCycle: {
        cycleName: ''
      }
    }
  },

  methods: {
    // 查看聊天记录
    // checkChatHistory() {
    //   this.chatDialog.config.visible = true
    // },
    // 标签页切换
    // handleTabClick(tab) {
    //   this.chatDialog.activeName = tab.name
    // },
    // 修改备注信息
    editRemark() {
      this.remarkForm.remark = this.customerData.remarks
      this.remarkDialog.config.visible = true
    },

    goBack() {
      this.$router.back()
    },
    //编辑信息按钮
    editBtn() {
      console.log(this.models)
      this.editDialog.config.visible = true
    },
    //编辑信息里的确认按钮
    submitEdit() {
      let that = this
      // let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

      // if (that.models.mobile != '') {
      //   if (that.models.mobile.length < 11) {
      //     that.$message.warning('请输入11位数的电话号码')
      //     return
      //   }
      // }
      // if (that.models.email != '') {
      //   if (reg.test(that.models.email) == false) {
      //     that.$message.warning('请输入正确的邮箱')
      //     return
      //   }
      // }
      that.$http.updataCustomerMessage(that.models).then(() => {
        that.$message.success('编辑信息成功')
        that.editDialog.config.visible = false
        that.getCustomerDetails()
      })
    },
    //新增按钮
    addNewsBtn() {
      this.addDialog.config.visible = true
    },
    //新增信息里的确认按钮
    submitAdd() {
      let that = this
      // that.models.externalProfileList.push(that.externalProfileList)
      if (that.externalProfileList.name == '') {
        that.$message.warning('请填写名称')
      } else if (that.externalProfileList.value == '') {
        that.$message.warning('请填写内容')
      } else {
        that.models.externalProfileList.push(that.externalProfileList)
        // console.log(that.models)
        that.$http.updataCustomerMessage(that.models).then(() => {
          that.$message.success('新增信息成功')
          that.getCustomerDetails()
          that.externalProfileList.name = ''
          that.externalProfileList.value = ''
          that.addDialog.config.visible = false
          // console.log(that.models)
        })
      }
    },
    // //限制手机号码输入框
    // mobileInput(e) {},
    //删除按钮删除东西
    deteleRow(row, index) {
      let that = this
      this.$confirm('是否删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // that.showExternal.splice(index, 1)
        that.models.externalProfileList.splice(index, 1)
        console.log(that.models.externalProfileList)
      })
    },
    //关闭客户编辑窗口
    editClose() {
      let that = this
      that.editDialog.config.visible = false
      that.getCustomerDetails()
    },

    //编辑企业标签关闭tag按钮
    closeTagList(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
    },

    //关闭编辑企业标签
    closeTagDialog() {
      this.selectEnterDialog.config.visible = false

      // console.log(this.spanName)
      // console.log(this.spanIndex)
    },
    //获取全部的企业标签列表
    // getTagList() {
    //   let that = this
    //   that.$http.getCustomerTagList().then(res => {
    //     let list = res.data.data.cropList
    //     let newList = []
    //     list.forEach(item => {
    //       newList.push(item)
    //     })
    //     that.tagList = newList
    //   })
    // },
    //编辑客户管理企业标签
    editEnterTag() {
      this.spanIndex = []
      this.spanName = []
      this.zanCunSpanIndex.forEach((item) => {
        this.spanIndex.push(item)
      })
      // let arr = []
      this.selectEnterDialog.config.visible = true
      this.listName.forEach((item) => {
        this.spanName.push(item)
      })
    },
    //编辑客户管理个人标签
    editPersonTag() {
      this.spanPerIndex = []
      this.tagNamePerName = []
      this.zanCunPerIndex.forEach((item) => {
        this.spanPerIndex.push(item)
      })
      this.selectPersonalDialog.config.visible = true
      this.listPerName.forEach((item) => {
        this.tagNamePerName.push(item)
      })
      console.log(this.zanCunPerIndex)
    },
    sumbitPerDialog() {
      let that = this
      let newArr = this.spanPerIndex.join('_')
      let params = {
        customerId: that.customerId,
        personalTagId: newArr
      }
      that.$http.personalSave(params).then(() => {
        that.$message.success('编辑个人企业标签成功')
        that.selectPersonalDialog.config.visible = false
        that.getPersonalList()
      })
    },
    //确定编辑企业标签
    sumbitTagDialog() {
      let that = this
      let newArr = this.spanIndex.join('_')
      let params = {
        tagId: newArr,
        customerId: this.customerId
      }
      that.$http.enterpriseTagList(params).then(() => {
        that.$message.success('编辑企业标签成功')
        that.selectEnterDialog.config.visible = false
        that.getExternallCustomer()
      })

      // console.log(that.newArrsCustomer)
    },
    getExternallCustomer() {
      let that = this
      that.listName = []
      that.zanCunSpanIndex = []
      that.$http.getReCustomerTagList({ customerId: this.customerId }).then((res) => {
        let arr = res.data.data
        that.newArrsCustomer = []
        arr.forEach((item) => {
          that.newShowArr.push(item.tagList)
        })
        for (var i = 0; i < arr.length; i++) {
          let tagList = arr[i].tagList
          for (var j = 0; j < tagList.length; j++) {
            if (tagList[j].isCheck) {
              that.newArrsCustomer.push(tagList[j].name)
              that.listName.push(tagList[j].name)
              that.zanCunSpanIndex.push(tagList[j].id)
            }
          }
        }
      })
    },
    getPersonalList() {
      let that = this
      let list = []
      that.listPerName = []
      that.zanCunPerIndex = []
      that.$http.perosonalList({ customerId: that.customerId }).then((res) => {
        let arr = res.data.data
        that.newPersonlTagList = []
        arr.forEach((item) => {
          list.push({ name: item.name, id: item.id })
          if (item.isCheck == true) {
            that.listPerName.push(item.name)
            that.zanCunPerIndex.push(item.id)
            that.newPersonlTagList.push(item.name)
          }
          that.personList = list
        })
      })
    },
    closePerList(tag, index) {
      let that = this
      that.tagNamePerName.splice(index, 1)
      that.spanPerIndex.splice(index, 1)
    },
    changePerTag(id, name) {
      let arrIndex = this.spanPerIndex.indexOf(id)
      let arrName = this.tagNamePerName.indexOf(name)
      if (arrIndex > -1) {
        this.spanPerIndex.splice(arrIndex, 1)
        this.tagNamePerName.splice(arrName, 1)
      } else {
        this.spanPerIndex.push(id)
        this.tagNamePerName.push(name)
      }
    },
    //点击标签变色
    changeTag(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
      }
      // console.log(this.spanIndex)
    },

    getEnterList() {
      let that = this
      that.$http.getEnterTagList().then((res) => {
        let list = res.data.data
        this.tagNameList = res.data.data
        list.forEach((item) => {
          this.tagList.push(item.tagList)
        })
      })
    },
    getCustomerDetails() {
      let that = this
      let id = that.customerId
      that.$http.getCustomerDetail({ id }).then((res) => {
        that.customerData = res.data.data
        that.models.id = that.customerId
        that.models.corpFullName = that.customerData.corpFullName
        that.models.email = that.customerData.email
        that.models.mobile = that.customerData.mobile
        that.models.remarks = that.customerData.remarks
        that.models.position = that.customerData.position
        that.models.description = that.customerData.description
        that.externalProfileList = that.customerData.externalProfileList
        that.newShowData = that.customerData.externalProfileList
        that.groupName = that.customerData.groupName
        that.behaviorTagList = that.customerData.behaviorTagList
        that.lifeCycleIdList = that.customerData.customerLifeCycle.id
        if (res.data.data.customerLifeCycle.cycleName !== undefined) {
          that.customerLifeCycle.cycleName = res.data.data.customerLifeCycle.cycleName
        }
      })
    },

    /*个人客户*/
    /*标签关闭*/

    closePerDialog() {
      this.selectPersonalDialog.config.visible = false
    },

    //点击添加按钮
    addPersonalTag() {
      this.addPersonalDialog.config.visible = true
    },
    //点击确认按钮
    sumbitAddPerTagDialog() {
      let that = this
      if (that.tagModel.name == '') {
        that.$message.warning('请填写标签名称')
      } else {
        that.$http.personalTagAdd(that.tagModel).then(() => {
          that.$message.success('添加标签成功')
          that.addPersonalDialog.config.visible = false
          that.tagModel.name = ''
          that.getPersonalList()
          that.listPerName = []
          that.zanCunPerIndex = []
          that.tagNamePerName = []
          that.perNameList = []
        })
      }
      this.selectPersonalDialog.config.visible = true
    },
    closePerTagDialog() {
      this.addPersonalDialog.config.visible = false
    },
    //编辑扩展信息
    editExtendBtn() {
      let that = this
      that.eidtExtendlDialog.config.visible = true
    },
    //关闭编辑扩展信息
    closePerExtendDialog() {
      let that = this
      that.eidtExtendlDialog.config.visible = false
      that.getCustomerDetails()
    },
    //保存编辑扩展信息
    sumbitExtend() {
      let that = this
      let nawArr = that.newCustomerList
      let params = {
        id: that.customerId,
        externalProfileList: nawArr
      }
      that.$http.updateNewField(params).then(() => {
        that.$message.success('编辑成功')
        that.eidtExtendlDialog.config.visible = false
        that.getCustomerDetails()
      })
    },
    //新增编辑信息
    addExtendBtn() {
      let that = this
      that.addExtendlDialog.config.visible = true
    },
    closeAddExtendDialog() {
      let that = this
      that.addExtendlDialog.config.visible = false
      that.listExternalProfile = {}
    },
    sumbitAddExtend() {
      let that = this
      that.listExternalProfile.id = that.customerId
      that.$http.getCustomerpRrofile(that.listExternalProfile).then(() => {
        that.$message.success('添加成功')
        that.addExtendlDialog.config.visible = false
        that.getCustomerDetails()
      })
    },
    //获取用户扩展信息列表
    getCustomerExtendMessage() {
      let that = this
      that.$http.showNewField({ id: that.customerId }).then((res) => {
        that.newCustomerList = res.data.data
      })
    },
    relationClick(index) {
      this.nowIndex = index
      if (this.nowIndex === 1) {
        this.getCustomerDetails()
        this.getEnterList()
        this.getPersonalList() //7
        this.getCustomerExtendMessage()
        this.getExternallCustomer()
      }
    },

    //跟进记录
    addRecord() {
      if (this.recordContent == '') {
        this.$message.warning('跟进内容不能为空')
      } else {
        this.$http.addCustomerRecord({ content: this.recordContent, customerId: this.customerId }).then(() => {
          this.$message.success('添加跟进内容成功')
          this.recordContent = ''
          this.getRecordList()
        })
      }
    },
    getRecordList() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        customerId: this.customerId
      }
      this.$http.getCustomerRecordList(params).then((res) => {
        this.recordData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getRecordList()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getRecordList()
    },
    showEditDialog(row) {
      this.model = {}
      this.model = row
      this.editRecordContent = this.model.content
      this.editRecordDialog.config.visible = true
      console.log(this.model)
    },
    deleteRow(row) {
      let id = row.id
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deteleCustomerRecord({ id }).then(() => {
          this.$message.success('删除成功')
          this.getRecordList()
        })
      })
    },
    submitEditRecord() {
      this.model.content = this.editRecordContent
      this.$http.updateCustomerRecord(this.model, this.customerId).then(() => {
        this.$message.success('修改成功')
        this.editRecordDialog.config.visible = false
        this.getRecordList()
        this.model = {}
      })
    },
    //打开编辑客户生命周期标签
    openEditLifeCycle() {
      this.editLifeCycleContent = ''
      this.editLifeCycleContent = this.customerLifeCycle.cycleName
      this.editCustomerLifeCycleDialog.config.visible = true
    },
    submitEditCustomerLife() {
      if (this.lifeCycleIdList == '') {
        this.$message.warning('生命周期不可为空')
        return
      }
      let params = {
        customerId: this.customerId,
        customerLifeCycleId: this.lifeCycleIdList
      }
      this.$http.addLifeCycle(params).then(() => {
        this.$message.success('修改成功')
        this.editCustomerLifeCycleDialog.config.visible = false
        this.getCustomerDetails()
      })
    },
    getCustomerLifeCyle() {
      this.$http.getCustomerLifeCyle().then((res) => {
        let list = res.data.data.list
        list.forEach((item) => {
          this.customerLifeCycleList.push({ id: item.id, cycleName: item.cycleName })
        })
      })
    }
    // customerGuanTagList() {
    //   this.$http.customerGuanTagList({ customerId: this.customerId }).then(res => {
    //     console.log(res)
    //   })
    // }
  },
  created() {
    this.customerId = this.$route.query.id
    this.getCustomerDetails()
    this.getEnterList()
    this.getPersonalList()
    this.getCustomerExtendMessage()
    this.getExternallCustomer()
    this.getRecordList()
    this.getCustomerLifeCyle()
    // this.customerGuanTagList()
  },
  filters: {
    cropUserListFilter(option) {
      if (!option) {
        return ''
      }
      let cropUserListStr = ''
      option.forEach((item) => {
        cropUserListStr = cropUserListStr + ' ' + item.name
      })
      return cropUserListStr
    }
  }
}
</script>

<style lang="scss" scoped>
.header_nav {
  margin-bottom: 20px;
}
.customer-detail {
  width: 100%;
  // height: 100%;
  position: relative;
  margin-bottom: 20px;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.title-bar {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #303133;
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 20px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: 0px;
  }
  .el-button {
    float: right;
  }
}
.content {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.customer-digest {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 40px;
  .image-text {
    display: flex;
    .left-info {
      margin-left: 10px;
      .info-name {
        font-size: 18px;
        color: #909399;
        line-height: 28px;
      }
      .info-live {
        margin-top: 15px;
        // border: 1px solid red;
        font-size: 14px;
        color: #7f7f7f;
      }
      .info-desc {
        font-size: 16px;
        color: #ffa500;
        line-height: 24px;
      }
    }
  }
}
.customer-info {
  display: flex;
  align-items: center;
  max-width: 1000px;
  font-size: 14px;
  color: #909399;
  flex-flow: wrap;
  .info-item {
    height: 100%;
    // border: 1px solid red;
    min-width: 300px;
    margin-bottom: 30px;
    margin-right: 20px;
    .el-icon-edit-outline {
      margin-left: 10px;
      color: #1e90ff;
      cursor: pointer;
    }
    .info-itemtag {
      // border: 1px solid red;
      display: inline-block;
      color: #333333;
      background-color: #f2f2f2;
      padding: 5px 20px;
      border-radius: 20px;
      margin-right: 10px;
      margin-bottom: 10px;
      font-size: 13px;
      cursor: pointer;
    }
  }
  .company_item {
    margin-bottom: 20px;
  }
}
.eidt-btn {
  .el-button {
    color: #294a7b;
  }
}
.chat-content {
  height: 400px;
  padding: 0 20px;
  box-sizing: border-box;
}
.tag-info {
  flex-direction: column;
  align-items: unset;
}
.search-btn {
  display: flex;
  justify-content: center;
}
.tabs {
  width: 100%;
  display: flex;
  margin: 10px 0;
  box-sizing: border-box;
  border-bottom: 2px solid #ebeef5;
  .tab-item {
    width: 150px;
    padding: 10px;
    font-size: 14px;
    color: #303133;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 2px solid #ebeef5;
    margin-bottom: -2px;
    cursor: pointer;
  }
  .active {
    color: #294a7b;
    border-bottom: 2px solid #294a7b;
  }
}
.chat-list {
  .chat-item {
    display: flex;
    padding: 10px 0 20px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
    .item-content {
      margin-left: 10px;
      width: 100%;
      .digest {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #909399;
      }
      .dialogue {
        padding: 5px 10px 10px 10px;
        box-sizing: border-box;
        color: #303133;
        font-size: 14px;
        line-height: 24px;
      }
      .customer-dialogue {
        text-align: right;
      }
    }
    .customer-item-content {
      margin-right: 10px;
      margin-left: 0;
    }
  }
}
.remark-content {
  width: 100%;
  height: 200px;
  padding: 10px 20px;
  box-sizing: border-box;
  .remark-input {
    display: flex;
    white-space: nowrap;
    align-items: center;
  }
}
.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 30px auto;
  border-radius: 3px;
  cursor: pointer;
}
.iconMinu {
  font-size: 17px;
  color: #d36b5d;
  background-color: #cdcdcd;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
}
.edit-tag {
  display: inline;
  color: #294a7b;
  padding: 5px 20px;
  border: 1px solid #cccccc;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 13px;
  cursor: pointer;
}
.dialogSelect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
    border: 1px solid #dcdfe6;
    margin-bottom: 10px;
    min-height: 43px;
    line-height: 43px;
    padding: 5px 0;
    border-radius: 5px;
    .leftTitle {
      display: inline;
      span {
        display: inline-block;
        margin-top: 5px;
        // border: 1px solid red;
      }
    }
    .rightTags {
      display: inline;

      .el-tag {
        margin-left: 10px;
        margin-top: 5px;
      }
    }
  }
}
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;

    font-size: 14px;
  }
}
.tagChange {
  // border: 1px solid #ccc;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  div {
    font-size: 12px;
    margin: 10px 10px 10px 0;
    padding: 8px 20px;
    background-color: #f4f4f5;
    color: #909399;
    border-radius: 5px;
    display: inline-block;
    border-color: #e9e9eb;
    cursor: pointer;
  }
}
.tagGroupTitle {
  padding: 14px 0;
  position: relative;
  padding-left: 16px;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 14px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: 0;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.tagIndex {
  border: 1px solid #e9e9eb;
  color: #294a7b !important;
  background-color: #ffffff !important;
}
.edit-text {
  font-size: 14px;
  color: #909399;
  margin-top: 50px;
}
.groupName {
  margin-right: 5px;
}
.checked {
  color: #294a7b !important;
  font-size: 16px !important;
  border-bottom: 2px solid #294a7b;
  padding-bottom: 20px;
  font-weight: bold;
}
.customer-title {
  background-color: #fff;
  border-bottom: 2px solid #ebeef5;
}
.record_input {
  width: 600px;
}

.el-textarea__inner {
  height: 150px;
  overflow-y: auto;
  /* overflow-y: auto;兼容ie  */
}
.record-button {
  margin-left: 70px;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  padding-bottom: 10px;
}
.record-table {
  max-height: 550px;
  box-sizing: border-box;
  overflow-y: auto;
}
.editRecordCom {
  height: 500px !important;
}
.edit-recordbtn {
  margin: 0 auto;
}
.textarea-input {
  width: 405px;
  ::v-deep .el-textarea__inner {
    padding-bottom: 20px;
  }
  ::v-deep .el-input__count {
    width: calc(100% - 2px);
    bottom: 1px;
    height: 20px;
    line-height: 20px;
    text-align: right;
    left: 1px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.select-div-dispose {
  height: 500px;
  overflow-y: auto;
}

.deit-icon {
  margin-left: 5px;
  // border: 1px solid red;
  color: #294a7b;
  font-size: 16px;
  cursor: pointer;
  // margin-top: 40px;
  // bottom: 0;
}
.submit-btn-edit-sumbit {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 70px auto;
  border-radius: 3px;
  cursor: pointer;
}
.remark-content-edit {
  width: 100%;
  height: 200px;
  box-sizing: border-box;
}
.sumbit-form-item {
  padding-top: 50px;
}
.customer_title {
  .tab_bar {
    display: flex;
    .title_div {
      .title_name {
        cursor: pointer;
        width: 120px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        background-color: #ebeef5;
        font-size: 14px;
        &.isActive {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
