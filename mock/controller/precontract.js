const Mock = require('mockjs')

const data = Mock.mock({
  items: [
    {
      value: 1,
      label: '华北电力科学研究院',
      children: [
        {
          value: 2,
          label: '销售部',
          icon: 'tree-department',
          children: [
            {
              value: 3,
              label: '李贝贝',
              department: '销售部',
              icon: 'person',
            },
            {
              value: 4,
              label: '齐静雪',
              department: '销售部',
              icon: 'person',
            },
            {
              value: 5,
              label: '杨嘉丽',
              department: '销售部',
              icon: 'person',
            },
          ],
        },
      ],
    },
    {
      value: 6,
      label: '中国科学院声学研究所',
      children: [
        {
          value: 7,
          label: '研发部',
          icon: 'tree-department',
          children: [
            {
              value: 8,
              department: '研发部',
              label: '系统管理员',
              icon: 'person',
            },
            {
              value: 9,
              department: '研发部',
              label: '武丽平',
              icon: 'person',
            },
          ],
        },
      ],
    },
    {
      value: 10,
      label: '北大青鸟集团',
      icon: 'folder',
      children: [
        {
          value: 11,
          label: '财务部',
          icon: 'tree-department',
          children: [],
        },
        {
          value: 12,
          label: '综合部',
          icon: 'tree-department',
          children: [
            {
              value: 13,
              department: '综合部',
              label: '刘广平',
              icon: 'person',
            },
          ],
        },
        {
          value: 14,
          label: '培训部',
          icon: 'tree-department',
          children: [
            {
              value: 15,
              department: '培训部',
              label: '王超',
              icon: 'person',
            },
          ],
        },
      ],
    },
    {
      value: 16,
      label: '大唐国际盘山发电有限公司',
      children: [
        {
          value: 17,
          label: '发电部',
          children: [
            {
              value: 18,
              department: '发电部',
              label: '姬耀钦',
              icon: 'person',
            },
            {
              value: 19,
              department: '发电部',
              label: '袁斌',
              icon: 'person',
            },
          ],
        },
      ],
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/precontract/findAll',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
]
