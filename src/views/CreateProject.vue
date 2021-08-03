<template>
  <div class="create v-flex v-flex-column">
    <el-page-header
      :content="pageTitle"
      @back="goBack"
    ></el-page-header>
    <div class="content v-flex-1">
      <el-form
        :model="project"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="项目名称">
          <el-input
            v-model="project.name"
            placeholder="请输入项目名称"
            class="f-w300"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目路径">
          <el-input
            v-model="project.path"
            placeholder="请输入项目路径"
            class="f-w300 f-mr10"
          ></el-input>
          <!-- 选择package.json -->
          <el-link
            type="primary"
            :underline="false"
            @click="choosePackage"
          >快速导入</el-link>
          （选择项目下的package.json）
        </el-form-item>
        <el-form-item label="启动命令">
          <draggable
            v-model="project.commands"
            animation="300"
            handle=".mode-handle"
          >
            <transition-group>
              <div
                v-for="(command, index) in project.commands"
                :key="index"
                class="f-mb10"
              >
                <el-input
                  v-model="command.name"
                  placeholder="请输入命令名称"
                  class="f-w300 f-mr10"
                ></el-input>
                <el-input
                  v-model="command.command"
                  placeholder="请输入命令内容"
                  class="f-w300"
                ></el-input>
                <el-button
                  class="icon-btn"
                  type="success"
                  icon="el-icon-circle-plus-outline"
                  circle
                  @click="addCommand"
                ></el-button>
                <el-button
                  v-if="project.commands.length > 1"
                  class="icon-btn"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteCommand(index)"
                ></el-button>
                <el-button
                  v-if="project.commands.length > 1"
                  class="icon-btn mode-handle"
                  type="default"
                  icon="el-icon-sort"
                  style="cursor: move;"
                  circle
                ></el-button>
              </div>
            </transition-group>
          </draggable>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >保存</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import draggable from 'vuedraggable'
const command = {
  name: '',
  command: ''
}
export default {
  name: 'CreateProject',
  data () {
    return {
      pageTitle: '',
      project: {
        id: '',
        name: '',
        path: '',
        commands: []
      },
      rules: {

      }
    }
  },
  components: {
    draggable,
  },
  created () {
    const { id } = this.$route.query;
    this.project.id = id;
    if (id) {
      this.pageTitle = '编辑项目';
      this.getDetail(id);
    } else {
      this.pageTitle = '创建项目';
      this.project.commands.push(JSON.parse(JSON.stringify(command)))
    }

    ipcRenderer.on('choosePackageEnd', (event, arg) => {
      console.log('render 收到消息', arg);
      // this.project.path = arg;
      this.project.path = arg.path;
      this.project.commands = arg.commands.map(cmd => ({
        name: cmd.name,
        command: `npm run ${cmd.name}`
      }));
    })
  },
  methods: {
    getDetail (id) {
      this.$axios.post(this.$serve.projectDetail, { id }).then(res => {
        this.project = res.data;
      })
    },
    choosePackage () {
      console.log('render 发送消息');
      ipcRenderer.send('choosePackage')
    },
    onSubmit () {
      const url = this.project.id ? this.$serve.updateProject : this.$serve.crateProject;
      this.$axios.post(url, this.project).then((res) => {
        console.log(res);
        this.$message('保存成功', 'success')
      }).then(() => {
        this.$router.back();
      })
    },
    addCommand () {
      this.project.commands.push(JSON.parse(JSON.stringify(command)))
    },
    deleteCommand (index) {
      this.project.commands.splice(index, 1)
    },
    goBack () {
      window.history.back()
    }
  },
}
</script>

<style lang="scss" scoped>
.create {
  height: 100%;
}
.content {
  margin: 10px;
  background: #fff;
  padding: 20px;
}
.icon-btn {
  font-size: 24px;
  padding: 5px;
  vertical-align: middle;
  margin-left: 10px;
}
</style>