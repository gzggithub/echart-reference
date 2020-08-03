<template>
    <div class="analyse-bar">
        <Chart :id="id" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "analyseLeiBar",
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
                        text: '',
                        padding: 15,
                        //x: 'center',
                        left: 'center', //主副标题的水平位置
                        itemGap: 340,//主副标题间距
                        //subtext: '与容器左侧的距离',
                        textStyle: { //主标题文本样式
                            color: "#0F387C",
                            fontSize: 18,
                            fontWeight: 400,
                        },
                        subtextStyle: {
                            color: "#888",
                            fontSize: 12,
                            fontWeight: 400,
                        }
                    },
                    grid: {
                        left: 60, // 与容器左侧的距离
                        right: 60, // 与容器右侧的距离
                        top: 100, // 与容器顶部的距离
                        bottom: 60, // 与容器底部的距离
                    },

                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}<br/>\{a0}：{c0}<br/>\{a1}：{c1}%',
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
                        data: ['问题数', '累积占比']
                    },
                    xAxis: [{
                        type: 'category',
                        data: [],
                        //设置轴线的属性
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
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#63C3A1',
                                    fontSize: 12
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#63C3A1'
                                }
                            },
                            axisTick: {
                                lineStyle: {
                                    color: '#63C3A1',
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
                            axisLabel: {
                                formatter: '{value}%',
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
                                lineStyle: {
                                    color: '#155DA5',
                                } // y轴刻度的颜色
                            },
                            splitLine: {
                                show: false,
                            },
                        }
                    ],
                    series: [{
                            name: '问题数',
                            type: 'bar',
                            barMaxWidth: 22,
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
                            name: '累积占比',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [],
                            label: {
                                normal: {
                                    show: false,
                                    formatter: "{c}%",
                                    position: 'top',
                                    fontSize: 12,
                                }
                            },
                        },

                    ]
                }

            }
        },
        components: {
            Chart
        },
        methods: {
            showBar(arr, notes) {
                let array1 = [],
                    array2 = [],
                    array3 = [];

                arr.map((item, ind) => {
                    array1.push(item.name); //电压等级名称
                    array2.push(item.num); //数量
                    array3.push(item.percent); //帕累托图
                })
                this.optionTmp.xAxis[0].data = array1; //柱状图X轴数据
                this.optionTmp.series[0].data = array2; //遗留问题
                this.optionTmp.series[1].data = array3; //新增问题
                this.optionTmp.title.text = `${this.title}`
                if(notes) {
                    this.optionTmp.title.subtext = '其他:不区分电压等级、其他交流电压、其他直流电压、电压值为空等情况'
                }
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
        height: 100%;
        width: 100%
    }

</style>
