<template>
  <div>
    <custom-header title="我的便签"></custom-header>
    <div class="margin-se" :hidden="!showMyNotes">
      <div class="btn-container">
        <svg-icon
          icon-class="add-note"
          class="btn-add-note"
          @click="onAddNote"
        ></svg-icon>
        新增便签
      </div>
      <el-row>
        <el-col v-for="item in mynotes" :key="item.noteId" :span="8">
          <div class="note-item" @click="onEditNote(item)">
            <svg-icon icon-class="note-item" @click="onAddNote"></svg-icon>
            {{
              item.noteTitle.substring(0, 12) +
              (item.noteTitle.length > 12 ? '...' : '')
            }}
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="margin-se my-note-setting" :hidden="showMyNotes">
      <h3>我的便签设置</h3>
      <el-divider></el-divider>
      <div class="edit-note">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          label-position="top"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="便签标题:" prop="noteTitle">
            <el-input
              v-model="ruleForm.noteTitle"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="便签内容:" prop="noteContent">
            <el-input
              v-model="ruleForm.noteContent"
              type="textarea"
              :rows="7"
              placeholder="请输入内容"
            >
              >
            </el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="12">{{ '创建人:' }}</el-col>
          <el-col :span="12">{{ '创建时间:' }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button type="primary" size="small" @click="onReturn">
              返回
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="small" @click="onSave">
              保存
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="small"
              :disabled="!deleteActive"
              @click="onDelete"
            >
              删除当前便签
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { findAll, updateById, deleteById, create } from '@/api/my-note'
  import CustomHeader from '../../custom-header'
  export default {
    components: { CustomHeader },
    data() {
      return {
        ruleForm: {
          noteTitle: '',
          noteContent: '',
        },
        currentId: '',
        showMyNotes: true,
        deleteActive: false,
        mynotes: [],
        rules: {
          noteTitle: [
            { required: true, message: '请输入标题', trigger: 'change' },
          ],
          noteContent: [
            { required: true, message: '请输入内容', trigger: 'change' },
          ],
        },
      }
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        const { data } = await findAll()
        this.mynotes = data
      },
      onAddNote() {
        this.showMyNotes = false
        this.deleteActive = false
      },
      onReturn() {
        this.$refs.ruleForm.resetFields()
        this.showMyNotes = true
      },
      onSave() {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            this.showMyNotes = true
            const { msg } = this.deleteActive
              ? await updateById(this.ruleForm)
              : await create(this.ruleForm)
            this.$message({
              message: msg,
              type: 'success',
            })
            this.$refs.ruleForm.resetFields()
            this.initData()
          } else {
            return false
          }
        })
      },
      async onDelete() {
        this.showMyNotes = true
        const { msg } = await deleteById(this.currentId)
        this.$message({
          message: msg,
          type: 'success',
        })
        this.currentId = ''
        this.initData()
        this.$refs.ruleForm.resetFields()
      },
      onEditNote(item) {
        this.showMyNotes = false
        this.deleteActive = true
        this.ruleForm.noteTitle = item.noteTitle
        this.ruleForm.noteContent = item.noteContent
        this.currentId = this.ruleForm.noteId = item.noteId
      },
    },
  }
</script>

<style lang="scss" scoped>
  .margin-se {
    margin: 0 35px;
    font-size: 14px;
  }
  .btn-container {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
  }
  .btn-add-note {
    cursor: pointer;
  }
  .note-item {
    background-color: paleturquoise;
    padding: 5px;
    border: 1px solid grey;
    cursor: pointer;
  }
  .edit-note {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .my-note-setting {
    .el-form,
    .el-row {
      width: 500px;
    }
    .el-row {
      margin-bottom: 20px;
    }
  }
</style>
