<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="部门名称" prop="departName">
        <el-input
          v-model.trim="form.departName"
          autocomplete="off"
          :maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属机构" prop="branchId">
        <el-select v-model="form.branchId" :loading="isLoading">
          <el-option
            v-for="branch in branchList"
            :key="branch.branchId"
            :label="branch.branchName"
            :value="branch.branchId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="username">
        <el-cascader
          v-model="form.principalUser"
          :options="userInfo"
          :props="{ expandTrigger: 'hover' }"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input
          v-model.trim="form.connectTelNo"
          autocomplete="off"
          :maxlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="移动电话">
        <el-input
          v-model.trim="form.connectMobileTelNo"
          autocomplete="off"
          :maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="传真">
        <el-input
          v-model.trim="form.faxes"
          autocomplete="off"
          :maxlength="9"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { create, updateById } from '@/api/department'
  import { findAll as findAllBranches } from '@/api/branch'
  import { findAll as findAllUsers } from '@/api/user'
  export default {
    name: 'DeptEdit',
    data() {
      return {
        title: '',
        form: {
          departName: '',
          branchId: '',
          principalUser: [],
          connectTelNo: '',
          connectMobileTelNo: '',
          faxes: '',
        },
        rules: {
          departName: [
            { required: true, trigger: 'blur', message: '请输入部门名称' },
          ],
          branchId: [
            { required: true, trigger: 'blur', message: '请选择机构' },
          ],
          principalUser: [
            { required: true, trigger: 'blur', message: '请选择部门负责人' },
          ],
        },
        visible: false,
        isLoading: true,
        branchList: [],
        userInfo: [],
      }
    },
    created() {
      this.initBranchList()
      this.initUserInfo()
    },
    methods: {
      async initBranchList() {
        this.isLoading = true
        const { data } = await findAllBranches()
        this.branchList = data
        this.isLoading = false
      },
      //该方法需要优化
      async initUserInfo() {
        const { data } = await findAllUsers()
        debugger
        data.forEach((item) => {
          const branchExist = this.userInfo.some((branch) => {
            if (branch.value === item.branchId) {
              const deptExist = branch.children.some((dept) => {
                if (dept.value === item.departId) {
                  dept.children.push({
                    value: item.userId,
                    label: item.username,
                  })
                  return true
                }
                return false
              })
              if (!deptExist) {
                branch.children.push({
                  value: item.departId,
                  label: item.departName,
                  children: [],
                })
              }
              return true
            }
            return false
          })
          if (!branchExist) {
            this.userInfo.push({
              value: item.branchId,
              label: item.branchName,
              children: [
                {
                  value: item.departId,
                  label: item.departName,
                  children: [{ value: item.userId, label: item.username }],
                },
              ],
            })
          }
        })
      },
      open(row) {
        if (!row) {
          this.title = '添加部门'
        } else {
          this.title = '编辑部门'
          this.form = Object.assign({}, row)
        }
        this.visible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.visible = false
        this.$parent.initDeptList()
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const data = Object.assign({}, this.form)
            //TODO
            if (this.$baseLodash.isArray(data.principalUser)) {
              data.principalUser = data.principalUser.pop()
            }
            const { msg } = data.departId
              ? await updateById(data)
              : await create(data)
            this.$message({
              message: msg,
              type: 'success',
            })
            this.$refs['form'].resetFields()
            this.visible = false
            this.$parent.initDeptList()
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
    },
  }
</script>
