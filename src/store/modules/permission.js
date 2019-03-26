/**Created by xiaoqi on 2019/3/25*/
import {asyncRoutes, constantRoutes} from '../../router/index.js';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * 遍历roles(角色数组)
 * 使用当前项(role)与路由对象中的roles(角色数组)进行判断
 * 如果路由对象中的roles(角色数组)中包含当前项(role) 返回true 反之返回false
 * 这样就可以过滤出包含roles(角色数组)的路由数组
 * @param roles //['admin','edit']
 * @param route
 * */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * 递归过过滤异步路由表,返回符合用户角色权限的路由表
 *
 * @param routes //asyncRoutes
 * @param roles  eg:['editor']
 * */

export function filterAsyncRoutes(routes,roles){
    const res = [];
    //遍历路由数组
    routes.forEach(route=>{ // route ==> item 每一项
        const tmp = {...route};//扩展对象
        if(hasPermission(roles,tmp)){
            if(tmp.children){
                /**
                 * 递归children数组 会重新创建 const res = [] 这个是children的
                 * 与父级无关
                 * 父级会用父级的  const res = []
                 * */
                tmp.children = filterAsyncRoutes(tmp.children,roles)
            }
            res.push(tmp)
        }
    });
    return res
}

const permission = {
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes;
            state.routes = constantRoutes.concat(routes)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            //window.console.log(data);
            return new Promise(resolve => {
                const { roles } = data;
                let accessedRoutes;
                if (roles.includes('admin')) {
                    accessedRoutes = asyncRoutes
                } else {
                    accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                    //window.console.log(accessedRoutes);
                }
                commit('SET_ROUTES', accessedRoutes);
                resolve(accessedRoutes)
            })
        }
    },
    getters:{
        permission_routes:state=>state.routes,
        addRoutes:state=>state.addRoutes
    }
};

export default permission



















