<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: 'hello world'
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
html {
  height: 100%;
}

body {
  height: 100%;
}

.app {
  height: 800px;
}
</style>