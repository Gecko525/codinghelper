<template>
  <div class="note v-flex">
    <div class="left v-flex v-flex-column">
      <div class="search-bar v-flex">
        <el-input
          v-model="searchTitle"
          placeholder="搜索"
          size="normal"
          clearable
          class="f-mr10"
          @clear="getList"
          @change="handleSearch"
          @keyup.enter.native="handleSearch"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          circle
          @click="handleCreate"
        ></el-button>
      </div>
      <!-- 笔记列表 -->
      <ul class="note-list">
        <li
          v-for="(note, index) in list"
          :key="index"
          :class="{active: activeIndex === index}"
          class="v-flex v-flex-between v-flex-align note-list-item"
          @click="toggleNote(index)"
          @contextmenu.prevent="handleContextMenu(note._id)"
        >
          <div class="f-ellipsis note-title">
            <span class="note-icon el-icon-document"></span>
            <span class="note-name">{{note.title}}</span>
          </div>
          <span class="note-date">{{note.updatedAt}}</span>
        </li>
        <li class="list-bottom">到底了~</li>
      </ul>
    </div>
    <div class="right">
      <file-editor
        v-if="currNote"
        :title.sync="currNote.title"
        :value="currNote.content"
        @change="handleChange"
        @save="handleSave"
        @blur="saveTitle"
      ></file-editor>
    </div>
  </div>
</template>

<script>
import FileEditor from '@/components/FileEditor'
import dayjs from 'dayjs'
import { shell, remote } from 'electron'

export default {
  name: 'Project',
  data () {
    return {
      searchTitle: '',
      list: [],
      activeIndex: -1,
      currNote: null
    }
  },
  components: {
    FileEditor
  },
  watch: {
    currNote (n, o) {
      if (n && !o) {
        this.initHref();
      }
    }
  },
  mounted () {
    // this.$db.note.remove({}, { multi: true })
    this.getList();
    this.initMenu();
  },
  methods: {
    initMenu () {
      const Menu = remote.Menu;
      const MenuItem = remote.MenuItem;

      const menu = new Menu();
      const handleDelete = () => {
        console.log('delete ....');
        this.handleDelete();
      }
      menu.append(new MenuItem({ label: '删除', click: handleDelete }))
      this.menu = menu;
    },
    handleContextMenu (id) {
      this.deleteId = id;
      this.menu.popup();
    },
    async handleDelete () {
      console.log('删除');
      await this.$db.note.remove({ _id: this.deleteId })
      this.refreshList()
    },
    async getList (query = {}) {
      const list = await this.$db.note.find(query).sort({ updatedAt: -1 });
      for (const note of list) {
        // YYYY-MM-DD
        note.createdAt = dayjs(note.createdAt).format('YYYY-MM-DD')
        note.updatedAt = dayjs(note.updatedAt).format('YYYY-MM-DD')
      }
      console.log(list);
      this.list = list;
    },
    handleSearch () {
      const reg = new RegExp(`${this.searchTitle}`, 'i')
      this.getList({ title: reg })
    },
    handleView (row) {
      if (row.type === '1') {
        this.$router.push({ path: '/viewNote', query: { id: row.id } })
      } else if (row.type === '2') {
        // 使用浏览器打开
        shell.openExternal(row.url);
      }
    },
    async handleCreate () {
      const defaultNote = { title: '无标题笔记', content: '' }
      await this.$db.note.insert(defaultNote)
      this.refreshList()
    },
    toggleNote (index) {
      this.activeIndex = index;
      this.currNote = this.list[index];
    },
    handleChange (value) {
      if (value === this.currNote.content) return;
      this.currNote.content = value;
      console.log(value);
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        this.timer = null;
        this.save();
      }, 500);
    },
    async save () {
      const { _id, title, content } = this.currNote;
      await this.$db.note.update({ _id }, { content, title })
      this.refreshList();
    },
    async handleSave () {
      await this.save()
      await this.saveTitle()
      this.$message('放心吧大爷，小的给您存好了', 'success')
    },
    async saveTitle () {
      const { _id, title } = this.currNote;
      if (title === '') {
        this.$message('给个标题吧，求求了 0_0', 'error');
        return;
      }
      await this.$db.note.update({ _id }, { $set: { title } })
      this.refreshList()
    },
    async refreshList () {
      await this.getList();
      const [firstNote] = this.list;
      this.currNote = firstNote;
      this.activeIndex = 0;
    },
    initHref () {
      this.$nextTick(() => {
        var content = document.querySelector('.v-show-content')
        content.addEventListener('click', (e) => {
          const { target } = e;
          if (target.tagName.toLowerCase() === 'a') {
            e.preventDefault();
            shell.openExternal(target.href);
          }
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.note {
  height: 100%;

  .left,
  .right {
    height: 100%;
    background: #fff;
  }

  .left {
    width: 320px;
    min-width: 320px;
    .search-bar {
      padding: 10px;
      background: rgb(77, 198, 255);
    }
    .note-list {
      flex: 1;
      overflow-y: auto;

      .note-list-item {
        border-bottom: 1px solid #f1f1f1;
        height: 50px;
        padding: 0 10px;
        color: #333;
        cursor: pointer;

        .note-title {
          max-width: 200px;
        }

        .note-icon {
          color: rgb(255, 145, 0);
          font-size: 18px;
          vertical-align: bottom;
        }

        .note-name {
          margin-left: 5px;
          font-weight: bold;
        }

        &.active {
          background: #ffe344;
        }
      }

      .list-bottom {
        padding: 15px 0;
        text-align: center;
        color: #ccc;
      }
    }
  }

  .right {
    flex: 1;
    margin-left: 5px;
    overflow-x: auto;
  }
}
</style>