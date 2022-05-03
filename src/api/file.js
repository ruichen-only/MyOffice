import request from '@/utils/request'

export function listAllFiles() {
  return request({
    url: '/vue-admin-template/file/listAllFiles',
    method: 'get',
  })
}
