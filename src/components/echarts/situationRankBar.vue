<template>
    <div class="situation">
        <Chart :id="id" :title="title" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "situationRankBar",
        props: {
            title: {
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
                        text: '',
                        padding: 15,
                        x: 'center',
                        textStyle: { //主标题文本样式
                            color: "#0F387C",
                            fontSize: 18,
                            fontWeight: 400,
                        },
                    },
                    grid: {
                        left: 100, // 与容器左侧的距离
                        right: 60, // 与容器右侧的距离
                        top: 75, // 与容器顶部的距离
                        bottom: 80, // 与容器底部的距离
                    },

                    tooltip: {
                        trigger: 'axis',
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
                    /* legend: {
                        top: 45,
                        textStyle: {
                            color: "#ffffff",
                            fontSize: 14,
                        },
                        data: ['遗留问题数据', '新增问题数据', '整改问题数据', '新增问题占比']
                    }, */
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
                        /* min: 0,
                        max: 250, */
                        /* interval: 50, */
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
                            lineStyle: {
                                color: '#155DA5',
                            } // y轴刻度的颜色
                        },
                        splitLine: {
                            show: false,
                        },
                    }, ],
                    series: [{
                        name: '遗留问题数据',
                        type: 'bar',
                        barMaxWidth:22,
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                fontSize: 12,
                            }
                        },
                    }, ]
                }

            }
        },
        components: {
            Chart
        },
        methods: {
            showBar(arr) {
                let listTenXData = [],
                    listTenYData = [];

                arr.map((item, ind) => {
                    listTenXData.push(item.name);
                    listTenYData.push(item.num);
                })
                this.optionTmp.title.text = this.title
                this.optionTmp.xAxis[0].data = listTenXData;
                this.optionTmp.series[0].data = listTenYData;
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
