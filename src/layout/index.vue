<template>
  <div class="layout">
    <div class="header">
      <NavHeader />
    </div>
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader.vue';
export default {
  name: 'Layout',
  components: {
    NavHeader,
  }
}
</script>

<style lang="scss" scoped>
$headerHeight: 60px;
.layout {
  width: 100%;
  height: 100%;
}
.header {
  width: 100%;
  height: $headerHeight;
}
.body {
  height: calc(100% - #{$headerHeight});
}
</style>