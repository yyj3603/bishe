import Vue from 'vue'
import Router from 'vue-router'

import CustomersList from '../views/CustomersList'
import GoodsList from './../views/GoodsList'
import Cart from './../views/Cart'
import Address from './../views/Address'
import OrderConfirm from './../views/OrderConfirm'
import OrderSuccess from './../views/OrderSuccess'
import AdminView from './../views/AdminView'
import ManageGoods from '../views/ManageGoods'
import ManageCoachs from '../views/ManageCoachs'
import SubjectsList from '../views/SubjectsList'
import AboutUs from './../views/AboutUs'
import BaoBiao from './../views/Baobiao'
/* import Image from '@/views/Image'
import Title from '@/views/Title'
import Cart from '@/views/Cart' */

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/adminView',
      name:'AdminView',/*管理员主页*/
      component:AdminView,

    },
    {
      path: '/baoBiao',
      name:'BaoBiao',/*报表页面*/
      component:BaoBiao
    },
    {
      path:'/subjectsList',
      name:'SubjectsList',/*课程列表页面*/
      component: SubjectsList
    },
    {
      path:'/aboutUs',
      name:'AboutUs',/*关于我们页面*/
      component: AboutUs
    },
    {
      path: '/manageGoods',
      name:'ManageGoods',/*管理员才能访问的商品管理界面*/
      component:ManageGoods
    },
    {
      path: '/manageCoachs',
      name:'ManageCoachs',/*管理员才能访问的私人教练管理界面*/
      component:ManageCoachs
    },

    {
      path: '/',
      name:'GoodsList',/*商品列表*/
      component:GoodsList
    },
    // {
    //   path: '/goods',
    //   name: 'GoodsList',
    //   component: GoodsList
    // },
    {
      path:'/customersList',
      name:'CustomersList',/*用户列表*/
      component: CustomersList,
    },
    {
      path: '/cart',
      name:'Cart',
      component:Cart
    },
    {
      path:'/address',
      name:'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name:'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name:'OrderSuccess',
      component: OrderSuccess
    }

  ]
})
