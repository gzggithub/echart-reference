<template>
    <div class="app-object">
        <div class="ove-title">知识库实体关系查询</div>
        <el-container style="max-height: 1000px; border: 1px solid #eee">
            <el-aside width="300px">
                <div class="query-term"><i class="el-icon-search">
                    </i>&nbsp;&nbsp;查询条件
                    <el-popover placement="right-start" width="400" trigger="hover">
                        <el-table :data="queryTop20" max-height="700" height="600" border width="390">
                            <el-table-column label="常查节点" min-width="200">
                                <template slot-scope="scope">
                                    <el-link type="primary"
                                        @click="top20Click(scope.row.objectName,scope.row.objectLabel)">
                                        {{scope.row.objectName}}</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="节点类型" prop="objectLabel">
                            </el-table-column>
                            <el-table-column label="查询次数" prop="queryNum">
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference" type="text">常查节点Top20</el-button>
                    </el-popover>
                </div>
                <!-- <div> -->

                <!-- </div> -->
                <div class="entity-key">
                    <div class="query-term">实体关键词：</div>
                    <el-select v-model="selectNode" size="small" filterable clearable remote placeholder="请输入关键词"
                        :remote-method="queryNodes" :loading="loading" @change="objectNameChange()">
                        <el-option v-for="(item,index) in selectNodes" :key="getObjectShow(item)"
                            :label="getObjectShow(item)" :value="index">
                        </el-option>
                    </el-select>
                </div>
                <el-row>
                    <div class="query-term">匹配实体节点：</div>
                    <div class="retTree">
                        <el-tree :data="nodeTree" :indent="0" default-expand-all @node-click="treeNodeClick"
                            height="600">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>
                                    <i :class="getNodeIcon(data)"></i>{{ node.label }}
                                </span>
                            </span>
                        </el-tree>
                    </div>
                </el-row>
            </el-aside>
            <el-main>
                <el-row>
                    <div class="dg-datalist"><i class="el-icon-share"></i>&nbsp;&nbsp;实体关系&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button-group>
                            <el-button icon="el-icon-zoom-in" @click="zoomOut">放大</el-button>
                            <el-button icon="el-icon-zoom-out" @click="zoomIn">缩小</el-button>
                            <el-button icon="el-icon-rank" @click="showAll">适合</el-button>
                            <el-button icon="el-icon-rank" @click="reduction">原始</el-button>
                        </el-button-group>&nbsp;&nbsp;&nbsp;&nbsp;最大级别：
                        <el-input-number v-model="maxLevel" controls-position="right" @change="maxLevelChange" :min="1"
                            :max="8"></el-input-number>
                        &nbsp;&nbsp;&nbsp;&nbsp;当前实体：{{objectName?objectName:'未选择'}}
                    </div>
                    <el-col :span="20">
                        <div class="canDiv" v-loading="canvasLoading" element-loading-background="rgba(0, 0, 0, 0.5)"
                            element-loading-text="实体关系查询中！">
                            <canvas width="1000" height="550" id="canvas"></canvas>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <el-card class="box-card">
                            <div slot="header" class="card-title">
                                图例
                            </div>
                            <div v-for="(nodeType,typeIndex) in nodeTypes" :key="nodeType" class="card-text">
                                <span :style="getNodeTypeStyle(typeIndex)"
                                    @click="nodeTypeStateChange(nodeType,typeIndex)">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;{{nodeType}}&nbsp;&nbsp;&nbsp;&nbsp;
                                <!--  <el-tag :ref="'tag'+typeIndex" :color="getColorNodeType(typeIndex)" size="mini" @click="nodeTypeStateChange(nodeType,typeIndex)">&nbsp;&nbsp;&nbsp;</el-tag>{{nodeType}} -->
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import {
        queryObjectTypes,
        queryLikeObjects,
        queryObjectRelations,
        queryObjectQueryNumTop20,
        queryObjectOne
    } from '../../request/api'
    export default {
        name: "objectQuery",
        data() {
            return {
                objectName: '',
                objectLabel: '',
                selectNodes: [],
                selectNode: '',
                loading: false,
                nodeTypes: [
                    '文档名称', '一级业务域', '二级业务域', '引用业务标准', '引用技术标准', '引用管理规定', '业务对象', '业务事项',
                    '业务表单', '作业标准', '技术标准', '管理规定', '数据项', '业务流程', '流程节点', '生产'
                ],
                nodeTypeState: [],
                stage: {},
                scene: {},
                typeColor: [
                    /* '#ef5b9c','#deab8a','#817936','#7d5886','#77ac98','#33a3dc','#63434f','#f0dc70','#77787b','#dbce8f','#225a1f','#8552a1','#45b97c',
                    '#6699CC','#663366','#CCCC99','#990033','#CCFF66','#FF9900','#666699','#660033','#99CC99','#FFFF66',
                    '#660099','#009933','#CC9900','#993366','#CC3366','#99CCFF','#FFFF66','#0099CC','#FFCCCC','#CCCCFF' */
                    '#d71345', '#ef5b9c', '#f47920', '#8B3A62', '#48D1CC', '#77787b', '#ffd400', '#45b97c',
                    '#817936', '#45b97c', '#8552a1', '#008B8B', '#33a3dc', '#426ab3', '#225a1f',
                    '#6699CC', '#663366', '#CCCC99', '#990033', '#CCFF66', '#FF9900', '#666699', '#660033',
                    '#99CC99', '#FFFF66',
                ],
                nodeMap: new Map(),
                maxLevel: 5,
                range: 1000,
                minLength: 300,
                queryTop20: [],
                canvasLoading: false,
                nodeTreeMap: new Map(),
                treeNodes: [],
                nodeTree: [],
            }
        },
        methods: {
            treeNodeClick(data) {
                if (data.isObject) {
                    this.objectName = data.label
                    this.objectLabel = data.type
                    this.queryNodeRelationsByObjectName()
                }
            },
            getNodeIcon(data) {
                return data.icon;
            },
            nodeTreeInit() {
                this.treeNodes = []
                this.nodeTypes.forEach(
                    (type, index) => {
                        this.treeNodes[index] = {
                            'label': this.nodeTypes[index],
                            'icon': 'el-icon-folder',
                            'children': []
                        }
                    }
                )
                this.nodeTypes.forEach(
                    (type, index) => {
                        this.nodeTreeMap.set(this.nodeTypes[index], index)
                    }
                )
            },
            relationsInit() {
                this.treeNodes[6].children.push(this.treeNodes[12])
                this.treeNodes[8].children.push(this.treeNodes[12])
                this.treeNodes[14].children.push(this.treeNodes[6])
                this.treeNodes[14].children.push(this.treeNodes[8])
                this.treeNodes[13].children.push(this.treeNodes[14])
                this.treeNodes[5].children.push(this.treeNodes[11])
                this.treeNodes[7].children.push(this.treeNodes[5])
                this.treeNodes[7].children.push(this.treeNodes[13])
                this.treeNodes[4].children.push(this.treeNodes[10])
                this.treeNodes[3].children.push(this.treeNodes[9])
                this.treeNodes[2].children.push(this.treeNodes[3])
                this.treeNodes[2].children.push(this.treeNodes[4])
                this.treeNodes[2].children.push(this.treeNodes[5])
                this.treeNodes[2].children.push(this.treeNodes[6])
                this.treeNodes[2].children.push(this.treeNodes[7])
                this.treeNodes[2].children.push(this.treeNodes[8])
                this.treeNodes[1].children.push(this.treeNodes[2])
                this.treeNodes[0].children.push(this.treeNodes[1])
            },
            queryNodes(query) {
                if (query !== '') {
                    this.loading = true
                    queryLikeObjects({
                        input_text: query
                    }).then(res => {
                        this.selectNodes = res
                        this.loading = false
                        this.nodeTreeInit()

                        if (res) {
                            res.forEach(
                                (item) => {
                                    var typeIndex = this.nodeTreeMap.get(item.label)
                                    if (typeIndex) {
                                        this.treeNodes[typeIndex].children.push({
                                            'label': item.name,
                                            children: null,
                                            'icon': '',
                                            isObject: true,
                                            'type': item.label
                                        })
                                    }
                                }
                            )
                            this.relationsInit()
                            this.nodeTree = [this.treeNodes[0]]

                            /*                             if(this.$route.params.itemName){
                                                            if(this.selectNodes.length>0){
                                                                this.selectNode = '0'
                                                                this.objectNameChange() 
                                                            }
                                                        } */
                        }
                    }).catch(error => {
                        console.log(error)
                    });
                } else {
                    this.selectNodes = []
                    this.selectNode = ''
                }
            },
            queryNodeTypes() {
                this.nodeTypeState = new Array()
                this.nodeTypes.forEach(
                    (item, index) => {
                        this.nodeTypeState.push(true)
                    }
                )
            },
            getObjectShow(item) {
                return item.name + '(' + item.label + ')'
            },
            getObjectValue(item) {
                return {
                    name: item.name,
                    label: item.label
                }
            },
            getNodeTypeStyle(typeIndex) {
                return 'background-color:' + this.getColorNodeType(typeIndex)
            },
            nodeTypeStateChange(nodeType, typeIndex) {
                if (this.nodeTypeState[typeIndex]) {
                    this.nodeTypeState[typeIndex] = false
                } else {
                    this.nodeTypeState[typeIndex] = true
                }
                this.canvasLoading = true
                this.canvasLoading = false
                var theNodes = this.scene.findElements(
                    (node) => {
                        return node.type == nodeType
                    }
                )
                theNodes.forEach(
                    (node) => {
                        node.visible = this.nodeTypeState[typeIndex]
                        node.inLinks.forEach(
                            (link) => {
                                if (this.nodeTypeState[typeIndex]) {
                                    let nodeA = link.nodeA
                                    let indexA = this.nodeTreeMap.get(nodeA.type)
                                    link.visible = this.nodeTypeState[indexA]
                                } else {
                                    link.visible = false
                                }
                            }
                        )
                        node.outLinks.forEach(
                            (link) => {
                                if (this.nodeTypeState[typeIndex]) {
                                    let nodeZ = link.nodeZ
                                    let indexZ = this.nodeTreeMap.get(nodeZ.type)
                                    link.visible = this.nodeTypeState[indexZ]
                                } else {
                                    link.visible = false
                                }
                            }
                        )
                    }
                )
            },
            top20Click(objectName, objectLabel) {
                this.objectName = objectName
                this.objectLabel = objectLabel
                this.queryNodeRelationsByObjectName()
            },
            maxLevelChange() {
                this.queryNodeRelationsByObjectName()
            },
            hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                return result ? (parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3],
                    16)) : ''
            },
            getColorNodeType(typeIndex) {
                if (this.nodeTypeState[typeIndex]) {
                    if (typeIndex >= 25) {
                        typeIndex -= 25
                    }
                    return this.typeColor[typeIndex]
                } else {
                    return "#C0CCDA"
                }
            },
            getColorByNodeType(type) {
                let typeIndex = this.nodeTypes.findIndex(nodeType => nodeType == type)
                return this.hexToRgb(this.getColorNodeType(typeIndex))
            },
            queryObjectTop20() {
                queryObjectQueryNumTop20({}).then(res => {
                    this.queryTop20 = res.result.records
                }).catch(error => {
                    console.log(error)
                })
            },
            queryNodeRelationsByObjectName() {
                if (this.objectName != '') {
                    this.canvasLoading = true
                    this.scene.clear()
                    queryObjectRelations({
                        input_text: this.objectName,
                        input_label: this.objectLabel,
                        index_start: '1',
                        index_end: "" + this.maxLevel + ""
                    }).then(res => {
                        if (res) {
                            let nodeArr = res[0]
                            let linkArr = res[1]
                            this.nodeMap = new Map()

                            if (nodeArr.length > 100) {
                                this.minLength = 800
                                this.range = 4000
                            } else if (nodeArr.length > 50) {
                                this.minLength = 600
                                this.range = 3000
                            } else if (nodeArr.length > 25) {
                                this.minLength = 400
                                this.range = 2000
                            } else {
                                this.minLength = 200
                                this.range = 1000
                            }
                            nodeArr.forEach((node, index, array) => {
                                var x = this.randomCoor();
                                var y = this.randomCoor();
                                var theNode = this.createNode(x, y, node.name, node.label)
                                var key = node.label + "_" + node.name
                                this.nodeMap.set(key, theNode)
                            })

                            // 定义效果
                            var effect = JTopo.Effect.spring({
                                minLength: this.minLength // 节点之间最短距离
                            });
                            linkArr.forEach((link, index, array) => {
                                if (link.source && link.target) {
                                    if (link.source.label != link.target.label || link.source.name !=
                                        link.target.name) {
                                        var nodeA = this.findTheNodeByName(this.nodeMap, link.source)
                                        var nodeZ = this.findTheNodeByName(this.nodeMap, link.target)
                                        var text = link.value
                                        var theLink = this.createLink(nodeA, nodeZ, text)
                                        effect.addNode(nodeA, nodeZ)
                                        effect.addNode(nodeZ, nodeA)
                                    }
                                }
                            })
                            // 播放
                            effect.play()

                            setTimeout(() => {
                                this.showAll()
                            }, 1000)
                        }
                        this.canvasLoading = false
                    }).catch(error => {
                        console.log(error)
                    })

                    queryObjectOne({
                        objectName: this.objectName,
                        objectLabel: this.objectLabel,
                    }).then(res => {
                        this.queryObjectTop20()
                    }).catch(error => {
                        this.queryObjectTop20()
                    })
                }
            },
            objectNameChange() {
                this.objectName = this.selectNodes[this.selectNode].name
                this.objectLabel = this.selectNodes[this.selectNode].label
                this.queryNodeRelationsByObjectName()
            },
            findTheNodeByName(nodeMap, node) {
                let key = node.label + "_" + node.name
                return nodeMap.get(key)
            },
            createLink(nodeA, nodeZ, text) {
                var link = new JTopo.Link(nodeA, nodeZ);
                link.arrowsRadius = 7; //箭头大小
                link.bundleGap = 30; // 线条之间的间隔
                link.lineWidth = 1;
                link.textOffsetY = 0; // 文本偏移量（向下3个像素）
                link.text = text
                link.fontColor = "102,102,102";
                link.alpha = 1
                link.strokeColor = '165,171,182';
                this.scene.add(link);
                return link;
            },
            // 生成随机坐标
            randomCoor() {
                return Math.random() * this.range;
            },
            sub4(fullText) {
                let len = fullText.length
                if (len < 5)
                    return fullText
                else
                    return fullText.substring(0, 4) + '..'
            },
            nodeShowHigh(node, inOrOut) {
                if (inOrOut === 'in') {
                    let inLinks = node.inLinks
                    if (inLinks) {
                        inLinks.forEach(
                            (inlink) => {
                                inlink.alpha = 1
                                let nodeA = inlink.nodeA
                                nodeA.alpha = 1
                                this.nodeShowHigh(nodeA, 'in')
                            }
                        )
                    }
                } else {
                    let outLinks = node.outLinks
                    if (outLinks) {
                        outLinks.forEach(
                            (outlink) => {
                                outlink.alpha = 1
                                let nodeZ = outlink.nodeZ
                                nodeZ.alpha = 1
                                this.nodeShowHigh(nodeZ, 'out')
                            }
                        )
                    }
                }
            },
            createNode(x, y, text, type) {
                var node = new JTopo.CircleNode();
                node.radius = 20;
                node.type = type
                node.shadow = false;
                //node.textOffsetX = 5;
                // node.tip = text
                node.fontColor = '55,55,55'
                node.fullText = text
                node.textPosition = "Middle_Center"
                node.text = this.sub4(text)
                node.setSize(40, 40);
                node.alpha = 0.8
                node.setLocation(x, y);
                node.fillColor = this.getColorByNodeType(type);
                var _this = this

                var _scene = this.scene
                node.mouseover(function (event) {
                    if (event.target == null)
                        return;
                    this.text = this.fullText + '(' + this.type + ')'
                    this.textPosition = "Top_Center"
                    this.fontColor = '0,0,0'
                    var thenode = event.target
                    var ele = _scene.childs;
                    ele.forEach(
                        (item) => {
                            item.alpha = 0.1
                        }
                    )
                    node.alpha = 1
                    _this.nodeShowHigh(node, 'in')
                    _this.nodeShowHigh(node, 'out')
                });

                node.mouseout(function (event) {
                    this.text = _this.sub4(text)
                    this.textPosition = "Middle_Center"
                    this.fontColor = '55,55,55'
                    var ele = _scene.childs;
                    ele.forEach(
                        (item) => {
                            item.alpha = 0.8
                        }
                    )
                });
                node.dbclick(
                    function (event) {
                        if (event.target == null) return
                        let node = event.target
                        _this.objectName = node.fullText
                        _this.objectLabel = node.type
                        _this.queryNodeRelationsByObjectName()
                    }
                )
                this.scene.add(node);

                if (text == this.objectName && type == this.objectLabel) {
                    JTopo.Animate.stepByStep(node, {
                        scaleX: 2.5,
                        scaleY: 2.5,
                        alpha: 1
                    }, 2000, true).start();
                }
                return node;
            },

            canvas_init() {
                var canvas = document.getElementById('canvas');
                this.stage = new JTopo.Stage(canvas)
                this.stage.wheelZoom = 0.85
                this.scene = new JTopo.Scene(this.stage)
                this.scene.alpha = 1;
                //this.scene.background = '/static/bg.jpg'
                var _scene = this.scene
                var _stage = this.stage
                var _this = this
                this.stage.addEventListener("mousewheel", function (event) {
                    var v = event.wheelDelta;
                    if (v > 0 && _scene.scaleX < 3) {
                        _stage.zoomOut();
                    } else if (v < 0 && _scene.scaleX > 0.3) {
                        _stage.zoomIn();
                    }
                    _this.setfontsize();
                });

            },
            resizeCanvas() {
                $("#canvas").attr("width", ($(window).width() - 300) * 0.8 - 2);
                $("#canvas").attr("height", $(window).height() - 220);
            },
            setfontsize() {
                var fontstr = this.getCurrFontsize(this.scene);

                var ele = this.scene.childs;
                for (var i = 0; i < ele.length; i++) {
                    ele[i].font = fontstr;
                }
            },
            // 缩小
            zoomIn() {
                if (this.scene.scaleX > 0.3) {
                    this.stage.zoomIn();
                    this.setfontsize();
                }
            },
            // 放大
            zoomOut() {
                if (this.scene.scaleX < 3) {
                    this.stage.zoomOut();
                    this.setfontsize();
                }
            },
            showAll() {
                this.stage.centerAndZoom()
            },
            // 鸟瞰
            bridpic() {
                if (this.stage.eagleEye.visible)
                    this.stage.eagleEye.visible = false; // 鸟瞰图
                else
                    this.stage.eagleEye.visible = true;
            },
            // 还原
            reduction() {
                this.scene.zoom(1, 1);
                this.setfontsize();
            },
            getCurrFontsize(allscene) {
                var fontstr;
                if (allscene.scaleX < 0.5) {
                    fontstr = "26px Consolas";
                } else if (allscene.scaleX < 0.7) {
                    fontstr = "22px Consolas";
                } else if (allscene.scaleX < 0.9) {
                    fontstr = "18px Consolas";
                } else if (allscene.scaleX < 1.1) {
                    fontstr = "14px Consolas";
                } else if (allscene.scaleX < 1.4) {
                    fontstr = "12px Consolas";
                } else if (allscene.scaleX < 1.7) {
                    fontstr = "10px Consolas";
                } else if (allscene.scaleX < 2.0) {
                    fontstr = "8px Consolas";
                } else if (allscene.scaleX < 2.5) {
                    fontstr = "7px Consolas";
                } else {
                    fontstr = "6px Consolas";
                }
                return fontstr;
            }
        },
        created() {
            this.queryNodeTypes()
            this.queryObjectTop20()
            this.nodeTreeInit()
            this.relationsInit()
            this.nodeTree = [this.treeNodes[0]]
        },
        mounted() {
            this.canvas_init()
            window.addEventListener("resize", this.resizeCanvas());
            if (this.$route.params.objectName) {
                //this.queryNodes(this.$route.params.itemName)
                this.objectName = this.$route.params.objectName
                this.objectLabel = this.$route.params.objectLabel
                this.queryNodeRelationsByObjectName()
            }
        }
    }

</script>

<style lang="less" scoped>
    .app-object {
        padding: 2px;
    }

    .query-term {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        color: #363636;
    }

    .entity-key {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 6px auto;
    }

    .box-card {
        margin-left: 20px;

        .card-title {
            font-size: 16px;
        }

        .card-text {
            font-size: 14px;
            padding: 4px 0;
        }
    }

    /* .item {
        padding: 2px;
    } */

    .canDiv {
        border: 2px solid;
        border-radius: 2px;
        font-size: 24;
    }
    .box-card /deep/ .el-card__header {
        padding: 8px 12px;
    }
    .app-object /deep/ .el-tree {
        height: 700px;
    }

    .app-object /deep/ .el-tree-node {
        position: relative;
        padding-left: 10px;
    }

    .app-object /deep/ .el-tree-node__children {
        padding-left: 10px;
    }

    .app-object /deep/ .el-tree-node :last-child:before {
        height: 28px;
    }

    .app-object /deep/ .el-tree>.el-tree-node:before {
        border-left: none;
    }

    .app-object /deep/ .el-tree>.el-tree-node:after {
        border-top: none;
    }

    .app-object /deep/ .el-tree-node:before {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .app-object /deep/ .el-tree-node:after {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .app-object /deep/ .el-tree-node:before {
        border-left: 1px dashed #4386c6;
        bottom: 0px;
        height: 100%;
        top: -26px;
        width: 1px;
    }

    .app-object /deep/ .el-tree-node:after {
        border-top: 1px dashed #4386c6;
        height: 20px;
        top: 12px;
        width: 24px;
    }

    .app-object /deep/ .el-tree-node:focus>.el-tree-node__content {
        background-color: #ccc !important;
    }

    .app-object /deep/ .el-tree-node__content {
        font-size: 14px;
    }

    .dg-datalist {
        padding-bottom: 5px;
        font-size: 16px;
        text-align: left;
    }

</style>
