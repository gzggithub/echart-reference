<template>
    <div class="app-frame">
        <div class="ove-title">组织机构管理</div>
        <div class="frame-all">
            <div class="frame-left">
                <!--  <el-card> -->
                <div class="treeStyles">
                    <el-tree :props="props" lazy ref="asyncTree" highlight-current :load="loadNode" node-key="id"
                        @node-click="nodeClick" :expand-on-click-node="false" :default-expanded-keys="treeExpandData">
                        <span class="custom-tree-node" slot-scope="{node, data}" @mouseenter="mouseenter(data)"
                            @mouseleave="mouseleave(data)">
                            <span class="span-text span-hidden" :title="node.label">{{ node.label }}</span>
                            <span v-if="data.del&&data.id!='601'" class="span-btn"
                                @click.stop="showAddOrg(data)">新增</span>
                            <span v-if="data.del&&data.id!='601'" class="span-btn"
                                @click.stop="showUpdateOrg(data)">修改</span>
                            <span v-if="data.del&&data.id!='601'" class="span-btn"
                                @click.stop="removeOrg(data)">删除</span>
                        </span>
                    </el-tree>
                </div>
                <!-- </el-card> -->
            </div>
            <div class="frame-right">
                <!-- <el-card> -->
                <div>
                    <template>
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="岗位列表" name="first">
                                <div style="padding-right: 56px;padding-bottom: 5px;text-align: right;">
                                    <el-button :plain="true" type="success" size="mini" icon="el-icon-plus"
                                        @click="showAddPost">新增
                                    </el-button>
                                </div>
                                <div class="grid-content bg-purple-dark">
                                    <el-table :data="objectPostList" max-height="600" border>
                                        <el-table-column type="index" label="序号" width="80" align="center">
                                        </el-table-column>
                                        <el-table-column prop="postName" label="岗位名称" min-width="80" align="center">
                                            <template slot-scope="scope">
                                                <el-input v-if="scope.$index == showPostInd" v-model="inputPostName"
                                                    autocomplete="off" @keyup.enter.native="updatePositionList(scope)"
                                                    @blur="showPostInd=-1">
                                                </el-input>
                                                <span v-else>{{scope.row.postName}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="orgName" label="所属组织" min-width="80" align="center">
                                        </el-table-column>
                                        <el-table-column label="操作" align="center">
                                            <template slot-scope="scope">
                                                <el-button size="mini" @click="updatePost(scope)">修改</el-button>
                                                <el-button size="mini" type="danger" @click="deletePost(scope.row)">
                                                    删除</el-button>
                                            </template></el-table-column>
                                    </el-table>
                                    <div class="ove-paging">
                                        <el-pagination background @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]"
                                            :page-size="10" layout="total, sizes, prev, pager, next" :total="total">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="人员列表" name="second">
                                <div style="padding-right: 56px;padding-bottom: 5px;text-align: right;">
                                    <el-button :plain="true" type="success" size="mini" icon="el-icon-plus"
                                        @click="showAddEmployee">新增
                                    </el-button>
                                </div>
                                <div class="grid-content bg-purple-dark">
                                    <el-table :data="objectEmpList" max-height="600" border>
                                        <el-table-column type="index" label="序号" width="80" align="center">
                                        </el-table-column>
                                        <el-table-column prop="empName" label="人员名称" min-width="80" align="center">
                                        </el-table-column>
                                        <el-table-column prop="postName" label="所属岗位" min-width="80" align="center">
                                        </el-table-column>
                                        <el-table-column label="操作" align="center">
                                            <template slot-scope="scope">
                                                <el-button size="mini" @click="showUpdateEmp(scope)">修改</el-button>
                                                <el-button size="mini" type="danger"
                                                    @click="deleteEmployeeList(scope.row)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="ove-paging">
                                        <el-pagination background @size-change="handleSizeChangeTwo"
                                            @current-change="handleCurrentChangeTwo" :page-sizes="[10, 20, 50, 100]"
                                            :page-size="10" layout="total, sizes, prev, pager, next" :total="total2">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </div>
                <!-- </el-card> -->
            </div>
        </div>


        <!--组织添加修改弹框开始-->
        <el-dialog class="addOrgForm" width="400px" :title="titleOrg" :visible.sync="dialogFormOrgVisible">
            <el-form :model="addOrgForm" ref="addOrgForm" :rules="rulesOrg">
                <el-form-item label="组织名称：" prop="orgName" label-width="110px">
                    <el-input v-model="addOrgForm.orgName" autocomplete="off"></el-input>
                    <el-input v-model="addOrgForm.id" size="mini" type="hidden" readonly autocomplete="off"></el-input>
                    <el-input v-model="addOrgForm.parent" size="mini" type="hidden" readonly autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="简化名称" prop="shortName" label-width="110px">
                    <el-input v-model="addOrgForm.shortName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="titleOrg =='新增组织'" type="primary" @click="orgSaveBtn">保存</el-button>
                <el-button v-else type="primary" @click="OrgUpdateBtn()">修改</el-button>
                <el-button @click="dialogFormOrgVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--组织添加修改弹框结束-->



        <!--岗位添加修改弹框开始-->
        <el-dialog class="addPositionForm" width="400px" title="添加岗位信息" :visible.sync="dialogFormPositionVisible">
            <el-form :model="addPositionForm" ref="addPositionForm" :rules="rulesVis">
                <el-form-item label="岗位名称：" prop="name" label-width="110px">
                    <el-input v-model="addPositionForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属组织：" prop="orgId" label-width="110px">
                    <el-input v-model="addPositionForm.orgName" autocomplete="off" :disabled="true"></el-input>
                    <el-input v-model="addPositionForm.orgId" autocomplete="off" type="hidden"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="savePostList">保存</el-button>
                <el-button @click="dialogFormPositionVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--岗位添加修改弹框结束-->

        <!--人员添加修改弹框开始-->
        <el-dialog class='addEmployeeForm' width="460px" :title="titleEmployee"
            :visible.sync="dialogFormEmployeeVisible">
            <el-form :model="addEmployeeForm" ref="addEmployeeForm" :rules="rulesEmployee">
                <el-form-item label="人员名称：" prop="name" label-width="110px">
                    <el-input v-model="addEmployeeForm.name" autocomplete="off"></el-input>
                    <el-input v-model="addEmployeeForm.empId" type="hidden" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属岗位：" prop="postId" label-width="110px">
                    <el-select v-model="addEmployeeForm.postId" filterable placeholder="请选择">
                        <!-- <el-option :label="addEmployeeForm.postName" :value="addEmployeeForm.postId" selected>
                        </el-option> -->
                        <el-option v-for="item in objectPostList" :key="item.postId" :label="item.postName"
                            :value="item.postId"></el-option>
                        <div class="drop-all">
                            <el-pagination small background layout="prev, pager, next" :total="total" :page-size="10"
                                @current-change="handleCurrentChange">
                            </el-pagination>
                        </div>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="titleEmployee =='添加人员列表'" type="primary" @click="saveEmployeeList">保存</el-button>
                <el-button v-else type="primary" @click="updateEmployeeList(scope)">修改</el-button>
                <el-button @click="dialogFormEmployeeVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--人员添加修改弹框结束-->



    </div>
</template>

<script>
    import {
        orgTreeByOrgId,
        getPositionList,
        savePositionList,
        deletePositionList,
        updatePositionList,
        getEmployeeList,
        saveEmployeeList,
        deleteEmployeeList,
        updateEmployeeList,
        orgSave,
        orgUpdate,
        orgDelete,
    } from '../../request/api'; // 获取角色列表
    export default {
        name: "organizeFrame",
        data() {
            return {
                form: {
                    region: ''
                },
                orgIdTree: '',
                orgIdTab: '',
                props: {
                    label: 'orgName',
                    //children: 'zones',
                    isLeaf: 'leaf'
                },
                treeExpandData: [], //角色列表数据
                objectPostList: [{}], //岗位列表集合
                objectEmpList: [{}], //人员列表集合
                multipleSelection: [], //选中表格项id
                total: 0, //数据总条数
                pageNum: 1, //当前页默认第一页
                pageSize: 10, //每页显示多少条
                total2: 0, //数据总条数
                pageNum2: 1, //当前页默认第一页
                pageSize2: 10, //每页显示多少条
                total3: 0,
                pageNum3: 1, //当前页默认第一页
                activeName: 'first',
                dialogFormOrgVisible: false,
                titleOrg: '',
                addOrgForm: {
                    id: '',
                    parent: '',
                    orgName: '',
                    shortName: '',
                },
                rulesOrg: { //组织提交表验证
                    id: [{
                        required: true,
                        message: '',
                        trigger: 'blur'
                    }],
                    parent: [{
                        required: true,
                        message: '',
                        trigger: 'blur'
                    }],
                    orgName: [{
                        required: false,
                        message: '',
                        trigger: 'blur'
                    }],
                    shortName: [{
                        required: false,
                        message: '',
                        trigger: 'blur'
                    }],
                },

                dialogFormPositionVisible: false,
                addPositionForm: { //岗位提交表单字段
                    name: '',
                    orgId: '',
                    orgName: '',
                },
                rulesVis: { //岗位提交表验证
                    name: [{
                        required: true,
                        message: '请输入岗位名称',
                        trigger: 'blur'
                    }],
                    orgId: [{
                        required: true,
                        message: '请选择左侧组织机构节点',
                        trigger: 'blur'
                    }],
                },
                inputPostName: '', //修改岗位名称
                showPostInd: -1,

                dialogFormEmployeeVisible: false,
                addEmployeeForm: { //人员表单字段
                    name: '',
                    postId: '',
                    postName: '',
                    orgIdees: '0',
                    empId: ''
                },
                rulesEmployee: { //岗位提交表验证
                    name: [{
                        required: true,
                        message: '请输入岗位名称',
                        trigger: 'blur'
                    }],
                    postId: [{
                        required: true,
                        message: '请选择左侧组织机构节点',
                        trigger: 'blur'
                    }],
                },
                titleEmployee: '添加人员列表',
                options: [],
                orgIdCRUD: '',

            }
        },
        created() {

        },
        mounted() {
            this.nodeClick(1)
        },
        methods: {
            handleSizeChange(val) { //每页多少条数据
                //console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getPositionList();
            },
            handleCurrentChange(val) { //当前第几页
                //console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getPositionList();
            },
            handleSizeChangeTwo(val) { //每页多少条数据
                //console.log(`每页 ${val} 条`);
                this.pageSize2 = val;
                this.getEmployeeList();
            },
            handleCurrentChangeTwo(val) { //当前第几页
                //console.log(`当前页: ${val}`);
                this.pageNum2 = val;
                this.getEmployeeList();
            },

            handleSelectionChange(val) { //表格选中项

            },
            mouseenter(data) {
                console.log(data)
                this.$set(data, 'del', true)
            },
            mouseleave(data) {
                this.$set(data, 'del', false)
            },

            loadNode(node, resolve) { //加载组织节点
                console.log(node)
                if (node.data) {
                    this.orgIdTree = node.data.id
                }
                orgTreeByOrgId({
                    orgId: this.orgIdTree
                }).then(res => {
                    setTimeout(() => {
                        resolve(res.result);
                    }, 500);
                    if (!this.orgIdTree) {
                        this.treeExpandData.push(res.result[0].id);
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            nodeClick(data, node) {
                console.log(data.id)
                this.orgIdTab = data.id || '601';
                this.addPositionForm.orgId = data.id || '601';
                this.addPositionForm.orgName = data.orgName || '大理供电局';
                if (this.activeName == 'first') {
                    this.getPositionList();
                } else {
                    this.getEmployeeList();
                }
            },
            handleClick(tab, event) { //加载人员列表
                console.log(tab)
                if (tab.name == 'first') {
                    this.getPositionList();
                } else {
                    this.getEmployeeList();
                }

            },
            /* 岗位列表查询 */
            getPositionList() {
                getPositionList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    orgIdPosition: this.orgIdTab || '601'
                }).then(res => {
                    this.objectPostList = res.result.records;
                    this.total = res.result.total
                }).catch(error => {
                    console.log(error)
                });
            },
            /* 显示添加岗位 */
            showAddPost() {
                this.dialogFormPositionVisible = true;
                this.addPositionForm.name = '';
            },
            /* 保存新增岗位列表 */
            savePostList() {
                console.log(this.addPositionForm.name, this.addPositionForm.orgId)
                savePositionList({
                    //id:this.pageNum,
                    name: this.addPositionForm.name,
                    orgId: this.addPositionForm.orgId
                }).then(res => {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormPositionVisible = false;
                    this.getPositionList();
                }).catch(error => {
                    console.log(error)
                });
            },
            /* 删除岗位列表 */
            deletePost(row) {
                console.log(row)
                this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePositionList({
                        id: row.postId,
                    }).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.getPositionList();
                    }).catch(error => {
                        console.log(error)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /* 修改岗位列表 */
            updatePost(scope) {
                this.showPostInd = scope.$index;
                this.inputPostName = scope.row.postName;
            },
            /* 失去焦点 确认修改 */
            updatePositionList(scope) {
                updatePositionList({
                    id: scope.row.postId,
                    name: this.inputPostName,
                    postId: scope.row.postId,
                }).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.showPostInd = -1;
                    this.getPositionList();
                }).catch(error => {
                    console.log(error)
                });
            },

            /* 人员列表查询 */
            getEmployeeList() {
                getEmployeeList({
                    pageNum: this.pageNum2,
                    pageSize: this.pageSize2,
                    orgIdEmployee: this.orgIdTab || '601'
                }).then(res => {
                    this.objectEmpList = res.result.records;
                    this.total2 = res.result.total
                }).catch(error => {
                    console.log(error)
                });
            },

            /* 显示添加人员 */
            showAddEmployee() {
                this.titleEmployee = '添加人员列表';
                this.dialogFormEmployeeVisible = true;
                this.addEmployeeForm.name = '';
                this.addEmployeeForm.postId = '';
                this.addEmployeeForm.postName = '';
                this.getPositionList()
            },
            /* 显示修改人员 */
            showUpdateEmp(scope) {
                this.titleEmployee = '修改人员列表';
                this.dialogFormEmployeeVisible = true;
                this.addEmployeeForm.name = scope.row.empName;
                this.addEmployeeForm.postId = scope.row.postId;
                this.addEmployeeForm.postName = scope.row.postName;
                this.addEmployeeForm.empId = scope.row.empId;
                this.getPositionList()
            },

            /* 保存新增renyuan列表 */
            saveEmployeeList() {
                saveEmployeeList({
                    //id:this.pageNum,
                    name: this.addEmployeeForm.name,
                    posHid: this.addEmployeeForm.postId,
                    orgId: this.orgIdTab || '601',
                }).then(res => {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormEmployeeVisible = false;
                    this.getEmployeeList();
                }).catch(error => {
                    console.log(error)
                });
            },

            /* 删除人员列表 */
            deleteEmployeeList(row) {
                this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteEmployeeList({
                        id: row.empId,
                    }).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.getEmployeeList();
                    }).catch(error => {
                        console.log(error)
                    });
                }).catch(() => {
                    /* this.$message({
                        type: 'info',
                        message: '已取消删除'
                    }); */
                });
            },
            /*  确认修改renyuan */
            updateEmployeeList(scope) {
                console.log()
                updateEmployeeList({
                    name: this.addEmployeeForm.name,
                    posHid: this.addEmployeeForm.postId,
                    id: this.addEmployeeForm.empId,
                    orgId: this.orgIdTab || '601',
                }).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.getEmployeeList();
                    this.dialogFormEmployeeVisible = false;
                }).catch(error => {
                    console.log(error)
                });
            },
            showAddOrg(data) { //显示添加组织弹框
                this.dialogFormOrgVisible = true
                this.titleOrg = '新增组织';
                this.addOrgForm.orgName = '';
                this.addOrgForm.shortName = '';
                this.addOrgForm.id = '';
                this.addOrgForm.parent = data.parent;

            },
            showUpdateOrg(data) { //显示修改组织弹框
                this.dialogFormOrgVisible = true
                this.titleOrg = '修改组织';
                this.addOrgForm.orgName = data.orgName;
                this.addOrgForm.shortName = data.shortName;
                this.addOrgForm.id = data.id;
                this.addOrgForm.parent = data.parent;
            },
            orgSaveBtn(data) { //新增保存组织
                orgSave({
                    id: this.addOrgForm.parent,
                    orgName: this.addOrgForm.orgName,
                    shortName: this.addOrgForm.shortName,
                }).then(res => {
                    this.orgIdCRUD = this.addOrgForm.parent;
                    let node = this.$refs.asyncTree.getNode(this.orgIdCRUD); // 通过节点id找到对应树节点对象
                    node.loaded = false;
                    node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点

                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.dialogFormOrgVisible = false;
                    /* this.showPostInd = -1;
                    this.getPositionList(); */
                }).catch(error => {
                    console.log(error)
                });
            },
            OrgUpdateBtn(data) { //修改保存组织
                orgUpdate({
                    id: this.addOrgForm.id,
                    orgName: this.addOrgForm.orgName,
                    shortName: this.addOrgForm.shortName,
                }).then(res => {
                    this.dialogFormOrgVisible = false;
                    this.orgIdCRUD = this.addOrgForm.parent;
                    let node = this.$refs.asyncTree.getNode(this.orgIdCRUD); // 通过节点id找到对应树节点对象
                    node.loaded = false;
                    node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });

                }).catch(error => {
                    console.log(error)
                });
            },
            removeOrg(data) { //删除组织
                orgDelete({
                    id: data.id,
                }).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    });

                }).catch(error => {
                    console.log(error)
                });
            }
        }
    }

</script>

<style lang="less" scoped>
    .app-frame/deep/.el-table__header tr,
    .app-frame/deep/.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }

    .app-frame/deep/.el-tree {
        background: transparent;
    }

    /* .app-frame/deep/.el-tree-node__content{
        background: transparent;
        color: #ffffff;
    } */
    .app-frame/deep/.el-tree-node:focus>.el-tree-node__content .span-text {
        color: #043779;
    }

    .app-frame/deep/.el-tree-node__content:hover .span-text {
        color: #043779;
    }

    .app-frame/deep/.el-tree-node__expand-icon {
        font-size: 16px;
    }

    .frame-all {
        display: flex;
        justify-content: space-between;

        .frame-left {
            width: 350px;
            background: #215283;
            padding: 10px;
            margin-right: 5px;
        }

        .frame-right {
            width: 100%;
            background: #ffffff;
            padding: 10px;
        }
    }

    .custom-tree-node {
        display: flex;
        align-items: center;
    }

    .span-text {
        display: inline-block;
        color: white;
        font-size: 16px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .span-btn {
        display: inline-block;
        color: tomato;
        margin-left: 5px;
        font-size: 14px;
    }

    /* .span-hidden {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    } */

    /* .el-main {
        padding: 0px 10px;
    } */

    .drop-all {
        margin: auto;
        text-align: center;
    }

</style>
