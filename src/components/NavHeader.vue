<template>
  <header class="header">
    <symbol id="icon-cart" viewBox="0 0 38 32">
      <title>cart</title>
      <path
        class="path1"
        d="M37.759 0h-4.133c-0.733 0.004-1.337 0.549-1.434 1.255l-0.546 4.342c-0.081 0.484-0.496 0.849-0.997 0.849-0.005 0-0.009-0-0.014-0h-27.604c-0.003 0-0.007-0-0.011-0-1.674 0-3.031 1.357-3.031 3.031 0 0.34 0.056 0.666 0.159 0.971l2.52 8.062c0.385 1.194 1.486 2.043 2.785 2.043 0.126 0 0.25-0.008 0.372-0.023l22.983 0.002c0.515 0.131 0.626 0.768 0.626 1.283 0.005 0.044 0.009 0.095 0.009 0.146 0 0.501-0.294 0.933-0.718 1.134l-22.439 0.003c-0.354 0-0.642 0.287-0.642 0.642s0.287 0.642 0.642 0.642h22.745l0.131-0.071c0.919-0.392 1.551-1.287 1.551-2.33 0-0.058-0.002-0.116-0.006-0.173 0.021-0.108 0.033-0.24 0.033-0.376 0-1.072-0.732-1.973-1.724-2.23l-23.357-0.004c-0.063 0.008-0.135 0.013-0.209 0.013-0.719 0-1.332-0.455-1.566-1.093l-2.53-8.095c-0.048-0.154-0.076-0.332-0.076-0.515 0-0.973 0.782-1.764 1.752-1.778h27.657c1.159-0.004 2.112-0.883 2.232-2.011l0.547-4.345c0.010-0.083 0.078-0.147 0.161-0.152l4.133-0c0.354 0 0.642-0.287 0.642-0.642s-0.287-0.642-0.642-0.642z"
      ></path>
      <path
        class="path2"
        d="M31.323 9.69c-0.022-0.003-0.048-0.004-0.074-0.004-0.328 0-0.598 0.248-0.633 0.567l-0.809 7.268c-0.003 0.022-0.004 0.048-0.004 0.074 0 0.328 0.248 0.598 0.567 0.633l0.074 0c0.001 0 0.003 0 0.004 0 0.327 0 0.596-0.246 0.632-0.563l0.809-7.268c0.003-0.022 0.004-0.048 0.004-0.074 0-0.328-0.248-0.598-0.567-0.633z"
      ></path>
      <path
        class="path3"
        d="M27.514 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM27.514 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z"
      ></path>
      <path
        class="path4"
        d="M9.599 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM9.599 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z"
      ></path>
    </symbol>
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
<!--          <span><img class="navbar-brand-logo" @click="toOrNo" src="static/logo.png"/></span>-->
          <router-link to="/adminView"><img class="navbar-brand-logo" src="static/logo.png"/></router-link>
        </a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <!--<a href="/" class="navbar-link">我的账户</a>-->
          <!--nickName是true才显示-->
          <a href="javascript:void(0)" class="navbar-link" v-text="nickName" v-if="nickName" ></a>
          <a href="javascript:void(0)" class="navbar-link" @click="loginModalFlag=true" v-if="!nickName">Login</a>
          <a href="javascript:void(0)" class="navbar-link" v-if="nickName" @click="logOut">Logout</a>
          <a href="javascript:void(0)" class="navbar-link"  @click="getUsersInformation">about Me</a>

          <el-dialog title="您的个人信息" class="navbar-link" :visible.sync="dialogTableVisible">
            <el-table :data="userData">
              <el-table-column property="createUserDate" label="创建日期" width="150"></el-table-column>
              <el-table-column property="userName" label="姓名" width="200"></el-table-column>
              <el-table-column property="gender" label="性别"></el-table-column>
              <el-table-column property="age" label="年龄"></el-table-column>
              <el-table-column  property="subjectsList[0].subjectName" label="课程"></el-table-column>
              <el-table-column  property="subjectsList[0].startTime" label="课程开始时间"></el-table-column>
              <el-table-column  property="subjectsList[0].endTime" label="课程结束时间"></el-table-column>
            </el-table>

          </el-dialog>

          <router-link class="navbar-link" to="/aboutUs">about Us</router-link>
          <div class="navbar-cart-container">
            <span class="navbar-cart-count" v-if="cartCount>0">{{cartCount}}</span>
            <a class="navbar-link navbar-cart-link" href="/#/cart">
              <svg class="navbar-cart-logo">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click="loginModalFlag=false">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName"
                       class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2" name="password" v-model="userPwd"
                       class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password"
                       @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="login">登 录</a>
<!--            <el-button-->
<!--                    plain-->
<!--                    class="btn-login"-->
<!--                    @click="login">-->
<!--              登录-->
<!--            </el-button>-->
          </div>

        </div>
      </div>
    </div>
    <!--遮罩层-->

    <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
  </header>
</template>

<script>
  import './../assets/css/login.css'

  import axios from 'axios'

  export default {
    data() {
      return {
        userName: '',
        userPwd: '',
        userId: '',
        errorTip: false, //true就显示用户名或密码错误提示，false就不显示
        loginModalFlag: false,//控制用户登录框
        /**用户信息弹框中的用户数据**/
        userData:[],
        dialogTableVisible:false,


      }
    },
    mounted() {
      this.checkLogin();

    },
    computed:{
      /*
      *  ...mapState(['nickName','cartCount']) 是下面两个方法的简写
      * */
      nickName(){//将用户名保存在这里
        return this.$store.state.nickName;
      },
      cartCount(){
        return this.$store.state.cartCount;
      }
    },
    methods: {
      /**是否跳转到管理页面根据ID判断**/
      /*测试*/
      checkLogin(){
        axios.get("/users/checkLogin").then((response)=>{
          var res = response.data;
          if(res.status=="0"){
            this.$store.commit("updateUserInfo",res.result);
            this.getCartCount();
            this.loginModalFlag = false;
          }
        });
      },
      login() {
        /*如果userName或者userPwd是false*/
        console.log(`login调用1，userName：${this.userName}`)
        if (!this.userName || !this.userPwd) {
          console.log(`login调用2，userName：${this.userName}`)
          this.errorTip = true;
          return;
        }

        axios.post("/users/login", {
          userName: this.userName,
          userPwd: this.userPwd,

        }).then((response) => {
          let res = response.data;
          console.log(`userName:${this.userName}userId:${this.userId}`)
          if (res.status == "0") {

            this.errorTip = false;
            /**成功，隐藏错误提示*/
            this.loginModalFlag = false;/*登录成功，关掉登录框*/
            this.$store.commit("updateUserInfo",res.result.userName)
            // this.nickName = res.result.userName;
            this.getCartCount();
            this.$notify({
              title: '成功',
              message: '用户登录成功',
              type: 'success'
            });

            console.log(`这句话如果成功输出，可尝试在这里增添判断用户是否管理员账户，如果是进行路由跳转${this.userName}和${this.userId}`);
            if(this.userName=="admin"){
              console.log(`是管理员`);
              /**是管理员账户，跳转到adminView页面**/
              this.$router.push("/adminView")
            }
          } else {
            this.errorTip = true;
          }
        });
      },
      logOut() {
        axios.post("/users/logout").then((response) => {
          let res = response.data;
          if (res.status == "0") {
            /*说明登出成功*/
            // this.nickName = "";
            this.$notify({
              title: '警告',
              message: '注意您已退出登录',
              type: 'warning'
            });

            this.$store.commit("updateUserInfo",'');//登出，用户名改为空

          }
        })
      },
      /**获取用户数据**/
      getUsersInformation(){
        this.dialogTableVisible = true
        console.log("调用getUsersInformation，此方法用来获取顾客信息")
        axios.get("/users/information").then(response =>{
          let res = response.data;
          console.log(`请求进来了，res为${this.res}`)
          if(res.status == "0") {
            this.userData = res.result;
            console.log(`数据获取成功：${this.userData[0].createUserDate}${res.result[0].userName}`)
          }else {
            /*数据请求失败*/
            console.log(`数据获取失败`)
            this.userData = [];
          }
        })
      },
      getCartCount(){
        /*调用/getCartCount接口，通过then这种链式调用promise的结构来拿到数据*/
        axios.get("/users/getCartCount").then((response)=>{
          let res = response.data;

          this.$store.commit("initCartCount",res.result);
        })
      },


    }
  }
</script>
