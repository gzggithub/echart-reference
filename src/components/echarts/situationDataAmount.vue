<template>
    <div class="situation">
        <Chart :id="id" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "situationDataAmount",
        props: {
            
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
                        text: '各单位问题数据量',
                        padding: 15,
                        x: 'center',
                        textStyle: { //主标题文本样式
                            color: "#0F387C",
                            fontSize: 18,
                            fontWeight: 400,
                        },
                    },
                    grid: {
                        left: 60, // 与容器左侧的距离
                        right: 60, // 与容器右侧的距离
                        top: 100, // 与容器顶部的距离
                        bottom: 50, // 与容器底部的距离
                    },

                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}<br/>\{a0}：{c0}<br/>\{a1}：{c1}<br/>\{a2}：{c2}<br/>\{a3}：{c3}%<br/>',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            },
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        //icon: "rect",
                        /* itemWidth: 20,
                        itemHeight: 8, //居右显示
                        itemGap: 25, // 设置间距 */
                        textStyle: { //图例文字的样式
                            fontSize: 14,
                        },
                        top: 45,
                        data: ['新增问题数据', '遗留问题数据', '整改问题数据', '新增问题占比']
                    },
                    xAxis: [{
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            rotate: 25,
                            interval: 0,
                            fontSize: 12
                        },
                        //x轴字体颜色
                        axisLine: {
                            lineStyle: {
                                color: '#5A5A5A'
                            }
                        },

                    }],
                    yAxis: [{
                            type: 'value',
                            name: '问题数',
                            /*  min: 0,
                             max:  100, */
                            /* interval: 1200, */
                            /* splitNumber: 3, */
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#155DA5',
                                    fontSize: 12
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#155DA5'
                                }
                            },
                            axisTick: {
                                show: false,
                                lineStyle: {
                                    color: '#155DA5',
                                } // y轴刻度的颜色
                            },
                            splitLine: {
                                show: false,
                            },
                        },
                        {
                            type: 'value',
                            name: '占比',
                            min: 0,
                            max: 100,
                            /* min: 0,
                            max: 25,
                            interval: 5, */
                            axisLabel: {
                                formatter: '{value}%',
                                textStyle: {
                                    color: '#0091F1',
                                    fontSize: 12
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#0091F1'
                                }
                            },
                            axisTick: {
                                show: false,
                                lineStyle: {
                                    color: '#0091F1',
                                } // y轴刻度的颜色
                            },
                            splitLine: {
                                show: false,
                            },
                        }
                    ],
                    series: [
                        
                        {
                            name: '遗留问题数据',
                            type: 'bar',
                            barMaxWidth:28,
                            stack: 'resNum',
                            z:2,
                            data: [],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    fontSize: 12,
                                }
                            },
                        },
                        {
                            name: '新增问题数据',
                            type: 'bar',
                            barMaxWidth:28,
                            z:1,
                            stack: 'resNum',
                            data: [],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    fontSize: 12,
                                }
                            },
                        },
                        {
                            name: '整改问题数据',
                            type: 'bar',
                            barMaxWidth:28,
                            //stack: 'resNum',
                            z:3,
                            data: [],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    fontSize: 12,
                                }
                            },
                        },
                        {
                            name: '新增问题占比',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [],
                        }
                    ]
                }

            }
        },
        components: {
            Chart
        },
        methods: {
            showBar(arr) {
                let array1 = [],
                    array2 = [],
                    array3 = [],
                    array4 = [],
                    array5 = [];

                arr.map((item, ind) => {
                    array1.push(item.logogram); //柱状图X轴数据
                    array2.push(item.levaeQuestionNum); //遗留问题
                    array3.push(item.newQuestions); //新增问题
                    array4.push(item.changQuestions); // 整改问题
                    array5.push(item.percent); //新增问题占比
                    /* let obj = {};
                    obj.value = item.questionsNum;
                    obj.name = item.name; */
                })
                console.log('ffffffffffff')
                console.log(array1)
                this.optionTmp.xAxis[0].data = array1; //柱状图X轴数据
                this.optionTmp.series[0].data = array2; //遗留问题
                this.optionTmp.series[1].data = array3; //新增问题
                this.optionTmp.series[2].data = array4; //整改问题 
                this.optionTmp.series[3].data = array5; //新增问题占比
                this.option = JSON.parse(JSON.stringify(this.optionTmp))
            },
        },
        created() {

        },
        mounted() {}

    }

</script>


<style scoped>
    .situation {
        height: 400px;
        width: 100%
    }

</style>
