import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/vue-admin-template/schedule/findAll',
    method: 'get',
  })
}

export function searchDepSchedule() {
  return request({
    url: '/vue-admin-template/schedule/searchDepSchedule',
    method: 'get',
  })
}

export function updateById(data) {
  return request({
    url: '/vue-admin-template/schedule/updateById',
    method: 'put',
    data,
  })
}

export function deleteById(scheduleId) {
  return request({
    url: '/vue-admin-template/schedule/deleteById',
    method: 'delete',
    data: { scheduleId },
  })
}

export function create(data) {
  return request({
    url: '/vue-admin-template/schedule/create',
    method: 'post',
    data,
  })
}
