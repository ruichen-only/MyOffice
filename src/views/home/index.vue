<template>
  <div class="home-container" @click="home">我的主页内容，点我试试</div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      home() {
        alert('back to home')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .home {
    &-container {
      margin: 30px;
      height: 30px;
      background-color: aquamarine;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
