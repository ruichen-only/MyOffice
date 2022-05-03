import request from '@/utils/request'

export function search() {
  return request({
    url: '/vue-admin-template/message/search',
    method: 'get',
  })
}

export function findUser(params) {
  return request({
    url: '/vue-admin-template/message/findUser',
    method: 'get',
    params,
  })
}

export function deleteById(messageId) {
  return request({
    url: '/vue-admin-template/message/deleteById',
    method: 'delete',
    data: { messageId },
  })
}

export function searchReceiveMessage(params) {
  return request({
    url: '/vue-admin-template/message/searchReceiveMessage',
    method: 'get',
    params,
  })
}
