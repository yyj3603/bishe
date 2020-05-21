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
                    @select="handleSelect"
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
        <el-button type="primary" class="addButton" @click="addUser">开户<i class="el-icon-upload el-icon--right"></i></el-button>
        <!--        会员列表-->
        <el-table
                :data="tables"
                style="width: 100%; "
                class="userList"
        >

            <el-table-column label="会员名">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="性别">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.gender }}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.age }}</span>
                </template>
            </el-table-column>
            <el-table-column label="办卡日期">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" >{{ scope.row.createUserDate }}</span>
                </template>
            </el-table-column>

            <el-table-column label="参加课程">
                <template slot-scope="scope">
                    <span :key="index" v-for="(item,index) in scope.row.subjectsList" style="margin-left: 10px" >{{ item.subjectName}}</span>
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
<!--                    <el-button-->
<!--                            size="mini"-->

<!--                    >配备教练</el-button>-->
<!--                    <el-button-->
<!--                            size="mini"-->

<!--                    ><router-link to="/subjectsList">报课</router-link></el-button>-->
                    <el-button
                            size="mini"
                            icon="el-icon-edit"
                            @click="showEditDialog(scope.row.userId)" >Edit</el-button>
                    <!--                    <el-button-->
                    <!--                            size="mini"-->
                    <!--                            @click="handleEdit(scope.$index, scope.row)" >Edit</el-button>-->
                    <el-button
                            size="mini"
                            type="danger"
                            @click="delCustomerConfirm(scope.row)"
                    >Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 修改用户的对话框 -->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input v-model="editForm.userPwd"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="editForm.age"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-input v-model="editForm.gender"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo(editForm.userId,editForm.userName,editForm.userPwd,editForm.gender,editForm.age)">确 定</el-button>
          </span>
        </el-dialog>

        <!--        添加会员-->
        <!--:model绑定表单数据 :rules绑定验证规则-->
        <el-form :model="ruleForm" status-icon style="background-color: #FFFFFF" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm addUser" v-show="addModalFlag" >
            <div >
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="ruleForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-input v-model="ruleForm.gender"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass" >
                    <el-input type="password" v-model="ruleForm.userPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkUserPwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="ruleForm.age"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleForm.userName,ruleForm.userPwd,ruleForm.gender,ruleForm.age)">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </div>

        </el-form>
        <modal v-bind:mdShow="modalConfirm" v-on:close="closeModal">
            <!--      插槽定义name值后组件的插槽引用sloat的值要一样才能对应-->
            <p slot="message">
                <svg class="navbar-cart-logo">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" />
                </svg>
                <span>确认要删除该会员的信息吗，删除后无法恢复</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="delCustomer">确定删除</a>
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
    import Modal from "./../../src/components/Modal.vue"
    import axios from "axios"
    export default {
        data(){
            /**添加用户时候的校验规则**/
            var validateUserName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('会员名不能为空'));
                }
            };
            var validateGender = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('性别不能为空'));
                }
            };
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('年龄不能为空'));
                }
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value < 18) {
                            callback(new Error('必须年满18岁'));
                        } else {
                            callback();
                        }
                    }
                }, 500);
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                // 查询到的用户信息对象,用来接收响应的值
                editForm: {
                    userId:'',
                    userName:'',
                    userPwd: '',
                    gender: '',
                    age: ''
                },
                // 修改表单的验证规则对象
                editFormRules: {
                    email: [
                        {required: true, message: '请输入更改后的密码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入更改后的年龄', trigger: 'blur'},
                        {validator: checkAge, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: '请输入性别男/女', trigger: 'blur'},
                        {validator: validateGender, trigger: 'blur'}
                    ],
                },
                /*控制遮罩层的显示和隐藏*/
                mdShow: false,
                addModalFlag: false,//控制用户登录框
                /*控制模态框的显示和隐藏*/
                modalConfirm: false,
// 控制修改用户对话框的显示与隐藏，默认为隐藏
                editDialogVisible: false,
                tableDate: [], usersList:[],
                search: '',
                /*会员添加弹窗验证*/
                ruleForm: {
                    userName:'',
                    userPwd: '',
                    checkUserPwd: '',
                    gender: '',
                    age: ''
                },
                rules: {
                    userName: [
                        // {required: true, message: '用户名不能为空', trigger: 'blur'},
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    gender: [
                        // {required: true, message: '请输入性别', trigger: 'blur'},
                        { validator: validateGender, trigger: 'blur' }
                    ],
                    pass: [
                        // {required: true, message: '密码不能为空', trigger: 'blur'},
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        // {required: true, message: '密码需要相同', trigger: 'blur'},
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    age: [
                        { validator: checkAge, trigger: 'blur' }
                    ]
                }
                /*会员添加弹窗验证结束*/
            };
        },
        computed: {
            // 模糊搜索
            tables () {
                const search = this.search
                if (search) {
                    // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                    // 注意： filter() 不会对空数组进行检测。
                    // 注意： filter() 不会改变原始数组。
                    return this.usersList.filter(data => {
                        // some() 方法用于检测数组中的元素是否满足指定条件;
                        // some() 方法会依次执行数组的每个元素：
                        // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                        // 如果没有满足条件的元素，则返回false。
                        // 注意： some() 不会对空数组进行检测。
                        // 注意： some() 不会改变原始数组。
                        return Object.keys(data).some(key => {
                            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                            return String(data[key]).toLowerCase().indexOf(search) > -1
                        })
                    })
                }
                return this.usersList
            }},

        mounted: function(){
            this.getUsersList();
        },
        components:{
            NavHeader,
            NavFooter,
            Modal
        },
        methods:{
            closeModal() {
                this.modalConfirm = false;
                this.mdShow = false;
                this.addModalFlag=false;
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            addUser() {
                this.mdShow=true;
                this.addModalFlag=true;
            },
            /**编辑单行会员信息**/
            handleEdit(index, row) {
                console.log("row.gender:"+row.gender)
                console.log("index:"+index, "row:"+row.age);
            },
            /**删除单行会员信息**/
            delCustomerConfirm(row) {
                // 此处获取到应该删除掉的会员的ID
                console.log(`这行会员的ID为：${row.userId}`);
                this.row= row;
                this.modalConfirm = true;
            },
            delCustomer() {
                axios.post("/users/delUser",{
                    row:this.row
                }).then((res)=>{
                    console.log(`res.data:${res.data}`);
                    console.log(`res::::${this.userId}`);
                }).catch((err)=>{
                    console.log(err);
                })
                // console.log(`所删除的这行的会员名和索引值：${row.userName},会员ID为：${row.userId}`);
                this.modalConfirm = false;
                this.getUsersList();
            },
            /**获取顾客列表**/
            getUsersList(){
                console.log("成功调用getUsersList方法，此方法用来获取顾客列表信息")
                axios.get("/users/list").then(response =>{
                    let res = response.data;
                    console.log(`请求进来了，res为${this.res}`)
                    if(res.status == "0") {
                        this.usersList = res.result.list;
                        // console.log(`${this.customersList[0].userName}`);
                        console.log(`customersList:${this.usersList},userName为：${this.usersList[0].userName}`)
                    }else {
                        /*数据请求失败*/
                        this.usersList = [];
                    }
                })
            },
            /*添加用户弹窗，传送数据*/
            submitForm(name,pwd,gender,age) {
                console.log("submitForm()方法调用成功")
                axios.post("/users/addUser",{
                    userName:name,
                    userPwd:pwd,
                    gender:gender,
                    age:age
                }).then((res)=>{
                    console.log("res.data.status:"+res.data.status);
                    /**关闭弹窗和遮罩**/
                    this.mdShow=false;
                    this.addModalFlag=false;
                    this.getUsersList();
                })
            },
            // 展示编辑用户的对话框
            showEditDialog(id) {
                this.editDialogVisible = true;
                console.log(`获取到该行用户的ID为：${id}`);//此处已经获取到ID，之后参照删除时id的传递
                this.userId = id;
            },
            // 监听修改用户对话框的关闭
            editDialogClosed () {
                this.$refs.editFormRef.resetFields()
            },
            //确定修改该用户的信息
            editUserInfo(id,name,pwd,gender,age){
                console.log("editUserInfo方法调用成功");
                console.log(`是否是對象：${this.editForm.age}${this.editForm.userName}${this.editForm.userPwd}${this.editForm.gender}`)
                console.log(`能否获取到该行的userId:${this.userId}`)
                axios.post("/users/editUser",{
                    userId:this.userId,
                    userName:name,
                    userPwd:pwd,
                    gender:gender,
                    age:age
                }).then((res)=>{
                    console.log(`/users/editUser接口调用的状态：`+res.data.status);
                    this.editDialogVisible = false;
                    this.getUsersList();
                })
            },
            // submitForm(formName) {
            //     console.log(`userName:${this.ruleForm.userName} gender:${this.ruleForm.gender} `)
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {
            //             alert('submit!');
            //         } else {
            //             console.log('error submit!!');
            //             return false;
            //         }
            //     });
            // },
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
    .userList{
        margin-top: 20px;
    }
    .addUser{
        position: fixed;
        top: 50%;
        left: 50%;
        width: 535px;
        height: auto;
        transform: translate(-50%, -50%);
        z-index: 201;
    }
</style>