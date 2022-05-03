import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '主页', icon: 'el-icon-s-home' },
      },
    ],
  },

  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/mySchedule',
    name: 'Schedule',
    meta: { title: '日程管理', icon: 'schedule' },
    children: [
      {
        path: 'mySchedule',
        name: 'MySchedule',
        component: () => import('@/views/schedule/my-schedule'),
        meta: { title: '我的日程', icon: 'my-schedule' },
      },
      {
        path: 'depSchedule',
        name: 'DepSchedule',
        component: () => import('@/views/schedule/dep-schedule/index'),
        meta: { title: '部门日程', icon: 'dep-schedule' },
      },
      {
        path: 'myNote',
        name: 'MyNote',
        component: () => import('@/views/schedule/my-note/index'),
        meta: { title: '我的便签', icon: 'my-note' },
      },
    ],
  },

  {
    path: '/archive',
    component: Layout,
    redirect: '/archive/file',
    name: 'Archive',
    meta: {
      title: '文档管理',
      icon: 'el-icon-folder',
    },
    children: [
      {
        path: 'file',
        component: () => import('@/views/archive/file/index'),
        name: 'File',
        meta: {
          title: '文档管理',
          icon: 'el-icon-document',
        },
      },
      {
        path: 'recycle',
        component: () => import('@/views/archive/recycle/index'),
        name: 'Recycle',
        meta: {
          title: '回收站',
          icon: 'el-icon-delete',
        },
      },
      {
        path: 'search',
        component: () => import('@/views/archive/search/index'),
        name: 'Search',
        meta: {
          title: '文件搜索',
          icon: 'el-icon-search',
        },
      },
    ],
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/messageMgr',
    name: 'Message',
    meta: { title: '消息传递', icon: 'messages' },
    children: [
      {
        path: 'messageMgr',
        component: () => import('@/views/message/message-manager'),
        name: 'MessageMgr',
        meta: { title: '消息管理', icon: 'message-manager' },
      },
      {
        path: 'mail',
        component: () => import('@/views/message/mail'),
        name: 'Mail',
        meta: { title: '信箱', icon: 'mail-fill' },
      },
    ],
  },

  {
    path: '/time',
    component: Layout,
    redirect: '/time/sign',
    name: 'Time',
    meta: { title: '考勤管理', icon: 'time-manage' },
    children: [
      {
        path: 'sign',
        component: () => import('@/views/time/sign'),
        name: 'Sign',
        meta: { title: '员工签到、签退', icon: 'sign' },
      },
      {
        path: 'timeHistory',
        component: () => import('@/views/time/time-history'),
        name: 'TimeHistory',
        meta: { title: '考勤历史查询', icon: 'time-history' },
      },
      {
        path: 'statistics',
        component: () => import('@/views/time/statistics'),
        name: 'Statistics',
        meta: { title: '考勤统计', icon: 'statistics' },
      },
    ],
  },
]

export const asyncRoutes = [
  {
    path: '/personnel',
    component: Layout,
    redirect: '/personnel/branch',
    name: 'Personnel',
    meta: { title: '人事管理', icon: 'personnel', roles: ['admin'], index: 3 },
    children: [
      {
        path: 'branch',
        name: 'Branch',
        component: () => import('@/views/personnel/branch/index'),
        meta: { title: '机构信息', icon: 'branch', roles: ['admin'] },
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/personnel/department/index'),
        meta: { title: '部门信息', icon: 'department', roles: ['admin'] },
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/personnel/user'),
        meta: { title: '员工管理', icon: 'users', roles: ['admin'] },
      },
    ],
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'system',
      roles: ['admin'],
      index: 7,
    },
    children: [
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'role', roles: ['admin'] },
      },
      {
        path: 'loginLog',
        name: 'LoginLog',
        component: () => import('@/views/system/loginLog'),
        meta: { title: '登录日志', icon: 'login-log', roles: ['admin'] },
      },
      {
        path: 'operateLog',
        name: 'OperateLog',
        component: () => import('@/views/system/operateLog'),
        meta: { title: '操作日志', icon: 'operate-log', roles: ['admin'] },
      },
      {
        path: 'menuOrder',
        name: 'MenuOrder',
        component: () => import('@/views/system/menuOrder'),
        meta: { title: '菜单排序', icon: 'menu-order', roles: ['admin'] },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true, meta: { index: 8 } },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
