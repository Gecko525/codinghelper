<template>
  <div class="note v-flex v-flex-column">
    <div class="search v-flex v-flex-between">
      <el-input
        class="f-w300"
        v-model="search.name"
        placeholder="搜索名称"
        size="normal"
        clearable
        @change="onSearch"
      ></el-input>
      <el-button
        type="primary"
        size="default"
        @click="handleCreate"
      >新建</el-button>
    </div>
    <div class="table-block v-flex-1">
      <el-table
        class="table"
        :data="list"
        border
        stripe
      >
        <el-table-column
          prop="name"
          label="名称"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
        >
          <template v-slot="{row}">{{typeMap[row.type]}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="handleView(row)"
            >查看</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="handleEdit(row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Project',
  data () {
    return {
      search: {
        name: ''
      },
      typeMap: {
        '1': '本地',
        '2': '线上'
      },
      list: [
        { name: '如何快速建站', type: '2', id: '123123123', url: 'https://www.baidu.com' }
      ]
    }
  },
  methods: {
    getList () { },
    onSearch () { },
    handleView (row) {
      if (row.type === '1') {
        this.$router.push({ path: '/viewNote', query: { id: row.id } })
      } else if (row.type === '2') {
        // 使用浏览器打开
        const { shell } = require('electron');
        shell.openExternal(row.url);
      }
    },
    handleCreate () { },
    handleEdit () { },
    handleDelete () { }
  },
}
</script>

<style lang="scss" scoped>
.note {
  height: 100%;
  .search {
    margin: 10px;
    background: #fff;
    border-radius: 5px;
    padding: 10px;
  }
  .table-block {
    width: 100%;
    height: 100%;
    padding: 10px;
    .table {
      height: 100%;
    }
  }
}
</style>