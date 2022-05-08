import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/branch/findAll',
    method: 'get',
  })
}

export function deleteById(branchId) {
  return request({
    url: '/branch/deleteById',
    method: 'delete',
    data: { branchId },
  })
}

export function deleteByIds(branchIds) {
  return request({
    url: '/branch/deleteByIds',
    method: 'delete',
    data: { branchIds },
  })
}

export function create(data) {
  return request({
    url: '/branch/create',
    method: 'post',
    data,
  })
}

export function updateById(data) {
  return request({
    url: '/branch/updateById',
    method: 'put',
    data,
  })
}
