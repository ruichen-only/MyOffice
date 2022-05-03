import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/vue-admin-template/mynote/findAll',
    method: 'get',
  })
}

export function updateById(data) {
  return request({
    url: '/vue-admin-template/mynote/updateById',
    method: 'put',
    data,
  })
}

export function deleteById(noteId) {
  return request({
    url: '/vue-admin-template/mynote/deleteById',
    method: 'delete',
    data: { noteId },
  })
}

export function create(data) {
  return request({
    url: '/vue-admin-template/mynote/create',
    method: 'post',
    data,
  })
}
