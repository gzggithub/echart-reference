<template>
    <div class="app-situation">
        <div class="situation-left">
            <left-list @child-click="childClick"></left-list>
        </div>
        <div class="situation-right ove-right-pad">
            <div class="ove-title">主网设备问题数据质量</div>
            <div v-if="showMain">
                <div class="major-chart">
                    <situationDataAmount class="chart-bar" ref="situationDataAmount" id="situationMainBar">
                    </situationDataAmount>
                    <situationPie class="chart-pie" ref="situationPie" orgName="主网" id="situationMainPie">
                    </situationPie>
                    <!-- <div id="mainBar" class="chart-bar"></div>
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
            <div class="ove-title">配网设备问题数据质量</div>
            <div v-if="showVice">
                <div class="second-chart">
                    <situationDataAmount class="chart-bar" ref="situationDataAmountVice" id="situationViceBar">
                    </situationDataAmount>
                    <situationPie class="chart-pie" ref="situationPieVice" orgName="配网" id="situationVicePie">
                    </situationPie>
                    <!-- <div id="viceBar" class="chart-bar"></div>
                    <div id="vicePie" class="chart-pie"></div> -->
                </div>
                <div class="ove-tab" v-if="tableVice.length!==0">
                    <table cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <td class="td-first"></td>
                                <td v-for="(item1, ind1) in tableVice" :key="`${ind1}ind1`">{{item1.logogram}}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="td-bg">问题数据总量</td>
                                <td v-for="(item2, ind2) in tableVice" :key="`${ind2}ind2`">
                                    <div v-if='item2.questionsNum==0'>{{item2.questionsNum}}</div>
                                    <div v-else class="td-color" @click="jumpTo(item2.id, 0)">{{item2.questionsNum}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td-bg">新增问题数据</td>
                                <td v-for="(item3, ind3) in tableVice" :key="`${ind3}ind3`">
                                    <div v-if='item3.newQuestions==0'>{{item3.newQuestions}}</div>
                                    <div v-else class="td-color" @click="jumpTo(item3.id, 1)">{{item3.newQuestions}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td-bg">遗留问题数据</td>
                                <td v-for="(item5, ind5) in tableVice" :key="`${ind5}ind5`">
                                    <div v-if='item5.levaeQuestionNum==0'>{{item5.levaeQuestionNum}}</div>
                                    <div v-else class="td-color" @click="jumpTo(item5.id, 3)">{{item5.levaeQuestionNum}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td-bg">整改问题数据</td>
                                <td v-for="(item4, ind4) in tableVice" :key="`${ind4}ind4`">{{item4.changQuestions}}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="ove-no-data">无配网数据</div>

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
        queryViceDataQualityInfo,
        queryMainDataQualityByName
    } from '../../request/api';
    import leftList from "../../components/leftList";
    import situationDataAmount from "@/components/echarts/situationDataAmount"
    import situationPie from "@/components/echarts/situationPie"
    export default {
        name: "situationOverall",
        components: {
            leftList,
            situationDataAmount,
            situationPie,
        },
        data() {
            return {
                name: '大理供电局',
                flag: 'main',
                ind: -1,
                showVice: true,
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

                xAxisVice: [], //柱状图X轴数据
                questionsVice: [], //问题总数
                levaeQuestionVice: [], //遗留问题数
                newVice: [], //新增问题
                changVice: [], //整改问题
                percentVice: [], //新增问题占比
                pieVice: [], //饼图数据
                id: '601',
                professionLevel: '',

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
                this.ind = ind;
                this.id = val.id;
                this.professionLevel = val.professionLevel;
                this.flag = val.flag;
                if (!val.professionLevel) {
                    this.showMain = true;
                    this.showVice = true;
                    /* this.getMainData();
                    this.getViceData(); */
                } else if (val.professionLevel == '1' || val.professionLevel === '2') {
                    this.name = val.name;
                    this.showMain = true;
                    this.showVice = false;
                    /* this.getDataDaLi(val.name); */
                } else {
                    this.name = val.name;
                    this.showMain = false;
                    this.showVice = true;
                    /*  this.getDataDaLi(val.name); */
                }

            },
            /* 跳转问题明细 */
            jumpTo(subDept, status) {
                this.$router.push({
                    name: 'detailedOverall',
                    params: {
                        subDept: subDept,
                        status: status,
                        ind: this.ind,
                        professionLevel: this.professionLevel,
                    }
                });
                this.SET_DEFAULT_ACTIVE('M301')
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
            getViceData() {
                queryViceDataQualityInfo({
                    id: this.changeId,
                }).then(res => {
                    this.tableVice = res.result;
                    this.$refs.situationDataAmountVice.showBar(res.result)
                    this.$refs.situationPieVice.showPie(res.result)

                }).catch(error => {
                    // console.log(error)
                })
            },
            getDataDaLi(name) {
                queryMainDataQualityByName({
                    id: this.changeId,
                    professionLevel: this.professionLevel
                }).then(res => {
                    if (this.professionLevel == '1' || this.professionLevel == '2') {
                        this.tableMain = res.result;
                        this.$refs.situationDataAmount.showBar(res.result)
                        this.$refs.situationPie.showPie(res.result)
                    } else {
                        this.tableVice = res.result;
                        this.$refs.situationDataAmountVice.showBar(res.result)
                        this.$refs.situationPieVice.showPie(res.result)
                    }


                }).catch(error => {
                    console.log(error)
                    if (name == '输电管理所' || name == '变电运行所') {
                        this.showMain = false;
                    } else {
                        this.showVice = false;
                    }
                })
            }
        },
        watch: {
            //监听vuex数据变化
            '$store.state.leftList.changeId': function (val) {
                //你需要执行的代码
                if (this.professionLevel) {
                    this.getDataDaLi();
                } else {
                    this.getMainData();
                    this.getViceData();
                }

            }
        },
        created() {

        },
        mounted() {
            this.SET_CHANGE_ID(this.changeId);
            if (this.changeId == '601') {
                this.getMainData();
                this.getViceData();
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
                    box-sizing: border-box;
                    width: 60%;
                    height: 400px;
                    //border-right: 5px solid #f8f9f8;
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
