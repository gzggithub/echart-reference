<template>
    <div class="app-correct">
        <div class="ove-title">设备信息智能纠错</div>
        <div class="ove-search">
            <div class="ove-search-in">
                <span>主网/配网：</span>
                <el-select v-model="type" size="small" placeholder="请选择" @change="typeChange()">
                    <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ove-search-in">
                <span>设备类别：</span>
                <el-select v-model="selectClassify" size="small" placeholder="请选择" @change="classifyChange()">
                    <el-option v-for="(item,index) in classifys" :key="index" :label="showClassify(item)"
                        :value="item.classifyName">
                    </el-option>
                </el-select>
            </div>
        </div>
        <!--  -->
        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp; 纠错整体情况</div>

        <el-row>
            <el-col :span="12">
                <div class="correctChart border-right border-bottom">
                    <equipCorrectBarManufacturer ref="equipCorrectBarManufacturer"></equipCorrectBarManufacturer>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="correctChart border-bottom">
                    <equipCorrectBarDeviceModel ref="equipCorrectBarDeviceModel"></equipCorrectBarDeviceModel>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="correctChart">
                    <equipCorrectChart ref="equipCorrectChart"></equipCorrectChart>
                </div>
            </el-col>
        </el-row>
        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;数据列表</div>
        <el-table :data="correctDetails" border fit @row-click="openDetails">
            <el-table-column label="设备类别" prop="classifyName" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="设备型号" prop="deviceModel" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="生产厂家" prop="manufacturer" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{scope.row.manufacturer}} <br />({{scope.row.manufacturer_old}} )
                </template>
            </el-table-column>
            <el-table-column label="记录总数" prop="classifyNameTotal" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="技术参数" min-width="450px" align="center">
                <template slot-scope="params">
                    <el-table :data="getParams(params.row)">
                        <el-table-column label="技术参数" prop="paramName" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="非空记录数" prop="paramTotal" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="参考值" prop="paramMaxValue" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span class="default-value">{{scope.row.paramMaxValue}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="参考值记录数" prop="paramValueNum" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="参考值记录占比" prop="maxValuePer" :formatter="formateNum"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="参考值记录纯比" prop="purePer" :formatter="formateNum"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
        </el-table>
        <div class="ove-pagination">
            <el-pagination background layout="total, sizes, prev, pager, next" :total="total"
                :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :current-page="pageNum"
                @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {
        queryClassifyNameAndTotal,
        queryDeviceModelAndTotal,
        queryManufacturerAndTotal,
        queryPerByClassifyDeviceModeManufacture,
        queryMainDeviceAnswerByClassifyDeviceModeManufacture,
        queryViceDeviceAnswerByClassifyDeviceModeManufacture
    } from "../../request/api.js"
    import equipCorrectChart from "@/components/echarts/equipCorrectChart"
    import equipCorrectBarDeviceModel from "@/components/echarts/equipCorrectBarDeviceModel"
    import equipCorrectBarManufacturer from "@/components/echarts/equipCorrectBarManufacturer"
    export default {
        name: "equipCorrect",
        data() {
            return {
                type: "main",
                types: [{
                    value: 'main',
                    label: '主网'
                }, {
                    value: 'vice',
                    label: '配网'
                }],
                classifys: [],
                selectClassify: '',
                correctDetails: [],
                total: 0, //数据总条数
                pageSize: 10,
                pageNum: 1,
                deviceModel: '',
                manufacturer: ''
            }
        },
        methods: {
            getParams(row) {
                let params = new Array()
                if (this.type === 'main') {
                    let youhaoObject = new Object()
                    youhaoObject.paramName = '油号'
                    youhaoObject.paramTotal = row.youhaoTotal
                    youhaoObject.paramMaxValue = row.youhao
                    youhaoObject.paramValueNum = row.youhaoMax
                    youhaoObject.maxValuePer = row.youhaoRatio
                    youhaoObject.purePer = Math.round(row.youhaoMax * 100 / row.classifyNameTotal) / 100
                    params.push(youhaoObject)

                    let jyspObject = new Object()
                    jyspObject.paramName = '绝缘水平'
                    jyspObject.paramTotal = row.jyspTotal
                    jyspObject.paramMaxValue = row.jysp
                    jyspObject.paramValueNum = row.jyspMax
                    jyspObject.maxValuePer = row.jyspRatio
                    jyspObject.purePer = Math.round(row.jyspMax * 100 / row.classifyNameTotal) / 100
                    params.push(jyspObject)

                    let eddyObject = new Object()
                    eddyObject.paramName = '额定电压'
                    eddyObject.paramTotal = row.eddyTotal
                    eddyObject.paramMaxValue = row.eddy
                    eddyObject.paramValueNum = row.eddyMax
                    eddyObject.maxValuePer = row.eddyRatio
                    eddyObject.purePer = Math.round(row.eddyMax * 100 / row.classifyNameTotal) / 100
                    params.push(eddyObject)

                    let eddlObject = new Object()
                    eddlObject.paramName = '额定电流'
                    eddlObject.paramTotal = row.eddlTotal
                    eddlObject.paramMaxValue = row.eddl
                    eddlObject.paramValueNum = row.eddlMax
                    eddlObject.maxValuePer = row.eddlRatio
                    eddlObject.purePer = Math.round(row.eddlMax * 100 / row.classifyNameTotal) / 100
                    params.push(eddlObject)

                    let pdbjObject = new Object()
                    pdbjObject.paramName = '爬电比距'
                    pdbjObject.paramTotal = row.pdbjTotal
                    pdbjObject.paramMaxValue = row.pdbj
                    pdbjObject.paramValueNum = row.pdbjMax
                    pdbjObject.maxValuePer = row.pdbjRatio
                    pdbjObject.purePer = Math.round(row.pdbjMax * 100 / row.classifyNameTotal) / 100
                    params.push(pdbjObject)

                    let dianrongObject = new Object()
                    dianrongObject.paramName = '电容量'
                    dianrongObject.paramTotal = row.dianrongTotal
                    dianrongObject.paramMaxValue = row.dianrong
                    dianrongObject.paramValueNum = row.dianrongMax
                    dianrongObject.maxValuePer = row.dianrongRatio
                    dianrongObject.purePer = Math.round(row.dianrongMax * 100 / row.classifyNameTotal) / 100
                    params.push(dianrongObject)
                } else {
                    let byqlxObject = new Object()
                    byqlxObject.paramName = '变压器类型'
                    byqlxObject.paramTotal = row.byqlxTotal
                    byqlxObject.paramMaxValue = row.byqlx
                    byqlxObject.paramValueNum = row.byqlxMax
                    byqlxObject.maxValuePer = row.byqlxRatio
                    byqlxObject.purePer = Math.round(row.byqlxMax * 100 / row.classifyNameTotal) / 100
                    params.push(byqlxObject)

                    let bffsObject = new Object()
                    bffsObject.paramName = '包封方式'
                    bffsObject.paramTotal = row.bffsTotal
                    bffsObject.paramMaxValue = row.bffs
                    bffsObject.paramValueNum = row.bffsMax
                    bffsObject.maxValuePer = row.bffsRatio
                    bffsObject.purePer = Math.round(row.bffsMax * 100 / row.classifyNameTotal) / 100
                    params.push(bffsObject)

                    let rzdxczObject = new Object()
                    rzdxczObject.paramName = '绕组导线材质'
                    rzdxczObject.paramTotal = row.rzdxczTotal
                    rzdxczObject.paramMaxValue = row.rzdxcz
                    rzdxczObject.paramValueNum = row.rzdxczMax
                    rzdxczObject.maxValuePer = row.rzdxczRatio
                    rzdxczObject.purePer = Math.round(row.rzdxczMax * 100 / row.classifyNameTotal) / 100
                    params.push(rzdxczObject)

                    let txxsObject = new Object()
                    txxsObject.paramName = '铁芯型式'
                    txxsObject.paramTotal = row.txxsTotal
                    txxsObject.paramMaxValue = row.txxs
                    txxsObject.paramValueNum = row.txxsMax
                    txxsObject.maxValuePer = row.txxsRatio
                    txxsObject.purePer = Math.round(row.txxsMax * 100 / row.classifyNameTotal) / 100
                    params.push(txxsObject)

                    let yxmfxsObject = new Object()
                    yxmfxsObject.paramName = '油箱密封型式'
                    yxmfxsObject.paramTotal = row.yxmfxsTotal
                    yxmfxsObject.paramMaxValue = row.yxmfxs
                    yxmfxsObject.paramValueNum = row.yxmfxsMax
                    yxmfxsObject.maxValuePer = row.yxmfxsRatio
                    yxmfxsObject.purePer = Math.round(row.yxmfxsMax * 100 / row.classifyNameTotal) / 100
                    params.push(yxmfxsObject)

                    let eddyObject = new Object()
                    eddyObject.paramName = '额定电压'
                    eddyObject.paramTotal = row.eddyTotal
                    eddyObject.paramMaxValue = row.eddy
                    eddyObject.paramValueNum = row.eddyMax
                    eddyObject.maxValuePer = row.eddyRatio
                    eddyObject.purePer = Math.round(row.eddyMax * 100 / row.classifyNameTotal) / 100
                    params.push(eddyObject)

                    let eddrObject = new Object()
                    eddrObject.paramName = '额定容量'
                    eddrObject.paramTotal = row.eddrTotal
                    eddrObject.paramMaxValue = row.eddr
                    eddrObject.paramValueNum = row.eddrMax
                    eddrObject.maxValuePer = row.eddrRatio
                    eddrObject.purePer = Math.round(row.eddrMax * 100 / row.classifyNameTotal) / 100
                    params.push(eddrObject)

                    let fjfwObject = new Object()
                    fjfwObject.paramName = '分接范围'
                    fjfwObject.paramTotal = row.fjfwTotal
                    fjfwObject.paramMaxValue = row.fjfw
                    fjfwObject.paramValueNum = row.fjfwMax
                    fjfwObject.maxValuePer = row.fjfwRatio
                    fjfwObject.purePer = Math.round(row.fjfwMax * 100 / row.classifyNameTotal) / 100
                    params.push(fjfwObject)

                    let jxzbObject = new Object()
                    jxzbObject.paramName = '结线组别'
                    jxzbObject.paramTotal = row.jxzbTotal
                    jxzbObject.paramMaxValue = row.jxzb
                    jxzbObject.paramValueNum = row.jxzbMax
                    jxzbObject.maxValuePer = row.jxzbRatio
                    jxzbObject.purePer = Math.round(row.jxzbMax * 100 / row.classifyNameTotal) / 100
                    params.push(jxzbObject)

                    let yxfjdwObject = new Object()
                    yxfjdwObject.paramName = '运行分接档位'
                    yxfjdwObject.paramTotal = row.yxfjdwTotal
                    yxfjdwObject.paramMaxValue = row.yxfjdw
                    yxfjdwObject.paramValueNum = row.yxfjdwMax
                    yxfjdwObject.maxValuePer = row.yxfjdwRatio
                    yxfjdwObject.purePer = Math.round(row.yxfjdwMax * 100 / row.classifyNameTotal) / 100
                    params.push(yxfjdwObject)

                    let xsObject = new Object()
                    xsObject.paramName = '相数'
                    xsObject.paramTotal = row.xsTotal
                    xsObject.paramMaxValue = row.xs
                    xsObject.paramValueNum = row.xsMax
                    xsObject.maxValuePer = row.xsRatio
                    xsObject.purePer = Math.round(row.xsMax * 100 / row.classifyNameTotal) / 100
                    params.push(xsObject)

                    let tyfsObject = new Object()
                    tyfsObject.paramName = '调压方式'
                    tyfsObject.paramTotal = row.tyfsTotal
                    tyfsObject.paramMaxValue = row.tyfs
                    tyfsObject.paramValueNum = row.tyfsMax
                    tyfsObject.maxValuePer = row.tyfsRatio
                    tyfsObject.purePer = Math.round(row.tyfsMax * 100 / row.classifyNameTotal) / 100
                    params.push(tyfsObject)
                }
                return params
            },
            showClassify(item) {
                return item.classifyName + '(' + item.total + ')'
            },
            typeChange() {
                this.classifys = []
                this.selectClassify = ''
                this.correctDetails = []
                this.total = 0
                queryClassifyNameAndTotal({
                    'type': this.type
                }).then(res => {
                    this.classifys = res.result;
                }).catch(error => {
                    console.log(error)
                });
            },
            classifyChange() {
                this.correctDetails = []
                this.total = 0
                queryManufacturerAndTotal({
                    'type': this.type,
                    'classifyName': this.selectClassify
                }).then(res => {
                    this.$refs.equipCorrectBarManufacturer.showBar(res.result)
                }).catch(error => {
                    console.log(error)
                });
                queryDeviceModelAndTotal({
                    'type': this.type,
                    'classifyName': this.selectClassify,
                    'manufacturer': ''
                }).then(res => {
                    this.$refs.equipCorrectBarDeviceModel.showBar(res.result)
                }).catch(error => {
                    console.log(error)
                });
                queryPerByClassifyDeviceModeManufacture({
                    'type': this.type,
                    'classifyName': this.selectClassify
                }).then(res => {
                    this.$refs.equipCorrectChart.showBar(res.result)
                    this.queryDetail()
                }).catch(error => {
                    console.log(error)
                });
            },
            queryDetail() {
                if (this.type === 'main') {
                    queryMainDeviceAnswerByClassifyDeviceModeManufacture({
                        'classifyName': this.selectClassify,
                        'deviceModel': this.deviceModel,
                        'manufacturer': this.manufacturer,
                        'pageNum': this.pageNum,
                        'pageSize': this.pageSize
                    }).then(res => {
                        this.correctDetails = res.result.records;
                        this.total = res.result.total;
                    }).catch(error => {
                        console.log(error)
                    });
                } else {
                    queryViceDeviceAnswerByClassifyDeviceModeManufacture({
                        'classifyName': this.selectClassify,
                        'deviceModel': this.deviceModel,
                        'manufacturer': this.manufacturer,
                        'pageNum': this.pageNum,
                        'pageSize': this.pageSize
                    }).then(res => {
                        this.correctDetails = res.result.records;
                        this.total = res.result.total;
                    }).catch(error => {
                        console.log(error)
                    });
                }
            },
            handleSizeChange(val) { //每页多少条数据
                this.pageSize = val;
                //重置当前页为1
                this.handleCurrentChange(1);
            },
            handleCurrentChange(val) { //当前第几页
                this.pageNum = val;
                this.queryDetail();
            },
            formateNum(row, column, cellValue) {
                let num = cellValue
                return Math.round(num * 1000) / 10 + '%'
            },
            openDetails(row) {
                if (this.type === 'main') {
                    this.$router.push({
                        name: 'correctDetailMain',
                        params: {
                            'classifyName': row.classifyName,
                            'manufacturer': row.manufacturer,
                            'deviceModel': row.deviceModel,
                        }
                    });
                } else {
                    this.$router.push({
                        name: 'correctDetailVice',
                        params: {
                            'classifyName': row.classifyName,
                            'manufacturer': row.manufacturer,
                            'deviceModel': row.deviceModel,
                        }
                    });
                }
            }
        },
        created() {

        },
        mounted() {
            this.typeChange()
        },
        components: {
            equipCorrectChart,
            equipCorrectBarDeviceModel,
            equipCorrectBarManufacturer
        }
    }

</script>
<style lang="less" scoped>
    .correctChart {
        height: 300px;
    }

    .app-correct {
        padding: 2px;
    }

    .app-correct /deep/ .el-table__body tr,
    .app-correct /deep/ .el-table__body td {
        padding: 0;
        height: 20px;
        font-size: 10;
    }

    .app-correct/deep/.el-table__header tr,
    .app-correct/deep/.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }
    .border-right {
        border-right: 5px solid #EBEEF5;
    }
    .border-bottom {
        border-bottom: 5px solid #EBEEF5;
    }

    .error {
        color: red;
    }

    .default-value {
        color: blue;
    }

</style>
