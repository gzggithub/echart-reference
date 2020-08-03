<template>
    <div class="app-correct">
        <div class="ove-title">设备信息智能纠错明细--配网设备</div>
        <div class="dg-query-param">
            <el-row>
                <el-col :span="12">
                    设备类别：
                    <el-select
                        v-model="selectClassify"
                        filterable
                        removeable
                        placeholder="请选择设备类别！"
                        @change="classifyChange()">
                        <el-option
                            v-for="(item,index) in classifys"
                            :key="index"
                            :label="item.classifyName"
                            :value="item.classifyId">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="12">                    
                    设备型号：
                    <el-select
                        v-model="selectModel"
                        filterable
                        removeable
                        placeholder="请选择设备型号！"
                        @change="modelChange()">
                        <el-option
                            v-for="(item,index) in models"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-col>              
            </el-row>
        </div>
        <div class="dg-datalist"><i class="el-icon-s-grid"></i>&nbsp;&nbsp; 纠错情况</div>
        <div class="correctChart">
            <correctChart ref="correctChart"></correctChart>
        </div>        
        <div class="dg-datalist"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;数据列表(参考值)</div>
        <el-table :data="correctValues" style="width: 100%" border fit>
            <el-table-column label="设备型号" prop="device_model"  align="center">
                <el-table-column label="型号名称" prop="device_model.name">               
                </el-table-column>
                <el-table-column label="型号记录总数" prop="device_model.total">               
                </el-table-column>
            </el-table-column>
            <el-table-column label="设备类别" prop="classify_name"  align="center">
                <el-table-column label="参考值" prop="classify_name.value">
                    <template slot-scope="scope">
                        <span class="default-value">{{scope.row.classify_name.value}}</span>
                    </template>                    
                </el-table-column>
                <el-table-column label="参考值占比" prop="classify_name.per" :formatter="formateNum">               
                </el-table-column>
            </el-table-column>
            <el-table-column label="电压等级" prop="voltage_page_show"  align="center">
                <el-table-column label="参考值" prop="voltage_page_show.value"> 
                    <template slot-scope="scope">
                        <span class="default-value">{{scope.row.voltage_page_show.value}}</span>
                    </template>                                       
                </el-table-column>
                <el-table-column label="参考值占比" prop="voltage_page_show.per" :formatter="formateNum">               
                </el-table-column>               
            </el-table-column>
            <el-table-column label="生产厂家" prop="manufacturer"  align="center">
                <el-table-column label="参考值" prop="manufacturer.value">   
                    <template slot-scope="scope">
                        <span class="default-value">{{scope.row.manufacturer.value}}</span>
                    </template>                                   
                </el-table-column>
                <el-table-column label="参考值占比" prop="manufacturer.per" :formatter="formateNum">               
                </el-table-column>                 
            </el-table-column>  
            <el-table-column label="生产厂现用名"  prop="manufacturer_now">
                <el-table-column label="参考值" prop="manufacturer_now.value">
                    <template slot-scope="scope">
                        <span class="default-value">{{scope.row.manufacturer_now.value}}</span>
                    </template>                                     
                </el-table-column>
                <el-table-column label="参考值占比" prop="manufacturer_now.per" :formatter="formateNum">               
                </el-table-column>                 
            </el-table-column>        
        </el-table>
        <div class="dg-datalist"><i class="el-icon-s-grid"></i>&nbsp;&nbsp;数据列表(纠错明细)</div>
        <el-table :data="correctDetails" style="width: 100%" max-height="600" border fit stripe="true" :row-style="tableRowStyle">
            <el-table-column label="序号"  type="index" width="50" align="center">
            </el-table-column>    
            <el-table-column label="设备类别" prop="classifyName">
                <template slot-scope="scope">
                    <span class="error" v-if="errorClassifyName(scope.row.classifyName)">{{scope.row.classifyName}}</span>
                </template>    
            </el-table-column>
            <el-table-column label="电压等级" prop="voltagePageShow">
                <template slot-scope="scope">
                    <span class="error" v-if="errorVoltagePageShow(scope.row.voltagePageShow)">{{scope.row.voltagePageShow}}</span>
                </template> 
            </el-table-column>
            <el-table-column label="生产厂家" prop="manufacturer">
                <template slot-scope="scope">
                    <span class="error" v-if="errorManufacturer(scope.row.manufacturer)">{{scope.row.manufacturer}}</span>
                </template>                 
            </el-table-column>
            <el-table-column label="生产厂现用名"  prop="manufacturerNow">
                <template slot-scope="scope">
                    <span class="error" v-if="errorManufacturerNow(scope.row.manufacturerNow)">{{scope.row.manufacturerNow}}</span>
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
    import {getClassifyVice,getModelByClassifyVice,getDetailsVice,checkDevModelVice,checkDevModelByOne} from  "../../request/api.js"
    import correctChart from "@/components/echarts/correctChart"
    export default {
        name: "equipCorrectDetailMain",
        data() {
            return {
                classifys:[],
                selectClassify:'',
                models:[],
                selectModel:'',
                correctDetails:[],
                correctValues:[],
                total: 0, //数据总条数
                pageSize: 10,
                pageNum: 1,                
            }
        },
        methods: {
            tableRowStyle({row,rowIndex}){
                return 'background-color:#B2B2B2;font-size:12px;'
            },
            classifysInit(){
                getClassifyVice({
                }).then(res => {
                    this.classifys = res.result;
                }).catch(error => {
                    console.log(error)
                });
            },
            classifyChange(){
                getModelByClassifyVice({
                    'classifyId':this.selectClassify
                }).then(res => {
                    this.models = res.result;
                }).catch(error => {
                    console.log(error)
                });
            },
            modelChange(){
                this.correctValues = []
                this.correctDetails = []
                checkDevModelByOne({
                    'device_model':this.selectModel,
                    'num_device_model':10,
                    'type':'book_vice'
                }).then(res => {
                    if(res && res.length>0){
                        this.correctValues = res
                        this.$refs.correctChart.showBar(res)
                        this.queryErrors()
                    }else{
                        this.$message({
                            offset: 150,
                            message: '此型号记录数不足，无法判定参考值！',
                            type: 'warning'
                        });
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            queryErrors(){
                getDetailsVice({
                    'deviceModel':this.selectModel,
                    'classifyName':this.correctValues[0].classify_name.value,
                    'manufacturer':this.correctValues[0].manufacturer.value,
                    'manufacturerNow':this.correctValues[0].manufacturer_now.value,
                    'voltagePageShow':this.correctValues[0].voltage_page_show.value,
                    'pageNum':this.pageNum,
                    'pageSize':this.pageSize
                }).then(res => {
                    this.correctDetails = res.result.records
                    this.total = res.result.total
                }).catch(error => {
                    console.log(error)
                })
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
            formateNum(row, column, cellValue){
                let num = cellValue
                return Math.round(num*1000)/10 + '%'
            },
            errorClassifyName(classifyName){
                return classifyName != this.correctValues[0].classify_name.value
            },
            errorVoltagePageShow(voltagePageShow){
                return voltagePageShow != this.correctValues[0].voltage_page_show.value
            },
            errorManufacturer(manufacturer){
                return manufacturer != this.correctValues[0].manufacturer.value
            },
            errorManufacturerNow(manufacturerNow){
                return manufacturerNow != this.correctValues[0].manufacturer_now.value
            },
        },
        created() {
            this.classifysInit()
        },
        mounted() {
        },
        components: {
            correctChart
        }
    }
</script>
<style lang="less" scoped>
    .correctChart{
        height:300px;
    }
    .app-correct{
        width: 99%;
        padding: 2px;

        .ove-title {
            padding: 4px 10px;
            font-size: 18px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
            //background: rgba(4, 55, 121, 1);
        }
    }
    .vmiddle {
        padding: 12px 0px;
        text-align: right;
        vertical-align:middle; 
    }
    .vmiddle1 {
        padding: 5px 0px;
        text-align: left;
        vertical-align:middle; 
    }
    .dg-datalist {
        padding: 3px 10px;
        font-size: 16px;
        color: #363636;
        margin-top: 5px;
        text-align: left;
        background: #dedede;
    }
    .dg-table {
        min-height: 300px;
        width: 100%;
        background: #dedede;
    }
    .app-correct /deep/ .el-table__header tr,
    .app-correct /deep/ .el-table__header th {
        padding: 0;
        height: 40px;
        background: #043779;
        color: #ffffff;
    }
    .error{
        color:red;
    }
    .default-value{
        color:blue;
    }
</style>