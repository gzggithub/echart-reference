<template>
    <div class="left-list">
        <div class="title">组织机构 </div>
        <div class="div-daLi" :class="-1 === listInd ? 'on' : ''" @click="listClick({
                    id:601,
                    name:'大理供电局'
                },-1)">大理供电局</div>

        <ul class="ul-department">
            <li v-for="(item, ind) in listData" :class="ind === listInd ? 'on' : ''" :key="`${ind}cf`"
                @click="listClick(item, ind)">{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import {
        getMenus
    } from '../request/api';
    export default {
        name: "leftList",
        data() {
            return {
                listData: [],
                listInd: -1,
            }
        },
        props: {
            flag: {
                type: String,
                default: ''
            },
            ind: {
                type: Number,
                default: -1
            }
        },
        computed: {
            ...mapState('leftList', ['changeId']),
        },
        methods: {
            ...mapMutations('leftList', ['SET_CHANGE_ID']),
            getListData() {
                getMenus({
                    flag: this.flag
                }).then(res => {
                    /*  if (this.flag === 'vice') {
                         this.listData = res.result;
                         this.SET_CHANGE_ID(res.result[0].id)
                         //console.log('menus12')
                     } else {
                         this.listData = res.result.children;
                         this.SET_CHANGE_ID(res.result.id)
                         //console.log('menus224')
                     } */
                    this.listData = res.result.children;
                    this.SET_CHANGE_ID(res.result.id)

                }).catch(error => {
                    console.log(error)
                })
            },
            listClick(val, ind) {
                this.listInd = ind;
                this.SET_CHANGE_ID(val.id)
                this.$emit('child-click', val, ind);
            }
        },

        created() {
            /* if (this.flag === 'vice') {
                this.listInd = 0;
                if (this.ind > 0) {
                    this.listInd = this.ind;
                }
            } else {
                this.listInd = this.ind
            } */
            this.listInd = this.ind
            //console.log('left  create')
            this.getListData();

        },
        mounted() {

        },
    }

</script>

<style lang="less" scoped>
    .left-list {
        width: 260px;
        /* background-color: #215283; */
        /* padding: 15px; */

        .title {
            padding: 8px 10px;
            font-size: 18px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
            background: rgba(4, 55, 121, 1);
        }

        .div-daLi {
            font-size: 16px;
            color: #ffffff;
            padding: 4px 0 4px 15px;
            cursor: pointer;
        }

        .div-daLi.on {
            color: #215283;
            background: #ffffff;
        }

        .div-daLi:hover {
            color: #215283;
            background: #ffffff;
        }

        .ul-department li {
            font-size: 16px;
            color: #ffffff;
            padding: 4px 0 4px 40px;
            cursor: pointer;
        }

        .ul-department li.on {
            color: rgba(4, 55, 121, 1);
            background: #ffffff;
        }

        .ul-department li:hover {
            color: rgba(4, 55, 121, 1);
            background: #ffffff;
        }
    }

</style>
