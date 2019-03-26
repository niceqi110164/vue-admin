<template>
    <div v-if="!item.hidden" class="menu-wrapper">
        <!-- 判断是不是只有一个子元素 -->
        <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
            <!-- 这个路由对象item 通过hasOneShowingChild(item.children,item) 判断children情况-->
            <!-- 除非这个路由对象有属性 alwaysShow:true  -->
            <!-- 所以这里的意思是: 这个只有一个自路由,自路由没有children,这个路由没有属性 alwaysShow:true -->
            <!-- 那么就将他的唯一自路由放到一级菜单来 -->
            <!--resolvePath(index) => /form/index -->
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
                    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>

    </div>
</template>

<script>
    import path from 'path'
    import { isExternal } from '../../../../utils/validate'
    import Item from './Item'
    import AppLink from './Link'
    import FixiOSBug from './FixiOSBug'

    export default {
        name: 'SidebarItem',
        components: { Item, AppLink },
        mixins: [FixiOSBug],
        props: {
            // route object
            item: {
                type: Object,
                required: true
            },
            isNest: {
                type: Boolean,
                default: false
            },
            basePath: {
                type: String,
                default: ''
            }
        },
        data() {
            // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
            // TODO: refactor with render function
            this.onlyOneChild = null;
            return {}
        },
        methods: {
            hasOneShowingChild(children = [], parent) {
                //把children中有hidden属性的过滤掉 返回搜集到的数组showingChildren
                //1.判断 showingChildren 里面是不是只有一个子元素 return true;
                //2.判断 showingChildren 里面没有子元素 【比如 '/login' 这个 route 就没有 children】
                //3.showingChildren 里的子元素大于1个时的 情况 return false;
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        // Temp set(will be used if only has one showing child)
                        // 这个地方就一直循环下去，至于是不是只有一个child，在后面会判断
                        this.onlyOneChild = item;
                        return true
                    }
                });

                // When there is only one child router, the child router is displayed by default
                // 只有 1 个子元素的时候，返回 true
                if (showingChildren.length === 1) {
                    return true
                }

                // Show parent if there are no child router to display
                // 没有子元素的啥时候,就显示父级路由
                if (showingChildren.length === 0) {
                    this.onlyOneChild = { ... parent, path: '', noShowingChildren: true };
                    return true
                }

                return false
            },
            resolvePath(routePath) {
                if (isExternal(routePath)) {
                    return routePath
                }
                return path.resolve(this.basePath, routePath)
            },
        }
    }
</script>
