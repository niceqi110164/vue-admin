/**Created by xiaoqi on 2019/3/22*/
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

/**Layout*/
import Layout from '../views/layout/Layout';
/**Router Modules*/
// import componentsRouter  from './mudules/components'
// import chartsRouter from './mudules/charts '
// import tableRouter from './mudules/table'
// import treeTableRouter from './mudules/tree-table '
// import nestedRouter from './mudules/nested'

export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('../views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../views/login/index.vue'),
    },
    {
        path: '/auth-redirect',
        component: () => import('../views/login/authredirect.vue'),
        hidden:true
    },
    {
        path: '/404',
        component: () => import('../views/errorPage/404.vue'),
        hidden:true
    },
    {
        path: '/403',
        component: () => import('../views/errorPage/401.vue'),
        hidden:true
    },
    {
        path: '',
        component:Layout,
        redirect: '/dashboard',
        children:[
            {
                path:'dashboard',
                component:()=>import('../views/dashboard/index.vue'),
                name:'Dashboard',
                meta:{title:'dashboard',icon:'dashboard',noCache:true,affix:true}
            }
        ]
    },
    {
        path:'/documentation',
        component:Layout,
        children:[
            {
                path:'index',
                component:()=>import('../views/documentation/index.vue'),
                name:'Documentation',
                meta:{
                    title:'documentation',
                    icon:'documentation',
                    affix:false
                }
            }
        ]
    },
    {
        path:'/guide',
        component:Layout,
        redirect:'/guide/index',
        children:[
            {
                path:'/guide',
                component:()=>import('../views/guide/index'),
                name:'Guide',
                meta:{
                    title:'guide',
                    icon:'guide',
                    noCache:true
                }
            }
        ]
    }
];

export default new VueRouter({
    scrollBehavior:()=>({y:0}),
    routes:constantRoutes
})

export const asyncRoutes = [
    {
        path:'/permission',
        component:Layout,
        redirect:'/permission/index',
        alwaysShow:true,
        meta:{
            title:'permission',
            icon:'lock',
            roles:['admin','editor']
        },
        children:[
            {
                path:'page',
                component:()=>import('../views/permission/page'),
                name:'PagePermission',
                meta:{
                    title: 'pagePermission',
                    //roles: ['admin'] // or you can only set roles in sub nav
                }
            },
            {
                path:'directive',
                component:()=>import('../views/permission/directive'),
                name:'DirectivePermission',
                meta:{
                    title:'directivePermission'
                }
            },
            {
                path:'role',
                component:()=>import('../views/permission/role'),
                name:'RolePermission',
                meta:{
                    title:'rolePermission',
                    roles:['admin']
                }
            }
        ]
    },
    {
        path: '/icon',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('../views/svg-icons/index'),
                name: 'Icons',
                meta: { title: 'icons', icon: 'icon', noCache: true }
            }
        ]
    },
    /** When your routing table is too long, you can split it into small modules**/
    // componentsRouter,
    // chartsRouter,
    // nestedRouter,
    // tableRouter,
    // treeTableRouter,
    /**
    {
        path: '/example',
        component: Layout,
        redirect: '/example/list',
        name: 'Example',
        meta: {
            title: 'example',
            icon: 'example'
        },
        children: [
            {
                path: 'create',
                component: () => import('../views/example/create'),
                name: 'CreateArticle',
                meta: { title: 'createArticle', icon: 'edit' }
            },
            {
                path: 'edit/:id(\\d+)',
                component: () => import('../views/example/edit'),
                name: 'EditArticle',
                meta: { title: 'editArticle', noCache: true },
                hidden: true
            },
            {
                path: 'list',
                component: () => import('../views/example/list'),
                name: 'ArticleList',
                meta: { title: 'articleList', icon: 'list' }
            }
        ]
    },
    {
        path: '/tab',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('../views/tab/index'),
                name: 'Tab',
                meta: { title: 'tab', icon: 'tab' }
            }
        ]
    },
    {
        path: '/error',
        component: Layout,
        redirect: 'noredirect',
        name: 'ErrorPages',
        meta: {
            title: 'errorPages',
            icon: '404'
        },
        children: [
            {
                path: '401',
                component: () => import('../views/errorPage/401'),
                name: 'Page401',
                meta: { title: 'page401', noCache: true }
            },
            {
                path: '404',
                component: () => import('../views/errorPage/404'),
                name: 'Page404',
                meta: { title: 'page404', noCache: true }
            }
        ]
    },
    {
        path: '/error-log',
        component: Layout,
        redirect: 'noredirect',
        children: [
            {
                path: 'log',
                component: () => import('../views/errorLog/index'),
                name: 'ErrorLog',
                meta: { title: 'errorLog', icon: 'bug' }
            }
        ]
    },
    {
        path: '/excel',
        component: Layout,
        redirect: '/excel/export-excel',
        name: 'Excel',
        meta: {
            title: 'excel',
            icon: 'excel'
        },
        children: [
            {
                path: 'export-excel',
                component: () => import('../views/excel/exportExcel'),
                name: 'ExportExcel',
                meta: { title: 'exportExcel' }
            },
            {
                path: 'export-selected-excel',
                component: () => import('../views/excel/selectExcel'),
                name: 'SelectExcel',
                meta: { title: 'selectExcel' }
            },
            {
                path: 'export-merge-header',
                component: () => import('../views/excel/mergeHeader'),
                name: 'MergeHeader',
                meta: { title: 'mergeHeader' }
            },
            {
                path: 'upload-excel',
                component: () => import('../views/excel/uploadExcel'),
                name: 'UploadExcel',
                meta: { title: 'uploadExcel' }
            }
        ]
    },
    {
        path: '/zip',
        component: Layout,
        redirect: '/zip/download',
        alwaysShow: true,
        meta: { title: 'zip', icon: 'zip' },
        children: [
            {
                path: 'download',
                component: () => import('../views/zip/index'),
                name: 'ExportZip',
                meta: { title: 'exportZip' }
            }
        ]
    },
    {
        path: '/pdf',
        component: Layout,
        redirect: '/pdf/index',
        children: [
            {
                path: 'index',
                component: () => import('../views/pdf/index'),
                name: 'PDF',
                meta: { title: 'pdf', icon: 'pdf' }
            }
        ]
    },
    {
        path: '/pdf/download',
        component: () => import('../views/pdf/download'),
        hidden: true
    },
    {
        path: '/theme',
        component: Layout,
        redirect: 'noredirect',
        children: [
            {
                path: 'index',
                component: () => import('../views/theme/index'),
                name: 'Theme',
                meta: { title: 'theme', icon: 'theme' }
            }
        ]
    },
    {
        path: '/clipboard',
        component: Layout,
        redirect: 'noredirect',
        children: [
            {
                path: 'index',
                component: () => import('../views/clipboard/index'),
                name: 'ClipboardDemo',
                meta: { title: 'clipboardDemo', icon: 'clipboard' }
            }
        ]
    },
    {
        path: 'external-link',
        component: Layout,
        children: [
            {
                path: 'https://github.com/PanJiaChen/vue-element-admin',
                meta: { title: 'externalLink', icon: 'link' }
            }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
     */
];


















