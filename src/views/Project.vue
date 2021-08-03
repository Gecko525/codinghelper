<template>
  <div class="project v-flex v-flex-column">
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
        type="default"
        size="default"
        @click="onSearch"
      >刷新</el-button>
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
          prop="path"
          label="路径"
        >
        </el-table-column>
        <el-table-column
          prop="branch"
          label="分支"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template v-slot="{row}">
            <el-button
              v-for="(btn, i) in row.commands"
              :key="i"
              size="mini"
              @click="execute(row.path, btn.command)"
            >{{btn.name}}</el-button>
            <el-button
              type="primary"
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
      list: [],
      commands: []
    }
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      this.$axios.post(this.$serve.projectList, this.search).then((res) => {
        console.log(res);
        this.list = res.data.list;
      })
    },
    onSearch () {
      this.getList()
    },
    handleCreate () {
      this.$router.push('/createProject');
    },
    handleEdit (id) {
      this.$router.push({
        path: '/createProject',
        query: { id }
      })
    },
    handleDelete (id) {
      this.$confirm('确定要删除？', '提示').then(() => {
        this.$axios.post(this.$serve.deleteProject, { id }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList();
        })
      }).catch(() => { })
    },
    execute (path, command) {
      console.log(path, command);
      const { exec } = require('child_process');

      const cp = exec(`start cmd.exe /K ${command}`, {
        cwd: path
      });


      cp.stderr.on('data', (data) => {
        console.log(data.toString());
      })

      cp.on('error', (error) => {
        console.log(error);
      })

      cp.on('close', (code) => {
        console.log('close code: ' + code);
      })

      cp.on('exit', (code) => {
        console.log('exit code: ' + code);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.project {
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