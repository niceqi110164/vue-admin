<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">
                    {{item.meta.title}}
                </span>
                <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    import pathToRegexp from 'path-to-regexp';
    export default {
        data(){
            return {
                levelList:null
            }
        },
        watch:{
            $route(){
                this.getBreadcrumb()
            }
        },
        created(){
            this.getBreadcrumb();
        },
        methods:{
            getBreadcrumb(){
                /**
                 * $route.matched
                 * 一个数组,包含当前路由的所有嵌套路径片段的路由记录.路由记录就是routes配置数组中的对象副本(还有在children数组)
                 * vue的$route.matched获取的路由记录都是相同的
                 *  */
                let matched = this.$route.matched.filter(item=>item.name);
                const first = matched[0];
                if(first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()){
                    matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
                }
                this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
            },
            pathCompile(path){
                // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
                const {params} = this.$route;
                window.console.log(this.$route);
                //用于将字符串准换为有效路径
                let toPath = pathToRegexp.compile(path);
                return topath(params)
            },
            handleLink(item){
                window.console.log(item);
                const {redirect,path} = item;
                if(redirect){
                    this.$router.push(redirect);
                    return
                }
                this.$router.push(this.pathCompile(path)) // /icon
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 8px;
        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }
</style>