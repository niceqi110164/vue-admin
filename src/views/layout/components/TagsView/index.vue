<template>
    <div class="tags-view-container">
        <!--ref="scrollContainer"
         :vertical="false"
         class="scroll-container"
         @wheel.native.prevent="handleScroll"-->
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag)?'active':''"
                :to="{path:tag.path,query:tag.query,fullPath:tag.fullPath}"
                tag="span"
                class="tags-view-item"
                @click.middle.native="closeSelectedTag(tag)"
                @contextmenu.prevent.native="openMenu(tag,$event)"
            >
                {{tag.title}}
                <!--
                @click.stop 阻止事件冒泡
                @click.prevent 阻止事件的默认行(a标签的跳转)
                @click.native 可以理解为该修饰符的作用就是把一个vue组件转化为一个普通的HTML标签
                @contextmenu右键菜单
                -->
                <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></span>
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">refresh</li>
            <li v-if="!(selectedTag.meta && selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">
                close
            </li>
            <li @click="closeOthersTags">closeOthers</li>
            <li @click="closeAllTags(selectedTag)">closeAll</li>
        </ul>
    </div>
</template>

<script>
    import path from 'path'
    import ScrollPane from './ScrollPane.vue'

    export default {
        components:{ScrollPane},
        data(){
            return {
                visible:false,
                top:0,
                left:0,
                selectedTag:{},
                affixTags:[]
            }
        },
        computed:{
            visitedViews(){
                return this.$store.state.tagsView.visitedViews
            },
            routes(){//路由数组
                //window.console.log(this.$store.state.permission.routes);
                return this.$store.state.permission.routes
            }
        },
        watch:{
            $route(){
                this.addTags();
                this.moveToCurrentTag();
            },
            visible(value){
                if(value){
                    document.body.addEventListener('click',this.closeMenu)
                }else{
                    document.body.addEventListener('click',this.closeMenu)
                }
            }
        },
        mounted(){
            this.initTags();
            this.addTags();
        },
        methods:{
            isActive(route){
                return route.path === this.$route.path
            },
            filterAffixTags(routes,basePath = '/'){
                let tags = [];
                routes.forEach(route => {
                    if(route.meta && route.meta.affix){
                        /**
                         * path.resolve([arg1,arg2,...])根据参数的不同，返回值存在两种情况。
                         * 1.每个参数都不带'/'，比如path.resolve(),或者path.resolve('path1','path2')，或者path.resolve('./path');
                         * 2.一个或多个参数最开头带'/'符号 path.resolve('/path');
                         * 返回值分别为：
                         *  1.绝对路径
                         *  2.相对路径
                         * 1.参数为空：
                         * path.resolve() //输出：当前文件所在文件夹路径  === __dirname
                         * 2.参数为文件夹名字(参数>=1):
                         * path.resolve('path') //输出：当前文件所在文件夹绝对路径/path
                         * path.resolve('path1','path2') //当前文件所在文件夹绝对路径/path1/path2
                         *  path.resolve('path1','path2'.......'pathX')//当前文件所在文件夹绝对路径/path1/path2...../pathX
                         * 3.某个参数为'./'+文件名
                         * path.resolve('./path') //当前文件所在文件夹绝对路径/path
                         * path.resolve('path1','./path2') //当前文件所在文件夹绝对路径/path1/path2
                         * 4.文件夹名字前加了'/'
                         * 注意，无论是第几个文件前加了/！！！最终路径都为：/+‘最后一个前面加/的文件文件名’+‘剩下文件夹’
                         * 4.1 path.resolve('/path') //输出: /path
                         * 4.2.1 path.resolve('path1','path2','/path3') //输出: /path3
                         * 4.2.2 path.resolve('path1','/path2','/path3') // /path3
                         * 4.3  path.resolve('path1','/path2','path3') // /path2/path3
                         * */
                        const tagPath = path.resolve(basePath,route.path);// '/'+ route.path
                        tags.push({
                            fullPath:tagPath,
                            path:tagPath,
                            name:route.name,
                            meta:{...route.meta}
                        })
                    }

                    if(route.children){
                        const tempTags = this.filterAffixTags(route.children,route.path);
                        //window.console.log(tempTags);
                        if(tempTags.length >= 1){
                            tags=[...tags,...tempTags];
                        }
                    }
                });
                //window.console.log(tags);
                return tags
            },
            initTags(){
                //过滤路由数组
                const affixTags = this.affixTags = this.filterAffixTags(this.routes);
                //循环数组
                for(const tag of affixTags){
                    //Must have tag name
                    if(tag.name){
                        this.$store.dispatch('addVisitedView',tag)
                    }
                }
            },
            addTags(){
                //window.console.log(this.$route);
                const {name} = this.$route;
                if(name){
                    this.$store.dispatch('addView',this.$route)
                }
                return false
            },
            moveToCurrentTag() {
                const tags = this.$refs.tag;
                //window.console.log(tags);
                this.$nextTick(() => {
                    for (const tag of tags) {
                        if (tag.to.path === this.$route.path) {
                            this.$refs.scrollPane.moveToTarget(tag);
                            // when query is different then update
                            if (tag.to.fullPath !== this.$route.fullPath) {
                                this.$store.dispatch('updateVisitedView', this.$route)
                            }
                            break
                        }
                    }
                })
            },
            //refresh 刷新
            refreshSelectedTag(view){
                this.$store.dispatch('delCachedView',view).then(()=>{
                    const {fullPath} = view;
                    //window.console.log(view);
                    this.$nextTick(() => {
                        this.$router.replace({
                            path: '/redirect' + fullPath
                        })
                    })
                })
            },
            closeSelectedTag(view){
                this.$store.dispatch('delView',view).then(({visitedViews})=>{
                    if(this.isActive(view)){
                        this.toLastView(visitedViews)
                    }
                })
            },
            closeOthersTags(){
                this.$router.push(this.selectedTag);
                this.$store.dispatch('delOthersViews',this.selectedTag).then(()=>{
                    this.moveToCurrentTag()
                })
            },
            closeAllTags(view){
                this.$store.dispatch('delAllViews').then(({visitedViews})=>{
                    if(this.affixTags.some(tag=>tag.path===view.path)){
                        return
                    }
                    this.toLastView(visitedViews)
                })
            },
            toLastView(visitedViews){
                const latestView = visitedViews.slice(-1)[0];
                if(latestView){
                    this.$router.push(latestView)
                }else{
                    this.$router.push('/')
                }
            },
            openMenu(tag,e){
                const menuMinWidth = 105;
                //window.console.log(this.$el.offsetWidth);
                const offsetLeft = this.$el.getBoundingClientRect().left;//container margin left(210)
                const offsetWidth = this.$el.offsetWidth;//container width
                const maxLeft = offsetWidth - menuMinWidth; // left boundary
                const left = e.clientX - offsetLeft + 15; //15:margin right

                if(left > maxLeft){
                    this.left = maxLeft
                }else{
                    this.left = left
                }

                this.top = e.clientY;
                this.visible = true;
                this.selectedTag = tag;
            },
            closeMenu(){
                this.visible = false;
            }
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .tags-view-container {
        height: 34px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
        .tags-view-wrapper {
            .tags-view-item {
                display: inline-block;
                position: relative;
                cursor: pointer;
                height: 26px;
                line-height: 26px;
                border: 1px solid #d8dce5;
                color: #495060;
                background: #fff;
                padding: 0 8px;
                font-size: 12px;
                margin-left: 5px;
                margin-top: 4px;
                &:first-of-type {
                    margin-left: 15px;
                }
                &:last-of-type {
                    margin-right: 15px;
                }
                &.active {
                    background-color: #42b983;
                    color: #fff;
                    border-color: #42b983;
                    &::before {
                        content: '';
                        background: #fff;
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        position: relative;
                        margin-right: 2px;
                    }
                }
            }
        }
        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 100;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
            li {
                margin: 0;
                padding: 7px 16px;
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    //reset element css of el-icon-close
    .tags-view-wrapper {
        .tags-view-item {
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;
                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }
                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
</style>