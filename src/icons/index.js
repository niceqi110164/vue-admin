/**Created by xiaoqi on 2019/3/23*/
import Vue from 'vue';
import SvgIcon from '../components/SvgIcon';
//全局组件
Vue.component('svg-icon',SvgIcon);

/**
 * require.context
 *您可以使用该require.context()函数创建自己的上下文。
 *它允许您传入一个目录进行搜索，一个标志指示是否应该搜索子目录，还有一个正则表达式来匹配文件。
 * */
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req)