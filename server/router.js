const { transformRespose, uuid, escapeSpecialChar } = require('./util');
const router = require('koa-router')();
const { query } = require('./mysql');
const { QUERY_DATAS, INSERT_DATAS_BY_OBJECT, UPDATE_DATAS_BY_OBJECT, DELETE_DATA_BY_ID, QUERY_DATAS_WHERE } = require('./mysql/sql');

router.get('/', (ctx, next) => {
  ctx.body = 'Hello koa'
})

router.post('/api/project/list', async (ctx) => {
  const { name = '' } = ctx.request.body;
  let list = await query(`${QUERY_DATAS('project')}${name ? ' WHERE name = ?;' : ';'}`, [name])
  for (const item of list) {
    item.commands = await query(`${QUERY_DATAS('project_command')} WHERE project_id = ?`, [item.id])
  }
  ctx.body = transformRespose({ list });
})

router.post('/api/project/detail', async (ctx) => {
  const { id } = ctx.request.body;
  const list = await query(QUERY_DATAS_WHERE('project', 'id'), id);
  const project = list[0];
  if (!project) {
    ctx.body = transformRespose(null, '项目不存在', -1)
  } else {
    const commands = await query(QUERY_DATAS_WHERE('project_command', 'project_id'), id);
    project.commands = commands;
    ctx.body = transformRespose(project)
  }
})

router.post('/api/project/create', async (ctx) => {
  const data = ctx.request.body;
  const id = uuid();
  const { name, path, branch } = data;
  const project = { id, name, path, branch }

  await query(INSERT_DATAS_BY_OBJECT('project'), project);

  const { commands = [] } = data;
  for (const item of commands) {
    if (item.name && item.command) {
      const command_item = { id: uuid(), project_id: id, ...item }
      await query(INSERT_DATAS_BY_OBJECT('project_command'), command_item)
    }
  }
  ctx.body = transformRespose({ data: 'success' })
})

router.post('/api/project/update', async (ctx) => {
  const data = ctx.request.body;
  const { id, name, path, branch } = data;
  const project = { name, path, branch }

  await query(UPDATE_DATAS_BY_OBJECT('project'), [project, id]);

  // 删除命令
  await query(`DELETE FROM project_command WHERE project_id = ?`, id)

  const { commands = [] } = data;
  for (const item of commands) {
    if (item.name && item.command) {
      const command_item = { id: uuid(), project_id: id, ...item }
      await query(INSERT_DATAS_BY_OBJECT('project_command'), command_item)
    }
  }
  ctx.body = transformRespose({ data: 'success' })
})

router.post('/api/project/delete', async (ctx) => {
  const data = ctx.request.body;
  const { id } = data;
  // 先删命令再删项目
  await query(`DELETE FROM project_command WHERE project_id = ?`, id)
  await query(DELETE_DATA_BY_ID('project'), id)
  ctx.body = transformRespose({ data: 'success' })
})

module.exports = router;