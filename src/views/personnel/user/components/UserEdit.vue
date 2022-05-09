<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      :disabled="readonly"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model.trim="form.userId"
          autocomplete="off"
          :maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model.trim="form.password"
          autocomplete="off"
          :maxlength="50"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model.trim="form.confirmPassword"
          autocomplete="off"
          :maxlength="50"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="username">
        <el-input
          v-model.trim="form.username"
          autocomplete="off"
          :maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="form.gender" label="1">男</el-radio>
        <el-radio v-model="form.gender" label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="所在部门" prop="department">
        <el-select v-model="form.deptId" style="width: 100%">
          <el-option
            v-for="department in deptList"
            :key="department.deptId"
            :label="department.deptName"
            :value="department.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="form.roleId"
          placeholder="请选择用户角色"
          style="width: 100%"
        >
          <el-option
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleName"
            :value="role.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="userState">
        <el-select
          v-model="form.userStateId"
          placeholder="请选择用户状态"
          style="width: 100%"
        >
          <el-option
            v-for="userState in userStateList"
            :key="userState.userStateId"
            :label="userState.userStateName"
            :value="userState.userStateId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { create, updateById } from '@/api/user'
  import { findAll as findAllDepts } from '@/api/department'
  import { findAll as findAllRoles } from '@/api/role'
  import { findAll as findAllUserStates } from '@/api/user-state'
  export default {
    name: 'UserEdit',
    data() {
      const checkConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const checkDepartment = (rule, value, callback) => {
        if (!this.form.deptId) {
          callback(new Error('请选择部门'))
        } else {
          callback()
        }
      }
      const checkRole = (rule, value, callback) => {
        if (!this.form.roleId) {
          callback(new Error('请选择用户角色'))
        } else {
          callback()
        }
      }
      const checkUserState = (rule, value, callback) => {
        if (this.$baseLodash.isNil(this.form.userStateId)) {
          callback(new Error('请选择用户状态'))
        } else {
          callback()
        }
      }
      return {
        title: '',
        form: {
          userId: '',
          password: '',
          confirmPassword: '',
          username: '',
          deptId: '',
          gender: '',
          roleId: '',
          userStateId: '',
        },
        rules: {
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          confirmPassword: [
            { validator: checkConfirmPassword, trigger: 'blur' },
          ],
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          department: [{ validator: checkDepartment, trigger: 'blur' }],
          gender: [{ required: true, trigger: 'blur', message: '请选择性别' }],
          role: [{ validator: checkRole, trigger: 'blur' }],
          userState: [{ validator: checkUserState, trigger: 'blur' }],
        },
        visible: false,
        readonly: false,
        deptList: [],
        roleList: [],
        userStateList: [],
      }
    },
    created() {
      this.initSelectData()
    },
    methods: {
      async initSelectData() {
        const [deptdata, roleData, userStateData] = await Promise.all([
          findAllDepts(),
          findAllRoles(),
          findAllUserStates(),
        ])
        this.deptList = deptdata.data
        this.roleList = roleData.data
        this.userStateList = userStateData.data
      },
      open(row, readonly) {
        if (readonly == true) {
          this.title = '用户详情'
          this.form = Object.assign({ confirmPassword: row.password }, row)
          this.form.gender = this.form.gender + ''
        } else if (!row) {
          this.title = '添加用户'
        } else {
          this.title = '编辑用户'
          this.form = Object.assign({ confirmPassword: row.password }, row)
          this.form.gender = this.form.gender + ''
        }
        this.readonly = readonly
        this.visible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.visible = false
        this.$parent.initUserList()
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } =
              this.title !== '添加用户'
                ? await updateById(this.form)
                : await create(this.form)
            this.$message({
              message: msg,
              type: 'success',
            })
            this.$refs['form'].resetFields()
            this.visible = false
            this.$parent.initUserList()
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
    },
  }
</script>
