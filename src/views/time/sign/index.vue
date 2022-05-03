<template>
  <div style="font-size: 14px">
    <custom-header title="员工签到、签退"></custom-header>
    <div class="sign-container">
      <div class="sign-border-title" style="top: 92px">员工填写区:</div>
      <el-form inline>
        <el-form-item label="签卡日期:">
          <div style="display: flex">
            <el-date-picker
              v-model="date"
              size="small"
              format="yyyy-MM-dd"
              disabled
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            :disabled="!canSign"
            @click="onSign"
          >
            签到
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            :disabled="canSign"
            @click="onUnsign"
          >
            签退
          </el-button>
        </el-form-item>
      </el-form>
      <el-form inline>
        <el-form-item label="签卡备注:">
          <el-input
            v-model="signDesc"
            type="textarea"
            size="small"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-if="showSignInfo"
      class="sign-container"
      style="display: flex; margin-top: 30px"
    >
      <div class="sign-border-title" style="top: 300px">
        {{ canSign ? '您的签退信息:' : '您的签到信息:' }}
      </div>
      <el-form inline label-width="100px" label-position="left">
        <el-form-item label="用户号:">
          <el-input v-model="currentUserInfo.userId" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="currentUserInfo.userName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-input
            v-model="currentUserInfo.department"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属机构:">
          <el-input v-model="currentUserInfo.brach" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="width: 700px">
            {{ (canSign ? '您的签退时间:' : '您的签到时间:') + date }}
          </div>
        </el-form-item>
        <el-form-item label="签卡备注:">
          <el-input
            v-model="signDesc"
            type="textarea"
            size="small"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import CustomHeader from '../../custom-header'
  import { parseTime } from '@/utils/index'
  export default {
    components: { CustomHeader },
    data() {
      return {
        signDesc: '',
        canSign: true,
        showSignInfo: false,
        currentUserInfo: {
          userId: 'admin',
          userName: '系统管理员',
          department: '研发部',
          brach: '中国科学院声学研究所',
        },
        date: parseTime(new Date()),
      }
    },
    methods: {
      onSign() {
        if (this.showSignInfo) {
          this.$message('您今天已经签到过了')
          return
        }
        this.canSign = false
        this.showSignInfo = true
        this.date = parseTime(new Date())
      },
      onUnsign() {
        this.canSign = true
        this.date = parseTime(new Date())
      },
    },
  }
</script>

<style>
  .sign-container {
    /* display: flex; */
    margin: 10px 35px;
    color: #606266;
    border: 1px solid #dcdfe6;
    padding: 20px 0 0 20px;
  }
  .sign-border-title {
    position: absolute;
    background-color: white;
    font-size: 14px;
  }
  .el-textarea,
  .el-input {
    width: 250px !important;
  }
</style>
