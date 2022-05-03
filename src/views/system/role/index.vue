<template>
  <div>
    <custom-header title="角色管理"></custom-header>
    <el-form>
      <el-form-item label="角色名称:">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="角色说明:">
        <el-input size="small"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CustomHeader from '../../custom-header'
  export default {
    components: { CustomHeader },
  }
</script>

<style></style>
