const Mock = require('mockjs')

const data = Mock.mock({
  items: [
    {
      noteId: 1,
      noteTitle: '个人工作',
      noteContent: '个人工作',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
    {
      noteId: 1,
      noteTitle: '教师分类毕业设计项目总结',
      noteContent: '教师分类毕业设计项目总结',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
    {
      noteId: 3,
      noteTitle: '快速记事快速记事快速记事快速记事快速记事',
      noteContent: '快速记事快速记事快速记事快速记事快速记事',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
    {
      noteId: 4,
      noteTitle: '记事本',
      noteContent: '记事本',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
    {
      noteId: 5,
      noteTitle: '办公自动化',
      noteContent: '办公自动化',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
    {
      noteId: 6,
      noteTitle: '本月工作总结',
      noteContent: '本月工作总结',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
    {
      noteId: 7,
      noteTitle: 'Dot Net代码规范',
      noteContent: 'Dot Net代码规范',
      createTime: '2022-1-12 13:00:00',
      createUser: '@cname',
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/mynote/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
  {
    url: '/vue-admin-template/mynote/updateById',
    type: 'put',
    response: (config) => {
      const note = config.body
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].noteId == note.noteId) {
          data.items[i] = Object.assign(note)
        }
      }
      return {
        code: 20000,
        msg: '便签更新成功',
      }
    },
  },
  {
    url: '/vue-admin-template/mynote/deleteById',
    type: 'delete',
    response: (config) => {
      const { noteId } = config.body
      const index = data.items.findIndex((item) => item.noteId === noteId)
      data.items.splice(index, 1)
      return {
        code: 20000,
        msg: '便签删除成功',
      }
    },
  },
  {
    url: '/vue-admin-template/mynote/create',
    type: 'post',
    response: (config) => {
      const note = config.body
      note.noteId = Mock.mock('@id')
      data.items.push(note)
      return {
        code: 20000,
        msg: '便签创建成功',
      }
    },
  },
]
