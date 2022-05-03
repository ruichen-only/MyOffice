<template>
  <div class="add-schedule-container">
    <div>
      <el-button type="primary" class="schedule-header">我的日程安排</el-button>
    </div>
    <el-divider></el-divider>
    <el-form
      ref="scheduleForm"
      :model="scheduleForm"
      label-address="left"
      label-width="100px"
      :rules="rules"
      class="schedule-body"
    >
      <el-form-item label="主题:" prop="title">
        <el-input
          v-model="scheduleForm.title"
          placeholder="请输入主题"
        ></el-input>
      </el-form-item>
      <el-form-item label="地点:" prop="address">
        <el-input
          v-model="scheduleForm.address"
          placeholder="请输入地点"
        ></el-input>
      </el-form-item>
      <el-form-item label="会议类型:" prop="meetingId">
        <el-select v-model="scheduleForm.meetingId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间:" prop="timeRanges">
        <el-time-picker
          v-model="scheduleForm.timeRanges"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
      </el-form-item>
      <el-input
        v-model="scheduleForm.schContent"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请输入内容"
      ></el-input>
      <el-cascader
        ref="users"
        separator="-"
        placeholder="预约他人"
        :options="userData"
        :props="{
          multiple: true,
          expandTrigger: 'hover',
        }"
        class="schedule-book"
        clearable
      ></el-cascader>
      <div class="schedule-description">
        <div>选项:</div>
        <el-checkbox v-model="scheduleForm.ifPrivate">是否公开</el-checkbox>
        <div>{{ '创建者:' + scheduleForm.createUser }}</div>
        <div>
          {{ '创建日期:' + scheduleForm.createTime }}
        </div>
      </div>
    </el-form>
    <div class="schedule-footer">
      <el-button type="primary" :disabled="savedisabled" @click="quitAndSave">
        保存退出
      </el-button>
      <el-button type="primary" :disabled="deletedisabled" @click="delSchedule">
        删除
      </el-button>
      <el-button type="primary" @click="quit">退出</el-button>
    </div>
  </div>
</template>

<script>
  import { updateById, deleteById, create } from '@/api/schedule'
  import { findAll as findMeetingInfo } from '@/api/meeting-info'
  import { findAll as findPrecontract } from '@/api/precontract'
  export default {
    data() {
      return {
        savedisabled: false,
        deletedisabled: true,
        createUser: '',
        scheduleForm: {
          ifPrivate: true,
          title: '',
          address: '',
          meetingId: '',
          schContent: '',
        },
        rules: {
          title: [{ required: true, message: '请输入主题', trigger: 'change' }],
          address: [
            { required: true, message: '请输入地点', trigger: 'change' },
          ],
          meetingId: [
            { required: true, message: '请选择会议类型', trigger: 'change' },
          ],
          timeRanges: [
            { required: true, message: '请设置起止时间', trigger: 'change' },
          ],
        },
        options: [],
        userData: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.initMeetingInfo()
        this.initPrecontract()
      },
      async initMeetingInfo() {
        const { data } = await findMeetingInfo()
        this.options = data
      },
      async initPrecontract() {
        const { data } = await findPrecontract()
        this.userData = data
      },
      setContent(content) {
        this.$refs.scheduleForm.resetFields()
        this.scheduleForm = Object.assign({}, content)
        this.scheduleForm.ifPrivate = content.ifPrivate == 1
      },
      quitAndSave() {
        this.$refs.scheduleForm.validate(async (valid) => {
          if (valid) {
            const data = this.save()
            const { msg } = this.deletedisabled
              ? await create(data)
              : await updateById(data)
            this.$message({
              message: msg,
              type: 'success',
            })
            this.$emit('quit-and-save', data)
            this.$refs.scheduleForm.resetFields()
          } else {
            return false
          }
        })
      },
      save() {
        return Object.assign({}, this.scheduleForm, {
          users: this.$refs.users.getCheckedNodes(),
          ifPrivate: this.scheduleForm.ifPrivate ? 1 : 0,
        })
      },
      quit() {
        this.$emit('quit')
      },
      async delSchedule() {
        const { msg } = await deleteById(this.scheduleForm.scheduleId)
        this.$message({
          message: msg,
          type: 'success',
        })
        this.$refs.scheduleForm.resetFields()
        this.$emit('delete')
      },
    },
  }
</script>

<style scoped>
  .add-schedule-container {
    font-size: 14px;
  }
  .schedule-header {
    margin: 14px 0 0 10px;
  }
  .schedule-body {
    margin: 0 60px;
  }
  .schedule-book {
    width: 300px;
    margin-top: 15px;
  }
  .schedule-description {
    margin-top: 15px;
    display: flex;
  }
  .schedule-footer {
    margin: 15px;
  }
  .schedule-description div {
    margin-left: 130px;
  }
</style>
