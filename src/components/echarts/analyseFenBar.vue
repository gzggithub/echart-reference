<template>
    <div class="analyse-bar">
        <Chart :id="id" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "analyseFenBar",
        props: {
            id: {
                type: String,
                default () {
                    return "";
                }
            },
            title: {
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
                        text: '变电一次专业问题数据变化趋势',
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
                        formatter: '{b}<br/>\{a0}：{c0}<br/>\{a1}：{c1}',
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
                        top: 45,
                        textStyle: {
                            fontSize: 14,
                        },
                        data: ['遗留问题数', '新增问题数', '对数(问题数)']
                    },
                    xAxis: [{
                        type: 'category',
                        data: [],
                        //设置轴线的属性
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            rotate: 30,
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
                            name: '', 
                            /* min: 0,
                            max: 100,
                            //logBase:10,*/
                             axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: 'transparent',
                                    fontSize: 12
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'transparent'
                                }
                            },
                            axisTick: {
                                show: false,
                                lineStyle: {
                                    color: 'transparent',
                                } // y轴刻度的颜色
                            },
                            splitLine: {
                                show: false,
                            },
                        }
                    ],
                    series: [{
                            name: '遗留问题数',
                            type: 'bar',
                            barMaxWidth: 22,
                            stack: 'resNum',
                            z: 2,
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
                            name: '新增问题数',
                            type: 'bar',
                            stack: 'resNum',
                            z: 1,
                            data: [],
                            label: {
                                normal: {
                                    formatter: "{c}",
                                    show: true,
                                    position: 'top',
                                    fontSize: 12,
                                }
                            },
                        },
                        {
                            name: '对数(问题数)',
                            type: 'line',
                            symbolSize:0,   //拐点圆的大小
                            //yAxisIndex: 1,
                            smooth: 0.4,
                            //seriesLayoutBy: 'row',
                            yAxisIndex: 1,
                            data: [],
                            /* label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    fontSize: 12,
                                }
                            }, */
                        },

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
                    array4 = [];

                console.log(arr)
                arr.map((item, ind) => {
                    array1.push(`${item.strMonth}`);
                    array2.push(item.levaeQuestionNum); //遗留问题数
                    array3.push(item.newQuestionNum); //新增问题数
                    array4.push((item.logarithmicPercent)); //对数问题数
                })
                this.optionTmp.xAxis[0].data = array1; //柱状图X轴数据
                this.optionTmp.series[0].data = array2; //遗留问题
                this.optionTmp.series[1].data = array3; //新增问题
                this.optionTmp.series[2].data = array4; //整改问题
                this.optionTmp.title.text = this.title + '专业问题数据变化趋势'
                this.option = JSON.parse(JSON.stringify(this.optionTmp))
            },
        },
        created() {

        },
        mounted() {}

    }

</script>


<style scoped>
    .analyse-bar {
        height: 400px;
        width: 100%
    }

</style>
