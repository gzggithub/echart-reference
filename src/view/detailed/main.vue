<template>
    <div class="app-problem">
        <div class="problem-left">
            <left-list @child-click="childClick" flag='main' v-bind:ind=this.$route.params.ind></left-list>
        </div>
        <div class="problem-right ove-right-pad">
            <div class="ove-title">数据质量统计信息</div>
            <div class="ove-search">
                <div class="ove-search-in">
                    <span>下级单位：</span>
                    <el-select v-model="subDept" size="small" @change="getSubDept" placeholder="请选择">
                        <el-option v-for="item in dataSubDept" :key=item.id :label=item.orgName :value=item.id>
                        </el-option>
                    </el-select>&emsp;&emsp;&emsp;&emsp;
                </div>
                <div class="ove-search-in" v-if="showProfessional">
                    <span>主网：</span>
                    <el-select v-model="value" size="small" @change="getMajor" placeholder="请选择">
                        <el-option key="1" label="主网" value="main"></el-option>
                        <!--  <el-option key="2" label="配网" value="vice"></el-option> -->
                    </el-select>&emsp;&emsp;&emsp;&emsp;
                </div>
                <div class="ove-search-in" v-if="showProfessional">
                    <span>专业：</span>
                    <el-select v-model="valueMajor" size="small" @change="getProfessional" placeholder="请选择">
                        <el-option v-for="item in dataMajor" :key=item.professionalInt :label=item.professionalStr
                            :value=item.professionalInt>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="tab-out">
                <el-table :data="tableDataAll" :span-method="objectSpanMethod" style="margin-bottom:20px" stripe
                    size="small" border>
                    <el-table-column align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.flag=='main'?'主网':'配网'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="合计" align="center">
                        <template slot-scope="scope">
                            <span class="tb-span"
                                @click="cellClick(scope.row, 0)">{{scope.row.flag=='main'?tableDataOne.mainCount:tableDataOne.viceCount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="professional" label="专业" align="center"></el-table-column>
                    <el-table-column label="完整性" align="center">
                        <template slot-scope="scope">
                            <span class="tb-span" @click="cellClick(scope.row, 1)">{{scope.row.normName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="规范性" align="center">
                        <template slot-scope="scope">
                            <span class="tb-span" @click="cellClick(scope.row, 2)">{{scope.row.fullName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="小计" align="center">
                        <template slot-scope="scope">
                            <span class="tb-span" @click="cellClick(scope.row, 3)">{{scope.row.bigNum}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="title-export">
                <span>问题数据明细</span>
                <span class="export" @click="exportData">导出数据</span>
            </div>
            <el-table :data="tableDataTwo" stripe size="small" border>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="siteName" label="站/线名称 ">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="objectName" label="设备名称">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="classifyName" label="设备类别">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="checkType" label="数据类型">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="checkName" label="数据项">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop @click="goObjectQuery(scope.row.checkName)"
                            class="dg-url dg-succeed">{{scope.row.checkName}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="itemValue" label="数据值">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="errorType" label="质量维度">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="rulesDetail" label="质量规则">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="ruleName" label="问题描述">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="vindicateOname" label="责任机构">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="responsible" label="责任人">
                </el-table-column>
            </el-table>
            <div v-if="tableDataTwo.length !== 0" class="ove-paging">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-sizes="[20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>

        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import {
        queryDataQualityInfoMain,
        queryDataQuestionList,
        downloadDataQuestionExcel,
        getMenu,
        professionalListByFlag,
        getChildrenByNameAndFlag,
        queryLikeObjects,
        getOgrListByParent,
    } from '../../request/api';
    import leftList from "../../components/leftList";
    export default {
        name: "detailedMain",
        components: {
            leftList
        },
        data() {
            return {
                value: 'main',
                valueMajor: '',
                subDept: '',
                dataMajor: [],
                dataSubDept: [],
                tableDataOne: [],
                tableDataAll: [],
                tableDataTwo: [],
                /* name: '大理供电局',
                menuId: '601', */
                status: 0,
                spanArr: [],
                position: 0,
                current: 1,
                errorType: 0,
                flag: 'main',
                professional: '',
                size: 20,
                total: 1,

                pageshow: true,
                professionLevel: '1', //默认为主网
                showTableAll: true,
                showProfessional: true,
            }
        },
        computed: {
            ...mapState('leftList', ['changeId']),
        },
        methods: {
            ...mapMutations('leftList', ['SET_CHANGE_ID']),
            /* 合并单元格 */
            rowspan() {
                this.tableDataAll.forEach((item, index) => {
                    if (index === 0) {
                        this.spanArr.push(1);
                        this.position = 0;
                    } else {
                        if (this.tableDataAll[index].flag === this.tableDataAll[index - 1].flag) {
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                })
            },
            objectSpanMethod({
                row,
                column,
                rowIndex,
                columnIndex
            }) { //表格合并行
                if (columnIndex === 0) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if (columnIndex === 1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },

            handleNodeClick(data) {
                this.name = data.name;
                this.getTableOne();
            },

            /* 获取数据质量统计信息 */
            getTableOne() {
                queryDataQualityInfoMain({
                    id: this.subDept || this.changeId,
                    status: this.status,
                    professionLevel: this.professionLevel,
                    professional: this.valueMajor
                }).then(res => {
                    this.tableDataOne = res.result;
                    this.tableDataAll = res.result.dataQualitiesMain.concat(res.result.dataQualitiesVice)
                    this.rowspan()
                }).catch(error => {
                    console.log(error)
                })
            },
            /* 获取问题数据明细 */
            getTableTwo() {
                queryDataQuestionList({
                    current: this.current,
                    errorType: this.errorType,
                    flag: this.flag,
                    professional: this.professional,
                    size: this.size,
                    id: this.subDept || this.changeId,
                    status: this.status,
                }).then(res => {
                    this.tableDataTwo = res.result.records;
                    this.total = res.result.total
                }).catch(error => {
                    console.log(error)
                })
            },
            /* 导出数据 */
            exportData() {
                let url =
                    `/apis/equip/dgequip/equip/professionalQuestion/downloadDataQuestionExcel?
                current=${this.current}&errorType=${this.errorType}&flag=${this.flag}&professional=${this.professional}&size=${this.size}&id=${this.changeId}&status=${this.status}`
                location.href = url;
            },
            handleSizeChange(val) {
                this.size = val;
                this.getTableTwo();
            },
            handleCurrentChange(val) {
                this.current = val;
                this.getTableTwo();
            },
            cellClick(row, num) {
                this.flag = row.flag;
                this.professional = row.professionalInt;
                this.errorType = num;
                this.getTableTwo();
            },

            childClick(val, ind) {
                //将分页的参数重置
                this.current = 1;
                this.size = 20;

                this.pageshow = false;
                this.$nextTick(() => {
                    this.pageshow = true;
                });
                this.SET_CHANGE_ID(val.id);

                this.value = val.flag;
                if (val.id == '601') {
                    this.falg = 'main';
                } else {
                    this.flag = val.flag;
                }
                this.subDept = '';
                this.errorType = 0;
                this.professional = '';
                this.valueMajor = '',
                this.status = 0;
                this.getChildrenByNameAndFlag();
                this.getTableOne();
                this.getTableTwo();
            },
            getChildrenByNameAndFlag() {
                //获取下级班组或者供电局
                getOgrListByParent({
                    id: this.changeId,
                    flag:'main'
                }).then(res => {
                    this.dataSubDept = res.result;
                }).catch(error => {
                    console.log(error)
                })
            },
            getMajor() { //根据状态获取专业
                professionalListByFlag({
                    flag: this.value
                }).then(res => {
                    this.dataMajor = res.result;
                }).catch(error => {
                    console.log(error)

                })
            },
            //专业下拉框的change事件
            getProfessional() {
                this.getTableOne();
            },
            //下级部门的内容改变事件
            getSubDept() {
                //this.name = this.subDept;
                this.getMajor();
                this.getTableOne();
            },
            goObjectQuery(itemName) {
                queryLikeObjects({
                    input_text: itemName
                }).then(res => {
                    if (res && res.length > 0) {
                        this.$router.push({
                            name: 'queryObject',
                            params: {
                                'objectName': res[0].name,
                                'objectLabel': res[0].label
                            }
                        })
                    } else {
                        this.$message({
                            offset: 150,
                            message: '此数据项在知识库中暂不存在！',
                            type: 'warning'
                        });
                    }
                }).catch(error => {
                    console.log(error)

                })
            }
        },

        created() {

        },
        mounted() {
            //左侧组织，下级单位，组织类型main或vice，左侧组织的索引位置，传入的专业类型
            if (this.$route.params.subDept) {
                this.status = this.$route.params.status;
                this.subDept = this.$route.params.subDept;
                this.value = this.$route.params.professionLevel == '3' ? 'vice' : 'main'
                this.getMajor();

                this.showProfessional = false;
                console.log(this.showProfessional)
            }
            /*if (this.$route.params.orgId) {
                this.subDept = this.$route.params.orgId;
                this.getMajor();
            }*/
            //如果传入的专业存在
            if (this.$route.params.professionalInt != null && this.$route.params.professionalInt != '') {
                this.getMajor();
                this.valueMajor = this.$route.params.professionalInt;
                this.professional = this.$route.params.professionalInt;
                this.showProfessional = false;
            }
            this.getChildrenByNameAndFlag();
            this.getTableOne();
            this.getTableTwo();
        },
        activated() {}

    }

</script>


<style scoped>
    .problem-left>>>.el-tree {
        background: transparent;
    }

    .problem-left>>>.el-tree-node__label {
        font-size: 16px;
    }

    .problem-left>>>.el-tree-node__expand-icon {
        font-size: 20px;
        color: #043779
    }

    .problem-left>>>.el-tree-node__expand-icon.is-leaf {
        color: transparent;
        cursor: default;
    }

    .problem-right>>>.el-table__header tr,
    .problem-right>>>.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }

    .dg-url {
        font-size: 14px;
        font-weight: 600;
        text-decoration: underline;
    }

    .dg-succeed {
        color: blue;
    }

</style>

<style lang="less" scoped>
    .app-problem {
        display: flex;

        .ove-title {
            padding: 8px 10px;
            font-size: 18px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
            //background: rgba(4, 55, 121, 1);
        }

        .problem-left {
            width: 280px;
            background: #215283;

            .div-daLi {
                font-size: 18px;
                color: #ff3333;
                padding: 8px 20px;
            }

            .ul-department li {
                font-size: 16px;
                color: #333333;
                padding: 4px 40px;
                cursor: pointer;
            }

            .ul-department li.on {
                background: #ffffff;
            }

            .ul-department li:hover {
                background: #ffffff;
            }
        }

        .problem-right {
            width: 100%;

            .title-export {
                display: flex;
                justify-content: space-between;
                padding: 8px 10px;
                font-size: 18px;
                color: rgba(255, 255, 255, 1);
                background: rgba(4, 55, 121, 1);

                .export {
                    font-size: 16px;
                    border-bottom: 1px solid #ffffff;
                    cursor: pointer;
                }
            }

            .tab-out {
                overflow-x: auto;

                .tb-span {
                    display: inline-block;
                    width: 100%;
                    color: #3a78e6;
                    text-decoration: underline;
                    cursor: pointer;
                }

                table {
                    width: 100%;
                    border-right: 1px solid #000;
                    border-bottom: 1px solid #000;
                    margin: 15px auto;
                    text-align: center;
                    color: #606266;

                    thead {
                        background: #4472C4;
                        color: #ffffff
                    }

                    td {
                        border-left: 1px solid #000;
                        border-top: 1px solid #000;
                        padding: 5px;
                        font-size: 16px;
                        letter-spacing: 2px;
                        word-break: keep-all;
                    }

                    td.td-bg {
                        background: #4472C4;
                        color: #ffffff
                    }
                }
            }
        }
    }

</style>
