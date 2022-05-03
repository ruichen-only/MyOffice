<template>
  <div class="app-container">
    <h1 style="text-align: center">文件管理</h1>
    <el-divider></el-divider>
    <div style="display: flex">
      <div class="tree-container">
        <el-tree
          ref="folder-tree"
          node-key="fileId"
          :data="getFolderTree()"
          :highlight-current="true"
          :expand-on-click-node="false"
          :indent="30"
          accordion
          draggable
          default-expand-all
          @node-click="setCurFilePath"
        >
          <span slot-scope="{ data }">
            <svg-icon :icon-class="data.fileTypeImage"></svg-icon>
            <span style="margin-left: 8px; font-size: 14px">
              {{ data.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="table-container" style="width: 80%">
        <el-link icon="el-icon-back" @click="goBack">后退</el-link>
        <el-link icon="el-icon-top" @click="goParent">返回到上级目录</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link icon="el-icon-search" @click="searchFile">搜索</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link icon="el-icon-folder-add" @click="createFolder">
          创建目录
        </el-link>
        <el-link icon="el-icon-document-add" @click="createFile">
          创建文件
        </el-link>
        <el-cascader
          v-model="curFilePath"
          style="width: 400px"
          :options="getFolderTree()"
          :props="{ checkStrictly: true, placeholder: '请选择文件路径' }"
          @change="setCurFileId"
        ></el-cascader>
        <el-table
          :data="getCurrentFiles()"
          style="width: 100%"
          max-height="578"
        >
          <el-table-column width="30">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.fileTypeImage"></svg-icon>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileName"
            label="名称"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="fileTypeName"
            label="类型"
            width="80"
          ></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column
            prop="fileOwner"
            label="所有者"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="createDate"
            label="创建日期"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="createDate"
            label="创建日期"
            width="180"
          ></el-table-column>
          <el-table-column width="150" fixed="right" label="操作">
            <template #default="{ row }">
              <div style="display: flex; justify-content: space-between">
                <el-button size="mini" @click="openFile(row)">查看</el-button>
                <el-popconfirm
                  title="确定删除该文件吗？"
                  @confirm="deleteFile(row)"
                >
                  <el-button slot="reference" size="mini" type="danger">
                    删除
                  </el-button>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { listAllFiles } from '@/api/file'
  export default {
    name: 'File',
    data() {
      return { files: [], curFilePath: [], hisotry: [] }
    },
    computed: {
      curFileId: {
        get: function () {
          return this.$baseLodash.last(this.curFilePath)
        },
      },
    },
    created() {
      this.initFiles()
    },
    methods: {
      async initFiles() {
        const { data } = await listAllFiles()
        this.files = data
      },
      getFolderTree() {
        const tree = []
        this.files.forEach(function (item) {
          this[item.fileId] = {
            id: item.fileId,
            value: item.fileId,
            fileTypeImage: item.fileTypeImage,
            remark: item.remark,
            label: item.fileName,
            children: this[item.fileId] && this[item.fileId].children,
          }
          if (!item.parentId) {
            tree.push(this[item.fileId])
          } else {
            this[item.parentId] = this[item.parentId] || {}
            this[item.parentId].children = this[item.parentId].children || []
            this[item.parentId].children.push(this[item.fileId])
          }
        }, {})
        return tree
      },
      getCurrentFiles() {
        return this.files.filter((file) => {
          return file.parentId == this.$baseLodash.last(this.curFilePath)
        })
      },
      goBack() {
        this.curFilePath = this.hisotry.pop()
      },
      goParent() {
        if (this.curFilePath.length != 0) this.curFilePath.pop()
      },
      searchFile() {},
      createFolder() {},
      createFile() {},
      setCurFileId(value) {
        // const fileId = this.$baseLodash.last(this.curFilePath)
        // this.$refs['folder-tree'].setCurrentKey(fileId)
        this.hisotry.push(this.curFilePath)
      },
      setCurFilePath(obj, node, tree) {
        this.curFilePath = []
        while (node.level != 0) {
          if (!node.isLeaf) {
            this.curFilePath.unshift(node.data.id)
          }
          node = node.parent
        }
        this.hisotry.push(this.curFilePath)
      },
      openFile(row) {},
      deleteFile(row) {},
    },
  }
</script>

<style lang="scss">
  .tree-container {
    width: 18%;
    padding-left: 20px;
  }
  .table-container {
    & > * {
      margin: 10px;
    }
  }
</style>
