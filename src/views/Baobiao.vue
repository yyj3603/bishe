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
                <el-menu-item index="/manageCoachs" class="is-active" ><span target="_blank">教练管理</span></el-menu-item>
                <el-menu-item index="/manageGoods" class="is-active" ><span target="_blank">商品管理</span></el-menu-item>
                <el-menu-item index="/baoBiao" class="is-active" ><span target="_blank">报表</span></el-menu-item>
            </el-menu>
        </nav>
        <div class="Baobiao_title">
            <div class="Baobiao_title_content">
                <span>近一周办卡人数走势</span>
            </div>
        </div>
        <span :key="index" v-for="(item,index) in testArr">成功获取到所有用户的创建时间：这是第{{index+1}}个用户{{item.createUserDate}}---</span>

        <template>
<!--            折线图-->
            <ve-line :data="chartData" width="auto 800px"></ve-line>
        </template>
        <div class="Baobiao_title">
            <div class="Baobiao_title_content">
                <span>各年龄段会员占比</span>
            </div>
        </div>
        <span :key="index" v-for="(item,index) in testArr">成功获取到所有用户的年龄：这是第{{index+1}}个用户{{item.age}}---</span>

        <template>
            <ve-pie :data="chartData2"></ve-pie>
        </template>
        <template>
            <ve-bar :data="chartData3"></ve-bar>
        </template>

        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import NavHeader from "./../../src/components/NavHeader.vue"; /*头部组件 */
    import NavFooter from "./../../src/components/NavFooter.vue"; /*底部组件 */
    import axios from "axios"
    export default {
        data () {
            return {
                chartData: {
                    columns: ['createUserDate', '办卡用户'],
                    rows: [
                        // { 'createUserDate': '2018-05-22', '办卡用户': 19810 },
                        // { 'createUserDate': '2018-05-23', '办卡用户': 4398 },
                        // { 'createUserDate': '2018-05-23', '办卡用户': 4398 },
                        // { 'createUserDate': '2018-05-23', '办卡用户': 4398 },
                        // { 'createUserDate': '2018-05-24', '办卡用户': 52910 },
                        // { 'createUserDate': '2018-08-23', '办卡用户': 6650 },
                    ]
                },
                chartData2: {
                    columns: ['age', '会员人数'],
                    rows: [
                        // { 'age': '15-20岁', '会员人数': 1393 },
                        // { 'age': '20-25岁', '会员人数': 3530 },
                        // { 'age': '25-35岁', '会员人数': 2923 },
                        // { 'age': '35-40岁', '会员人数': 1723 },
                        // { 'age': '40-50岁', '会员人数': 1723 },
                    ]
                },
                chartData3: {
                    columns: ['日期', '访问用户', '办卡用户', '办卡率'],
                    rows: [
                        { '日期': '1/1', '访问用户': 1393, '办卡用户': 1093, '办卡率': 0.32 },
                        { '日期': '1/2', '访问用户': 3530, '办卡用户': 3230, '办卡率': 0.26 },
                        { '日期': '1/3', '访问用户': 2923, '办卡用户': 2623, '办卡率': 0.76 },
                        { '日期': '1/4', '访问用户': 1723, '办卡用户': 1423, '办卡率': 0.49 },
                        { '日期': '1/5', '访问用户': 3792, '办卡用户': 3492, '办卡率': 0.323 },
                        { '日期': '1/6', '访问用户': 4593, '办卡用户': 4293, '办卡率': 0.78 }
                    ]
                },
                /**用户数据获取**/
                userArr:[],
                age20:[],/*统计15-20岁会员的人数*/
                age25:[],/*统计20-25岁会员的人数*/
                age30:[],/*统计25-30岁会员的人数*/
                age40:[],/*统计30-40岁会员的人数*/
                age45:[],/*统计40-45岁会员的人数*/
                /**保存五个年龄段人数**/
                countArr:[],
            }
            },
        mounted: function () {
            this.getValue();
        },
        components:{
            NavHeader,
            NavFooter,
        },
        methods:{
            getValue() {
                axios.get("/users/list").then(response=>{
                    let res = response.data.result.list;

                    console.log(`报表获取到的数据有：${res}`)
                    this.userArr=res;
                    console.log(res.length)
                    /**将所有用户的创建日期当作横坐标**/
                    for(let i=0;i<this.userArr.length;i++){
                        this.chartData.rows.push({
                            "createUserDate" : this.userArr[i].createUserDate,
                            "办卡用户" : this.userArr[i].age
                        })
                        console.log(`${this.userArr[i].createUserDate}`)
                    }
                    for(let i=0;i<this.userArr.length;i++){
                        /**对每个用户的年龄进行判断再分别加入到不同年龄段的数组中**/
                        if(this.userArr[i].age<=20){
                            this.age20.push(this.userArr[i].age);
                            console.log(`age20数组的长度为：${this.age20.length}`);
                        }else if (this.userArr[i].age<=25){
                            this.age25.push(this.userArr[i].age);
                            console.log(`age25数组的长度为：${this.age25.length}`)
                        }else if (this.userArr[i].age<=30){
                            this.age30.push(this.userArr[i].age);
                            console.log(`age30数组的长度为：${this.age30.length}`)
                        }else if (this.userArr[i].age<=40){
                            this.age40.push(this.userArr[i].age);
                            console.log(`age40数组的长度为：${this.age40.length}`)
                        }else if (this.userArr[i].age<=45){
                            this.age45.push(this.userArr[i].age);
                            console.log(`age45数组的长度为：${this.age45.length}`)
                        }
                        this.chartData2.rows.push({
                            "age" : this.userArr[i].age,
                            "会员人数" : this.userArr[i].age
                        })
                        console.log(`${this.userArr[i].age}`)
                    }
                    /**创建count1到count5来储存五个年龄段的人数**/
                    let count1=this.age20.length;
                    let count2=this.age25.length;
                    let count3=this.age30.length;
                    let count4=this.age40.length;
                    let count5=this.age45.length;
                    this.countArr.push(count1,count2,count3,count4,count5);
                    console.log(`用完即删：countArr的长度为：${this.countArr.length}`);
                    // for(let i=0;i<this.countArr.length;i++){
                    //     // console.log(this.countArr[i])
                    //     this.chartData2.rows.push({
                    //
                    //         "会员人数" : this.countArr[i]
                    //     })
                    // }
                })
            }
        }
    }
</script>

<style scoped>
    .Baobiao_title{
        border-bottom: 1px solid rgba(51, 51, 51, 0.15);
        max-width: 1280px;
        margin: 20px auto;

    }
    .Baobiao_title_content{
        height: 100px;
    }
    .Baobiao_title_content span{
        font-size: xx-large;
    }
</style>