<template>
    <div class="app-situation">
        <div class="situation-left">
            <left-list @child-click="childClick" flag='main'></left-list>
        </div>
        <div class="situation-right ove-right-pad">
            <div class="ove-title">主网设备问题数据质量</div>
            <div v-if="showMain">
                <div class="major-chart">
                    <situationDataAmount class="chart-bar" ref="situationDataAmount" id="situationMainBar">
                    </situationDataAmount>
                    <situationPie class="chart-pie" ref="situationPie" orgName="主网" id="situationMainPie">
                    </situationPie>
                    <!--  <div id="mainBar" class="chart-bar"></div>
                    <div id="mainPie" class="chart-pie"></div> -->
                </div>
                <div class="ove-tab" v-if="tableMain.length!==0">
                    <table cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <td class="td-first"></td>
                                <td v-for="(item1, ind1) in tableMain" :key="`${ind1}ind1`">{{item1.logogram}}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="td-bg">问题数据总量</td>
                                <td v-for="(item2, ind2) in tableMain" :key="`${ind2}ind2`">
                                    <div v-if='item2.questionsNum==0'>{{item2.questionsNum}}</div>
                                    <div v-else class="td-color" @click="jumpTo(item2.id, 0)">{{item2.questionsNum}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td-bg">新增问题数据</td>
                                <td v-for="(item3, ind3) in tableMain" :key="`${ind3}ind3`">
                                    <div v-if='item3.newQuestions==0'>{{item3.newQuestions}}</div>
                                    <div v-else class="td-color" @click="jumpTo(item3.id, 1)">{{item3.newQuestions}}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td class="td-bg">遗留问题数据</td>
                                <td v-for="(item5, ind5) in tableMain" :key="`${ind5}ind5`">
                                    <div v-if='item5.levaeQuestionNum==0'>{{item5.levaeQuestionNum}}</div>
                                    <div v-else class="td-color" @click="jumpTo(item5.id, 3)">{{item5.levaeQuestionNum}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td-bg">整改问题数据</td>
                                <td v-for="(item4, ind4) in tableMain" :key="`${ind4}ind4`">{{item4.changQuestions}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="ove-no-data">无主网数据</div>

            <div class="ove-title">主网各运维单位设备问题数量排名</div>
            <el-row v-if="showTen">
                <el-col :span="12">
                    <!-- <div id="top10" :class="[showTen?'bar10':'bar0']"></div> -->
                    <situationRankBar ref="situationRankTop" title="问题数据多发前10名">
                    </situationRankBar>
                </el-col>
                <el-col :span="12">
                    <situationRankBar ref="situationRankLast" title="问题数据较少前10名">
                    </situationRankBar>
                    <!-- <div id="last10" :class="[showTen?'bar10':'bar0']"></div> -->
                </el-col>
            </el-row>
            <div v-else>
                <situationRankBar v-if="!showTen" ref="situationRankList" title="问题数据排名">
                </situationRankBar>
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
        queryMainDataQualityInfo,
        queryMainDataQualityByName,
        queryStandingListMain
    } from '../../request/api';
    import leftList from "../../components/leftList";
    import situationDataAmount from "@/components/echarts/situationDataAmount"
    import situationPie from "@/components/echarts/situationPie"
    import situationRankBar from "@/components/echarts/situationRankBar"

    export default {
        name: "situationMain",
        components: {
            leftList,
            situationDataAmount,
            situationPie,
            situationRankBar
        },
        data() {
            return {
                // name: '大理供电局',
                flag: 'main',
                ind: -1,
                showVice: false,
                showMain: true,
                tableMain: [],
                tableVice: [],
                xAxisMain: [], //柱状图X轴数据
                questionsMain: [], //问题总数
                levaeQuestionMain: [], //遗留问题数
                newMain: [], //新增问题
                changMain: [], //整改问题
                percentMain: [], //新增问题占比
                pieMain: [], //饼图数据

                professionLevel: '',

                topTenXData: [],
                topTenYData: [],
                lastTenXData: [],
                lastTenYData: [],
                listTenXData: [],
                listTenYData: [],
                showTen: true

            }
        },
        computed: {
            ...mapState('leftList', ['changeId']),
        },
        methods: {
            ...mapMutations('leftList', ['SET_CHANGE_ID']),
            ...mapMutations('List', ['SET_DEFAULT_ACTIVE']),

            /* 点击左侧树结构 */
            childClick(val, ind) {
                console.log(ind);
                this.ind = ind;
                this.falg = val.falg;
                this.professionLevel = val.professionLevel;
                if (val.id == '601') {
                    this.showTen = true
                } else {
                    this.showTen = false
                }
            },
            /* 跳转问题明细 */
            jumpTo(subDept, status) {
                this.$router.push({
                    name: 'detailedMain',
                    params: {
                        subDept: subDept,
                        status: status,
                        ind: this.ind,
                        professionLevel: this.professionLevel,
                    }
                });
                this.SET_DEFAULT_ACTIVE('M302')
            },


            getMainData() {
                queryMainDataQualityInfo({
                    id: this.changeId,
                }).then(res => {
                    console.log(res);
                    this.tableMain = res.result;
                    this.$refs.situationDataAmount.showBar(res.result)
                    this.$refs.situationPie.showPie(res.result)
                }).catch(error => {
                    console.log(error)
                })
            },

            getDataDaLi(name) {
                queryMainDataQualityByName({
                    id: this.changeId,
                    professionLevel: this.professionLevel
                }).then(res => {
                    this.tableMain = res.result;
                    this.$refs.situationDataAmount.showBar(res.result)
                    this.$refs.situationPie.showPie(res.result)

                }).catch(error => {
                    console.log(error)
                })
            },

            getTopTen() {
                //获取top10与last10图表
                queryStandingListMain({
                    id: this.changeId,
                }).then(res => {
                    if (res.result.list) {
                        this.$refs.situationRankList.showBar(res.result.list)
                    }

                    if (res.result.topTen) {
                        this.$refs.situationRankTop.showBar(res.result.topTen)
                    }
                    if (res.result.lastTen) {
                        this.$refs.situationRankLast.showBar(res.result.lastTen)
                    }

                })
            },
        },
        watch: {
            //监听vuex数据变化
            '$store.state.leftList.changeId': function (val) {
                //你需要执行的代码
                if (this.professionLevel) {
                    this.getDataDaLi();
                } else {
                    this.getMainData();
                }
                this.getTopTen();
            }
        },
        created() {

        },
        mounted() {
            this.SET_CHANGE_ID(this.changeId)
            if (this.changeId == '601') {
                this.getMainData();
                this.getTopTen();
            }
        },
        activated() {}

    }

</script>

<style lang="less" scoped>
    .app-situation {
        display: flex;

        .ove-title {
            padding: 8px 10px;
            font-size: 18px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
            //background: rgba(4, 55, 121, 1);
        }

        .situation-left {
            background: #215283;
        }

        .situation-right {
            width: 100%;
            overflow: hidden;

            .major-chart,
            .second-chart {
                font-size: 0;

                .chart-bar {
                    display: inline-block;
                    width: 60%;
                    height: 400px;
                }

                .chart-pie {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 40%;
                    height: 400px;
                    border-left: 5px solid #EBEEF5;
                }
            }

        }
    }

</style>
