<template>
    <div class="app-analyse">
        <div class="analyse-left">
            <left-list @child-click="childClick"></left-list>
        </div>
        <div class="analyse-right ove-right-pad">
            <div class="ove-title">业务专业分析</div>
            <div class="one-chart">
                <analysePie class="include-chart border-right border-bottom" ref="analyseOverPie"></analysePie>
                <analyseFenBar v-if="showOneBar" ref="oneBar" title="输电" class="include-chart border-bottom">
                </analyseFenBar>
                <analyseFenBar v-if="showTwoLeft" ref="twoBarLeft" title="变电一次"
                    class="include-chart border-right border-bottom"></analyseFenBar>
                <analyseFenBar v-if="showTwoRight" ref="twoBarRight" title="配电" class="include-chart border-bottom">
                </analyseFenBar>
                <!-- <div v-if="showOnePie" id="onePie" class="include-chart border-right border-bottom"></div> -->
                <!-- <div v-if="showOneBar" id="oneBar" class="include-chart border-bottom"></div>
                <div v-if="showTwoLeft" id="twoBarLeft" class="include-chart border-right"></div>
                <div v-if="showTwoRight" id="twoBarRight" class="include-chart"></div> -->
            </div>

            <div class="ove-tab">
                <table cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <td class="td-first"></td>
                            <td v-for="(item1, ind1) in tableData" :key="`${ind1}ind1`">{{item1.name}}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="td-bg">问题数据量</td>
                            <td v-for="(item2, ind2) in tableData" :key="`${ind2}ind2`" >
                                <div v-if='item2.questionNum==0'>{{item2.questionNum}}</div>
                                <div v-else class="td-color" @click="jumpTo(item2)">{{item2.questionNum}}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="td-bg">问题数据占比</td>
                            <td v-for="(item3, ind3) in tableData" :key="`${ind3}ind3`">
                                {{parseFloat(item3.percent)==100||parseFloat(item3.percent)==0?parseFloat(item3.percent):parseFloat(item3.percent).toFixed(2)}}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="ove-title">问题数据帕累托分析</div>
            <!-- <div v-if="!showThreeLeft&!showThreeLeft" class="ove-no-data">暂无数据</div> -->
            <div class="three-chart">
                <el-row>
                    <el-col v-if="showOneBar" :span="12" class="border-right border-bottom">
                        <analyseLeiBar ref="threeBarShu" title="输电专业（按设备类别）" class="include-chart-dept"></analyseLeiBar>
                    </el-col>
                    <el-col v-if="showTwoLeft" :span="12" class="border-right border-bottom">
                        <analyseLeiBar ref="threeBarBian" title="变电一次专业（按设备类别）" class="include-chart-dept">
                        </analyseLeiBar>
                    </el-col>
                    <el-col v-if="showTwoRight" :span="12" class="border-right border-bottom">
                        <analyseLeiBar ref="threeBarPei" title="配电专业（按设备类别）" class="include-chart-dept"></analyseLeiBar>
                    </el-col>
                    <el-col :span="12" class="border-right border-bottom">
                        <analyseLeiBar ref="threeBarRight" title="跨专业（按设备电压等级）" class="include-chart-dept">
                        </analyseLeiBar>
                    </el-col>
                </el-row>
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
        queryProfessionalQuestionQualityAnalysisInfo,
        queryDeviceParetoChart,
        queryGradeParetoChart
    } from '../../request/api';
    import leftList from "../../components/leftList";
    import analysePie from "@/components/echarts/analysePie"
    import analyseFenBar from "@/components/echarts/analyseFenBar"
    import analyseLeiBar from "@/components/echarts/analyseLeiBar"
    export default {
        name: "analyseOverall",
        components: {
            leftList,
            analysePie,
            analyseFenBar,
            analyseLeiBar
        },
        data() {
            return {
                name: '大理供电局',
                flag: 'main',
                ind: -1,
                tableData: [],
                showOnePie: true,
                showOneBar: true,
                showTwoLeft: true,
                showTwoRight: true,
                showThreeLeft: true,
                showThreeRight: true,

                /* 各专业数据问题占比--数据 */
                onePieLegend: [], //饼图legend数据
                onePieSeries: [], //饼图series数据
                /* 输电专业问题数据变化趋势--数据 */
                oneRightXAxis: [],
                oneRightNum: [],
                oneRightPercent: [],
                oneRightLog: [],
                /* 变电一次专业问题数据变化趋势--数据 */
                twoLeftXAxis: [],
                twoLeftNum: [],
                twoLeftPercent: [],
                twoLeftLog: [],
                /* 配电专业问题数据变化趋势--数据 */
                twoRightXAxis: [],
                twoRightNum: [],
                twoRightPercent: [],
                twoRightLog: [],
                /* 问题数据设备类别帕累托图--输电数据 */
                threeLeftXAxisShu: [],
                threeLeftNumShu: [],
                threeLeftPercentShu: [],
                /* 问题数据设备类别帕累托图--变电数据 */
                threeLeftXAxisBian: [],
                threeLeftNumBian: [],
                threeLeftPercentBian: [],
                /* 问题数据设备类别帕累托图--配电数据 */
                threeLeftXAxisPei: [],
                threeLeftNumPei: [],
                threeLeftPercentPei: [],
                /* 问题数据电压等级帕累托图--数据 */
                threeRightXAxis: [],
                threeRightNum: [],
                threeRightPercent: [],

                professionLevel: '',
            }
        },
        computed: {
            ...mapState('leftList', ['changeId']),
        },
        methods: {
            ...mapMutations('List', ['SET_DEFAULT_ACTIVE']),
            ...mapMutations('leftList', ['SET_CHANGE_ID']),
            childClick(val, ind) {
                this.name = val.name;
                //this.falg = val.falg;
                this.professionLevel = val.professionLevel;
                this.ind = ind;
                if (val.professionLevel == undefined) {
                    this.showOnePie = true;
                    this.showOneBar = true;
                    this.showTwoLeft = true;
                    this.showTwoRight = true;
                    console.log('1111')

                } else if (val.professionLevel == 1) {
                    this.showOnePie = true;
                    this.showOneBar = true;
                    this.showTwoLeft = false;
                    this.showTwoRight = false;
                    console.log('22222')

                } else if (val.professionLevel == 2) {
                    this.showOnePie = true;
                    this.showOneBar = false;
                    this.showTwoLeft = true;
                    this.showTwoRight = false;
                    console.log('33333')

                } else {
                    this.showOnePie = true;
                    this.showOneBar = false;
                    this.showTwoLeft = false;
                    this.showTwoRight = true;
                    console.log('4444')

                }
                this.getOneData();
                this.getThreeLeft();
                this.getThreeRight();
            },
            //左侧组织，所属专业
            jumpTo(item) {
                if (item.status) {
                    this.$router.push({
                        name: 'detailedOverall',
                        params: {
                            /* name1: this.name,
                            name2: '', */
                            // orgId:item.orgId,
                            professionLevel: this.professionLevel,
                            ind: this.ind,
                            professionalInt: item.professionalInt
                        }
                    });
                    this.SET_DEFAULT_ACTIVE('M301');
                } else {
                    this.$message.error('暂时无法跳转')
                }

            },
            /* 获取 业务专业分析 数据 */
            getOneData() {
                queryProfessionalQuestionQualityAnalysisInfo({
                    id: this.changeId
                }).then(res => {
                    this.tableData = res.result.professionalQuestionData;
                    this.$refs.analyseOverPie.showPie(res.result)

                    if (this.showOneBar) {
                        this.$refs.oneBar.showBar(res.result.transportProfessionalInfos)
                    }

                    if (this.showTwoLeft) {
                        this.$refs.twoBarLeft.showBar(res.result.substatioProfessionalInfos)
                    }

                    if (this.showTwoRight) {
                        this.$refs.twoBarRight.showBar(res.result.distributionProfessionalInfos)
                    }

                }).catch(error => {
                    console.log(error)
                })
            },

            /* 获取 问题数据设备类别帕累托图 数据 */
            getThreeLeft() {
                queryDeviceParetoChart({
                    id: this.changeId
                }).then(res => {
                    if (this.showOneBar) {
                        this.$refs.threeBarShu.showBar(res.result.transmissions)
                    }

                    if (this.showTwoLeft) {
                        this.$refs.threeBarBian.showBar(res.result.substations)
                    }

                    if (this.showTwoRight) {
                        this.$refs.threeBarPei.showBar(res.result.switchings)
                    }

                }).catch(error => {
                    console.log(error)
                    console.log(222)
                    this.showThreeLeft = false;
                })
            },
            /* 获取 问题数据电压等级帕累托图 数据 */
            getThreeRight() {
                queryGradeParetoChart({
                    id: this.changeId
                }).then(res => {
                    //this.tableVice = res.result;
                    this.$refs.threeBarRight.showBar(res.result, true)
                }).catch(error => {
                    console.log(error)
                    this.showThreeRight = false;
                })
            },
        },
        watch: {
            //监听vuex数据变化
            '$store.state.leftList.changeId': function (val) {
                //你需要执行的代码
                this.getOneData();
                this.getThreeLeft();
                this.getThreeRight();

            }
        },
        created() {

        },
        mounted() {
            this.SET_CHANGE_ID(this.changeId);
            /* this.getOneData();
            this.getThreeLeft();
            this.getThreeRight(); */
            if (this.changeId == '601') {
                this.getOneData();
                this.getThreeLeft();
                this.getThreeRight();
            }

        },
        activated() {}

    }

</script>

<style lang="less" scoped>
    .app-analyse {
        display: flex;

        .ove-title {
            padding: 8px 10px;
            font-size: 18px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
            // background: rgba(4, 55, 121, 1);
        }

        .analyse-left {
            background: #215283;
        }

        .analyse-right {
            width: 100%;
            overflow: hidden;

            .one-chart {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;

                .include-chart {
                    width: 50%;
                    height: 400px;
                    box-sizing: border-box;
                }

                .include-chart.on {
                    width: 0;
                    height: 0;
                }

                /* .chart-right {
                    border-left: 5px solid #ffffff;
                } */
            }

            .three-chart {
                .include-chart-dept {
                    height: 400px;
                }
            }

            .four-chart {
                .include-chart-level {
                    height: 400px;
                }
            }

            .border-right {
                border-right: 5px solid #EBEEF5;
            }

            .border-bottom {
                border-bottom: 5px solid #EBEEF5;
            }

        }
    }

</style>
