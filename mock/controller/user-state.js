const data = [
  { userStateId: 0, userStateName: '被屏蔽' },
  { userStateId: 1, userStateName: '正常状态' },
]

module.exports = [
  {
    url: '/vue-admin-template/user-state/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data,
      }
    },
  },
]
