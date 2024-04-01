<template>
    <div class="content-box">
        <el-tabs v-model="activeName">
            <el-tab-pane label="主控界面" name="first"><mainCtrl /></el-tab-pane>
<!--            <el-tab-pane label="出入操作" name="second"><inOutOperate /></el-tab-pane>-->
<!--            <el-tab-pane label="堆垛机预警" name="third"><warnStacker /></el-tab-pane>-->
<!--            <el-tab-pane label="AGV I/O" name="fourth"><agvIo /></el-tab-pane>-->
<!--            <el-tab-pane label="状态信息" name="five"><statusInfo /></el-tab-pane>-->
        </el-tabs>
    </div>
</template>

<script>
    import mainCtrl from './mainCtrl/index.vue'
    import inOutOperate from './inOutOperate/index.vue'
    import warnStacker from './warnStacker/index.vue'
    import agvIo from './agvIo/index.vue'
    import statusInfo from './statusInfo/index.vue'

    export default {
        components:{
            mainCtrl,
            inOutOperate,
            warnStacker,
            agvIo,
            statusInfo
            // warnAgv
        },
        data() {
            return {
                activeName: 'first',

            };
        },
        methods: {
        }
    };
</script>

<style scoped>
    .content-box {
        margin: 20px;
        padding: 20px;
        background: #fff;
        border-radius: 5px;
        /*min-height: 1000px;*/
    }

</style>
