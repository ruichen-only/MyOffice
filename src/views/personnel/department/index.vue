<template>
  <div class="app-container">
    <h1 style="text-align: center">部门管理</h1>
    <el-divider></el-divider>
    <div class="input-container">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="editDept()">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="deleteDept()">
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
      :data="filterDeptList"
      style="margin: auto"
      max-height="578"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="departName" label="部门名称"></el-table-column>
      <el-table-column prop="branchName" label="机构"></el-table-column>
      <el-table-column prop="username" label="负责人"></el-table-column>
      <el-table-column prop="connectTelNo" label="联系电话"></el-table-column>
      <el-table-column
        prop="connectMobileTelNo"
        label="移动电话"
      ></el-table-column>
      <el-table-column prop="faxes" label="传真"></el-table-column>
      <el-table-column width="150" fixed="right" label="操作">
        <template #default="{ row }">
          <div style="display: flex; justify-content: space-between">
            <el-button size="mini" @click="editDept(row)">修改</el-button>
            <el-popconfirm
              title="确定删除该部门吗？"
              @confirm="deleteDept(row)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <dept-edit ref="dept-edit"></dept-edit>
  </div>
</template>

<script>
  import { findAll, deleteById, deleteByIds } from '@/api/department'
  import DeptEdit from './components/DeptEdit.vue'

  export default {
    name: 'Department',
    components: {
      DeptEdit,
    },
    data() {
      return {
        isLoading: true,
        selectRows: [],
        keyword: '',
        deptList: [],
        userMap: {},
      }
    },
    computed: {
      filterDeptList: function () {
        return this.deptList.filter((department) => {
          if (!this.keyword) {
            return true
          }
          return (
            department.departName
              .toLowerCase()
              .includes(this.keyword.toLowerCase()) ||
            department.branchName
              .toLowerCase()
              .includes(this.keyword.toLowerCase()) ||
            department.username
              .toLowerCase()
              .includes(this.keyword.toLowerCase())
          )
        })
      },
    },
    created() {
      this.initDeptList()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      async initDeptList() {
        this.isLoading = true
        const { data } = await findAll()
        debugger
        this.deptList = data
        this.isLoading = false
      },
      editDept(row) {
        this.$refs['dept-edit'].open(row)
      },
      async deleteDept(row) {
        const { msg } = row
          ? await deleteById(row.deptId)
          : await deleteByIds(this.selectRows.map((row) => row.deptId))
        this.$message({
          message: msg,
          type: 'success',
        })
        this.initDeptList()
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
