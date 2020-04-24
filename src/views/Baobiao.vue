<template>
    <div>
        <nav-header></nav-header>
        <div class="Baobiao_title">
            <div class="Baobiao_title_content">
                <span>近一周办卡人数走势</span>
            </div>
        </div>

        <template>
            <ve-line :data="chartData" width="auto 800px"></ve-line>
        </template>
        <div class="Baobiao_title">
            <div class="Baobiao_title_content">
                <span>各年龄段会员占比</span>
            </div>
        </div>
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

    export default {
        data () {
            return {
                chartData: {
                    columns: ['日期', '访问用户', '办卡用户'],
                    rows: [
                        { '日期': '2018-05-22', '访问用户': 32371, '办卡用户': 19810 },
                        { '日期': '2018-05-23', '访问用户': 12328, '办卡用户': 4398 },

                        { '日期': '2018-05-23', '访问用户': 12328, '办卡用户': 4398 },
                        { '日期': '2018-05-23', '访问用户': 12328, '办卡用户': 4398 },
                        { '日期': '2018-05-24', '访问用户': 92381, '办卡用户': 52910 },
                        { '日期': '2018-08-23', '访问用户': 12328, '办卡用户': 6650 },
                    ]
                },
                chartData2: {
                    columns: ['日期', '访问用户'],
                    rows: [
                        { '日期': '1/1', '访问用户': 1393 },
                        { '日期': '1/2', '访问用户': 3530 },
                        { '日期': '1/3', '访问用户': 2923 },
                        { '日期': '1/4', '访问用户': 1723 },
                        { '日期': '1/5', '访问用户': 3792 },
                        { '日期': '1/6', '访问用户': 4593 }
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
                }
            }
            },

        components:{
            NavHeader,
            NavFooter,

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