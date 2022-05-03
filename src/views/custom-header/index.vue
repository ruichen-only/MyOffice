<template>
  <div class="margin-se">
    <h1>{{ title }}</h1>
    <el-divider></el-divider>
  </div>
</template>

<script>
  export default {
    props: { title: { type: String, default: '' } },
    data() {
      return {}
    },
  }
</script>

<style scoped>
  h1 {
    text-align: center;
  }
  .margin-se {
    margin: 10px 35px;
    font-size: 14px;
  }
</style>
