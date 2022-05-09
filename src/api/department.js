import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/department/findAll',
    method: 'get',
  })
}

export function deleteById(deptId) {
  return request({
    url: '/department/deleteById',
    method: 'delete',
    data: { deptId },
  })
}

export function deleteByIds(deptIds) {
  return request({
    url: '/department/deleteByIds',
    method: 'delete',
    data: { deptIds },
  })
}

export function create(data) {
  return request({
    url: '/department/create',
    method: 'post',
    data,
  })
}

export function updateById(data) {
  return request({
    url: '/department/updateById',
    method: 'put',
    data,
  })
}
