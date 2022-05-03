<template>
  <div>
    <custom-header title="部门日程"></custom-header>
    <div class="margin-se" :hidden="!showDepSchedule">
      <div class="margin-se">
        <el-form
          :inline="true"
          class="demo-form-inline"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="选择机构:">
            <el-select
              v-model="branch"
              placeholder="请选择机构"
              size="small"
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
          <el-form-item label="选择部门:">
            <el-select
              v-model="department"
              placeholder="请选择部门"
              size="small"
            >
              <el-option
                v-for="item in filterDepOptions"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名:">
            <el-input
              v-model="name"
              placeholder="请输入姓名"
              size="small"
              class="name-input"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          :inline="true"
          class="demo-form-inline"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="日期:">
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              size="small"
              value-format="yyyy-MM-dd"
              style="width: 190px"
              @change="onDateChange"
            >
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              :disabled="!date"
              @click="onSearch"
            >
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            {{ date }}
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="searchResult"
        border
        style="width: 100%"
        :hidden="searchResult.length == 0"
        @cell-click="onTableCellClick"
        @cell-mouse-enter="onTableCellMouseEnter"
      >
        <el-table-column
          v-for="item in nearlyDays"
          :key="item.value"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </div>
    <edit-schedule
      ref="editSchedule"
      :hidden="showDepSchedule"
      :username="'系统管理员'"
      @quit="onQuit"
    />
  </div>
</template>

<script>
  import EditSchedule from '../edit-schedule/EditSchedule.vue'
  import { findAll as findBranch } from '@/api/branch'
  import { findAll as findDepartment } from '@/api/department'
  import { searchDepSchedule } from '@/api/schedule'
  import CustomHeader from '../../custom-header'
  export default {
    components: { EditSchedule, CustomHeader },
    data() {
      return {
        branch: '',
        department: '',
        name: '',
        date: '',
        showDepSchedule: true,
        nearlyDays: [
          { value: '1', prop: 'name', label: '人员姓名' },
          { value: '2', prop: '', label: '星期日' },
          { value: '3', prop: '', label: '星期一' },
          { value: '4', prop: '', label: '星期二' },
          { value: '5', prop: '', label: '星期三' },
          { value: '6', prop: '', label: '星期四' },
          { value: '7', prop: '', label: '星期五' },
          { value: '8', prop: '', label: '星期六' },
        ],
        branchOptions: [],
        orgDepOptions: [],
        filterDepOptions: [],
        searchResult: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        const { data: branchOptions } = await findBranch()
        this.branchOptions = branchOptions
        const { data: orgDepOptions } = await findDepartment()
        this.orgDepOptions = orgDepOptions
      },
      onBranchChange() {
        this.filterDepOptions = []
        for (const item of this.orgDepOptions) {
          if (this.branch == item.branchId) {
            this.filterDepOptions.push(item)
          }
        }
      },
      getWeek(day) {
        // 一天里一共的毫秒数
        const weekNames = [
          '星期日',
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六',
        ]
        let oneDayTime = 1000 * 60 * 60 * 24
        let today = new Date(day)
        let todayDay = today.getDay()
        // 计算本周一毫秒数
        let startDate = today.getTime() - oneDayTime * todayDay
        let dateList = []
        for (let i = 0; i < 7; i++) {
          let temp = new Date(startDate + i * oneDayTime)
          let year = temp.getFullYear()
          let month = temp.getMonth() + 1
          let day = temp.getDate()
          dateList[i] = {
            label: `${weekNames[i]} ${day}`,
            prop: `${year}-${month}-${day}`,
          }
        }
        return dateList
      },
      async onSearch() {
        const week = this.getWeek(this.date)
        for (let i = 1; i < this.nearlyDays.length; i++) {
          let item = this.nearlyDays[i]
          item.label = week[i - 1].label
          item.prop = week[i - 1].prop
        }
        const { data: searchResult } = await searchDepSchedule()
        this.searchResult = searchResult
      },
      onDateChange(value) {
        if (!value) this.searchResult = []
      },
      onTableCellClick(row, column, cell, event) {
        if (cell.innerText) {
          this.showDepSchedule = false
          this.$refs.editSchedule.savedisabled = true
          this.$refs.editSchedule.setContent(this.searchResult[0].item)
        }
      },
      onTableCellMouseEnter(row, column, cell, event) {
        if (cell.innerText) cell.style.cursor = 'pointer'
      },
      onQuit() {
        this.showDepSchedule = true
      },
    },
  }
</script>

<style scoped>
  .margin-se {
    margin: 10px 35px;
    font-size: 14px;
  }
  .name-input {
    width: 120px;
  }
  .el-row,
  .el-table {
    margin-top: 10px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .bg-purple-dark {
    background: #99a9bf;
    text-align: center;
    line-height: 36px;
  }
  .el-form-item {
    margin-right: 40px !important;
  }
</style>
