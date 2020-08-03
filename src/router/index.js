import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            meta: {
                id:'',
                needLogin: false // 需要登录　
            },
            component: resolve => require(['@/view/login'], resolve)
        },
        {
            path: '/',
            name: 'List',
            component: resolve => require(['@/view/list'], resolve),
            children: [{ //数据质量情况
                    path: '/situation/overall',
                    name: 'situationOverall',
                    meta: {
                        id:'M101',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/situation/overall'], resolve)
                },
                {
                    path: '/situation/main',
                    name: 'situationMain',
                    meta: {
                        id:'M102',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/situation/main'], resolve)
                },
                {
                    path: '/situation/vice',
                    name: 'situationVice',
                    meta: {
                        id:'M103',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/situation/vice'], resolve)
                },
                { //数据质量分析
                    path: '/analyse/overall',
                    name: 'analyseOverall',
                    meta: {
                        id:'M201',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/analyse/overall'], resolve)
                },
                {
                    path: '/analyse/main',
                    name: 'analyseMain',
                    meta: {
                        id:'M202',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/analyse/main'], resolve)
                },
                {
                    path: '/analyse/vice',
                    name: 'analyseVice',
                    meta: {
                        id:'M203',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/analyse/vice'], resolve)
                },
                { //问题明细数据
                    path: '/detailed/overall',
                    name: 'detailedOverall',
                    meta: {
                        id:'M301',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/detailed/overall'], resolve)
                },
                {
                    path: '/detailed/main',
                    name: 'detailedMain',
                    meta: {
                        id:'M302',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/detailed/main'], resolve)
                },
                {
                    path: '/detailed/vice',
                    name: 'detailedVice',
                    meta: {
                        id:'M303',
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/detailed/vice'], resolve)
                },
                { //组织管理
                    path: 'organizeManage/contrastTable',
                    name: 'contrastTable',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/organizeManage/contrastTable'], resolve)
                },
                {
                    path: 'organizeManage/organizeFrame',
                    name: 'organizeFrame',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/organizeManage/organizeFrame'], resolve)
                },
                { //知识库应用
                    path: '/kbs/queryObject',
                    name: 'queryObject',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/kbs/queryObject'], resolve)
                },
                {
                    path: '/kbs/docManager',
                    name: 'docManager',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/kbs/docManager'], resolve)
                },
                { //系统管理
                    path: '/systemManage/roleManage',
                    name: 'roleManage',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/systemManage/roleManage'], resolve) //角色管理页
                },
                {
                    path: '/systemManage/accountManage',
                    name: 'accountManage',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/systemManage/accountManage'], resolve) //账号管理页
                },
                { //设备信息智能纠错
                    path: '/correct/equipCorrect',
                    name: 'equipCorrect',
                    meta: {
                        needLogin: true
                    },
                    component: resolve => require(['@/view/correct/equipinfoCorrect'], resolve) //设备纠错结果
                },
                {
                    path: '/correct/correctDetailMain',
                    name: 'correctDetailMain',
                    meta: {
                        needLogin: true
                    },
                    component: resolve => require(['@/view/correct/equipinfoCorrectMain'], resolve) //纠错明细(主网)
                },
                {
                    path: '/correct/correctDetailVice',
                    name: 'correctDetailVice',
                    meta: {
                        needLogin: true // 需要登录　
                    },
                    component: resolve => require(['@/view/correct/equipinfoCorrectVice'], resolve) //纠错明细(配网)
                }
            ]
        },
    ]
})
