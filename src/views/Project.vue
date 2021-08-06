<template>
  <div class="project v-flex v-flex-column">
    <div class="search v-flex v-flex-between">
      <el-input
        class="f-w300"
        v-model="searchName"
        placeholder="搜索名称"
        size="normal"
        clearable
        @change="onSearch"
      ></el-input>
      <div>
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
        <el-table-column label="分支">
          <template v-slot="{row}">
            <el-select
              v-model="row.branch"
              filterable
              @change="changeBranch(row, $event)"
            >
              <el-option
                v-for="item in row.branchList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template v-slot="{row}">
            <el-button
              v-for="(cmd, i) in row.commands"
              :key="i"
              size="mini"
              @click="execute(row.path, cmd.command)"
            >{{cmd.name}}</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(row._id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(row._id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import gitP from 'simple-git/promise';
export default {
  name: 'Project',
  data () {
    return {
      searchName: '',
      list: [],
      commands: []
    }
  },
  created () {
    this.getList();
  },
  methods: {
    getList (query = {}) {
      this.$db.project.find(query).then(async (list) => {
        console.log(list);
        for (const item of list) {
          const git = gitP(item.path);
          const branch = await git.branch();
          item.branch = branch.current;
          item.branchList = branch.all.filter(b => !b.startsWith('remote'));
        }
        this.list = list;
      })
    },
    changeBranch (project, val) {
      const loading = this.$loading({
        lock: true,
        text: '切换中...',
      });
      const git = gitP(project.path);
      git.checkout(val).then(() => {
        loading.close();
      })
    },
    onSearch () {
      const reg = new RegExp(`${this.searchName}`, 'i')
      this.getList({ name: reg })
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
      this.$confirm('确定要删除？', '提示').then(async () => {
        await this.$db.project.remove({ _id: id })
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList();
      }).catch(() => { })
    },
    execute (path, command) {
      console.log(path, command);
      const { exec } = require('child_process');
      exec(`start ${command}`, {
        cwd: path
      });
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