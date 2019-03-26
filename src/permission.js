/**Created by xiaoqi on 2019/3/22*/

import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from './utils/auth'
//进度条步显示文字
NProgress.configure({showSpinner: false});

/**
 *@hasPermission
 * roles  type:array 角色数组
 * permissionRoles   允许角色
 * */
function hasPermission(roles, permissionRoles) {
    //判断一个数组是否包含一个指定的值
    if (roles.includes('admin')) return true;
    if (!permissionRoles) return true;
    return roles.some(role => permissionRoles.indexOf(role) >= 0);
}

const whiteList = ['/login', 'auth-redirect'];

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    NProgress.start();
    //window.console.log(getToken());
    if (getToken()) {
        /**has token*/
        if (to.path === '/login') {
            next({path: '/'});
            NProgress.done();
        } else {
            //判断档期那用户是否已经拉取完user_info
            if (store.getters.roles.length === 0) {
                //window.console.log(store.getters.roles);
                store.dispatch('GetUserInfo')
                    .then(res => {
                        //拉取user_info
                        const roles = res.data.roles;
                        store.dispatch('GenerateRoutes', {roles})
                            .then(accessRouters => {
                                //根据roles权限生产可访问的路由表
                                router.addRoutes(accessRouters);//动态添加可访问路由表
                                next({...to, replace: true})//hack方法,确保addRoutes已完成,

                            })
                    })
                    .catch(err => {
                        store.dispatch('FedLogOut').then(() => {
                            Message.error(err);
                            next({ path: '/' })
                        })
                    })
            } else {
                //没有动态改变权限的需求可直接next(),删除下方权限判断↓
                if (hasPermission(store.getters.roles, to.meta.roles)) {
                    next()
                } else {
                    next({path: '/401', replace: true, query: {noGoBack: true}})
                }
                // 可删 ↑
            }
        }
    }else{
        /**has no token*/
        if(whiteList.indexOf(to.path)!==-1){
            // 在免登录白名单，直接进入
            next()
        }else{
            next(`/login?redirect=${to.path}`);//否则全部中定向到登录页面
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done() // finish progress bar
});