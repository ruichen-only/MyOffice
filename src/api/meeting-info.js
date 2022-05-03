import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/vue-admin-template/meeting-info/findAll',
    method: 'get',
  })
}
