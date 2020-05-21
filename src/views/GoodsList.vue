<template>
  <!-- <div>
    商品列表页面
    <span>{{$route.params.goodsId}}</span><br/>
    <router-link to="/goods/title">显示商品标题</router-link>
    <router-link to="/goods/img">显示商品图片</router-link>
    <router-link to="/cart">跳转到购物车页面</router-link>
    <button @click="jump">跳转到购物车页面（编程式路由）</button>
    <div>
        <router-view></router-view>
    </div>
  </div>-->

  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">Good</span>
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
          <!-- filter （按价格筛选）-->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  v-bind:class="{'cur':priceChecked=='all'}"
                  @click="priceChecked='all'"
                >All</a>
              </dd>
              <dd :key="index" v-for="(item,index) in priceFilter">
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index)"
                  v-bind:class="{'cur':priceChecked==index}"
                >{{item.startPrice}}--{{item.endPrice}}</a>
              </dd>
            </dl>

            <router-link to="/subjectsList">了解课程</router-link>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <!--  遍历mock商品数据 -->
                <li :key="index" v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#">
                      <!-- v-lazy指令直接指向图片路径，在图片加载之前会使用main.js里loading设置的图片，当图片加载完后会将v-lazy里的图片属性赋到src里面去 -->
                      <img v-lazy="'/static/'+item.productImage" alt />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
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
        请先登录，否则无法加入到购物车
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
  </div>
</template>

<script>
import "./../assets/css/base.css"; /*基础样式 */
import "./../assets/css/product.css"; /*商品列表样式 */
import "./../assets/css/login.css"; /* 登陆条样式*/
import "./../assets/css/checkout.css";

import NavHeader from "./../../src/components/NavHeader.vue"; /*头部组件 */
import NavFooter from "./../../src/components/NavFooter.vue"; /*底部组件 */
import NavBread from "./../../src/components/NavBread.vue"; /*面包屑组件 */
import Modal from "./../../src/components/Modal.vue"
import axios from "axios";
export default {
  data() {
    return {
      goodsList: [],
      sortFlag: true /**true为升序 */,
      page: 1,
      pageSize: 8,
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
    };
  },
  components: {
      /*使用一个组件必须把组件加到components里*/
      NavHeader,
      NavFooter,
      NavBread,
      Modal,

  },
  mounted: function() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1 /**如果是true为1，false为-1 */,
        priceLevel:this.priceChecked
      };
      this.loading = true;
      axios
        .get("/goods/list", {
          params: param
        })
        .then(response => {
          let res = response.data;
          console.log(`首页获取数据为：${res.result.list}`)
          this.loading = false;
          if (res.status == "0") {
            /**status为0则请求成功 */
            console.log(`商品列表的res.status为${res.status}`)
            if (flag) {
              console.log(`商品列表的flag为${flag}`)
              /**flag为true表示是分页，需要累加 */
              /* this.goodsList=res.result.list; */
              console.log(`res.result.list为${res.result.list}`)
              this.goodsList = this.goodsList.concat(
                res.result.list
              );
              /**concat将两个数组串联起来 */
              if (res.result.count == 0) {
                /**条数为0说明没有数据 */
                this.busy = true;
              }else{
                this.busy = false;
              }
            } else {
              /**else说明是第一次进入或者完全不需要数据拼接，数据不改变 */
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            /**数据请求失败 */
            this.goodsList = [];
          }

          /*  console.log("res"+res);
        console.log("res.result"+res.result.productId);//这个是数据 */
        });
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
    /**添加购物车*/
    addCart(productId) {
        axios.post('/goods/addCart',{
            productId:productId
        }).then((res)=>{
            /*插入成功*/
            console.log("res.data.status:"+res.data.status);
            if(res.data.status==0){
                this.mdShowCart = true;
                this.$store.commit("updateCartCount",1);
            }else{
                // alert("msg:"+"用户未登录");
                this.mdShow = true;
            }
        })
    },
    closeModal() {
        this.mdShow = false;
        this.mdShowCart = false;
        console.log("这个方法调用了")
    }
  }
};
</script>


