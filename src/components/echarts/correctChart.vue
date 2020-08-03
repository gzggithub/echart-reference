<template>
    <div class="correctDiv">
        <Chart :id="'correctDetailBar'" :option="option"></Chart>
    </div>
</template>


<script>
    import Chart from "./chart"

    export default {
        name: "correctDetailBar",
        data() {
            return {
                option:{},
                optionTmp: {
                   // backgroundColor: '#4472C4', //背景色
                    //默认色板
                    color: ['#EB6F49','#00D98B', '#0091F1', '#8256E8',  '#6495ed', '#ba55d3', '#cd5c5c'],
                    title: {
                        x: 'center', //居中显示
                        text: '设备属性信息疑似错误情况'
                    },
                    legend: {
                        show:true,
                        orient: 'vertical',
                        x: '85%',
                        y: 'center',   
                        data:['与参考值不同占比','与参考值相同占比'],
                        icon:"circle",
                        itemWidth:8,
                        itemHeight:8,
                    },
                    grid:{
                            x:70,
                            y:70,
                            x2:400,
                            y2:70,
                            borderWidth:1
                        },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: false,
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['设备类别','电压等级','生产厂家','生产厂现用名'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            rotate: 0 //旋转的角度
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '',
                        splitLine:{
                            show:true,
                            lineStyle:{
                                type:'dashed'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }],
                    series: [
                        {
                            name: '与参考值不同占比',
                            type: 'bar',
                            stack: 'correctValue',
                            barWidth: 40,
                            barMinHeight:15,
                            data: [],
                            label:{
                                normal:{
                                    show:true,
                                    formatter: '{c}%'
                                }
                            }
                        },{
                            name: '与参考值相同占比',
                            type: 'bar',
                            stack: 'correctValue',
                            barWidth: 40,
                            barMinHeight:15,
                            data: [],
                            label:{
                                normal:{
                                    show:true,
                                    formatter: '{c}%'
                                }
                            }                            
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
                var seriesCorrectData = new Array();
                var seriesErrorData = new Array();
                arr.forEach((value, index) => {
                    seriesCorrectData.push(this.getCorrectPer(value.classify_name.per));
                    seriesErrorData.push(this.getErrorPer(value.classify_name.per));
                    seriesCorrectData.push(this.getCorrectPer(value.voltage_page_show.per));
                    seriesErrorData.push(this.getErrorPer(value.voltage_page_show.per));
                    seriesCorrectData.push(this.getCorrectPer(value.manufacturer.per));
                    seriesErrorData.push(this.getErrorPer(value.manufacturer.per));
                    seriesCorrectData.push(this.getCorrectPer(value.manufacturer_now.per));
                    seriesErrorData.push(this.getErrorPer(value.manufacturer_now.per));
                });

                this.optionTmp.series[0].data = seriesErrorData;
                this.optionTmp.series[1].data = seriesCorrectData;

                this.option = JSON.parse(JSON.stringify(this.optionTmp))
            },
            getCorrectPer(num){
                return Math.round(num*1000)/10
            },
            getErrorPer(num){
                return Math.round((1-num)*1000)/10
            },
        },
        created() {

        },
        mounted() {
        }

    }
</script>


<style scoped>

.correctDiv{
    height:100%;
    width:100%
}
</style>
