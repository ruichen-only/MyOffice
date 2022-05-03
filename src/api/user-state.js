import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/vue-admin-template/user-state/findAll',
    method: 'get',
  })
}
