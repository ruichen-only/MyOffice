const Mock = require('mockjs')

const data = Mock.mock({
  items: [
    {
      scheduleId: 1,
      title: '今天下午要会见一个重要级人物。',
      address: 'B03会议室',
      meetingId: 'institutional meetings',
      timeRanges: ['2022-1-11 13:00:00', '2022-1-11 15:00:00'],
      schContent: '进行初次谈判',
      createUser: '@cname',
      createTime: '2022-1-12 13:00:00',
      ifPrivate: '@natural(0, 2)',
    },
  ],
  search: [
    {
      name: '系统管理员',
      '2022-1-9': '',
      '2022-1-10': '',
      '2022-1-11': '',
      '2022-1-12': '◎ 8:30 今天下...',
      '2022-1-13': '',
      '2022-1-14': '',
      '2022-1-15': '',
      item: {
        scheduleId: 1,
        title: '今天下午要会见一个重要级人物。',
        address: 'B03会议室',
        meetingId: 'institutional meetings',
        timeRanges: ['2022-1-11 13:00:00', '2022-1-11 15:00:00'],
        schContent: '进行初次谈判',
        createUser: '@cname',
        createTime: '2022-1-12 13:00:00',
        ifPrivate: '@natural(0, 2)',
      },
    },
    {
      name: '武丽平',
      '2022-1-9': '',
      '2022-1-10': '◎ 14:30 安排新...',
      '2022-1-11': '',
      '2022-1-12': '',
      '2022-1-13': '',
      '2022-1-14': '',
      '2022-1-15': '',
      item: {
        scheduleId: 1,
        title: '今天下午要会见一个重要级人物。',
        address: 'B03会议室',
        meetingId: 'institutional meetings',
        timeRanges: ['2022-1-11 13:00:00', '2022-1-11 15:00:00'],
        schContent: '进行初次谈判',
        createUser: '@cname',
        createTime: '2022-1-12 13:00:00',
        ifPrivate: '@natural(0, 2)',
      },
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/schedule/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
  {
    url: '/vue-admin-template/schedule/searchDepSchedule',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.search,
      }
    },
  },
  {
    url: '/vue-admin-template/schedule/updateById',
    type: 'put',
    response: (config) => {
      const schedule = config.body
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].scheduleId == schedule.scheduleId) {
          data.items[i] = Object.assign(schedule)
        }
      }
      return {
        code: 20000,
        msg: '日程更新成功',
      }
    },
  },
  {
    url: '/vue-admin-template/schedule/deleteById',
    type: 'delete',
    response: (config) => {
      const { scheduleId } = config.body
      const index = data.items.findIndex(
        (item) => item.scheduleId === scheduleId
      )
      data.items.splice(index, 1)
      return {
        code: 20000,
        msg: '日程删除成功',
      }
    },
  },
  {
    url: '/vue-admin-template/schedule/create',
    type: 'post',
    response: (config) => {
      const schedule = config.body
      schedule.scheduleId = Mock.mock('@id')
      data.items.push(schedule)
      return {
        code: 20000,
        msg: '日程创建成功',
      }
    },
  },
]
