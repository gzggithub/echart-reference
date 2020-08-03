<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App'
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        overflow-x: hidden;
    }

    * {
        padding: 0;
        margin: 0;
    }

    div,
    dl,
    dt,
    dd,
    form,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    img,
    ol,
    ul,
    li,
    table,
    th,
    td,
    p,
    span,
    a {
        border: 0;
    }

    img,
    input {
        border: none;
        vertical-align: middle;
    }

    body {
        font-family: Tahoma, Arial, Helvetica, "宋体";
        font-size: 12px;
        text-align: center;
        background: #FFF;
        color: #000;
    }

    html {
        overflow-y: scroll;
    }

    ul,
    ol {
        list-style-type: none;
    }

    input {
        outline: none;
        border: none;
        box-shadow: none;
    }

    button {
        border: none;
        cursor: pointer;
        background-color: transparent;
    }

    select {
        border-width: 1px;
        _zoom: 1;
        border-style: solid;
        padding-top: 2px;
    }

    a:link,
    a:visited {
        text-decoration: none;
        color: #333;
    }

    a:hover,
    a:active {
        text-decoration: none;
        color: #f60;
    }

    a,
    span {
        display: inline-block
    }

    /* 解决element-ui的table表格控件表头与内容列不对齐问题 */
    .el-table th.gutter {
        display: table-cell !important;
    }

    .ove-paging {
        margin: 16px auto;
        text-align: center;
    }

    .ove-no-data {
        height: 60px;
        line-height: 60px;
        font-size: 22px;
        color: #777;
        text-align: center;
    }

    .ove-right-pad {
        padding: 0 6px 6px;
    }

    /* 全局标题 */
    .ove-title {
        padding: 4px 10px;
        font-size: 18px;
        text-align: left;
        color: #FFF;
    }

    .ove-pagination {
        text-align: center;
        padding: 6px 0;
    }

    /* 全局搜索框样式  开始 */
    .ove-search {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 16px;
        color: rgba(77, 77, 77, 1);
        padding: 10px 10px;
        background: rgba(255, 255, 255, 1);
    }

    .ove-search-in {
        display: flex;
        align-items: center;
        margin-right: 36px;
    }

    .ove-search-in span {
        word-break: keep-all;
    }

    /* 全局搜索框样式  结束 */

    /* 全局自定义表格 开始 */
    .ove-tab {
        overflow-x: auto;
    }

    .ove-tab table {
        width: 100%;
        border-right: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
        margin: 5px 0;
        text-align: center;
        color: #606266;
        background: #ffffff;


    }

    .ove-tab table thead {
        font-weight: 600;
        color: #5a5a5a;
    }

    .ove-tab table td {
        border-left: 1px solid #EBEEF5;
        border-top: 1px solid #EBEEF5;
        padding: 6px;
        font-size: 16px;
        letter-spacing: 2px;
        word-break: keep-all;
    }
    .ove-tab table td.td-first {
        width: 125px;
    }

    .ove-tab table td .td-color {
        color: #3a78e6;
        text-decoration: underline;
        cursor: pointer;
    }

    /* 全局自定义表格 结束 */

</style>
