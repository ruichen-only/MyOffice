const Mock = require('mockjs')

const data = Mock.mock({
  items: [
    {
      fileId: '1',
      fileName: '公共文档',
      fileType: 1,
      fileTypeName: '文件夹',
      fileTypeImage: 'folder',
      fileTypeSuffix: '',
      remark: '@csentence(1, 50)',
      fileOwner: '@cname()',
      createDate: '@datetime()',
      parentId: '',
      filePath: '',
      ifDelete: '2',
    },
    {
      fileId: '2',
      fileName: '管理制度',
      fileType: 1,
      fileTypeName: '文件夹',
      fileTypeImage: 'folder',
      fileTypeSuffix: '',
      remark: '@csentence(1, 50)',
      fileOwner: '@cname()',
      createDate: '@datetime()',
      parentId: '',
      filePath: '',
      ifDelete: '2',
    },
    {
      fileId: '3',
      fileName: '部门文档',
      fileType: 1,
      fileTypeName: '文件夹',
      fileTypeImage: 'folder',
      fileTypeSuffix: '',
      remark: '@csentence(1, 50)',
      fileOwner: '@cname()',
      createDate: '@datetime()',
      parentId: '',
      filePath: '',
      ifDelete: '2',
    },
    {
      fileId: '33',
      fileName: '研发部',
      fileType: 1,
      fileTypeName: '文件夹',
      fileTypeImage: 'folder',
      fileTypeSuffix: '',
      remark: '@csentence(1, 50)',
      fileOwner: '@cname()',
      createDate: '@datetime()',
      parentId: '3',
      filePath: '',
      ifDelete: '2',
    },
    {
      fileId: '333',
      fileName: '部门员工介绍',
      fileType: 1,
      fileTypeName: '文件夹',
      fileTypeImage: 'folder',
      fileTypeSuffix: '',
      remark: '@csentence(1, 50)',
      fileOwner: '@cname()',
      createDate: '@datetime()',
      parentId: '33',
      filePath: '',
      ifDelete: '2',
    },
    {
      fileId: '3333',
      fileName: '员工基本资料',
      fileType: 2,
      fileTypeName: 'word',
      fileTypeImage: 'word',
      fileTypeSuffix: '.doc',
      remark: '@csentence(1, 50)',
      fileOwner: '@cname()',
      createDate: '@datetime()',
      parentId: '333',
      filePath: '',
      ifDelete: '2',
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/file/listAllFiles',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
]
