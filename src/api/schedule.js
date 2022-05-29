import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/schedule/findAll',
    method: 'get',
  })
}

export function searchDepSchedule() {
  return request({
    url: '/schedule/searchDepSchedule',
    method: 'get',
  })
}

export function updateById(data) {
  return request({
    url: '/schedule/updateById',
    method: 'put',
    data,
  })
}

export function deleteById(scheduleId) {
  return request({
    url: '/schedule/deleteById',
    method: 'delete',
    data: { scheduleId },
  })
}

export function create(data) {
  return request({
    url: '/schedule/create',
    method: 'post',
    data,
  })
}
