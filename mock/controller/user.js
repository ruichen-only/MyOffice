const Mock = require('mockjs')

const tokens = {
  admin: {
    token: 'admin-token',
  },
  editor: {
    token: 'editor-token',
  },
}

const userInfo = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
  },
}

const roleData = {
  1: '系统管理员',
  2: '普通用户',
  3: '未审批用户',
}

const userStateData = {
  0: '被屏蔽',
  1: '正常状态',
}

const data = Mock.mock({
  'items|3': [
    {
      'userId|+1': 1,
      username: '@cname',
      password: '@word(6)',
      branchId: '@natural(1, 15)',
      'branchName|+1': [
        '华北电力科学研究院',
        '中国科学院声学研究所',
        '北大青鸟集团',
        '大唐国际盘山发电有限公司',
        '青岛恒源田地有限公司',
        '阿里巴巴有限公司',
      ],
      deptId: '@natural(1, 15)',
      'deptName|+1': [
        '销售部',
        '研发部',
        '财务部',
        '发电部',
        '综合部',
        '培训部',
      ],
      'gender|+1': ['0', '1'],
      roleId: '@natural(1, 3)',
      roleName: function () {
        return roleData[this.roleId]
      },
      userStateId: '@natural(0, 1)',
      userStateName: function () {
        return userStateData[this.userStateId]
      },
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: (config) => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.',
        }
      }

      return {
        code: 20000,
        data: token,
      }
    },
  },
  {
    url: '/vue-admin-template/user/info.*',
    type: 'get',
    response: (config) => {
      const { token } = config.query
      const info = userInfo[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.',
        }
      }

      return {
        code: 20000,
        data: info,
      }
    },
  },
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        data: 'success',
      }
    },
  },
  {
    url: '/vue-admin-template/user/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
  {
    url: '/vue-admin-template/user/deleteByIds',
    type: 'delete',
    response: (config) => {
      const { userIds } = config.body
      data.items = data.items.filter((item) => !userIds.includes(item.userId))
      return {
        code: 20000,
        msg: '用户删除成功',
      }
    },
  },
  {
    url: '/vue-admin-template/user/deleteById',
    type: 'delete',
    response: (config) => {
      const { userId } = config.body
      const index = data.items.findIndex((item) => item.userId === userId)
      data.items.splice(index, 1)
      return {
        code: 20000,
        msg: '用户删除成功',
      }
    },
  },
  {
    url: '/vue-admin-template/user/create',
    type: 'post',
    response: (config) => {
      const user = Object.assign({}, config.body)
      user.userId = Mock.mock('@id')
      data.items.push(user)
      return {
        code: 20000,
        msg: '用户创建成功',
      }
    },
  },
  {
    url: '/vue-admin-template/user/updateById',
    type: 'put',
    response: (config) => {
      const user = Object.assign({}, config.body)
      const index = data.items.findIndex((item) => item.userId === user.userId)
      data.items.splice(index, 1, user)
      return {
        code: 20000,
        msg: '用户更新成功',
      }
    },
  },
]
