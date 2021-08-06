import Vue from 'vue'

const serve = {
  projectList: '/project/list',
  crateProject: '/project/create',
  updateProject: '/project/update',
  deleteProject: '/project/delete',
  projectDetail: '/project/detail',
  noteList: '/note/list',
};

Vue.prototype.$serve = serve;
export default serve;