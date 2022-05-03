<template>
  <div style="font-size: 14px">
    <custom-header title="考勤统计"></custom-header>
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
      <el-form inline>
        <el-form-item label="机构:">
          <el-select
            v-model="formInline.branch"
            placeholder="请选择机构"
            size="mini"
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
          >
            <el-option
              v-for="item in filterDepOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onStatistic">
            统计
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" disabled>
            导入Excel打印
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="statisticData"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="userName"
          label="姓名"
          align="center"
        ></el-table-column>
        <el-table-column prop="attendance" label="出勤率(%)" align="center">
          <template slot-scope="scope">
            {{
              parseInt((scope.row.absenteeismTime / scope.row.total) * 100) /
                100 +
              '%'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lateTimes"
          label="迟到次数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="earlyLeaveTimes"
          label="早退次数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="absenteeismTime"
          label="旷工次数"
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
  import { getNearlyWeek, getNearlyMonth } from '@/utils/index'
  import { findAll as findBranch } from '@/api/branch'
  import { findAll as findDepartment } from '@/api/department'
  import { search } from '@/api/manual-sign'

  const STARTING_TIME = '8:30'
  const FINISHING_TIME = '17:30'

  export default {
    components: { CustomHeader },
    data() {
      return {
        timeRadio: 3,
        timeRanges: [new Date(), new Date()],
        branchOptions: [],
        orgDepOptions: [],
        filterDepOptions: [],
        formInline: {
          branch: '',
          department: '',
        },
        statisticData: [],
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
      async onStatistic() {
        let result = {}

        const days = this.getWeekDays(this.timeRanges[0], this.timeRanges[1])
        const { data } = await search() //TODO 检索条件
        for (const item of data) {
          const userId = item.userId
          const info = result[userId]
          if (!info) {
            result[userId] = info = {
              lateTimes: 0,
              earlyLeaveTimes: 0,
              total: days,
              absenteeismTime: days,
              presentTime: new Set(),
            }
            result[userId] = Object.assign(result[userId], item)
          }
          const signTime = new Date(item.signTime)
          const signTag = item.signTag
          if (
            signTag == '签到' &&
            (signTime.getHours() > 8 ||
              (signTime.getHours() == 8 && signTime.getMinutes() > 30))
          ) {
            info.lateTimes++
          }
          if (
            signTag == '签退' &&
            (signTime.getHours() < 17 ||
              (signTime.getHours() == 17 && signTime.getMinutes() < 30))
          ) {
            info.earlyLeaveTimes++
          }
          const presentTime = info.presentTime
          const day = parseInt(signTime.getTime() / 1000 / 60 / 60 / 24)
          if (!presentTime.has(day)) {
            presentTime.add(day)
            info.absenteeismTime -= 1
          }
          presentTime.add(parseInt(signTime.getTime() / 1000 / 60 / 60 / 24))
        }
        this.statisticData = Object.values(result)
      },
      getWeekDays(start, end) {
        let days = 0

        const startDate = new Date(start)
        const endDate = new Date(end)
        for (
          let i = startDate.getTime();
          i <= endDate.getTime();
          i += 24 * 60 * 60 * 1000
        ) {
          const today = new Date(i)
          const day = today.getDay()
          if (day >= 1 && day <= 5) {
            days++
          }
        }
        return days
      },
    },
  }
</script>

<style></style>
