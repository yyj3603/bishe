<template>
    <div>
        <nav-header></nav-header>
        <!--        导航菜单-->
        <nav>
            <div class="line"></div>
            <el-menu
                    :default-active="this.$route"
                    router
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    style="display:flex;align-items:center;justify-content:center;">
                <el-menu-item index="/adminView">处理中心</el-menu-item>

                <el-menu-item index="3" disabled>消息中心</el-menu-item>
                <el-menu-item index="/manageGoods"><span target="_blank">商品管理</span></el-menu-item>
                <el-menu-item index="/baoBiao" class="is-active" ><span target="_blank">报表</span></el-menu-item>
            </el-menu>
        </nav>
        <el-button type="primary" class="addButton" @click="addProduct">添加商品<i class="el-icon-upload el-icon--right"></i></el-button>
        <!-- 商品列表-->
        <el-table
                :data="this.goodsList"
                style="width: 100%; "
                class="userList"
        >

            <el-table-column label="商品ID">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.productId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品名称">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品单价">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.salePrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品图片">
                <template slot-scope="scope">
<!--                    <span style="margin-left: 10px" >{{ scope.row.createUserDate }}</span>-->
                    <img style="width: 50px;height: 50px" v-lazy="'/static/'+scope.row.productImage" alt />
                </template>
            </el-table-column>
            <el-table-column label="商品数量">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.goodNum}}</span>
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
                            @click="handleEdit(scope.$index, scope.row)" >Edit</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="delCustomerConfirm(scope.row.customerId)"
                    >Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--添加产品-->
        <!--:model绑定表单数据 :rules绑定验证规则-->
        <el-form :model="ruleForm" status-icon style="background-color: #FFFFFF" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm addProduct" v-show="addModalFlag" >
            <div >

                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="ruleForm.productName"></el-input>
                </el-form-item>
                <el-form-item label="产品单价" prop="salePrice">
                    <el-input v-model="ruleForm.salePrice"></el-input>
                </el-form-item>
                <el-form-item label="产品数量" prop="goodNum" >
                    <el-input  v-model="ruleForm.goodNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-upload
                        class="upload-demo"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts"
                        multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <el-form-item>
                    <el-button type="primary" @click="submitProductForm(ruleForm.productName,ruleForm.salePrice,ruleForm.goodNum)">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </div>

        </el-form>
<!--        分页-->
<!--        <div class="block">-->
<!--            <span class="demonstration">页数较少时的效果</span>-->
<!--            <el-pagination-->
<!--                    layout="prev, pager, next"-->
<!--                    :total="50">-->
<!--            </el-pagination>-->
<!--        </div>-->
        <nav-footer></nav-footer>
        <!--        遮罩层-->
        <div class="md-overlay" v-show="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
    import NavHeader from "./../../src/components/NavHeader.vue"; /*头部组件 */
    import NavFooter from "./../../src/components/NavFooter.vue"; /*底部组件 */
    import axios from "axios"
    export default {
        data(){
            /**添加用户时候的校验规则**/
            var validateProductName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('产品名不能为空'));
                }
            };
            var validateSalePrice = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('产品单价不能为空'));
                }else{
                    if (value <= 0) {
                        callback(new Error('产品单价必须大于0'));
                    } else {
                        callback();
                    }
                }
            };
            var validateGoodNum = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('产品数量不能为空'));
                }else{
                    if (value == 0) {
                        callback(new Error('商品数量必须大于0'));
                    } else {
                        callback();
                    }
                }

                // setTimeout(() => {
                //     if (!Number.isInteger(value)) {
                //         callback(new Error('请输入数字值'));
                //     } else {
                //         if (value < 18) {
                //             callback(new Error('必须年满18岁'));
                //         } else {
                //             callback();
                //         }
                //     }
                // }, 1000);
            };
            return {
                /*会员添加弹窗验证*/
                ruleForm: {
                    productName:'',
                    salePrice: '',
                    goodNum: '',
                },
                rules: {
                    productName: [
                        // {required: true, message: '请正确输入产品名称', trigger: 'blur'},
                        { validator: validateProductName, trigger: 'blur' }
                    ],
                    salePrice: [
                        // {required: true, message: '请正确输入产品单价', trigger: 'blur'},
                        { validator: validateSalePrice, trigger: 'blur' }
                    ],
                    goodNum: [
                        // {required: true, message: '请正确输入产品数量', trigger: 'blur'},
                        { validator: validateGoodNum, trigger: 'blur' }
                    ],
                },
                addModalFlag: false,//控制用户登录框
                goodsList:[],
                activeIndex: '1',
                activeIndex2: '1',
                /*控制遮罩层的显示和隐藏*/
                mdShow: false,
                search:'',
                page: 1,
                pageSize: 8,
                busy: true,/**默认无限滚动是禁用的 */
                sortFlag: true /**true为升序 */,

            };
        },
        mounted: function(){
            this.getProductsList();
        },
        components:{
            NavHeader,
            NavFooter,
        },
        methods:{
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            closeModal() {
                this.mdShow = false;
                this.addModalFlag = false;
            },
            getProductsList(flag) {
                var param = {
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.sortFlag ? 1 : -1 /**如果是true为1，false为-1 */,
                    // priceLevel:this.priceChecked
                };
                this.loading = true;
                axios
                    .get("/goods/goodsList", {
                        params: param
                    })
                    .then(response => {
                        let res = response.data;
                        console.log(`首页获取数据为：${res.result}`);
                        this.loading = false;
                        if (res.status == "0") {
                            console.log(`商品管理列表的res.status为${res.status}`)
                            /**status为0则请求成功 */
                            /**这个flag为什么什么都没有！！！！！**/
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
                        }  else {
                            /**数据请求失败 */
                            this.goodsList = [];
                        }

                        /*  console.log("res"+res);
                      console.log("res.result"+res.result.productId);//这个是数据 */
                    });
            },
            /**滚动加载**/
            loadMore() {
                this.page++; /**滚动后页码加到第二页 */
                this.busy = true; /**页码++后禁用滚动 */
                setTimeout(() => {
                    this.getProductsList(
                        true
                    ); /**加载商品列表,参数为true即告诉它分页需要累加 */
                }, 1000);
            },
            /**添加产品**/
            addProduct() {
                this.mdShow=true;
                this.addModalFlag=true;
            },
            /**提交商品数据**/
            submitProductForm(name,price,num){
                console.log("submitProductForm方法调用成功");
                axios.post("/goods/addProduct",{
                    productName:name,
                    salePrice:price,
                    goodNum:num
                }).then((res)=>{
                    console.log("res.data.status:"+res.data.status);
                    /**关闭弹窗和遮罩**/
                    this.mdShow=false;
                    this.addModalFlag=false;
                    this.getProductsList();

                })
            },

            resetForm(ruleForm) {

                this.$refs[ruleForm].resetFields();
            }

        }
    }
</script>

<style scoped>
    .addButton{
        display: block;
        margin-top: 10px;
        background: rgb(84,92,100);
    }
    .addProduct{
        position: fixed;
        top: 50%;
        left: 50%;
        width: 535px;
        height: auto;
        transform: translate(-50%, -50%);

        z-index: 201;

    }
</style>