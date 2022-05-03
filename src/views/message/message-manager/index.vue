<template>
  <div>
    <custom-header title="消息管理"></custom-header>
    <div
      v-if="!editAreaVisable"
      class="message-container message-show-container"
    >
      <label>请输入填写消息的时间--</label>
      <div>
        <el-date-picker
          v-model="timeRanges"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          @focus="timeRadio = ''"
        ></el-date-picker>
        <el-radio-group
          v-model="timeRadio"
          style="margin-left: 90px"
          @change="onRadioChange"
        >
          <el-radio :label="3">本日</el-radio>
          <el-radio :label="6">本周</el-radio>
          <el-radio :label="9">本月</el-radio>
        </el-radio-group>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          style="margin-left: 20px"
          @click="onSearch"
        >
          搜索
        </el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <div class="new-message-container" @click="onNewMessage">
              <svg-icon icon-class="new-message"></svg-icon>
              添加新消息
            </div>
          </div>
        </el-col>
      </el-row>
      <el-table
        border
        max-height="550"
        style="width: 100%"
        :data="searchResult"
        :hidden="searchResult.length == 0"
        @cell-click="handleCellClick"
      >
        <el-table-column
          v-for="item in tableHeader"
          :key="item.value"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="发布" width="70">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.ifPublish == 1"
            >
              发布
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="显示消息内容" :visible.sync="dialogVisible" width="30%">
      <span>{{ content }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          关闭
        </el-button>
      </span>
    </el-dialog>
    <div v-if="editAreaVisable" class="message-container">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        style="margin: 20px 0"
      >
        <el-form-item label="消息标题:">
          <el-input
            v-model="form.title"
            size="small"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="消息类型:">
          <el-select v-model="form.type" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效时间:">
          <el-date-picker
            v-model="form.validTimeRanges"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发送对象:">
          <el-radio-group v-model="sendUserRadio" :disabled="isEdit">
            <el-radio label="all">所有人</el-radio>
            <el-radio label="special">选择特定对象</el-radio>
          </el-radio-group>
          <div
            v-if="!isEdit && sendUserRadio == 'special'"
            class="filter-range"
          >
            <i class="el-icon-search"></i>
            筛选范围:
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="按机构"></el-checkbox>
              <el-checkbox label="按部门"></el-checkbox>
              <el-checkbox label="按员工号"></el-checkbox>
              <el-checkbox label="按姓名"></el-checkbox>
            </el-checkbox-group>
            <el-form :inline="true" :model="formInline">
              <el-form-item label="机构:">
                <el-select
                  v-model="formInline.branch"
                  placeholder="请选择机构"
                  size="mini"
                  :disabled="
                    !checkList.some(
                      (item) => item == '按机构' || item == '按部门'
                    )
                  "
                  @change="onBranchChange"
                >
                  <el-option
                    v-for="item in branchOptions"
                    :key="item.branchId"
                    :label="item.branchName"
                    :value="item.branchId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门:">
                <el-select
                  v-model="formInline.department"
                  placeholder="请选择部门"
                  size="mini"
                  :disabled="!checkList.some((item) => item == '按部门')"
                  @change="onDepChange"
                >
                  <el-option
                    v-for="item in filterDepOptions"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="员工号:">
                <el-input
                  v-model="formInline.depNo"
                  size="mini"
                  :disabled="!checkList.some((item) => item == '按员工号')"
                  @change="onDepNoChange"
                ></el-input>
              </el-form-item>
              <el-form-item label="姓名:">
                <el-select
                  v-model="formInline.name"
                  filterable
                  clearable
                  allow-create
                  size="mini"
                  :disabled="!checkList.some((item) => item == '按姓名')"
                  @change="filterNameOptions"
                >
                  <el-option
                    v-for="item in nameOptions"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="onUserSearch">
                  确定选择范围
                </el-button>
              </el-form-item>
            </el-form>
            请选择发送对象
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="checkedNames"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="user in nameOptions"
                :key="user.userId"
                :label="user.name"
              >
                {{ user.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="消息内容:">
          <el-input
            v-model="form.messageContent"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
          >
            >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSave">保存消息</el-button>
          <el-button @click="onReturn">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import CustomHeader from '../../custom-header'
  import { search, findUser, deleteById } from '@/api/message'
  import { findAll } from '@/api/message-type'
  import { findAll as findBranch } from '@/api/branch'
  import { findAll as findDepartment } from '@/api/department'
  import { getNearlyWeek, getNearlyMonth } from '@/utils/index'
  export default {
    components: { CustomHeader },
    data() {
      return {
        content: '',
        isEdit: false,
        editAreaVisable: false,
        timeRanges: [new Date(), new Date()],
        timeRadio: 3,
        sendUserRadio: 'special',
        searchResult: [],
        options: [],
        checkList: ['按姓名'],
        dialogVisible: false,
        isIndeterminate: true,
        checkedNames: [],
        checkAll: false,
        form: {
          title: '',
          type: '',
          validTimeRanges: [new Date(), new Date()],
          messageContent: '',
        },
        branchOptions: [],
        orgDepOptions: [],
        filterDepOptions: [],
        nameOptions: [],
        formInline: {
          branch: '',
          department: '',
          depNo: '',
          name: '',
        },
        tableHeader: [
          { value: '1', prop: 'title', label: '消息标题' },
          { value: '2', prop: 'type', label: '消息类型' },
          { value: '3', prop: 'brief', label: '消息内容' },
          { value: '4', prop: 'fromUser', label: '创建者' },
          { value: '5', prop: 'toUser', label: '发送对象' },
          { value: '6', prop: 'beginTime', label: '开始时间' },
          { value: '7', prop: 'endTime', label: '结束时间' },
          { value: '8', prop: 'createTime', label: '创建时间' },
        ],
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        const { data } = await findAll()
        this.options = data
        const { data: branchOptions } = await findBranch()
        this.branchOptions = branchOptions
        const { data: orgDepOptions } = await findDepartment()
        this.orgDepOptions = orgDepOptions

        this.filterNameOptions()
      },
      onBranchChange() {
        this.filterDepOptions = []
        for (const item of this.orgDepOptions) {
          if (this.formInline.branch == item.branchId) {
            this.filterDepOptions.push(item)
          }
        }
        this.filterNameOptions()
      },
      onDepChange() {
        this.filterNameOptions()
      },
      onDepNoChange() {
        this.filterNameOptions()
      },
      async filterNameOptions() {
        this.nameOptions = []
        const { data } = await findUser({ name: this.formInline.name })
        this.nameOptions = data
      },
      onRadioChange(label) {
        const today = new Date()
        switch (label) {
          case 3:
            this.timeRanges = [today, today]
            break
          case 6:
            this.timeRanges = getNearlyWeek(today)
            break
          case 9:
            this.timeRanges = getNearlyMonth(today)
            break
        }
      },
      async onSearch() {
        this.searchResult = []

        const { data } = await search()
        for (const item of data) {
          const row = Object.assign({}, item)
          row.brief =
            item.content.length > 7
              ? item.content.substring(0, 7) + '...'
              : item.content
          this.searchResult.push(row)
        }
      },
      handleEdit(row) {
        this.isEdit = true
        this.editAreaVisable = true
        this.form.title = row.title
        this.form.type = row.type == '一般消息' ? 'common' : 'emergency'
        this.form.validTimeRanges = [
          new Date(row.beginTime),
          new Date(row.endTime),
        ]
        this.form.messageContent = row.content
      },
      async handleDelete(row) {
        const { msg } = await deleteById([row.messageId])
        this.$message({ message: msg, type: 'success' })

        this.onSearch()
      },
      handleCellClick(row, column, cell, event) {
        if (column.property == 'brief') {
          this.dialogVisible = true
          this.content = row.content
        }
      },
      onNewMessage() {
        this.editAreaVisable = true
        this.isEdit = false
      },
      onSave() {
        //TODO 调用保存API
        this.isEdit
          ? this.$message.success('消息更新成功')
          : this.$message.success('消息创建成功')

        this.$refs.form.resetFields()
        this.editAreaVisable = false
      },
      onReturn() {
        this.$refs.form.resetFields()
        this.editAreaVisable = false
      },
      onUserSearch() {
        this.filterNameOptions()
      },
      handleCheckAllChange(val) {
        this.checkedNames = val
          ? this.nameOptions.map((item) => {
              return item.name
            })
          : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.nameOptions.length
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.nameOptions.length
      },
    },
  }
</script>

<style scoped>
  .message-container {
    display: flex;
    flex-direction: column;
    margin: 10px 35px;
    color: #606266;
  }
  .message-show-container .el-range-editor--small.el-input__inner {
    margin: 15px 0 !important;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    margin-right: 0;
  }
  .bg-purple-dark {
    background: #99a9bf;
    text-align: center;
    line-height: 36px;
  }
  .new-message-container {
    float: right;
    margin-right: 10px;
    cursor: pointer;
  }
  .filter-range {
    background-color: blanchedalmond;
    border-radius: 5px;
    padding: 0 10px;
  }
</style>
