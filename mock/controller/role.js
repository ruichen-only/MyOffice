const data = [
  { roleId: 1, roleName: '系统管理员' },
  { roleId: 2, roleName: '普通用户' },
  { roleId: 3, roleName: '未审批用户' },
]

module.exports = [
  {
    url: '/vue-admin-template/role/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data,
      }
    },
  },
]
