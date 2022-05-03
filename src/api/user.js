import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data,
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post',
  })
}

export function findAll() {
  return request({
    url: '/vue-admin-template/user/findAll',
    method: 'get',
  })
}

export function deleteById(userId) {
  return request({
    url: '/vue-admin-template/user/deleteById',
    method: 'delete',
    data: { userId },
  })
}

export function deleteByIds(userIds) {
  return request({
    url: '/vue-admin-template/user/deleteByIds',
    method: 'delete',
    data: { userIds },
  })
}

export function create(data) {
  return request({
    url: '/vue-admin-template/user/create',
    method: 'post',
    data,
  })
}

export function updateById(data) {
  return request({
    url: '/vue-admin-template/user/updateById',
    method: 'put',
    data,
  })
}
