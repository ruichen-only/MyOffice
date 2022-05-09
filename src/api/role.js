import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/role/findAll',
    method: 'get',
  })
}
