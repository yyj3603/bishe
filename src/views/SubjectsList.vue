<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span slot="bread">Subjects</span>
        </nav-bread>

        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" @click="sortGoods">
                        Price
                        <svg class="icon icon-arrow-short" v-bind:class = "{'sort-up':!sortFlag}">
                            <use xlink:href="#icon-arrow-short" />
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
<!--                    &lt;!&ndash; filter （按价格筛选）&ndash;&gt;-->
<!--                    <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">-->
<!--                        <dl class="filter-price">-->
<!--                            <dt>Price:</dt>-->
<!--                            <dd>-->
<!--                                <a-->
<!--                                        href="javascript:void(0)"-->
<!--                                        v-bind:class="{'cur':priceChecked=='all'}"-->
<!--                                        @click="priceChecked='all'"-->
<!--                                >All</a>-->
<!--                            </dd>-->
<!--                            <dd :key="index" v-for="(item,index) in priceFilter">-->
<!--                                <a-->
<!--                                        href="javascript:void(0)"-->
<!--                                        @click="setPriceFilter(index)"-->
<!--                                        v-bind:class="{'cur':priceChecked==index}"-->
<!--                                >{{item.startPrice}}&#45;&#45;{{item.endPrice}}</a>-->
<!--                            </dd>-->
<!--                        </dl>-->
<!--                    </div>-->

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <!--  遍历mock商品数据 -->
                                <li :key="index" v-for="(item,index) in subjectsList">
                                    <div class="pic">
                                        <a href="#">
                                            <!-- v-lazy指令直接指向图片路径，在图片加载之前会使用main.js里loading设置的图片，当图片加载完后会将v-lazy里的图片属性赋到src里面去 -->
                                            <img v-lazy="'/static/'+item.productImage" alt />
                                        </a>
                                    </div>
                                    <div class="main">

                                        <div class="name">{{item.subjectName}}</div>
                                        <div class="price">{{item.role}}</div>
                                        <div class="startTime">{{item.startTime}}</div>--<div class="endTime">{{item.endTime}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addSubject(item.coachId,item.subjectId,item.subjectName,item.role,item.startTime,item.endTime,item.coachName,item.subjectPrice)">我要报名</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!-- 下拉加载  -->
                            <div
                                    v-infinite-scroll="loadMore"
                                    infinite-scroll-disabled="busy"
                                    infinite-scroll-distance="10"
                            >
                                <!--  loadMore为滚动时需要加载的方法busy值为true则禁止无限滚动，infinite-scroll-distance为滚动距离  -->
                                <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <!--    mdShow为向子组件传递的值-->
        <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
            <!--      插槽定义name值后组件的插槽引用sloat的值要一样才能对应-->
            <p slot="message">
                请先登录，否则无法报名
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
            </div>
        </modal>

        <!--    商品添加成功的提示模态框-->
        <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
            <!--      插槽定义name值后组件的插槽引用sloat的值要一样才能对应-->
            <p slot="message">
                <svg class="navbar-cart-logo">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" />
                </svg>
                <span>加入购物车成功</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
                <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
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
    import NavBread from "./../../src/components/NavBread.vue"; /*面包屑组件 */
    import axios from "axios"
    export default {
        data(){
            return {
                subjectsList:[],/**存放课程信息**/
                sortFlag: true /**true为升序 */,
                busy: true,/**默认无限滚动是禁用的 */
                mdShow: false,/*提示用户未登录框，默认不显示*/
                mdShowCart:false,/*商品添加后弹框提示，false默认不显示*/
                loading: false,/*loading默认是不显示的，接口请求之后才显示*/
                /*按价位筛选 */
                priceFilter: [
                    {
                        startPrice: "0.00",
                        endPrice: "500.00"
                    },
                    {
                        startPrice: "500.00",
                        endPrice: "1000.00"
                    },
                    {
                        startPrice: "1000.00",
                        endPrice: "2000.00"
                    }
                ],
                priceChecked: "all",
                filterBy: false,
                overLayFlag: false
            }
        },
        mounted: function() {
            this.getSubjectsList();
        },
        components:{
            NavHeader,NavFooter,Modal,NavBread
        },
        methods:{
            getSubjectsList(){
                console.log(`getSubjectsList()方法执行了`)
                axios
                    .get("/subjects/list").then(response=>{
                        let res = response.data;
                        console.log(`获取课程数据的接口进来了2,res.status:${res.status}`)
                        if(res.status == "0"){
                            this.subjectsList = res.result.list;
                            console.log(`subjectsList:${this.subjectsList}`)
                        }else {
                            /**数据请求失败**/
                            console.log(`数据请求失败`)
                            this.subjectsList = [];
                        }
                })
            },
            addSubject(coachId,id,name,role,startTime,endTime,coachName,price){
                console.log(`获取到的id:${id},获取到的name:${name},获取到的课程简介：${role},获取到的开始时间：${startTime},获取到的结束时间：${endTime},获取到的教练姓名：${coachName}，获取到的教练Id：${coachId},获取到的课程价格:${price}`)
                axios.post("/users/addSubject",{
                    coachId:coachId,
                    subjectId:id,
                    subjectName:name,
                    role:role,
                    startTime:startTime,
                    endTime:endTime,
                    coachName:coachName,
                    price:price
                }).then(response=>{
                    let res = response.data;
                    console.log(`报名课程的请求进来了,res.status:${res.status}`);
                    // console.log(`将选择报名课程的用户信息添加到教练的学生列表中`);
                    axios.post("/coachs/addStudent",{
                        coachId:coachId
                    }).then(response=>{
                        let res = response.data;
                        console.log(`添加会员到教练学生列表的请求进来了,教练Id为${coachId}`);
                        if(res.status=="0"){
                            console.log(`状态码为0`)
                        }
                    })
                })
            },
            closeModal() {
                this.mdShow = false;
                this.mdShowCart = false;
                console.log("这个方法调用了")
            },
            /**排序 */
            sortGoods() {
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
            },
            showFilterPop() {
                this.filterBy = true; /*控制价格 */
                this.overLayFlag = true; /* 控制遮罩 */
            },
            closePop() {
                this.filterBy = false; /*控制价格 */
                this.overLayFlag = false; /* 控制遮罩 */
            },
            /**按价格筛选 */
            setPriceFilter(index) {
                this.priceChecked = index;
                this.closePop();
                this.page = 1;/**筛选后从第一页开始 */
                this.getGoodsList();
            },
            /**滚动加载**/
            loadMore() {
                this.page++; /**滚动后页码加到第二页 */
                this.busy = true; /**页码++后禁用滚动 */
                setTimeout(() => {
                    this.getGoodsList(
                        true
                    ); /**加载商品列表,参数为true即告诉它分页需要累加 */
                }, 1000);
            },
        }
    }
</script>

<style scoped>

</style>