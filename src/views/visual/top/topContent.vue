<template>
    <div class="top-content animate__animated animate__slideInDown">
        <div class="quantity-box" v-for="(item,index) in quantityList" :key="index">
            <div class="quantity-left"><img :src="item.img" alt=""></div>
            <div class="quantity-right">
                <div class="quantity-num">{{item.num}}</div>
                <div class="quantity-title">{{item.title}}</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                quantityList: [
                    {
                        img: require('../../../assets/images/warehousing.png'),
                        num: '123,000',
                        title: '今日入库量',
                    },
                    {
                        img: require('../../../assets/images/outbound.png'),
                        num: '123,000',
                        title: '今日出库量',
                    },
                    {
                        img: require('../../../assets/images/stock.png'),
                        num: '123,000',
                        title: '实则库存数',
                    },
                ]
            }
        },
        methods: {

        },
    }
</script>
<style scoped>
    .top-content {
        width: 780px;
        position: absolute;
        top: 90px;
        left: 50%;
        margin-left: -390px;
        height: 100px;
        display: flex;

    }

    .quantity-box {
        width: 240px;
        height: 100px;
        background: rgba(30, 34, 35, 0.6);
        border-radius: 20px;
        margin: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .quantity-box .quantity-right {
        margin-left: 10px;
    }

    .quantity-box .quantity-right .quantity-num {
        font-size: 24px;
        font-weight: 800;
        color: #00FFE7;
    }

    .quantity-box .quantity-right .quantity-title {
        font-size: 14px;
        font-weight: 400;
        color: #FEFFFF;
    }
</style>