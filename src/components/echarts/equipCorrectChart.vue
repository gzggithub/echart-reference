<template>
    <div class="correctDiv">
        <Chart :id="'equipCorrectChart'" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "equipCorrectChart",
        data() {
            return {
                option: {},
                optionTmp: {
                    // backgroundColor: '#4472C4', //背景色
                    //默认色板
                    /* color: ['#0091F1','#00D98B', '#EB6F49', '#8256E8',  '#6495ed', '#ba55d3', '#cd5c5c'], */
                    title: {
                        x: 'center', //居中显示
                        text: '设备技术参数纠错情况'
                    },
                    grid: {
                        x: 70,
                        y: 70,
                        x2: 70,
                        y2: 70,
                        /* borderWidth: 1 */
                    },
                    tooltip: {
                        trigger: 'axis',
                        show: true,
                        formatter: '{b0}<br />非空记录: {c0}<br />空记录: {c1}<br />参考值记录数: {c2}<br />非参考值记录数: {c3}<br />参考值占比：{c4}%'
                    },
                    toolbox: {
                        show: false,
                    },
                    xAxis: [{
                        type: 'category',
                        data: [],
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '记录数',
                        min: 0,
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
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
                    }, {
                        type: 'value',
                        name: '参考值占比',
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
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    }],
                    series: [{
                        name: '非空记录数',
                        type: 'bar',
                        stack: 'nullValue',
                        barWidth: 40,
                        data: [],
                        label: {
                            normal: {
                                show: true,
                            }
                        }
                    }, {
                        name: '空记录数',
                        type: 'bar',
                        barWidth: 40,
                        stack: 'nullValue',
                        itemStyle: {
                            color: '#C6C6C6'
                        },
                        silent: true,
                        data: []
                    }, {
                        name: '参考值记录数',
                        type: 'bar',
                        stack: 'correctValue',
                        barWidth: 40,
                        data: [],
                        label: {
                            normal: {
                                show: true,
                            }
                        }
                    }, {
                        name: '非参考值记录数',
                        type: 'bar',
                        barWidth: 40,
                        stack: 'correctValue',
                        itemStyle: {
                            color: '#C6C6C6'
                        },
                        silent: true,
                        data: []
                    }, {
                        name: '参考值占比',
                        type: 'line',
                        yAxisIndex: 1,
                        lineStyle: {
                            width: 3
                        },
                        tooltip: {
                            formatter: '{c}%'
                        },
                        data: []
                    }]
                }
            }
        },
        components: {
            Chart
        },
        methods: {
            showBar(arr) {
                var xAxisData = new Array();
                var seriesNotNullValueData = new Array();
                var seriesNullValueData = new Array();
                var seriesCorrectData = new Array();
                var seriesErrorData = new Array();
                var seriesPerData = new Array();
                var classifyNameTotal = 0;
                arr.forEach((value, index) => {
                    if (value.classifyNameTotal > classifyNameTotal) {
                        classifyNameTotal = value.classifyNameTotal;
                    }
                    xAxisData.push(value.paramName)

                    seriesNotNullValueData.push(value.paramTotal)
                    seriesNullValueData.push(classifyNameTotal - value.paramTotal)

                    seriesCorrectData.push(value.paramValueNum)
                    seriesErrorData.push(classifyNameTotal - value.paramValueNum)

                    seriesPerData.push(value.purePer * 100)
                });
                this.optionTmp.xAxis[0].data = xAxisData;
                this.optionTmp.yAxis[0].max = classifyNameTotal;
                this.optionTmp.series[0].data = seriesNotNullValueData;
                this.optionTmp.series[1].data = seriesNullValueData;
                this.optionTmp.series[2].data = seriesCorrectData;
                this.optionTmp.series[3].data = seriesErrorData;
                this.optionTmp.series[4].data = seriesPerData;

                this.option = JSON.parse(JSON.stringify(this.optionTmp))
            },
        },
        created() {

        },
        mounted() {}

    }

</script>


<style scoped>
    .correctDiv {
        height: 100%;
        width: 100%
    }

</style>
