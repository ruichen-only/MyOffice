const Mock = require('mockjs')

const data = Mock.mock({
  items: [
    {
      value: 'common',
      label: '一般消息',
    },
    {
      value: 'emergency',
      label: '紧急消息',
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/message-type/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
]
