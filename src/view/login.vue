<template>
    <div class="app-login" :style="{height: conheight+'px'}">
        <div class="login-title"><img src="../assets/img/login/logo.png" />云南电网平台</div>
        <el-scrollbar class="main-scroll">
            <div class="login-frame">
                <div class="user-login">用户登录</div>
                <div class="user-name">
                    <img src="../assets/img/login/login_name.png" />
                    <input class="input input-name" v-model="inputName" type="text" placeholder="请输入用户名" />
                </div>
                <div class="user-pwd">
                    <img src="../assets/img/login/login_pwd.png" />
                    <input class="input input-pwd" v-model="inputPwd" type="password" placeholder="请输入密码" />
                </div>
                <div class="user-code">
                    <div class="code-left">
                        <img src="../assets/img/login/login_code.png" />
                        <input class="input input-code" @blur="codeBlur()" v-model="inputCode" type="text"
                            placeholder="验证码,单击图片刷新" />
                    </div>
                    <el-button v-if="showCode" type="success" icon="el-icon-check" circle></el-button>
                    <el-button v-else type="danger" icon="el-icon-close" circle></el-button>
                    <div class="code-right" @click="getRefreshCode()">
                        <img :src=imgSrc alt="">
                    </div>
                </div>
                <div class="four-row">
                    <div :class="[{on:showError},'import-error']">{{this.textError}}</div>
                    <div class="forget-pwd">忘记密码？</div>
                </div>
                <div class="btn-login" @click="clickLoginBtn">登录</div>
            </div>
        </el-scrollbar>
        <div class="login-footer">
            云南电网有限责任公司大理供电局 ©2019-2020
        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex';
    import {
        DES3
    } from '../assets/js/common';
    import {
        signAndToken,
        login,
        verifyCode
    } from '../request/api'; // 获取签名和token

    export default {
        name: "Login",
        data() {
            return {
                inputName: '', //用户名
                inputPwd: '', //用户密码
                inputCode: '', //验证码
                textError: '', //登录错误显示文本
                showError: false, //是否显示错误文本
                showCode: false, //验证code码是否正确的展示图标
                tokenLogin: '', //登录临时token
                lv: '', //登录页临时lv
                imgSrc: '', //验证码图片地址
                conheight: '',
            }
        },
        computed: {},
        methods: {
            ...mapMutations('List', ['SET_USER_NAME', 'SET_TOKEN']),
            /* 获取签名和token*/
            getSignAndToken() {
                signAndToken({}).then(res => {
                    //console.log(eval(res))
                    this.tokenLogin = res.result.token
                    this.lv = res.result.lv
                    this.getCodeImage()
                    //this.$message.error(2222);

                }).catch(error => {
                    this.$message.error('数据请求错误');
                    //console.log(error)
                });
            },

            /*获取图片验证码*/
            getCodeImage() {
                let time = new Date().getTime()
                this.imgSrc =
                    `/apis/equip/dgequip/equip/login/codeImage?token=${this.tokenLogin}&time=${time}`
            },
            /*刷新验证码*/
            getRefreshCode() {
                let time = new Date().getTime()
                this.imgSrc =
                    `/apis/equip/dgequip/equip/login/refreshCode?token=${this.tokenLogin}&time=${time}`
            },
            /*登录*/
            clickLoginBtn() {
                let password = DES3.encrypt(this.tokenLogin, this.inputPwd, this.lv); /*密码加密*/
                login({
                    token: this.tokenLogin,
                    lv: this.lv,
                    username: this.inputName,
                    password: password,
                    code: this.inputCode
                }).then(res => {
                    //console.log(eval(res))
                    sessionStorage.setItem('token', res.result)
                    sessionStorage.setItem('userName', this.inputName)
                    this.SET_USER_NAME(this.inputName)
                    this.SET_TOKEN(res.result)
                    this.showError = false
                    this.$message.success(res.message)

                    if (this.$route.query.redirect) {
                        this.$router.push({
                            path: this.$route.query.redirect,
                        })
                        /* if (this.$route.query.defaultActive) {
                            this.SET_DEFAULT_ACTIVE(this.$route.query.defaultActive)
                        } */
                    } else {
                        if (this.inputName.indexOf("main") != -1) {
                            this.$router.push({
                                path: '/situation/main',
                            })
                        } else if(this.inputName.indexOf("vice") != -1) {
                            this.$router.push({
                                path: '/situation/vice',
                            })
                        } else {
                            this.$router.push({
                                path: '/situation/overall',
                            })
                        }

                    }

                }).catch(error => {
                    //console.log(error)
                    sessionStorage.removeItem('token')
                    this.showError = true
                    this.textError = error.message
                })
            },
            /*验证码失去焦点事件*/
            codeBlur() {
                verifyCode({
                    code: this.inputCode,
                    token: this.tokenLogin
                }).then(res => {
                    //console.log(eval(res))
                    this.showCode = true
                }).catch(error => {
                    //console.log(error)
                    this.showCode = false
                })
            }
        },
        created() {
            this.getSignAndToken();
            this.conheight = window.innerHeight;
        },
        mounted() {
            console.log(this.$route.query.redirect)

        },

    }

</script>

<style scoped lang="less">
    .app-login /deep/ .el-scrollbar {
        height: calc(100% - 95px) !important;
    }

    .app-login /deep/ .el-scrollbar__wrap {
        overflow-y: scroll !important;
        overflow-x: hidden !important;
    }

    .app-login {
        height: 100%;
        background: url("../assets/img/login/login_bg1.png") no-repeat 0 0;
        background-size: cover;
        overflow: hidden;
    }

    .login-title {
        height: 60px;
        line-height: 60px;
        font: normal 500 32px PingFang SC;
        color: rgba(251, 255, 255, 1);
        background: rgba(4, 55, 121, 1);
    }

    .login-title img {
        width: 65px;
        height: 60px;
        vertical-align: middle;
    }

    .login-frame {
        width: 562px;
        height: 500px;
        margin: 200px 200px 200px auto;
        background: url("../assets/img/login/login_bg2.png") no-repeat center center;
    }

    .user-login {
        font: 500 24px PingFang SC;
        color: rgba(0, 191, 244, 1);
        padding: 30px 0;
    }

    .user-name,
    .user-pwd {
        display: flex;
        align-items: center;
        width: 460px;
        height: 56px;
        margin: auto;
        background: url("../assets/img/login/login_bg3.png") no-repeat;
        text-align: left;
    }

    .user-name img,
    .user-pwd img,
    .code-left img {
        width: 20px;
        height: 24px;
        margin: 0 15px 0;
    }

    .user-pwd {
        margin: 24px auto;
    }

    .user-code {
        display: flex;
        width: 460px;
        margin: auto;
        justify-content: space-between;
        align-items: center;
    }

    .user-code .code-left {
        display: flex;
        align-items: center;
        width: 260px;
        height: 56px;
        background: url("../assets/img/login/login_bg4.png") no-repeat;
        text-align: left;
    }

    .user-code .code-right {
        width: 135px;
        height: 56px;
        cursor: pointer;
    }

    .user-code .code-right img {
        width: 100%;
        height: 100%;
    }

    .input {
        width: 100%;
        height: 100%;
        border: 0;
        background: transparent;
        outline: none;
        font: 500 18px PingFang SC;
        color: rgba(255, 255, 255, 1);
    }

    input::placeholder {
        color: rgba(255, 255, 255, .6);
    }

    .four-row {
        width: 460px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font: 500 18px PingFang SC;
        margin: 25px auto;
    }

    .import-error {
        color: rgba(193, 37, 35, 1);
        opacity: 0;
    }

    .import-error.on {
        opacity: 1;
    }

    .forget-pwd {
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
    }

    .btn-login {
        width: 459px;
        height: 56px;
        margin: 30px auto;
        background: rgba(32, 163, 245, 1);
        font: 500 18px/56px PingFang SC;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
    }

    .login-footer {
        height: 35px;
        font: 500 16px/35px PingFang SC;
        background: rgba(4, 55, 121, 1);
        color: rgba(251, 255, 255, 1);
        letter-spacing: 6px;
    }

</style>
