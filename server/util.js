function transformRespose (data = {}, message = 'success', code = 0) {
  return {
    data,
    message,
    code
  }
}

const { v4: uuidv4 } = require('uuid');
function uuid () {
  return uuidv4().replace(/-/g, '')
}

function escapeSpecialChar (str) {
  return str.replace(/\\/g, '\\').replace(/\%/g, '\\%')
}


module.exports = {
  transformRespose,
  uuid,
  escapeSpecialChar
};