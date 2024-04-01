<template>
    <div class="bottom-content animate__animated animate__slideInUp">
        <i class="btn-icon prev-btn el-icon-caret-left" @click="prePage()"></i>
        <ul class="switch-box">
            <li :class="isActive == index ?'activebg':''" v-for="(item,index) of numList" :key="item.value"
                @click="changeClass(index,item)">{{item.num}}</li>
        </ul>
        <i class="btn-icon next-btn el-icon-caret-right" @click="nextPage()"></i>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                isActive: 0, //已选择的页，默认开始时为第一页
                numList: [
                    {
                        num: '一排',
                        value:101
                    },
                    {
                        num: '二排',
                        value:102
                    },
                    {
                        num: '三排',
                        value:103
                    },
                    {
                        num: '四排',
                        value:104
                    },
                    {
                        num: '五排',
                        value:105
                    },
                    {
                        num: '六排',
                        value:106
                    },
                    {
                      num: '七排',
                      value:107
                    },
                  {
                    num: '八排',
                    value:108
                  },
                  {
                    num: '九排',
                    value:109
                  },
                  {
                    num: '十排',
                    value:110
                  },
                  {
                    num: '十一排',
                    value:111
                  },
                  {
                    num: '十二排',
                    value:112
                  }
                ]
            }
        },
        methods: {
            changeClass(index,row) {
                this.isActive = index;
                this.$parent.$parent.$refs.iframeDom.contentWindow.send(row.value);
            },
            //上一页
            prePage() {
                //如果已经在第一页，点击按钮页码不变并弹出提示
                if (this.isActive == 0) {
                    this.isActive;
                    //否则当前页数-1
                } else {
                    this.isActive--;
                }
            },
            //下一页
            nextPage() {
                //如果已经在最后一页，点击按钮页码不变并弹出提示
                if (this.isActive == this.numList.length - 1) {
                    this.isActive;
                } else {
                    //否则当前页数+1
                    this.isActive++;
                }
            }
        }
    }
</script>
<style scoped>
    .bottom-content {
        width: 720px;
        height: 40px;
        position: absolute;
        bottom: 8%;
        left: 50%;
        margin-left: -360px;
        background: rgba(30, 34, 35, 0.6);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .bottom-content ul{
      padding: 0;
    }
    .switch-box {
        line-height: 40px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .switch-box li {
        width: 60px;
        text-align: center;
        color: #ABFFF7;
        font-size: 14px;
        cursor: pointer;
        list-style: none;
    }

    .bottom-content .btn-icon {
        /* color: #00C6B3; */
        color: #8DC2BD;
        cursor: pointer;
    }

    .bottom-content .btn-icon:hover {
        color: #00C6B3;
    }

    .switch-box li.activebg {
        background: url(~@/assets/images/active_bg.png) no-repeat left center;
    }
</style>
