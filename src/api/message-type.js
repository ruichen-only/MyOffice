import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/vue-admin-template/message-type/findAll',
    method: 'get',
  })
}
