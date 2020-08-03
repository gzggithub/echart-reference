<template>
    <div class="app-main">
        <!-- <div class="app-title"><img src="../../../assets/img/accountability/analysis_5.png" />添加账号</div> -->
        <el-row>
            <el-col :span="12">
                <el-tree ref="tree" :props="props" lazy highlight-current @node-click="clickNode" :load="loadNode">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span
                            class="span-type">({{data.type == 1 ? '公司' : data.type == 2 ? '子公司' : data.type == 3?'部门' : '局本部' }})</span>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="12">
                <el-table :data="accountList" @selection-change="getAccountId">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                </el-table>
                <el-button type="primary" @click="createUserByEmplyeeIds">确认添加</el-button>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import {
        orgTreeByOrgId,
        queryEmployeeListByOrgId,
        createUserByEmplyeeIds,
        orgRegionTreeByOrgId
    } from '../../../request/api'
    export default {
        name: "addAccount",
        data() {
            return {

                orgId: 6,
                parentNode: [],
                childNode: [],
                props: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
                accountList: [],
                name: '',
                selectIds: [],
                setChild: [], //局本部子节点
                flag: 1,

            };

        },

        methods: {
            clickNode(data) {
                if (data.type !== 4) {
                    this.orgId = data.id
                    this.queryEmployeeListByOrgId()
                }
            },
            loadNode(node, resolve) {
                console.log(node)
                let parentThree = [],
                    childThree = []
                let orgRegionTree = [{
                    id: '',
                    name: '局本部',
                    type: 4,
                }]

                //var setChild = []
                if (node.data && node.data.type == 4) {
                    console.log('type4')
                    console.log(node.data.id)
                    this.setChild = []
                    orgRegionTreeByOrgId({
                        orgId: node.data.id || ''
                    }).then(res => {
                        console.log(res)
                        this.setChild = this.setChild.concat(res.result.subCompanyTree, res.result.deptTree)

                    }).catch(error => {

                    })
                    setTimeout(() => {
                        resolve(this.setChild);
                    }, 500);

                } else {
                    console.log('type')

                    if (node.data) {
                        this.orgId = node.data.id
                    }
                    orgTreeByOrgId({
                        orgId: this.orgId,
                        flag: this.flag
                    }).then(res => {
                        console.log('sucess')
                        this.flag = ''
                        parentThree.push(res.result.tree)
                        childThree = res.result.companyTree;
                        //this.setChild = []
                        if (res.result.orgRegionTree.id) {
                            console.log(res.result.orgRegionTree.id)
                            orgRegionTree[0].id = res.result.orgRegionTree.id
                        }
                        if (res.result.orgRegionTree) {
                            /* this.setChild = this.setChild.concat(res.result.orgRegionTree.subCompanyTree, res
                                .result.orgRegionTree.deptTree) */
                            if (res.result.orgRegionTree.subCompanyTree.length !== 0 || res.result.orgRegionTree
                                .deptTree.length !== 0) {
                                parentThree = parentThree.concat(orgRegionTree);
                                childThree = childThree.concat(orgRegionTree);
                            };
                        } else {
                            //this.setChild = []
                        }
                        if (node.level === 0) {
                            return resolve(parentThree);
                        }
                        if (node.level > 10) return resolve([]);

                        setTimeout(() => {
                            resolve(childThree);
                        }, 500);

                    }).catch(error => {
                        console.log(error)
                        console.log('error')
                    })
                }
                //this.queryEmployeeListByOrgId()

            },
            queryEmployeeListByOrgId() { //根据组织id查询人员列表
                queryEmployeeListByOrgId({
                    orgId: this.orgId,
                    name: this.name
                }).then(res => {
                    this.accountList = res.result
                }).catch(error => {

                })
            },
            getAccountId(val) { //得到选中用户id
                this.selectIds = [];
                if (val) {
                    val.forEach(item => {
                        this.selectIds.push(item.id)
                    });
                }
                this.selectIds = this.selectIds.join()
                console.log(this.selectIds)
            },
            createUserByEmplyeeIds() { //创建用户
                createUserByEmplyeeIds({
                    emplyeeIds: this.selectIds,
                }).then(res => {
                    console.log(res)
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.$emit('childClick', false);
                }).catch(error => {

                })
            }

        },
        created() {
            //this.orgTreeByOrgId()
        },
        mounted() {
            //this.queryEmployeeListByOrgId()
        },
    }

</script>

<style lang="less" scoped>
    .app-main {
        min-height: 700px;
        padding: 10px;
        background: rgba(230, 238, 248, 1);
    }

    .span-type {
        margin-left: 20px;
        color: #ef0c0c;
    }

</style>
