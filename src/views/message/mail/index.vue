<template>
  <div>
    <custom-header title="个人消息管理区"></custom-header>
    <div v-show="!showReceive && !showSended" class="mail-container">
      <div>
        <svg-icon icon-class="mail" class="mail-icon"></svg-icon>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="type" label="本地文件夹" align="center">
          <template slot-scope="scope">
            <div style="cursor: pointer" @click="onClickFolder(scope.row)">
              <svg-icon :icon-class="scope.row.icon"></svg-icon>
              {{ scope.row.type }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="文件个数" align="center">
          <template slot-scope="scope">
            <el-link type="primary">
              {{ scope.row.totalCount }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="unreadCount" label="未读邮件" align="center">
          <template slot-scope="scope">
            <el-link type="primary">
              {{ scope.row.unreadCount }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="showReceive || showSended" class="mail-container">
      <div style="width: 100%">
        <el-table
          ref="multipleTable"
          :data="receiveMessageData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
          @row-click="onRowClick"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            :label="showReceive ? '发件人' : '收件人'"
            :prop="showReceive ? 'fromUser' : 'toUser'"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="showReceive"
            prop="ifRead"
            align="center"
            width="100px"
          >
            <template slot-scope="scope">
              <svg-icon
                :icon-class="scope.row.ifRead == '0' ? 'new' : ''"
                style="width: 30px; height: 30px"
              ></svg-icon>
            </template>
          </el-table-column>
          <el-table-column
            label="主题"
            prop="title"
            align="center"
          ></el-table-column>
          <el-table-column
            label="发送时间"
            prop="createTime"
            align="center"
          ></el-table-column>
          <el-table-column
            label="紧急程度"
            prop="type"
            align="center"
          ></el-table-column>
        </el-table>
        <div style="margin: 15px">
          <el-button
            type="primary"
            :disabled="multipleSelection.length == 0"
            @click="onDeleteSelected"
          >
            删除选定项
          </el-button>
          <el-button type="primary" @click="showReceive = showSended = false">
            返回
          </el-button>
        </div>
        <el-dialog
          title="消息详情"
          :visible.sync="dialogVisible"
          width="50%"
          center
        >
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="消息主题:">
              <el-input v-model="form.title" size="small"></el-input>
            </el-form-item>
            <el-form-item label="重要程度:">
              <el-input v-model="form.type" size="small"></el-input>
            </el-form-item>
            <el-form-item label="消息内容:">
              <el-input
                v-model="form.content"
                size="small"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="发件人:">
              <el-input v-model="form.fromUser" size="small"></el-input>
            </el-form-item>
            <el-form-item label="发送时间:">
              <el-input v-model="form.createTime" size="small"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="dialogVisible = false"
            >
              关闭
            </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import CustomHeader from '../../custom-header'
  import { searchReceiveMessage, deleteById } from '@/api/message'
  export default {
    components: { CustomHeader },
    data() {
      return {
        showReceive: false,
        showSended: false,
        dialogVisible: false,
        multipleSelection: [],
        form: { title: '' },
        tableData: [
          {
            type: '收件箱',
            totalCount: 1,
            unreadCount: 1,
            icon: 'mail-receive',
          },
          {
            type: '草稿箱',
            totalCount: 0,
            unreadCount: 0,
            icon: 'mail-draft',
          },
          {
            type: '已发送',
            totalCount: 3,
            unreadCount: 0,
            icon: 'mail-sended',
          },
          {
            type: '已删除',
            totalCount: 0,
            unreadCount: 0,
            icon: 'mail-delete',
          },
        ],
        receiveTableColumns: [
          { label: '发件人', prop: 'fromUser' },
          { label: '', prop: 'ifRead' },
          { label: '主题', prop: 'title' },
          { label: '发送时间', prop: 'createTime' },
          { label: '紧急程度', prop: 'type' },
        ],
        receiveMessageData: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        const { data } = await searchReceiveMessage()
        this.receiveMessageData = data
      },
      onClickFolder(row) {
        if (row.type == '收件箱') this.showReceive = true
        else if (row.type == '已发送') this.showSended = true
      },
      async onDeleteSelected() {
        const messageIds = this.multipleSelection.map((item) => item.messageId)
        const { msg } = await deleteById(messageIds)
        this.$message({ message: msg, type: 'success' })

        messageIds.forEach((id) => {
          const index = this.receiveMessageData.findIndex(
            (item) => item.messageId == id
          )
          this.receiveMessageData.splice(index, 1)
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      onRowClick(row, column, event) {
        row.ifRead = 1
        this.dialogVisible = true
        this.form = row
      },
    },
  }
</script>

<style scoped>
  .mail-container {
    display: flex;
    margin: 10px 35px;
    color: #606266;
    border: 1px solid #dcdfe6;
  }
  .mail-icon {
    width: 100px;
    height: 200px;
    margin: 0 30px;
  }
  ::v-deep .el-dialog__body {
    padding: 10px 20px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
</style>
