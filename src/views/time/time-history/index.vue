<template>
  <div style="font-size: 14px">
    <custom-header title="员工考勤历史记录查询"></custom-header>
    <div style="margin: 10px 35px">
      <div>
        <label style="margin-right: 20px">请输入时间段--</label>
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
      </div>
      <el-divider></el-divider>
      <div style="display: flex">
        <i class="el-icon-search"></i>
        查找范围:
        <el-checkbox-group v-model="checkList" style="margin-left: 20px">
          <el-checkbox label="按机构"></el-checkbox>
          <el-checkbox label="按部门"></el-checkbox>
          <el-checkbox label="按员工号"></el-checkbox>
          <el-checkbox label="按姓名"></el-checkbox>
        </el-checkbox-group>
      </div>
      <el-divider></el-divider>
      <el-form inline>
        <el-form-item label="机构:">
          <el-select
            v-model="formInline.branch"
            placeholder="请选择机构"
            size="mini"
            :disabled="
              !checkList.some((item) => item == '按机构' || item == '按部门')
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
            placeholder="请输入员工号"
            size="mini"
            :disabled="!checkList.some((item) => item == '按员工号')"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input
            v-model="formInline.name"
            size="mini"
            placeholder="模糊查找 eg:李"
            :disabled="!checkList.some((item) => item == '按姓名')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="search-button">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="onSearch"
        >
          搜索
        </el-button>
      </div>
      <el-table
        :data="signHistory"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="userName"
          label="签到员工"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="signTime"
          label="签卡时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="signTag"
          label="签卡标记"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="signDesc"
          label="签卡备注"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="department"
          label="所属部门"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="branch"
          label="所属机构"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import CustomHeader from '../../custom-header'
  import { findAll as findBranch } from '@/api/branch'
  import { findAll as findDepartment } from '@/api/department'
  import { search } from '@/api/manual-sign'
  import { getNearlyWeek, getNearlyMonth } from '@/utils/index'

  export default {
    components: { CustomHeader },
    data() {
      return {
        timeRadio: 3,
        timeRanges: [new Date(), new Date()],
        checkList: [],
        branchOptions: [],
        orgDepOptions: [],
        filterDepOptions: [],
        formInline: {
          branch: '',
          department: '',
          depNo: '',
          name: '',
        },
        signHistory: [],
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
      onBranchChange() {
        this.filterDepOptions = []
        for (const item of this.orgDepOptions) {
          if (this.formInline.branch == item.branchId) {
            this.filterDepOptions.push(item)
          }
        }
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 4 || columnIndex === 5) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1,
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            }
          }
        }
      },
      async onSearch() {
        const { data } = await search()
        this.signHistory = data
      },
    },
  }
</script>

<style scoped>
  .search-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-input {
    width: 120px;
  }
</style>
