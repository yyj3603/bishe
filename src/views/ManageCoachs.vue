<template>
    <div>
        <nav-header></nav-header>
        <nav>
            <div class="line"></div>
            <el-menu
                    :default-active="this.$route.path"
                    router
                    class="el-menu-demo"
                    mode="horizontal"

                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    style="display:flex;
align-items:center;
justify-content:center;"
            >
                <el-menu-item index="/adminView" class="is-active">处理中心</el-menu-item>
                <!--                <el-submenu index="2" >-->
                <!--                    <template slot="title" >我的工作台</template>-->
                <!--                    <el-menu-item index="2-1">选项1</el-menu-item>-->
                <!--                    <el-menu-item index="2-2">选项2</el-menu-item>-->
                <!--                    <el-menu-item index="2-3">选项3</el-menu-item>-->

                <!--                </el-submenu>-->
                <el-menu-item index="/manageCoachs" class="is-active" ><span target="_blank">教练管理</span></el-menu-item>
                <el-menu-item index="/manageGoods" class="is-active" ><span target="_blank">商品管理</span></el-menu-item>
                <el-menu-item index="/baoBiao" class="is-active" ><span target="_blank">报表</span></el-menu-item>
            </el-menu>
        </nav>
        <!-- 教练列表-->
<!--        <div class="accessory-list-wrap">-->
<!--            <div class="accessory-list col-4">-->
<!--                <ul>-->
<!--                    &lt;!&ndash;  遍历教练数据 &ndash;&gt;-->
<!--                    <li :key="index" v-for="(item,index) in coachsList">-->
<!--&lt;!&ndash;                        <div class="pic">&ndash;&gt;-->
<!--&lt;!&ndash;                            <a href="#">&ndash;&gt;-->
<!--&lt;!&ndash;                                &lt;!&ndash; v-lazy指令直接指向图片路径，在图片加载之前会使用main.js里loading设置的图片，当图片加载完后会将v-lazy里的图片属性赋到src里面去 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                                <img v-lazy="'/static/'+item.productImage" alt />&ndash;&gt;-->
<!--&lt;!&ndash;                            </a>&ndash;&gt;-->
<!--&lt;!&ndash;                        </div>&ndash;&gt;-->
<!--                        <div class="main">-->
<!--                            <div class="name">{{item.coachName}}</div>-->
<!--                            <div class="gender">{{item.coachGender}}</div>-->
<!--                            <div class="btn-area">-->
<!--                                <a href="javascript:;" class="btn btn&#45;&#45;m" >报名</a>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </li>-->
<!--                </ul>-->

<!--            </div>-->
<!--        </div>-->
        <el-table
                :data="this.coachsList"
                style="width: 100%; "
                class="coachsList"
        >
            <el-table-column label="教练ID">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.coachId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="教练名称">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.coachName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="教练性别">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.coachGender }}</span>
                </template>
            </el-table-column>
            <el-table-column label="教练身高">
                <template slot-scope="scope">
                    <!--                    <span style="margin-left: 10px" >{{ scope.row.createUserDate }}</span>-->
                    <span style="margin-left: 10px" >{{ scope.row.coachHeight }}</span>
                </template>
            </el-table-column>
            <el-table-column label="负责课程">
                <template slot-scope="scope">
                    <!--                    <span style="margin-left: 10px" >{{ scope.row.createUserDate }}</span>-->
                    <span :key="index" v-for="(item,index) in scope.row.coachProjects" style="margin-left: 10px" >{{ item}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header" slot-scope="">
                    <el-input
                            v-model="search"
                            size="mini"
                            placeholder="输入关键字搜索"/>
                </template>
                <!--                    编辑删除按钮-->
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="showEditDialog(scope.row.productId)" >Edit</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="delCoachConfirm(scope.row)"
                    >Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--        分页-->
        <!--        <div class="block">-->
        <!--            <span class="demonstration">页数较少时的效果</span>-->
        <!--            <el-pagination-->
        <!--                    layout="prev, pager, next"-->
        <!--                    :total="50">-->
        <!--            </el-pagination>-->
        <!--        </div>-->
        <modal v-bind:mdShow="modalConfirm" v-on:close="closeModal">
            <!--      插槽定义name值后组件的插槽引用sloat的值要一样才能对应-->
            <p slot="message">
                <svg class="navbar-cart-logo">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" />
                </svg>
                <span>确认要删除该教练的信息吗，删除后无法恢复</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="delCoach">确定删除</a>
                <a class="btn btn--m" href="javascript:;" @click="modalConfirm=false">取消</a>
            </div>
        </modal>
        <nav-footer></nav-footer>
        <!--        遮罩层-->
        <div class="md-overlay" v-show="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
    import NavHeader from "./../../src/components/NavHeader.vue"; /*头部组件 */
    import NavFooter from "./../../src/components/NavFooter.vue"; /*底部组件 */
    import Modal from "./../../src/components/Modal"
    import axios from "axios"
    export default {
        data(){
            return {
                coachsList:[],
                mdShow:false,
                /**控制模态框的显示和隐藏**/
                modalConfirm:false,
                search:'',
            }
        },
        components:{
            NavHeader,NavFooter,Modal
        },
        mounted: function () {
            this.getCoachsList();
        },
        methods:{
            getCoachsList(){
                axios.get("/coachs/list").then(response=>{
                    console.log(`coachsList的get请求进来了`)
                    let res = response.data;
                    console.log(`res.result.count为 :${res.result.count}`)/**返回0条数据**/
                    if(res.status == "0") {
                        this.coachsList = res.result.list;
                        console.log(`这里的数据是：${this.coachsList}`)
                    }else {
                        this.coachsList = [];
                        console.log(`error`)
                    }
                })
                console.log(`this.coachsList.coachAge数据为：${this.coachsList.coachAge}`)
            },
            closeModal(){
                this.modalConfirm = false;
                this.mdShow = false;
            },
            /**删除教练**/
            delCoachConfirm(row) {
                console.log(`该教练的Id为：${row.coachId}`);
                this.row = row;
                this.modalConfirm = true;
            },
            delCoach() {
                axios.post("/coachs/delCoach",{
                    row:this.row
                }).then(res=>{
                    console.log(`res.data:${res.data}`)
                })
                this.modalConfirm = false;
                this.getCoachsList();
            }
        }
    }
</script>

<style scoped>

</style>