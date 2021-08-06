<template>
  <div class="file-editor v-flex v-flex-column">
    <div class="editor-title">
      <el-input
        class="title-input"
        :value="title"
        @input="changeTitle"
        @blur="titleBlur"
        placeholder="请输入标题"
        size="normal"
      ></el-input>
    </div>
    <div class="editor-content">
      <mavon-editor
        v-bind="$attrs"
        v-on="$listeners"
        :value="value"
        class="markdown-wrapper"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileEditor',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeTitle (newValue) {
      this.$emit('update:title', newValue)
    },
    titleBlur () {
      this.$emit('blur')
    }
  }
}
</script>

<style lang="scss" scoped>
.file-editor {
  width: 100%;
  height: 100%;

  .editor-title {
    padding: 15px 0;
    border-bottom: 1px solid #ccc;

    .title-input {
      width: 100%;

      ::v-deep.el-input__inner {
        border: none;
        outline: none;
        font-size: 24px;
        color: #333;
      }
    }
  }
  .editor-content {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;

    ::v-deep.v-note-wrapper {
      height: 100%;
    }
  }
}
</style>