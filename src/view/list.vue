<template>
    <div class="app-list">
        <div class="ove-header">
            <div class="title-left">
                <div class="left-font">大理供电局数据质量认责管理工具</div>
                <img class="img-left2" src="../assets/head_2.png" alt="">
            </div>
            <div class="title-right">
                <div class="right-1">
                    <img class="img-right1" src="../assets/head_3.png" alt="">
                </div>
                <div class="right-2">
                    <img class="img-right2" src="../assets/head_4.png" alt="">
                </div>
            </div>

        </div>
        <div class="list-main">
            <div class="main-left">
                <el-menu :default-active="defaultActive" mode="horizontal" text-color="#ffffff"
                    background-color="#0e284f" active-text-color="#2c7ffa" class="el-menu-vertical-demo">
                    
                    <el-submenu v-for="item in menuList" :index="item.id" :key="item.id">
                        <template slot="title">
                            <span slot="title">
                                <!-- <i class="el-icon-monitor"></i> -->
                                {{item.name}}
                            </span>
                        </template>

                        <el-menu-item v-for="children in item.children" :key="children.id"
                                        :index="children.id">
                            <router-link :to=children.url>
                                <i class="el-icon-s-home"></i>
                                {{children.name}}
                            </router-link>
                        </el-menu-item>
                    </el-submenu>
                    
                </el-menu>
            </div>
            <div class="main-right">
                <keep-alive v-if="$route.meta.keepAlive">
                    <router-view :key="$route.fullPath"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
        <div class="ove-footer">云南电网有限责任公司大理供电局 ©2019-2020</div>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import {
        queryLeftMenu
    } from '../request/api'; // 
    export default {
        name: "List",
        data() {
            return {
                menuList: '', //左侧导航菜单
                userName: sessionStorage.getItem('userName'), //通过sessionStorage取得用户名
                dialogModifyPassword: false, //修改密码弹框是否显示
                formModifyPassword: { //
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                },
                lv: '', //修改密码所需临时lv
                token: '', //修改密码所需临时token
            }
        },
        computed: {
            ...mapState('List', ['defaultActive']),
        },
        methods: {
            ...mapMutations('List', ['SET_MENU_LIST']),
            /*获取左侧菜单*/
            queryLeftMenu() {
                queryLeftMenu({
                    
                }).then(res => {
                    let routerIdArray = []
                    res.result.forEach((items, index) => {
                        items.children.forEach((item, ind) => {
                            routerIdArray.push(item.id)
                        })
                    })
                    this.menuList = res.result
                    this.SET_MENU_LIST(routerIdArray)
                }).catch(error => {
                    //console.log(error)
                    this.showCode = false
                })
            }
        },
        created() {

        },
        mounted() {
            this.queryLeftMenu()
        },
        activated() {}

    }

</script>

<style lang="less" scoped>
    a {
        color: inherit;
    }

    #app .main-left .el-submenu .el-menu-item,
    #app .main-left .nest-menu .el-submenu>.el-submenu__title {
        background-color: #022d68 !important;
    }

    #app .main-left .el-submenu .el-menu-item:hover,
    #app .main-left .nest-menu .el-submenu>.el-submenu__title:hover {
        background-color: #4d6ba3 !important;
    }


    .app-list {
        //background: url("../assets/img/bg_index.png") no-repeat top center;
        background-size: 100%;
        min-height: 700px;
    }

    .ove-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        //background: rgba(4, 55, 121, 1);
        padding: 5px 15px;

        .title-left {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .img-left1 {
                width: 56px;
            }

            .left-font {
                font-size: 32px;
                color: rgba(255, 255, 255, 1);
                margin: 0 20px;
            }

            .img-left2 {
                width: 30px;
            }
        }

        .title-right {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .right-1 .img-right1 {
                width: 28px;
            }

            .right-2 {
                margin: 0 20px;

                .img-right2 {
                    width: 28px;
                }
            }

            .right-3 {
                width: 40px;
                height: 40px;
                background: #e4e4e4;
                border-radius: 50%;

            }

            .right-4 {

                margin-left: 20px;

                .el-dropdown-link {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 1);
                    line-height: 1.5;
                }
            }
        }
    }


    .list-main {
        padding-bottom: 36px;

        .main-left {
            background-color: #0e284f;
        }

        .main-right {
            width: 100%;
            text-align: left;
            background: #dedede;

            .right-tab {
                margin: 5px 0 0 5px;
                text-align: left
            }
        }
    }

    .ove-footer {
        position: fixed;
        bottom: 0;
        z-index: 1;
        width: 100%;
        height: 36px;
        line-height: 36px;
        //background: rgba(9, 47, 95, 1);
        font-size: 16px;
        color: rgba(255, 255, 255, 1);
        letter-spacing: 2px;
    }

</style>
