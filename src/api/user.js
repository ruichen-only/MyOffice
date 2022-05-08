import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}

export function findAll() {
  return request({
    url: '/user/findAll',
    method: 'get',
  })
}

export function deleteById(userId) {
  return request({
    url: '/user/deleteById',
    method: 'delete',
    data: { userId },
  })
}

export function deleteByIds(userIds) {
  return request({
    url: '/user/deleteByIds',
    method: 'delete',
    data: { userIds },
  })
}

export function create(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data,
  })
}

export function updateById(data) {
  return request({
    url: '/user/updateById',
    method: 'put',
    data,
  })
}
