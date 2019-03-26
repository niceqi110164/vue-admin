/**Created by xiaoqi on 2019/3/25*/

import request from '../utils/request'

export function loginByUsername(username,password){
    const data = {
        username,
        password
    };
    //window.console.log(data);
    return request({
        url:'doPost',
        method:'post',
        data
    })
}

export function logout(){
    return request({
        url:'',
        method:'post'
    })
}

export function getUserInfo(token){
    return request({
        url:'doGet',
        method:'get',
        params:{token}
    })
}