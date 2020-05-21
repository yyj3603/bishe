<template>
    <div>
        <nav-header></nav-header>
        <!--        导航菜单-->
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
                    style="display:flex;align-items:center;justify-content:center;">
                <el-menu-item index="/adminView">处理中心</el-menu-item>

                <el-menu-item index="/manageCoachs" class="is-active" ><span target="_blank">教练管理</span></el-menu-item>
                <el-menu-item index="/manageGoods" class="is-active" ><span target="_blank">商品管理</span></el-menu-item>
                <el-menu-item index="/baoBiao" class="is-active" ><span target="_blank">报表分析</span></el-menu-item>
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
                    <span style="margin-left: 10px" >{{ scope.row.productNum}}</span>
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
                            @click="delGoodConfirm(scope.row)"
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
                <el-form-item label="产品数量" prop="productNum" >
                    <el-input  v-model="ruleForm.productNum" autocomplete="off"></el-input>
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
                    <el-button type="primary" @click="submitProductForm(ruleForm.productName,ruleForm.salePrice,ruleForm.productNum)">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </div>

        </el-form>

        <!-- 修改商品的对话框 -->
        <el-dialog
                title="修改商品"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="70px">
                <el-form-item label="商品名">
                    <el-input v-model="editForm.productName"></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="price">
                    <el-input v-model="editForm.salePrice"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="num">
                    <el-input v-model="editForm.productNum"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editGoodInfo(editForm.productId,editForm.productName,editForm.productNum,editForm.salePrice)">确 定</el-button>
          </span>
        </el-dialog>
        <modal v-bind:mdShow="modalConfirm" v-on:close="closeModal">
            <!--      插槽定义name值后组件的插槽引用sloat的值要一样才能对应-->
            <p slot="message">
                <svg class="navbar-cart-logo">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" />
                </svg>
                <span>确认要删除该商品的信息吗，删除后无法恢复</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="delGood">确定删除</a>
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
    import Modal from "./../../src/components/Modal.vue";
    import axios from "axios"
    export default {
        data(){
            /**添加商品时候的校验规则**/
            var validateProductName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('产品名不能为空'));
                }
            };
            var validateSalePrice = (rule, value, callback) => {
                if (value == '') {
                    return callback(new Error('产品单价不能为空'));
                }else{
                    if (value <= 0) {
                        callback(new Error('产品单价必须大于0'));
                    } else {
                        callback();
                    }
                }
            };
            var validateproductNum = (rule, value, callback) => {
                if (value=='') {
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

                editForm: {
                    productId:'',
                    productName:'',
                    salePrice: '',
                    productNum: '',

                },
                editFormRules:{
                    name: [

                        {validator: validateProductName, trigger: 'blur'}
                    ],
                    price:[

                        {validator: validateSalePrice, trigger: 'blur'}
                    ],
                    num:[

                        {validator: validateproductNum, trigger: 'blur'}
                    ],
                },
                /*会员添加弹窗验证*/
                ruleForm: {
                    productName:'',
                    salePrice: '',
                    productNum: '',
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
                    productNum: [
                        // {required: true, message: '请正确输入产品数量', trigger: 'blur'},
                        { validator: validateproductNum, trigger: 'blur' }
                    ],
                },
                addModalFlag: false,//控制用户登录框
                /*控制模态框的显示和隐藏*/
                modalConfirm: false,
                // 控制修改用户对话框的显示与隐藏，默认为隐藏
                editDialogVisible: false,
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
            Modal
        },
        methods:{
            // handleSelect(key, keyPath) {
            //     console.log(key, keyPath);
            // },
            closeModal() {
                this.modalConfirm = false;
                this.mdShow = false;
                this.addModalFlag = false;
            },
            /**加载产品列表**/
            getProductsList(flag) {
                // var param = {
                //     page: this.page,
                //     pageSize: this.pageSize,
                //     sort: this.sortFlag ? 1 : -1 /**如果是true为1，false为-1 */,
                //     // priceLevel:this.priceChecked
                // };
                this.loading = true;
                axios
                    // .get("/goods/goodsList", {
                    //     params: param
                    // })
                    .get("/goods/goodsList")
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
            /**删除单行商品信息**/
            delGoodConfirm(row) {
                // 此处获取到应该删除掉的商品的ID
                console.log(`row的值为：${row}`)
                console.log(`这行会员的ID为：${row.productId}`);
                this.row= row;
                this.modalConfirm = true;
            },
            delGood() {
                axios.post("/goods/delGood",{
                    row:this.row
                }).then(response=>{
                    let res = response.data;
                    if(res.status == "0") {
                        console.log(`删除商品请求成功`)
                    }else {
                        console.log(`删除商品请求发送失败`)
                    }
                })
                this.modalConfirm=false;
                this.getProductsList();
            },
            /**展示编辑用户的对话框**/
            showEditDialog(id) {
                this.editDialogVisible = true;
                console.log(`获取到该行商品的Id为：${id}`);//此处已经获取到ID，之后参照删除时id的传递
                this.productId = id;
            },
            // 监听修改用户对话框的关闭
            editDialogClosed () {
                this.$refs.editFormRef.resetFields()
            },
            //确定修改该商品的信息
            editGoodInfo(id,name,num,price){
                console.log(`editGoodInfo调用了,获得的商品id为${this.productId}，商品名为${name}，数量为：${num},单价为：${price}`);
                axios.post("/goods/editGood",{
                    productId:this.productId,
                    productName:name,
                    salePrice:price,
                    productNum:num,

                }).then((res)=>{
                    console.log(`/goods/editGood接口调用的状态：`+res.data.status);
                    this.editDialogVisible = false;
                    this.getProductsList();
                }).catch(error=>{
                    console.log(error);
                })
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
                    productNum:num
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