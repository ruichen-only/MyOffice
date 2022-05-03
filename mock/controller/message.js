const Mock = require('mockjs')

const data = Mock.mock({
  'items|10': [
    {
      messageId: '@id',
      title: '@title',
      'type|1': ['紧急消息', '一般消息'],
      content: '@csentence(1,15) ',
      fromUser: '@cname',
      toUser: '@cname',
      beginTime: '@datetime',
      endTime: '@datetime',
      createTime: '@date',
      'ifPublish|1': [0, 1],
      'ifRead|1': [0, 1],
    },
  ],
  'users|10': [{ userId: '@id', name: '@cname' }],
})

module.exports = [
  {
    url: '/vue-admin-template/message/searchReceiveMessage',
    type: 'get',
    response: (config) => {
      const { toUserId } = config.query
      return {
        code: 20000,
        data: data.items.slice(0, 3),
      }
    },
  },
  {
    url: '/vue-admin-template/message/search',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
  {
    url: '/vue-admin-template/message/findUser',
    type: 'get',
    response: (config) => {
      const { branch, department, depNo, name } = config.query
      let result = []
      if (name) {
        for (const user of data.users) {
          if (user.userId == name || user.name.indexOf(name) >= 0) {
            result.push(user)
          }
        }
      } else {
        result = data.users
      }
      return {
        code: 20000,
        data: result,
      }
    },
  },
  {
    url: '/vue-admin-template/message/deleteById',
    type: 'delete',
    response: (config) => {
      const { messageId } = config.body
      const index = data.items.findIndex((item) =>
        item.messageId.includes(messageId)
      )
      data.items.splice(index, 1)
      return {
        code: 20000,
        msg: '信息删除成功',
      }
    },
  },
]
