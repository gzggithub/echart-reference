<template>
    <div class="app-table">
        <div class="tab-out1">
            <div class="tab-title">省</div>
            <el-table :data="proTable" style="width: 100%" row-key="id" :tree-props="{children: 'dept', hasChildren: 'hasChildren'}"
                :header-cell-style="{'background': '#4472C4','color': '#ffffff'}" :row-style="{'background': '#D9E1F2'}"
                border>
                <el-table-column prop="name" label="省级" align="center">
                </el-table-column>
                <el-table-column prop="deptName" label="部门/站所" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="业务数据责任者" align="center"></el-table-column>
            </el-table>
        </div>

        <div class="tab-out2">
            <div class="tab-title">地</div>
            <el-table :data="cityTable" :header-cell-style="{'background': '#4472C4','color': '#ffffff'}" row-key="id" :tree-props="{children: 'dept', hasChildren: 'hasChildren'}"
                :row-style="{'background': '#B4C6E7'}" style="width: 100%" border>
                <el-table-column prop="name" label="地市供电局" align="center">
                </el-table-column>
                <el-table-column prop="deptName" label="部门/站所" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="业务数据责任者" align="center"></el-table-column>
            </el-table>
        </div>

        <div class="tab-out3">
            <div class="tab-title">县</div>
            <el-table :data="countyTable" :header-cell-style="{'background': '#4472C4','color': '#ffffff'}" row-key="id" :tree-props="{children: 'dept', hasChildren: 'hasChildren'}"
                :row-style="{'background': '#8EA9DB'}" style="width: 100%" border>
                <el-table-column prop="name" label="区县供电局" align="center">
                </el-table-column>
                <el-table-column prop="deptName" label="部门/站所" align="center">
                </el-table-column>
                <el-table-column prop="userName" label="业务数据责任者" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {
        queryProDataSteward,
        queryCityDataSteward,
        queryCountyDataSteward
    } from '../../request/api';
    export default {
        name: "contrastTable",
        data() {
            return {
                proTable: [],
                cityTable: [],
                countyTable: []
            }
        },
        computed: {

        },
        methods: {
            //获取省级
            getProTableData() {
                queryProDataSteward({
                    id: '0'
                }).then(res => {
                    this.proTable = res.result;
                }).catch(error => {
                    console.log(error)
                })
            },
            //获取市
            getCityTableData() {
                queryCityDataSteward({
                    id:601
                }).then(res => {
                    this.cityTable = res.result;

                }).catch(error => {
                    console.log(error)
                })
            },
            //获取县
            getCountyTableData() {
                queryCountyDataSteward({
                    id:601
                }).then(res => {
                    this.countyTable = res.result;

                }).catch(error => {
                    console.log(error)
                })
            },


        },
        created() {

        },
        mounted() {
            this.getProTableData();
            this.getCityTableData();
            this.getCountyTableData();
        },
        activated() {}

    }

</script>
<style scoped>
    /* .el-table td,
    .el-table th.is-leaf,
    .el-table--border,
    .el-table--group {
        border-color: black;
    }

    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
        background-color: black;
    }

    .app-table >>> .el-table--border th,
    .app-table >>> .el-table--border td {
        border-right: 1px solid black;
    }

    .app-table >>> .el-table th.is-leaf,
    .app-table >>> .el-table td {
        border-bottom: 1px solid black;
    } */

</style>

<style lang="less" scoped>
    .app-table {
        display: flex;
        justify-content: space-between;

        .tab-out1 {
            width: 26%;
            background: #D9E1F2
        }

        .tab-out2 {
            width: 35%;
            background: #B4C6E7
        }

        .tab-out3 {
            width: 36%;
            background: #8EA9DB
        }

        .tab-title {
            font-size: 18px;
            color: #333333;
            text-align: center;
            padding: 16px 0
        }
    }

</style>
