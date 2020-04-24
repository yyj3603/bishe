<template>
    <div>
        <nav-header></nav-header>
        <nav-bread></nav-bread>
        <div class="CustomersListTable">
<!--            <el-table-->
<!--                    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
<!--                    style="width: 100%">-->
<!--                <el-table-column-->
<!--                        label="sd"-->
<!--                        prop="date">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="Name"-->
<!--                        prop="name">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        align="right">-->
<!--                    <template slot="header" slot-scope="">-->
<!--                        <el-input-->
<!--                                v-model="search"-->
<!--                                size="mini"-->
<!--                                placeholder="输入关键字搜索"/>-->
<!--                    </template>-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button-->
<!--                                size="mini"-->
<!--                                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>-->
<!--                        <el-button-->
<!--                                size="mini"-->
<!--                                type="danger"-->
<!--                                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--            </el-table>-->
            <el-table
                    :data="this.customersList"
                    style="width: 100%">
                <el-table-column
                        label="顾客ID"
                        prop="customerId">
                </el-table-column>
                <el-table-column
                        label="顾客名"
                        prop="customerName">
                </el-table-column>
                <el-table-column
                        label="地址"
                        prop="address">
                </el-table-column>
                <el-table-column
                        label="性别"
                        prop="gender">
                </el-table-column>
                <el-table-column
                        label="办卡日期"
                        prop="createDate">
                </el-table-column>
                <el-table-column
                        label="办卡日期"


                >
                    <template slot-scope="scope">

                        <span style="margin-left: 10px" >{{ scope.row.customerId }}</span>
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
                                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="delCustomerConfirm(scope.row.customerId)"
                               >Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <ul>
                    <li :key="index" v-for="(item,index) in customersList">
                        <span>{{item.userName}}</span>

                    </li>
                </ul>
            </div>
        </div>
        <Modal :mdShow="modalConfirm" @click="closeModal">
            <p slot="message">你确认要删除此条数据吗</p>
            <div slot="btnGroup" >
                <a href="javascript:;" class="btn btn--m" @click="delCustomer">确认</a>
                <a href="javascript:;" class="btn btn--m" @click="modalConfirm=false">关闭</a>
            </div>
        </Modal>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import NavHeader from "./../../src/components/NavHeader.vue"; /*头部组件 */
    import NavFooter from "./../../src/components/NavFooter.vue"; /*底部组件 */
    import NavBread from "./../../src/components/NavBread.vue"; /*面包屑组件 */
    import Modal from "./../../src/components/Modal.vue";
    import axios from "axios"
    // import "./../assets/css/base.css"; /*基础样式 */
    // import "./../assets/css/product.css"; /*商品列表样式 */
    // import "./../assets/css/login.css"; /* 登陆条样式*/
    // import "./../assets/css/checkout.css";
    export default {
        data(){
            return {
                customersList: [],
                /*控制模态框的显示和隐藏*/
                modalConfirm: false,
                tableData: [],
                search: ''
            }
        },
        components:{
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        },
        mounted: function() {
            this.getCustomersList();
        },
        methods: {
            init(){
                axios.get("/customers/list").then(response =>{
                    let res = response.data;
                    if(res.status == "0") {
                        this.customersList = res.result.list;
                        console.log(`init初始化后：${this.customersList[0].userName}`);
                        console.log(`init初始化偶customersList:${this.customersList}`)
                    }else {
                        /*数据请求失败*/
                        this.customersList = [];
                    }
                })
            },
            handleEdit(index, row) {
                console.log(row.gender)
                console.log(index, row);
            },
            // handleDelete(index, row) {
            //     console.log("index是："+index, "row是："+row);
            //     console.log(index);
            //     this.$confirm('此操作将删除该数据，是否继续？','提示',{
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(()=>{
            //         this.customersList.splice(index,1)
            //
            //     })
            // },

            /*删除会员确认框 将customerId全局保存,这样才能在delCart()里拿到这个productId来进行删除*/
            delCustomerConfirm(item) {
              this.delItem = item;
                console.log(`this.delItem的值为${item}`);
                console.log(`this.delItem.productId的值为${this.delItem}`);
              this.modalConfirm=true;
            },
            /*删除会员*/
            delCustomer(){
                axios.post("/customers/cusDel",{
                    customerId:this.delItem.customerId
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=='0'){
                        this.modalConfirm=false;
                        this.init();
                    }
                })
            },
            closeModal(){
                this.modalConfirm=false;
            },
            getCustomersList(){
                console.log("成功调用getCustomersList方法")
                axios.get("/customers/list").then(response =>{
                    let res = response.data;
                    if(res.status == "0") {
                        this.customersList = res.result.list;
                        console.log(`${this.customersList[0].userName}`);
                        console.log(`customersList:${this.customersList}`)
                    }else {
                        /*数据请求失败*/
                        this.customersList = [];
                    }
                })
            },
        },
    }
</script>

<style scoped>

</style>