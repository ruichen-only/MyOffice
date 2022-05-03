const Mock = require('mockjs')

const data = Mock.mock({
  'items|3': [
    {
      userId: '@id',
      userName: '@cname',
      signTime: '@datetime',
      'signTag|+1': ['签到', '签退'],
      signDesc: '@csentence(1,15)',
      'department|+1': [
        '销售部',
        '研发部',
        '财务部',
        '发电部',
        '综合部',
        '培训部',
      ],
      'branch|+1': [
        '华北电力科学研究院',
        '中国科学院声学研究所',
        '北大青鸟集团',
        '大唐国际盘山发电有限公司',
        '青岛恒源田地有限公司',
        '阿里巴巴有限公司',
      ],
    },
  ],
})

module.exports = [
  {
    url: '/vue-admin-template/manual-sign/search',
    type: 'get',
    response: () => {
      return {
        code: 20000,
        data: data.items,
      }
    },
  },
]
