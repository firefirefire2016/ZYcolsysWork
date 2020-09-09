import Login from "../pages/login";
import sysShow from "../pages/admin/dashboard/sysShow";
import zyContractList from "../pages/admin/zyContract/zyContractList";
import zyContractEdit from "../pages/admin/zyContract/zyContractEdit";
import editdemo from "../pages/admin/zyContract/editdemo";
import NoMatch from "../pages/404";
import zyRentList from "../pages/admin/zyCollection/zyRentList";
import propertyRight from "../pages/admin/baseInfo/propertyRight";
import zyUnitList from "../pages/admin/baseInfo/zyUnitList";




export const mainRoutes = [{
    path: '/login',
    component: Login
}, {
    path: '/noMatch',
    component: NoMatch
}]

export const adminRoutes = [
    {
        path: '/admin/sysShow',
        component: sysShow,
        title: '首页看板',
        isShow: true,
        icon: 'icon-zhanshi'
    }, {
        path: '/admin/propertyRight',
        component: propertyRight,
        title: '产权资料',
        isShow: true,
        icon: 'icon-zhanshi'
    },
    {
        path: '/admin/zyContract',
        component: zyContractList,
        exact: true,
        title: '合同管理',
        isShow: true,
        icon: 'icon-hetongguanli'
    }, {
        icon: 'icon-shouyetubiao-05',
        path: '/admin/zyCollection',
        component: zyRentList,
        exact: true,
        title: '租赁管理',
        isShow: true
    }, {
        path: '/admin/zyContract/edit/:id',
        component: zyContractEdit,
        isShow: false
    }
]

export const admins = [
    {
        icon: 'icon-zhanshi',
        title: '基础资料',
        path: '/admin/baseInfo',
        isShow: true,
        component: sysShow,
        children:
            [{
                path: '/admin/sysShow',
                component: sysShow,
                title: '首页看板',
                isShow: true,
                icon: 'icon-zhanshi'
            }, {
                path: '/admin/propertyRight',
                component: propertyRight,
                title: '产权资料',
                isShow: true,
                icon: 'icon-zhanshi'
            }, {
                path: '/admin/zyUnit',
                component: zyUnitList,
                title: '单位资料',
                isShow: true,
                icon: 'icon-zhanshi'
            }
            ]
    },
    {
        icon: 'icon-zhanshi',
        title: '物业管理',
        path: '/admin/propertyWork',
        component: zyContractList,
        isShow: true,
        children: [
            {
                path: '/admin/zyContract',
                component: zyContractList,
                exact: true,
                title: '合同管理',
                isShow: true,
                icon: 'icon-hetongguanli'
            }, {
                icon: 'icon-shouyetubiao-05',
                path: '/admin/zyCollection',
                component: zyRentList,
                // exact:true,
                title: '租赁管理',
                isShow: true
            }, {
                path: '/admin/zyContract/edit',
                component: zyContractEdit,
                isShow: false
            }, {
                path: '/admin/zyContract/createOne',
                component: zyContractEdit,
                isShow: false
            }]
    }
]