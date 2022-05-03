import request from '@/utils/request'

export function search(params) {
  return request({
    url: '/vue-admin-template/manual-sign/search',
    method: 'get',
    params,
  })
}
