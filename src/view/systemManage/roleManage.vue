<template>
    <div class="app-role">
        <div class="ove-title">角色管理</div>
        <!-- <div class="role-condition"><img src="../../assets/img/accountability/query_2.png" />&nbsp;&nbsp;查询条件</div> -->
        <div class="ove-search">
            <div class="ove-search-in">
                <span>角色名称：</span>
                <el-input type="text" size="small" placeholder="请输入角色名称" v-model="queryRoleName" />
            </div>
            <div class="ove-search-in">
                <span>角色编码：</span>
                <el-input type="text" size="small" placeholder="请输入角色编码" v-model.trim="queryRoleCode" />
            </div>
            <div class="ove-search-in">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="getRoleManag">查询</el-button>
            </div>
        </div>

        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;角色列表</div>
        <div class="role-operation">
            <div class="operation-btn" @click="showAddDialog()"><img src="../../assets/img/add_btn.png" />&nbsp;添加
            </div>
            <div class="operation-btn" @click="dialogDel"><img src="../../assets/img/delete_btn.png" />&nbsp;删除</div>
        </div>
        <div class="data-table">
            <el-table :data="tableData" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40">
                </el-table-column>
                <el-table-column label="序号" type="index" width="80" align="center">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center">
                </el-table-column>
                <el-table-column prop="roleCode" label="角色编码" align="center">
                </el-table-column>
                <el-table-column prop="description" label="角色描述" align="center">
                </el-table-column>
                <el-table-column label="操作" width="600" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="clickQueryBtn(scope.row.id)" round>详情</el-button>
                        <el-button size="mini" type="success" @click="clickModifyBtn(scope.row.id)" round>修改</el-button>
                        <el-button size="mini" type="info" @click="clickBindingAccountBtn(scope.row.id)" round>绑定账号
                        </el-button>
                        <el-button size="mini" type="warning" @click="clickQueryBoundAccountList(scope.row.id)" round>
                            查看绑定账号</el-button>
                        <el-button size="mini" type="danger" @click="clickBindingAuthor(scope.row.id)" round>绑定权限
                        </el-button>
                        <el-button size="mini" type="info" @click="clickAuthorListData(scope.row.id)" round>查看绑定权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="ove-paging">
                <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>

        <!--添加弹框开始-->
        <el-dialog width="400px" title="添加" :visible.sync="dialogAdd">
            <el-form :model="formAdd" ref="addForm">
                <el-form-item label="角色名称：" prop="roleName" label-width="110px">
                    <el-input v-model="formAdd.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色标识：" prop="roleCode" label-width="110px">
                    <el-input v-model="formAdd.roleCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" prop="description" label-width="110px">
                    <el-input type="textarea" v-model="formAdd.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickDialogAdd">添加</el-button>
                <el-button @click="dialogAdd = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--添加弹框结束-->


        <!--查询修改弹框开始-->
        <el-dialog width="500px" title="查看详情" :visible.sync="dialogQuery">
            <el-form :model="formBall">
                <el-input type="hidden" v-model="formBall.id" :disabled="!isQueryModify" autocomplete="off"></el-input>
                <el-form-item label="角色名称：" label-width="120px">
                    <el-input v-model="formBall.roleName" :disabled="!isQueryModify" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色编码：" label-width="120px">
                    <el-input v-model="formBall.roleCode" :disabled="!isQueryModify" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" label-width="120px">
                    <el-input type="textarea" v-model="formBall.description" :disabled="!isQueryModify"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isQueryModify" label="创建人：" label-width="120px">
                    <el-input v-model="formBall.createBy" :disabled="!isQueryModify" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isQueryModify" label="创建时间：" label-width="120px">
                    <el-input v-model="formBall.createTime" :disabled="!isQueryModify" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isQueryModify" label="修改人：" label-width="120px">
                    <el-input v-model="formBall.updateBy" :disabled="!isQueryModify" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isQueryModify" label="修改时间：" label-width="120px">
                    <el-input v-model="formBall.updateTime" :disabled="!isQueryModify" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="isQueryModify">
                <el-button type="primary" @click="dialogUpdate">提 交</el-button>
                <el-button @click="dialogQuery = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--查询修改弹框结束-->

        <!--绑定账号dialog -->
        <el-dialog title="绑定账号" :visible.sync="dialogBindingAccount">
            <div class="param-in">
                <span>角色名称：</span>
                <el-input type="text" placeholder="请输入角色名称" v-model="queryName" />
            </div>
            <el-table :data="dialogBindingAccountData" @selection-change="getAccountSelectId">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column property="username" label="账号" width="150"></el-table-column>
                <el-table-column property="realname" label="真实姓名" width="200"></el-table-column>
                <el-table-column property="status" label="账号状态">
                    <template slot-scope="scope">{{scope.row.status===1?"正常":'冻结'}}</template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAccountDataQueryBtn">查询</el-button>
                <el-button type="primary" @click="dialogAccountDataBtn">确认绑定</el-button>
                <el-button type="primary" @click="dialogBindingAccount = false">取消绑定</el-button>
            </div>
            <!--绑定账号表格分页 -->
            <div class="role-pagination">
                <el-pagination background layout="prev, pager, next" :total="dialogAccountDataTotal"
                    :page-size="dialogAccountDataPageSize" @size-change="dialogAccountDataSizeChange"
                    @current-change="dialogAccountDataCurrentChange">
                </el-pagination>
            </div>
        </el-dialog>

        <!--账号列表dialog -->
        <el-dialog :visible.sync="dialogAccountList">
            <el-table :data="dialogAccountListData">
                <el-table-column property="username" label="账号" width="150"></el-table-column>
                <el-table-column property="realname" label="真实姓名" width="200"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAccountList = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--权限dialog getCurrentKey-->
        <el-dialog :visible.sync="dialogAuthorTree">
            <el-tree :data="dialogAuthorTreeData" show-checkbox node-key="id" :props="authorTreeDefaultProps"
                @check="dialogAuthorTreeGetCurrentKey">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAuthorBindingBtn">确认绑定</el-button>
                <el-button type="primary" @click="dialogAuthorTreeCloseBtn = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--权限列表dialog -->
        <el-dialog :visible.sync="dialogAuthList">
            <el-table :data="dialogAuthListData">
                <el-table-column property="authName" label="权限名称"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAuthList = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        roleManag,
        saveRole,
        deleteRole,
        findRole,
        updateRole,
        dialogUserListByPage,
        userIdsPinlessRole,
        userListByRoleId,
        authorTreeList,
        setAuthorization,
        authorizationListByRoleId,
    } from '../../request/api'; // 获取角色列表
    export default {
        name: "roleManage",
        data() {
            return {
                form: {
                    region: ''
                },
                tableData: [], //角色列表数据
                multipleSelection: [], //选中表格项id
                total: 0, //数据总条数
                current: 1, //当前页默认第一页
                pageSize: 10, //每页显示多少条
                dialogQuery: false, //查询修改
                formBall: { //查询修改弹框
                    roleName: '',
                    roleCode: '',
                    description: '',
                },
                dialogAdd: false, //添加
                formAdd: { //添加弹框
                    roleName: '',
                    roleCode: '',
                    description: '',
                },
                isQueryModify: false, //点击是否是查询还是修改按钮
                queryRoleName: '', //查询角色名称
                queryRoleCode: '', //查询角色编码
                dialogBindingAccountData: [], //绑定账号列表数据 只展示当前角色未绑定的账号
                dialogBindingAccount: false, //绑定账号dialog 状态
                dialogAccountDataTotal: 0, //账号列表总条数 默认为0
                dialogAccountDataPageSize: 5, //账号列表每页展示多少条
                dialogAccountDataCurrent: 1, //账号列表默认第1页
                dialogAccountDataSelection: [], //账号列表复选框
                queryName: '', //查询账号或者名称 账号列表
                dialogAccounRroleId: '', //绑定账号中的dialog中的角色id
                dialogAccountListData: [], //查看已绑定账号的list
                dialogAccountList: false, //已绑定账号的dialog状态
                dialogAuthorTree: false, //权限treedialog状态 默认关闭
                dialogAuthorTreeData: [], //权限tree数据
                authorTreeDefaultProps: { //tree中的属性值用什么
                    children: 'children',
                    label: 'label'
                },
                authorTreeChenkboxData: '', //权限tree复选框 保存值
                authorTreeRoleId: '', //权限dialog中的角色id
                dialogAuthListData: [], //权限dialog表格数据
                dialogAuthList: false, //权限dialog状态 默认关闭
            }
        },
        created() {

        },
        mounted() {
            this.getRoleManag()
        },
        methods: {
            showAddDialog() { //显示添加弹框
                if (this.$refs['addForm'] !== undefined) {
                    this.$refs['addForm'].resetFields();
                }
                this.dialogAdd = true
            },
            dialogAuthorTreeGetCurrentKey(id, name) { //tree复选框被选中时会触发改事件
                this.authorTreeChenkboxData = name.checkedKeys.join()
            },
            dialogAccountDataCurrentChange(val) { //账号列表当前页，再触发一下点击事件
                this.dialogAccountDataCurrent = val;
                this.clickBindingAccountBtn();
            },
            dialogAccountDataSizeChange(val) { //账号列表每页多少条
            },
            dialogAccountDataBtn() { //账号dialog确认绑定按钮
                userIdsPinlessRole({
                    userIds: this.dialogAccountDataSelection,
                    roleId: this.dialogAccounRroleId
                }).then(res => {
                    this.$message({
                        message: '绑定成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogBindingAccount = false
                }).catch(error => {
                    console.log(error)
                });
            },
            getAccountSelectId(val) { //获取账号列表复选框id值
                this.dialogAccountDataSelection = [];
                if (val) {
                    val.forEach(item => {
                        this.dialogAccountDataSelection.push(item.id)
                    });
                }
                this.dialogAccountDataSelection = this.dialogAccountDataSelection.join()
            },
            getRoleManag() { //请求角色列表数据
                roleManag({
                    roleName: this.queryRoleName,
                    roleCode: this.queryRoleCode,
                    current: this.current,
                    size: this.pageSize
                }).then(res => {
                    this.tableData = res.result.records
                    this.total = res.result.total
                }).catch(error => {
                    console.log(error)
                });
            },

            handleSizeChange(val) { //每页多少条数据
                //console.log(`每页 ${val} 条`);

            },
            handleCurrentChange(val) { //当前第几页
                //console.log(`当前页: ${val}`);
                this.current = val
                this.getRoleManag();
            },
            handleSelectionChange(val) { //表格选中项
                this.multipleSelection = [];
                if (val) {
                    val.forEach(item => {
                        this.multipleSelection.push(item.id)
                    });
                }
                this.multipleSelection = this.multipleSelection.join()
            },
            clickQueryBtn(id) { //点击查询按钮
                this.dialogQuery = true;
                this.isQueryModify = false;
                findRole({
                    id: id,
                }).then(res => {
                    console.log(eval(res))
                    this.formBall = res.result

                }).catch(error => {
                    console.log(error)
                });
            },
            clickModifyBtn(id) { //点击修改按钮
                this.dialogQuery = true;
                this.isQueryModify = true;
                findRole({
                    id: id,
                }).then(res => {
                    this.formBall = res.result

                }).catch(error => {
                    console.log(error)
                });
            },
            clickDialogAdd() { //添加功能
                saveRole({
                    roleName: this.formAdd.roleName,
                    roleCode: this.formAdd.roleCode,
                    description: this.formAdd.description,
                }).then(res => {
                    this.dialogAdd = false;
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.getRoleManag()

                }).catch(error => {
                    console.log(error)
                    this.$message({
                        message: error.message,
                        type: 'error',
                        duration: 2000
                    });
                });
            },
            dialogDel() { //删除功能
                if ('' == this.multipleSelection) {
                    this.$message({
                        message: '请勾选需要删除的数据',
                        type: 'error',
                        duration: 2000
                    })
                } else {
                    this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteRole({
                            roleIds: this.multipleSelection,
                        }).then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success',
                                duration: 2000
                            });
                            this.getRoleManag()
                        }).catch(error => {
                            console.log(error)
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            dialogUpdate() {
                updateRole({
                    id: this.formBall.id,
                    roleName: this.formBall.roleName,
                    roleCode: this.formBall.roleCode,
                    description: this.formBall.description
                }).then(res => {
                    this.dialogQuery = false;
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.getRoleManag()
                }).catch(error => {
                    console.log(error)
                });
            },
            clickBindingAccountBtn(id) { //点击绑定账号按钮
                if (id == null && id == '') {

                } else {
                    this.dialogAccounRroleId = id
                }
                dialogUserListByPage({
                    roleId: id,
                    name: this.queryName,
                    current: this.dialogAccountDataCurrent,
                    size: this.dialogAccountDataPageSize
                }).then(res => {
                    this.dialogBindingAccountData = res.result.records //数据
                    this.dialogAccountDataTotal = res.result.total //总条数
                }).catch(error => {
                    console.log(error)
                });
                this.dialogBindingAccount = true

            },
            dialogAccountDataQueryBtn() { //账号dialog点击查询按钮
                this.clickBindingAccountBtn();
            },
            clickQueryBoundAccountList(val) { //点击查看已绑定账号按钮 传入roleId进行查询
                userListByRoleId({
                    roleId: val
                }).then(res => {
                    this.dialogAccountListData = res.result
                }).catch(error => {
                    console.log(error);
                })
                this.dialogAccountList = true
            },
            clickBindingAuthor(val) { //点击绑定权限按钮
                this.authorTreeRoleId = val
                authorTreeList({

                }).then(res => {
                    console.log(res);
                    this.dialogAuthorTreeData = res.result
                }).catch(error => {

                })
                this.dialogAuthorTree = true
            },
            dialogAuthorBindingBtn() { //权限与角色确认绑定按钮
                setAuthorization({
                    roleId: this.authorTreeRoleId,
                    authorizationIds: this.authorTreeChenkboxData,
                }).then(res => {
                    this.$message({
                        message: '绑定成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogAuthorTree = false
                }).catch(error => {})
            },
            clickAuthorListData(val) { //查看已绑定的权限
                authorizationListByRoleId({
                    roleId: val
                }).then(res => {
                    this.dialogAuthListData = res.result
                }).catch(error => {
                    console.log(error)
                })
                this.dialogAuthList = true
                // dialogAuthListData: [],//权限dialog表格数据
                // dialogAuthList
            },
        }
    }

</script>

<style lang="less" scoped>
    .app-role/deep/.el-table__header tr,
    .app-role/deep/.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }

    .app-role {
        padding: 2px;

        .role-operation {
            background: #FFFFFF;
            padding: 10px;
            text-align: left;

            .operation-btn {
                display: inline-block;
                margin-right: 40px;
                font-size: 16px;
                color: rgba(54, 54, 54, 1);
                cursor: pointer;

                img {
                    width: 20px;
                    height: 16px;
                }
            }
        }

    }

</style>
