<template>
    <div class="login-container">
        {{$store.state.user.user}}
        {{$store.getters.name}}
        <p>{{$store.getters.token}}</p>
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left">
            <div class="title-container">
                <h3 class="title">login</h3>
            </div>

            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user"/>
                </span>
                <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    name="username"
                    type="text"
                    auto-complete="on"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"/>
                </span>
                <el-input
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                auto-complete="on"
                @keyup.enter.native="handleLogin"></el-input>
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password'? 'eye':'eye-open'"></svg-icon>
                </span>
            </el-form-item>
            <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    import { validUsername } from '../../utils/validate.js'
    export default {
        name: "Login",
        data() {
            //对应rules里面的验证方法
            const validateUsername = (rule, value, callback) => {
                if (!validUsername(value)) {
                    callback(new Error("请输入正确的用户名"));
                } else {
                    callback();
                }
            };

            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error("密码不能少于6位"));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [{required: true, trigger: 'blur', validator: validateUsername}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}]
                },
                passwordType: 'password',
                loading: false,
                showDialog: false,
                redirect: 'undefained'
            }
        },
        watch:{
            $route:{
                handler:function(route){
                    this.redirect = route.query &&route.query.redirect
                },
                //immediate:true代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法
                immediate:true
            }
        },
        methods:{
            showPwd(){
                if(this.passwordType === 'password'){
                    this.passwordType = 'text'
                }else{
                    this.passwordType = 'password'
                }
            },
            handleLogin(){
                this.$refs.loginForm.validate(valid=>{
                    if(valid){
                        this.loading = true;
                        this.$store.dispatch('LoginByUsername',this.loginForm).then(()=>{
                            this.loading = false;
                            this.$router.push({path:this.redirect||'/'});
                        }).catch(()=>{
                            this.loading = false;
                        })
                    }else{
                        window.console.log('error submit!!');
                        return false;
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg:#283443;
    $light_gray:#eee;
    $cursor: #fff;
    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input{
            color: $cursor;
            &::first-line {
                color: $light_gray;
            }
        }
    }
    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;
                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#eee;
    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;
        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;
            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }
        .title-container {
            position: relative;
            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }
            .set-language {
                color: #fff;
                position: absolute;
                top: 3px;
                font-size:18px;
                right: 0px;
                cursor: pointer;
            }
        }
        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }
        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
        }
    }
</style>