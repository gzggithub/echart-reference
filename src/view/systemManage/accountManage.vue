<template>
    <div class="app-main">
        <div class="ove-title">账号管理</div>
        <div class="ove-search">
            <div class="ove-search-in">
                <span>姓名：</span>
                <el-input v-model="name" size="small" prefix="姓名" width="200px" placeholder="请输入姓名查询"></el-input>
            </div>
            <div class="ove-search-in">
                <el-button @click="getAccountList" type="primary" size="mini" icon="el-icon-search">查询</el-button>
                <el-button @click="goAdd" type="success" size="mini" icon="el-icon-plus">添加</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </div>

        </div>

        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;数据表格</div>
        <div class="data-table">
            <el-table :data="accountData" border @selection-change="tabChangeList">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="realname" label="真实姓名" align="center"></el-table-column>
                <el-table-column label="类型" width="120" align="center">
                    <template slot-scope="scope">{{scope.row.type===1?"普通用户":'超级管理员'}}</template>
                </el-table-column>
                <el-table-column prop="avtar" label="头像" align="center"></el-table-column>
                <el-table-column prop="email" label="电子邮件" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">{{scope.row.status===1?"正常":'冻结'}}</template>
                </el-table-column>
                <el-table-column label="操作" width="600" align="center">
                    <!-- <template slot-scope="scope">
                    
                    </template> -->
                </el-table-column>
            </el-table>
            <div class="ove-pagination">
                <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
        <!--添加dialog -->
        <el-dialog title="添加账户" width="1000px" :visible.sync="dialogAdd">
            <add-account @childClick=closeDialog></add-account>
        </el-dialog>
    </div>
</template>

<script>
    import {
        dialogUserListByPage
    } from '../../request/api'
    import addAccount from './accountManage/add'
    export default {
        name: "accountManage",
        components: {
            addAccount
        },
        data() {
            return {
                accountData: [],
                name: '',
                total: 0,
                pageSize: 10,
                currentPage: 1,
                dialogAdd: false
            }
        },

        methods: {
            getAccountList() {
                dialogUserListByPage({
                    name: this.name,
                    current: this.currentPage,
                    size: this.pageSize
                }).then(res => {
                    this.total = res.result.total
                    this.accountData = res.result.records
                }).catch(error => {
                    console.log(error)
                });
            },
            handleSizeChange(val) {
                this.pageSize = val
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getRoleManag();
            },
            tabChangeList() { //表格选中列表

            },
            goAdd() {
                this.dialogAdd = true
                //this.$router.push('/systemManage/accountManage/add')
            },
            closeDialog(msg) {
                console.log(111111)
                this.dialogAdd = msg
                this.getAccountList();
            }
        },
        created() {
            this.getAccountList()

        },
        mounted() {},
    }

</script>

<style lang="less" scoped>
    .app-main {
        min-height: 700px;
        padding: 2px;
    }

    .app-main/deep/.el-table__header tr,
    .app-main/deep/.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }

</style>
