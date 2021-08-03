<template>
  <div class="header">
    <el-menu
      :default-active="$route.path"
      :router="true"
      class="el-menu"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item
        v-for="nav in navs"
        :key="nav.path"
        :index="nav.path"
      >
        {{ nav.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'NavHeader',
  data () {
    return {
      navs: [
        { name: '项目管理', path: '/project' },
        { name: '我的笔记', path: '/note' },
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.el-menu {
  padding-left: 30px;
}
</style>