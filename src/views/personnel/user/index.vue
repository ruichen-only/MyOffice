<template>
  <div class="app-container">
    <h1 style="text-align: center">用户管理</h1>
    <el-divider></el-divider>

    <div class="input-container">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="editUser()">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="deleteUser()">
          删除
        </el-button>
      </div>
      <el-input
        v-model="keyword"
        placeholder="请输入检索内容"
        style="width: 350px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table
      v-loading="isLoading"
      :data="
        userList.filter(
          (user) =>
            !keyword ||
            user.username.toLowerCase().includes(keyword.toLowerCase()) ||
            user.roleName.toLowerCase().includes(keyword.toLowerCase())
        )
      "
      style="margin: auto"
      max-height="578"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userId" label="用户id"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column width="250" fixed="right" label="操作">
        <template #default="{ row }">
          <div style="display: flex; justify-content: space-between">
            <el-button size="mini" @click="editUser(row, true)">详情</el-button>
            <el-button size="mini" @click="editUser(row)">修改</el-button>
            <el-popconfirm
              title="确定删除该用户吗？"
              @confirm="deleteUser(row)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <user-edit ref="user-edit"></user-edit>
  </div>
</template>

<script>
  import { findAll, deleteById, deleteByIds } from '@/api/user'
  import UserEdit from './components/UserEdit.vue'

  export default {
    name: 'User',
    components: {
      UserEdit,
    },
    data() {
      return {
        isLoading: true,
        selectRows: [],
        keyword: '',
        userList: [],
      }
    },
    created() {
      this.initUserList()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      async initUserList() {
        this.isLoading = true
        const { data } = await findAll()
        this.userList = data
        this.isLoading = false
      },
      editUser(row, readonly) {
        this.$refs['user-edit'].open(row, readonly)
      },
      async deleteUser(row) {
        const { msg } = row
          ? await deleteById(row.userId)
          : await deleteByIds(this.selectRows.map((row) => row.userId))
        this.$message({
          message: msg,
          type: 'success',
        })
        this.initUserList()
      },
    },
  }
</script>

<style lang="scss">
  .input-container {
    display: flex;
    justify-content: space-between;
    margin: 50px auto;
    & > * {
      margin: 0 15px;
    }
  }
</style>
