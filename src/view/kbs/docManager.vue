<template>
    <div class="app-object">
        <div class="ove-title">知识库文档管理</div>
        <div class="ove-search">
            <div class="ove-search-in">
                <span>文档名称：</span>
                <el-input size="small" placeholder="请输入内容" v-model="docName" clearable>
                </el-input>
            </div>
            <div class="ove-search-in">
                <span>解析状态：</span>
                <el-select v-model="parseFlag" placeholder="请选择" clearable size="small">
                    <el-option v-for="item in parseFlags" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ove-search-in">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="queryAction">查询
                </el-button>
            </div>
        </div>
        <div class="ove-title">
            <i class="el-icon-s-grid"></i>&nbsp;&nbsp;
            数据列表
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="sucess" size="small" @click="upload = true">
                上传文档
                <i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
        <div v-loading="Loading" element-loading-background="rgba(0, 0, 0, 0.5)" element-loading-text="文档解析中">
            <el-dialog title="文档导入" :visible.sync="upload" width="30%">
                <div class="importDialog-content">
                    <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :auto-upload="false" drag
                        accept='.docx' multiple :http-request="uploaDocs" :limit="10">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过10M</div>
                    </el-upload>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="upload = false">取 消</el-button>
                    <el-button type="primary" @click="submitUpload">确定上传</el-button>
                </span>
            </el-dialog>
            <el-table :data="docs" border fit>
                <el-table-column prop="docDesc" label="文档名称" min-width="200">
                </el-table-column>
                <el-table-column label="文档上传时间" width="180" prop="uploadTime">
                </el-table-column>
                <el-table-column label="文档解析状态" prop="parseFlag" :formatter="parseState">
                </el-table-column>
                <el-table-column label="文档解析时间" width="180" prop="parseTime">
                </el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteTheDoc(scope.row.id)"
                            v-if="ifDel(scope.row.parseFlag)">删除</el-button>
                        <el-button type="primary" icon="el-icon-connection" size="mini"
                            @click="parseTheDoc(scope.row.docDesc,scope.row.id)" v-if="ifParse(scope.row.parseFlag)">解析
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="ove-pagination">
            <el-pagination background layout="total, sizes, prev, pager, next" :total="total"
                :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :current-page="pageNum"
                @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {
        getdocs,
        deleteDoc,
        uploadDoc,
        uploadDocs,
        parseDoc,
        uploadDocUrl,
        parseFinish
    } from "../../request/api.js"

    export default {
        name: "docManager",
        data() {
            return {
                uploadUrl: uploadDocUrl,
                uploadFiles: [],
                upload: false,
                Loading: false,
                docs: [],
                docName: '',
                parseFlag: '',
                parseFlags: [{
                    label: '未解析',
                    value: '-1'
                }, {
                    label: '解析中',
                    value: '0'
                }, {
                    label: '已解析',
                    value: '1'
                }, {
                    label: '解析失败',
                    value: '2'
                }],
                total: 0, //数据总条数
                pageSize: 10,
                pageNum: 1,
            }
        },
        methods: {
            // 确认上传
            submitUpload() {
                this.$refs.upload.submit();
            },
            //文件上传
            uploaDocs(params) {
                const _file = params.file;
                const isLt2M = _file.size / 1024 / 1024 < 10;

                // 通过 FormData 对象上传文件
                var formData = new FormData();
                formData.append("file", _file);

                if (!isLt2M) {
                    this.$message.error("请上传10M以下的.docx文件");
                    return false;
                }
                uploadDoc(
                    formData
                ).then(res => {
                    this.$message(_file.name + '上传成功！')
                }).catch(error => {
                    console.log(error)
                    this.$message(error)
                });

            },
            queryAction() {
                getdocs({
                    'docName': this.docName,
                    'parseFlag': this.parseFlag,
                    'pageSize': this.pageSize,
                    'pageNum': this.pageNum
                }).then(res => {
                    this.docs = res.result.records;
                    this.total = res.result.total;
                }).catch(error => {
                    console.log(error)
                });
            },
            handleSizeChange(val) { //每页多少条数据
                this.pageSize = val;
                //重置当前页为1
                this.handleCurrentChange(1);
            },
            handleCurrentChange(val) { //当前第几页
                this.pageNum = val;
                this.queryAction();
            },
            deleteTheDoc(docId) {
                deleteDoc({
                    'docId': docId
                }).then(res => {
                    this.queryAction()
                }).catch(error => {
                    console.log(error)

                });
            },
            parseTheDoc(docName, docId) {
                this.Loading = true
                parseDoc({
                    'url': '/home/upload/' + docName
                }).then(res => {
                    parseFinish({
                        'docId': docId
                    }).then(res => {
                        this.queryAction()
                    }).catch(error => {
                        console.log(error)

                    });
                    this.Loading = false

                }).catch(error => {
                    console.log(error)
                    this.Loading = false
                });
            },
            ifDel(parseFlag) {
                if (parseFlag) {
                    if (parseFlag == '2') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            },
            ifParse(parseFlag) {
                if (parseFlag) {
                    if (parseFlag == '2') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            },
            parseState(row, col, cell) {
                if (cell) {
                    if (cell == '0') {
                        return '解析中'
                    } else if (cell == '1') {
                        return '已解析'
                    } else if (cell == '2') {
                        return '解析失败'
                    }
                } else {
                    return '未解析'
                }
            }
        },
        created() {
            this.queryAction()
        },
        mounted() {},
        activated() {

        }
    }

</script>
<style lang="less" scoped>
    .app-object {
        padding: 0 6px;

    }
    .app-object/deep/.el-table__header tr,
    .app-object/deep/.el-table__header th {
        padding: 0;
        height: 40px;
        background: #e0e0e0;
        color: rgba(90, 90, 90, 1);
    }
   
</style>
