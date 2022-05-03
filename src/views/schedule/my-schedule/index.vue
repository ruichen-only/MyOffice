<template>
  <div>
    <custom-header title="个人日程管理"></custom-header>
    <el-calendar v-model="value" :lunarcalendar="true" :hidden="!showCalendar">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="date-cell">
          <div class="date-content">
            <div>{{ data.day.split('-')[2] }}</div>
            <div
              class="btn-add-schedule"
              title="新增个人日程"
              @click="addSchedule(data.day)"
            >
              <svg-icon icon-class="add-schedule"></svg-icon>
            </div>
          </div>
          <div class="date-lunar">
            {{ solarToLunar(date, data) }}
          </div>
          <el-popover placement="right" width="200" trigger="hover">
            <div
              v-for="(item, index) in seen(data.day).data"
              :key="index"
              style="cursor: pointer"
              @click="editSchedule(item.schData)"
            >
              {{ item.text }}
            </div>
            <div
              v-show="seen(data.day).shown"
              slot="reference"
              class="date-schedule"
              @click="editSchedule(seen(data.day).data[0].schData)"
            >
              {{ seen(data.day).text }}
            </div>
          </el-popover>
        </div>
      </template>
    </el-calendar>
    <edit-schedule
      ref="editSchedule"
      :hidden="showCalendar"
      @quit="onQuit"
      @quit-and-save="onQuitAndSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
  import calendar from '@/utils/calendar'
  import { findAll } from '@/api/schedule'
  import { parseTime } from '@/utils/index.js'
  import EditSchedule from '../edit-schedule/EditSchedule.vue'
  import CustomHeader from '../../custom-header'
  export default {
    components: { EditSchedule, CustomHeader },
    data() {
      return {
        showCalendar: true,
        value: new Date(),
        scheduleData: [],
      }
    },
    created() {
      this.initSchedules()
    },
    methods: {
      async initSchedules() {
        const { data } = await findAll()
        this.scheduleData = data
      },
      // 公历转农历
      solarToLunar(_slotDate, slotData) {
        let solarDayArr = slotData.day.split('-')
        let lunarDay = calendar.solar2lunar(
          solarDayArr[0],
          solarDayArr[1],
          solarDayArr[2]
        )
        // 农历日期
        let lunarMD = lunarDay.IMonthCn + lunarDay.IDayCn

        // 公历节日\农历节日\农历节气
        let festAndTerm = []
        festAndTerm.push(
          lunarDay.festival == null ? '' : ' ' + lunarDay.festival
        )
        festAndTerm.push(
          lunarDay.lunarFestival == null ? '' : '' + lunarDay.lunarFestival
        )
        festAndTerm.push(lunarDay.Term == null ? '' : '' + lunarDay.Term)
        festAndTerm = festAndTerm.join('')

        return festAndTerm == '' ? lunarMD : festAndTerm
      },
      addSchedule(day) {
        this.showCalendar = false
        this.$refs.editSchedule.setContent({
          createTime: parseTime(new Date()),
          createUser: '陈睿睿', //取得当前登录用户
          timeRanges: [day + ' 12:00:00', day + ' 13:00:00'],
        })
        this.$refs.editSchedule.deletedisabled = true
      },
      editSchedule(schData) {
        this.showCalendar = false
        this.$refs.editSchedule.setContent(schData)
        this.$refs.editSchedule.deletedisabled = false
      },
      onQuit() {
        this.showCalendar = true
      },
      onQuitAndSave() {
        this.showCalendar = true
        this.initSchedules()
      },
      /**
       * 取得显示在日历上的日程简略信息
       */
      getShowSchText(title, beginTime) {
        let text = '◎ '
        text += parseTime(new Date(beginTime), '{h}:{i}')
        text += ' ' + title.substring(0, 3)

        if (title.length > 3) text += '...'

        return text
      },
      onDelete() {
        this.showCalendar = true
      },
      /**
       * 判断当前时间是否存在日程，并取得显示在日历上的日程简略信息
       */
      seen(currentDate) {
        const result = { shown: false }

        const dayArr = currentDate.split('-')
        const year = dayArr[0]
        const month = dayArr[1]
        const day = dayArr[2]
        for (const data of this.scheduleData) {
          const date = new Date(data.timeRanges[0])
          if (
            date.getFullYear() == year &&
            date.getMonth() + 1 == month &&
            date.getDate() == day
          ) {
            result.shown = true
            const text = this.getShowSchText(data.title, data.timeRanges[0])
            result.text = text
            const schInfo = {
              text,
              schData: data,
            }
            result.data ? result.data.push(schInfo) : (result.data = [schInfo])
          }
        }
        return result
      },
    },
  }
</script>

<style scoped>
  .date-cell {
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }
  .date-content {
    display: flex;
    font-size: 13px;
  }
  .btn-add-schedule {
    margin-left: 15px;
  }
  .date-lunar,
  .date-schedule {
    margin-top: 10px;
  }
</style>
