import Vue from 'vue'

const baseUrl = '/api'
const serve = {
  projectList: '/project/list',
  crateProject: '/project/create',
  updateProject: '/project/update',
  deleteProject: '/project/delete',
  projectDetail: '/project/detail',
  noteList: '/note/list',
};

for (const key in serve) {
  if (Object.hasOwnProperty.call(serve, key)) {
    serve[key] = baseUrl + serve[key];
  }
}

Vue.prototype.$serve = serve;
export default serve;