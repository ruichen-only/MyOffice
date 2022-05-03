const Mock = require('mockjs')

const data = Mock.mock({
  items: [
    {
      value: 'annual meeting',
      label: '公司年会',
    },
    {
      value: 'institutional meetings',
      label: '机构会议',
    },
    {
      value: 'departmental meetings',
      label: '部门会议',
    },
    {
      value: 'team meeting',
      label: '小组会议',
    },
    {
      value: 'external cooperation meeting',
      label: '外部合作会议',
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/meeting-info/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
]
