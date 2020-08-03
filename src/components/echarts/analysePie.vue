<template>
    <div class="analysePie">
        <Chart :id="id" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "analysePie",
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
                        text: '各专业问题数据占比',
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
                        //avoidLabelOverlap: false,
                        radius: '45%',
                        center: ['50%', '50%'],
                        minAngle:30,//最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
                        label: {
                            normal: {
                                show: true,
                                formatter: "{b}\n{d}%({c})",
                                position: 'outside',
                                textStyle: {
                                    fontSize: '14',
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
                /* 各专业数据问题占比 */
                if (arr.professionalQuestionData) {
                    arr.professionalQuestionData.map((item, ind) => {
                        let obj = {};
                        obj.value = item.questionNum;
                        obj.name = item.name;
                        array6.push(obj)
                    })
                }
                this.optionTmp.series[0].data = array6;
               // this.optionTmp.title.text = this.orgName + '问题数据分布情况'
                this.option = JSON.parse(JSON.stringify(this.optionTmp))
            },
        },
        created() {

        },
        mounted() {

        }

    }

</script>


<style scoped>
    .analysePie {
        height: 100%;
        width: 100%
    }

</style>
