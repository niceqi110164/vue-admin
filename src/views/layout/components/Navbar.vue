<template>
    <div class="navbar">
        <Hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"></Hamburger>
        <Breadcrumb class="breadcrumb-container"></Breadcrumb>
        <div class="right-menu">
            <template v-if="device!=='mobile'">
                <!--<search class="right-menu-item"></search>-->
                <!--<error-log class="errLog-container right-menu-item hover-effect"></error-log>-->

                <screenfull class="right-menu-item hover-effect"></screenfull>

                <el-tooltip  effect="dark" placement="button">
                    <size-select class="right-menu-item hover-effect"></size-select>
                </el-tooltip>

                <!--<lang-select class="right-menu-item hover-effect" />-->
            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/">
                        <el-dropdown-item>
                            Home
                        </el-dropdown-item>
                    </router-link>
                    <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
                        <el-dropdown-item>
                            github
                        </el-dropdown-item>
                    </a>
                    <el-dropdown-item>
                        <span style="display:block;" @click="logout">LogOut</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Breadcrumb from '../../../components/Breadcrumb'
    import Hamburger from '../../../components/Hamburger'
    //import ErrorLog from '../../../components/ErrorLog'
    import Screenfull from '../../../components/Screenfull'
    import SizeSelect from '../../../components/SizeSelect'
    //import LangSelect from '../../../components/LangSelect'
    //import ThemePicker from '../../../components/ThemePicker'
    //import Search from '../../../components/HeaderSearch'


    export default {
        components:{
            Breadcrumb,
            Hamburger,
            //ErrorLog,
            Screenfull,
            SizeSelect,
            //LangSelect,
            //ThemePicker,
            //Search
        },
        computed:{
            ...mapGetters([
                'sidebar',
                'name',
                'avatar',
                'device'
            ])
        },
        methods:{
            toggleSideBar(){
                this.$store.dispatch('toggleSideBar')
            },
            logout(){
                this.$store.dispatch('LogOut').then(()=>{
                    location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        overflow: hidden;
        .hamburger-container {
            line-height: 46px;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background .3s;
            &:hover {
                background: rgba(0, 0, 0, .025)
            }
        }
        .breadcrumb-container {
            float: left;
        }
        .errLog-container {
            display: inline-block;
            vertical-align: top;
        }
        .right-menu {
            float: right;
            height: 100%;
            line-height: 50px;
            &:focus {
                outline: none;
            }
            .right-menu-item {
                display: inline-block;
                padding: 0 8px;
                height: 100%;
                font-size: 18px;
                color: #5a5e66;
                vertical-align: text-bottom;
                &.hover-effect {
                    cursor: pointer;
                    transition: background .3s;
                    &:hover {
                        background: rgba(0, 0, 0, .025)
                    }
                }
            }
            .avatar-container {
                margin-right: 30px;
                .avatar-wrapper {
                    margin-top: 5px;
                    position: relative;
                    .user-avatar {
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }
                    .el-icon-caret-bottom {
                        cursor: pointer;
                        position: absolute;
                        right: -20px;
                        top: 25px;
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>