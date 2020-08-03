<template>
    <div class="correctDiv">
        <Chart :id="'equipCorrectBarManufacturer'" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "equipCorrectBarManufacturer",
        data() {
            return {
                option: {},
                optionTmp: {
                    /* backgroundColor: '#fff', //背景色
                    //默认色板
                    color: ['#0091F1','#00D98B', '#EB6F49', '#8256E8',  '#6495ed', '#ba55d3', '#cd5c5c'], */
                    title: {
                        x: 'center', //居中显示
                        text: '设备生产厂家分布情况'
                    },
                    grid: {
                        x: 70,
                        y: 70,
                        x2: 70,
                        y2: 150,
                        /* borderWidth: 1 */
                    },
                    tooltip: {
                        trigger: 'axis',
                        show: true,
                    },
                    toolbox: {
                        show: false,
                    },
                    xAxis: [{
                        type: 'category',
                        name: '生产厂家',
                        axisLabel: {
                            interval: 0,
                            rotate: '-45'
                        },
                        data: [],
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '记录数',
                        min: 0,
                        splitLine: {
                            show: true,
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
                    }],
                    series: [{
                        name: '记录数',
                        type: 'bar',
                        barWidth: 15,
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        }
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
                var seriesTotaleData = new Array();
                arr.forEach((value, index) => {
                    xAxisData.push(value.manufacturer)
                    seriesTotaleData.push(value.total)
                });
                this.optionTmp.xAxis[0].data = xAxisData;
                this.optionTmp.series[0].data = seriesTotaleData;

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
