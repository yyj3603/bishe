<template>
    <div class="draser">
        <el-button @click="drawer = true" class="color" type="primary" style="{width: 120px;height: auto; position: fixed;}">
            点我打开
        </el-button>
        <el-drawer
                title="我是标题,已被:with-header属性设置取消"
                :visible.sync="drawer"
                :direction="direction"
                :with-header="false"
                :before-close="handleClose">
            <span>我来啦!</span>
            <ul>
                <li>购买器械</li>
                <li>会员管理</li>
                <li>报表</li>
            </ul>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                drawer: false,
                direction: 'ltr',/*默认打开方向*/

            };
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(() => {
                        done();
                    })
                    .catch(() => {});
            }
        }
    };
</script>

<style >
    .color{
        background-color: #333333;
    }
    .li{
        background-color: #7a7775;
        width: 100%;
        height: 20%;
    }
    .draser el-drawer__wrapper .el-drawer{
        width: 50%;
    }
</style>