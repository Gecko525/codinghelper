import Vue from 'vue'
import Datastore from 'nedb-promises';
import { remote } from 'electron'
import path from 'path'


const basePath = remote.app.getPath('userData')

console.log('数据存储路径：', basePath);
const getOption = (db) => {
  return {
    autoload: true,
    timestampData: true,
    filename: path.resolve(basePath, `${db}.db`)
  }
}
const db = {
  note: new Datastore(getOption('note')),
  project: new Datastore(getOption('project'))
}

Vue.prototype.$db = db;