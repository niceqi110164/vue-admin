/**Created by xiaoqi on 2019/3/22*/
import Cookies from 'js-cookie'
import { getToken, setToken, removeToken } from '../../utils/auth.js'
import {loginByUsername,getUserInfo,logout} from '../../api/login.js'
const user = {
    state:{
        user:'',
        status:'',
        code:'',
        token:getToken(),
        name:'',
        avatar:'',
        introduction:'',
        roles:[],
        setting:{
            articlePlatform: []
        }
    },
    mutations:{
        SET_CODE:(state,code)=>{
            state.code = code
        },
        SET_TOKEN:(state,token)=>{
            window.console.log(token);
            state.token = token
        },
        SET_INTRODUCTION:(state,introduction)=>{
            state.introduction = introduction
        },
        SET_SETTING:(state,setting)=>{
            state.setting = setting
        },
        SET_STATUS:(state,status)=>{
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },
    actions:{
        //用户登录
        LoginByUsername({commit},userInfo){
            const username = userInfo.username.trim();
            return new Promise((resolve,reject)=>{
                loginByUsername(username, userInfo.password).then(response => {
                    const data = response.data;
                    //登录成功后将token存储在cookie之中
                    Cookies.set('Token', data.token);
                    commit('SET_TOKEN', data.token);
                    setToken(data.token);
                    //window.console.log(data)
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //获取用户信息
        GetUserInfo({commit,state}){
            return new Promise((resolve,reject)=>{
                //window.console.log(state.token);
                getUserInfo(state.token).then(response=>{
                    //由于mockjs不支持自定义状态码只能这样hack
                    if(!response.data){
                        reject('失败,请重新登录');
                    }
                    const data =response.data;
                    //验证返回的roles是否是一个非空数组
                    if(data.roles && data.roles.length>0){
                        commit('SET_ROLES',data.roles);
                    }else{
                        reject('roles必须是一个非空数组')
                    }
                    commit('SET_NAME', data.name);
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_INTRODUCTION', data.introduction);
                    resolve(response)
                }).catch((error)=>{
                    reject(error)
                })
            })
        },
        //等出
        LogOut({commit,state}){
            return new Promise((resolve,reject)=>{
                logout(state.token).then(()=>{
                    commit('SET_TOKEN','');
                    commit('SET_ROLES',[]);
                    removeToken();
                    resolve();
                }).catch((error)=>{
                    reject(error)
                })
            })
        },
        //前端登出
        FedLogOut({commit}){
            return new Promise((resolve)=>{
                commit('SET_TOKEN','');
                removeToken();
                resolve();
            })
        },
        //动态修改权限
        ChangeRoles({commit,dispatch},role){
            return new Promise((resolve)=>{
                commit('SET_TOKEN',role);
                setToken(role);
                getUserInfo(role).then(response=>{
                    const data = response.data;
                    commit('SET_ROLES', data.roles);
                    commit('SET_NAME', data.name);
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_INTRODUCTION', data.introduction);
                    dispatch('GenerateRoutes', data);// 动态修改权限后 重绘侧边菜单
                    resolve()
                })
            })
        }

    },
    getters:{
        token:state=>state.token,
        name:state=>state.name,
        avatar:state=>state.avatar,
        introduction:state=>state.introduction,
        status:state=>state.status,
        roles:state=>state.roles,
        setting:state=>state.setting,
    }
};

export default user