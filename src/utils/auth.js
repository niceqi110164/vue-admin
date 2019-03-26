/**Created by xiaoqi on 2019/3/23*/
import Cookies from 'js-cookie'

const TokenKey = 'Access-Token';

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}