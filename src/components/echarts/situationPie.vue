<template>
    <div class="situationPie">
        <Chart :id="id" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "situationPie",
        props: {
            orgName: {
                type: String,
                default () {
                    return "";
                }
            },
            id: {
                type: String,
                default () {
                    return "";
                }
            },
        },
        data() {
            return {
                option: {},
                optionTmp: {
                    title: {
                        text: '主网问题数据分布情况',
                        padding: 15,
                        x: 'center',
                        textStyle: { //主标题文本样式
                            color: "#0F387C",
                            fontSize: 18,
                            fontWeight: 400,
                        },
                    },
                    tooltip: {
                        show: false,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    /* legend: {
                        top: '80%',
                        left: 'center',
                        data: this.xAxisMain,
                        textStyle: {
                            fontSize: 14,
                        },
                    }, */
                    series: [{
                        name: '访问来源',
                        type: 'pie',
                        roseType : 'area',
                        //avoidLabelOverlap: false,
                        //minAngle: 30,
                        top:0,
                        bootom:0,
                        left:0,
                        right:0,
                        radius: ['5%', '60%'],
                        center: ['50%', '55%'],
                        label: {
                            normal: {
                                show: true,
                                formatter: "{b}\n{d}%({c})",
                                position: 'outside',
                                textStyle: {
                                    fontSize: '12',
                                    /*  fontWeight: 'bold' */
                                }
                            },
                            emphasis: {
                                show: true,
                                formatter: "{b}\n{d}%({c})",
                                textStyle: {
                                    fontSize: '16',
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true,
                            }
                        },
                        data: [],
                    }]
                }
            }
        },
        components: {
            Chart
        },
        methods: {

            showPie(arr) {

                let array6 = [];

                arr.map((item, ind) => {
                    let obj = {};
                    obj.value = item.questionsNum;
                    obj.name = item.logogram;
                    array6.push(obj)
                })

                this.optionTmp.series[0].data = array6;

                this.optionTmp.title.text = /* this.orgName + */ '各单位问题数占比'
                this.option = JSON.parse(JSON.stringify(this.optionTmp))

            },
            /* resize(){
                this.$refs.businessResInfoPie.resize()
            }, */
        },
        created() {

        },
        mounted() {

        }

    }

</script>


<style scoped>
    .businessResInfoDiv {
        height: 100%;
        width: 100%
    }

</style>
