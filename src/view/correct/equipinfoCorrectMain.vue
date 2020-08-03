<template>
    <div class="app-correct">
        <div class="ove-title">设备技术参数智能纠错明细--主网设备</div>
        <div class="ove-search">
            <div class="ove-search-in">
                <span>设备类别：</span>
                <el-select v-model="selectClassify" size="small" filterable placeholder="请选择设备类别！" @change="classifyChange()">
                    <el-option v-for="(item,index) in classifys" :key="index" :label="showClassify(item)"
                        :value="item.classifyName">
                    </el-option>
                </el-select>
            </div>
            <div class="ove-search-in">
                <span>生产厂家：</span>
                <el-select v-model="selectManufacturer" size="small" filterable placeholder="请选择生产厂家！"
                    @change="manufacturerChange()">
                    <el-option v-for="(item,index) in manufacturers" :key="index" :label="showManufacturer(item)"
                        :value="item.manufacturer">
                    </el-option>
                </el-select>
            </div>
            <div class="ove-search-in">
                <span>设备型号：</span>
                <el-select v-model="selectModel" size="small" filterable placeholder="请选择设备型号！" @change="modelChange()">
                    <el-option v-for="(item,index) in models" :key="index" :label="showDeviceModel(item)"
                        :value="item.deviceModel">
                    </el-option>
                </el-select>
            </div>
        </div>
        
        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp; 纠错情况</div>
        <div class="correctChart">
            <equipCorrectChart ref="equipCorrectChart"></equipCorrectChart>
        </div>
        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;数据列表(参考值)</div>
        <el-table :data="correctValues" border fit @row-click="errorDetails">
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
        <div class="ove-title"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;数据列表(纠错明细)</div>
        <el-table :data="correctDetails" border fit :row-style="tableRowStyle">
            <el-table-column type="expand">
                <template slot-scope="props">
                    &nbsp;&nbsp;&nbsp;&nbsp;设备编码：<span>{{ props.row.deviceCode }}</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;设备全路径: <span>{{ props.row.fullPath }}</span>
                </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center">
            </el-table-column>
            <el-table-column label="油号" prop="youhao" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="error" v-if="erroryouhao(scope.row.youhao)">{{scope.row.youhao}}</span>
                </template>
            </el-table-column>
            <el-table-column label="绝缘水平" prop="jysp" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="error" v-if="errorjysp(scope.row.jysp)">{{scope.row.jysp}}</span>
                </template>
            </el-table-column>
            <el-table-column label="额定电压" prop="eddy" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="error" v-if="erroreddy(scope.row.eddy)">{{scope.row.eddy}}</span>
                </template>
            </el-table-column>
            <el-table-column label="额定电流" prop="eddl" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="error" v-if="erroreddl(scope.row.eddl)">{{scope.row.eddl}}</span>
                </template>
            </el-table-column>
            <el-table-column label="爬电比距" prop="pdbj" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="error" v-if="errorpdbj(scope.row.pdbj)">{{scope.row.pdbj}}</span>
                </template>
            </el-table-column>
            <el-table-column label="电容量" prop="dianrong" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span class="error" v-if="errordianrong(scope.row.dianrong)">{{scope.row.dianrong}}</span>
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
        findOneMainDeviceAnswerByClassifyDeviceModeManufacture,
        queryMainDeviceAnswerByClassifyDeviceModeManufacture,
        queryMaindeviceCorrectDetails
    } from "../../request/api.js"
    import equipCorrectChart from "@/components/echarts/equipCorrectChart"
    export default {
        name: "equipCorrectDetailMain",
        data() {
            return {
                type: 'main',
                classifys: [],
                selectClassify: '',
                models: [],
                selectModel: '',
                manufacturers: [],
                selectManufacturer: '',
                correctDetails: [],
                correctValues: [],
                total: 0, //数据总条数
                pageSize: 10,
                pageNum: 1,
                correctValue: {}
            }
        },
        methods: {
            tableRowStyle({
                row,
                rowIndex
            }) {
                return 'font-size:12px;'
            },
            showDeviceModel(item) {
                return item.deviceModel + '(' + item.total + ')'
            },
            showManufacturer(item) {
                return item.manufacturer + '(' + item.total + ')'
            },
            showClassify(item) {
                return item.classifyName + '(' + item.total + ')'
            },
            classifysInit() {
                queryClassifyNameAndTotal({
                    'type': this.type
                }).then(res => {
                    this.classifys = res.result;
                    this.initClassifyName()
                }).catch(error => {
                    console.log(error)
                });
            },
            classifyChange() {
                queryManufacturerAndTotal({
                    'type': this.type,
                    'classifyName': this.selectClassify
                }).then(res => {
                    this.manufacturers = res.result;
                    this.initManufacturer();
                }).catch(error => {
                    console.log(error)
                });
            },
            manufacturerChange() {
                queryDeviceModelAndTotal({
                    'type': this.type,
                    'classifyName': this.selectClassify,
                    'manufacturer': this.selectManufacturer
                }).then(res => {
                    this.models = res.result;
                    this.initDeviceModel()
                }).catch(error => {
                    console.log(error)
                });
            },
            modelChange() {
                this.correctValues = []
                this.correctDetails = []
                this.pageNum = 1
                this.pageSize = 10
                findOneMainDeviceAnswerByClassifyDeviceModeManufacture({
                    'classifyName': this.selectClassify,
                    'manufacturer': this.selectManufacturer,
                    'deviceModel': this.selectModel,
                }).then(res => {
                    this.$refs.equipCorrectChart.showBar(this.getParams(res.result))
                }).catch(error => {
                    console.log(error)
                });
                queryMainDeviceAnswerByClassifyDeviceModeManufacture({
                    'classifyName': this.selectClassify,
                    'manufacturer': this.selectManufacturer,
                    'deviceModel': this.selectModel,
                    'pageNum': 1,
                    'pageSize': 20
                }).then(res => {
                    this.correctValues = res.result.records
                    this.correctValue = this.correctValues[0]
                    this.queryErrors()
                }).catch(error => {
                    console.log(error)
                });
            },
            queryErrors() {
                queryMaindeviceCorrectDetails({
                    'classifyName': this.selectClassify,
                    'manufacturer': this.selectManufacturer,
                    'deviceModel': this.selectModel,
                    'youhao': this.correctValue.youhao,
                    'jysp': this.correctValue.jysp,
                    'eddy': this.correctValue.eddy,
                    'eddl': this.correctValue.eddl,
                    'pdbj': this.correctValue.pdbj,
                    'dianrong': this.correctValue.dianrong,
                    'pageNum': this.pageNum,
                    'pageSize': this.pageSize
                }).then(res => {
                    this.correctDetails = res.result.records
                    this.total = res.result.total
                }).catch(error => {
                    console.log(error)
                })
            },
            errorDetails(row) {
                this.correctValue = row
                this.queryErrors()
            },
            handleSizeChange(val) { //每页多少条数据
                this.pageSize = val;
                //重置当前页为1
                this.handleCurrentChange(1);
            },
            handleCurrentChange(val) { //当前第几页
                this.pageNum = val;
                this.queryErrors();
            },
            formateNum(row, column, cellValue) {
                let num = cellValue
                return Math.round(num * 1000) / 10 + '%'
            },
            erroryouhao(youhao) {
                return youhao != this.correctValue.youhao
            },
            errorjysp(jysp) {
                return jysp != this.correctValue.jysp
            },
            erroreddy(eddy) {
                return eddy != this.correctValue.eddy
            },
            erroreddl(eddl) {
                return eddl != this.correctValue.eddl
            },
            errorpdbj(pdbj) {
                return pdbj != this.correctValue.pdbj
            },
            errordianrong(dianrong) {
                return dianrong != this.correctValue.dianrong
            },
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
                    youhaoObject.classifyNameTotal = row.classifyNameTotal
                    params.push(youhaoObject)

                    let jyspObject = new Object()
                    jyspObject.paramName = '绝缘水平'
                    jyspObject.paramTotal = row.jyspTotal
                    jyspObject.paramMaxValue = row.jysp
                    jyspObject.paramValueNum = row.jyspMax
                    jyspObject.maxValuePer = row.jyspRatio
                    jyspObject.purePer = Math.round(row.jyspMax * 100 / row.classifyNameTotal) / 100
                    jyspObject.classifyNameTotal = row.classifyNameTotal
                    params.push(jyspObject)

                    let eddyObject = new Object()
                    eddyObject.paramName = '额定电压'
                    eddyObject.paramTotal = row.eddyTotal
                    eddyObject.paramMaxValue = row.eddy
                    eddyObject.paramValueNum = row.eddyMax
                    eddyObject.maxValuePer = row.eddyRatio
                    eddyObject.purePer = Math.round(row.eddyMax * 100 / row.classifyNameTotal) / 100
                    eddyObject.classifyNameTotal = row.classifyNameTotal
                    params.push(eddyObject)

                    let eddlObject = new Object()
                    eddlObject.paramName = '额定电流'
                    eddlObject.paramTotal = row.eddlTotal
                    eddlObject.paramMaxValue = row.eddl
                    eddlObject.paramValueNum = row.eddlMax
                    eddlObject.maxValuePer = row.eddlRatio
                    eddlObject.purePer = Math.round(row.eddlMax * 100 / row.classifyNameTotal) / 100
                    eddlObject.classifyNameTotal = row.classifyNameTotal
                    params.push(eddlObject)

                    let pdbjObject = new Object()
                    pdbjObject.paramName = '爬电比距'
                    pdbjObject.paramTotal = row.pdbjTotal
                    pdbjObject.paramMaxValue = row.pdbj
                    pdbjObject.paramValueNum = row.pdbjMax
                    pdbjObject.maxValuePer = row.pdbjRatio
                    pdbjObject.purePer = Math.round(row.pdbjMax * 100 / row.classifyNameTotal) / 100
                    pdbjObject.classifyNameTotal = row.classifyNameTotal
                    params.push(pdbjObject)

                    let dianrongObject = new Object()
                    dianrongObject.paramName = '电容量'
                    dianrongObject.paramTotal = row.dianrongTotal
                    dianrongObject.paramMaxValue = row.dianrong
                    dianrongObject.paramValueNum = row.dianrongMax
                    dianrongObject.maxValuePer = row.dianrongRatio
                    dianrongObject.purePer = Math.round(row.dianrongMax * 100 / row.classifyNameTotal) / 100
                    dianrongObject.classifyNameTotal = row.classifyNameTotal
                    params.push(dianrongObject)
                } else {
                    let byqlxObject = new Object()
                    byqlxObject.paramName = '变压器类型'
                    byqlxObject.paramTotal = row.byqlxTotal
                    byqlxObject.paramMaxValue = row.byqlx
                    byqlxObject.paramValueNum = row.byqlxMax
                    byqlxObject.maxValuePer = row.byqlxRatio
                    byqlxObject.purePer = Math.round(row.byqlxMax * 100 / row.classifyNameTotal) / 100
                    byqlxObject.classifyNameTotal = row.classifyNameTotal
                    params.push(byqlxObject)

                    let bffsObject = new Object()
                    bffsObject.paramName = '包封方式'
                    bffsObject.paramTotal = row.bffsTotal
                    bffsObject.paramMaxValue = row.bffs
                    bffsObject.paramValueNum = row.bffsMax
                    bffsObject.maxValuePer = row.bffsRatio
                    bffsObject.purePer = Math.round(row.bffsMax * 100 / row.classifyNameTotal) / 100
                    bffsObject.classifyNameTotal = row.classifyNameTotal
                    params.push(bffsObject)

                    let rzdxczObject = new Object()
                    rzdxczObject.paramName = '绕组导线材质'
                    rzdxczObject.paramTotal = row.rzdxczTotal
                    rzdxczObject.paramMaxValue = row.rzdxcz
                    rzdxczObject.paramValueNum = row.rzdxczMax
                    rzdxczObject.maxValuePer = row.rzdxczRatio
                    rzdxczObject.purePer = Math.round(row.rzdxczMax * 100 / row.classifyNameTotal) / 100
                    rzdxczObject.classifyNameTotal = row.classifyNameTotal
                    params.push(rzdxczObject)

                    let txxsObject = new Object()
                    txxsObject.paramName = '铁芯型式'
                    txxsObject.paramTotal = row.txxsTotal
                    txxsObject.paramMaxValue = row.txxs
                    txxsObject.paramValueNum = row.txxsMax
                    txxsObject.maxValuePer = row.txxsRatio
                    txxsObject.purePer = Math.round(row.txxsMax * 100 / row.classifyNameTotal) / 100
                    txxsObject.classifyNameTotal = row.classifyNameTotal
                    params.push(txxsObject)

                    let yxmfxsObject = new Object()
                    yxmfxsObject.paramName = '油箱密封型式'
                    yxmfxsObject.paramTotal = row.yxmfxsTotal
                    yxmfxsObject.paramMaxValue = row.yxmfxs
                    yxmfxsObject.paramValueNum = row.yxmfxsMax
                    yxmfxsObject.maxValuePer = row.yxmfxsRatio
                    yxmfxsObject.purePer = Math.round(row.yxmfxsMax * 100 / row.classifyNameTotal) / 100
                    yxmfxsObject.classifyNameTotal = row.classifyNameTotal
                    params.push(yxmfxsObject)

                    let eddyObject = new Object()
                    eddyObject.paramName = '额定电压'
                    eddyObject.paramTotal = row.eddyTotal
                    eddyObject.paramMaxValue = row.eddy
                    eddyObject.paramValueNum = row.eddyMax
                    eddyObject.maxValuePer = row.eddyRatio
                    eddyObject.purePer = Math.round(row.eddyMax * 100 / row.classifyNameTotal) / 100
                    eddyObject.classifyNameTotal = row.classifyNameTotal
                    params.push(eddyObject)

                    let eddrObject = new Object()
                    eddrObject.paramName = '额定容量'
                    eddrObject.paramTotal = row.eddrTotal
                    eddrObject.paramMaxValue = row.eddr
                    eddrObject.paramValueNum = row.eddrMax
                    eddrObject.maxValuePer = row.eddrRatio
                    eddrObject.purePer = Math.round(row.eddrMax * 100 / row.classifyNameTotal) / 100
                    eddrObject.classifyNameTotal = row.classifyNameTotal
                    params.push(eddrObject)

                    let fjfwObject = new Object()
                    fjfwObject.paramName = '分接范围'
                    fjfwObject.paramTotal = row.fjfwTotal
                    fjfwObject.paramMaxValue = row.fjfw
                    fjfwObject.paramValueNum = row.fjfwMax
                    fjfwObject.maxValuePer = row.fjfwRatio
                    fjfwObject.purePer = Math.round(row.fjfwMax * 100 / row.classifyNameTotal) / 100
                    fjfwObject.classifyNameTotal = row.classifyNameTotal
                    params.push(fjfwObject)

                    let jxzbObject = new Object()
                    jxzbObject.paramName = '结线组别'
                    jxzbObject.paramTotal = row.jxzbTotal
                    jxzbObject.paramMaxValue = row.jxzb
                    jxzbObject.paramValueNum = row.jxzbMax
                    jxzbObject.maxValuePer = row.jxzbRatio
                    jxzbObject.purePer = Math.round(row.jxzbMax * 100 / row.classifyNameTotal) / 100
                    jxzbObject.classifyNameTotal = row.classifyNameTotal
                    params.push(jxzbObject)

                    let yxfjdwObject = new Object()
                    yxfjdwObject.paramName = '运行分接档位'
                    yxfjdwObject.paramTotal = row.yxfjdwTotal
                    yxfjdwObject.paramMaxValue = row.yxfjdw
                    yxfjdwObject.paramValueNum = row.yxfjdwMax
                    yxfjdwObject.maxValuePer = row.yxfjdwRatio
                    yxfjdwObject.purePer = Math.round(row.yxfjdwMax * 100 / row.classifyNameTotal) / 100
                    yxfjdwObject.classifyNameTotal = row.classifyNameTotal
                    params.push(yxfjdwObject)

                    let xsObject = new Object()
                    xsObject.paramName = '相数'
                    xsObject.paramTotal = row.xsTotal
                    xsObject.paramMaxValue = row.xs
                    xsObject.paramValueNum = row.xsMax
                    xsObject.maxValuePer = row.xsRatio
                    xsObject.purePer = Math.round(row.xsMax * 100 / row.classifyNameTotal) / 100
                    xsObject.classifyNameTotal = row.classifyNameTotal
                    params.push(xsObject)

                    let tyfsObject = new Object()
                    tyfsObject.paramName = '调压方式'
                    tyfsObject.paramTotal = row.tyfsTotal
                    tyfsObject.paramMaxValue = row.tyfs
                    tyfsObject.paramValueNum = row.tyfsMax
                    tyfsObject.maxValuePer = row.tyfsRatio
                    tyfsObject.purePer = Math.round(row.tyfsMax * 100 / row.classifyNameTotal) / 100
                    tyfsObject.classifyNameTotal = row.classifyNameTotal
                    params.push(tyfsObject)
                }
                return params
            },
            initClassifyName() {
                if (this.$route.params.classifyName != null && this.$route.params.classifyName != '') {
                    this.selectClassify = this.$route.params.classifyName
                    this.classifyChange()
                }
            },
            initManufacturer() {
                if (this.$route.params.manufacturer != null && this.$route.params.manufacturer != '') {
                    this.selectManufacturer = this.$route.params.manufacturer
                    this.manufacturerChange()
                }
            },
            initDeviceModel() {
                if (this.$route.params.deviceModel != null && this.$route.params.deviceModel != '') {
                    this.selectModel = this.$route.params.deviceModel
                    this.modelChange()
                }
            },
        },
        created() {},
        mounted() {
            this.classifysInit()
        },
        components: {
            equipCorrectChart
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

    .error {
        color: red;
    }

    .default-value {
        color: blue;
    }

    .app-correct/deep/.el-table__header tr,
    .app-correct/deep/.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }

</style>
