<template>
    <div class="unity-content">
        <iframe id="unity-infame" ref="iframeDom" src="./unity3D/index.html" frameborder="0" scrolling="no" width="1920px"
            height="1080px" marginwidth="0" marginheight="0" allowtransparency="yes"></iframe>
        <div class="top-box">
            <div class="title-box">
                <img src="@/assets/images/logo.png" alt="">
                <img src="@/assets/images/title.png" alt="">
            </div>
            <ul class="tab-box">
                <li :class="{active:dayIndex==0}" @click="tabButton(0)">库房总览</li>
                <li :class="{active:dayIndex==1}" @click="tabButton(1)">能耗分析</li>
            </ul>
            <div class="right-box">
                <div class="time">{{ gettime }}</div>
                <div class="line"></div>
                <div class="full-screen" style="cursor: pointer;" @click="toggleFullScreen">{{fullScreenName}}</div>
                <div class="line"></div>
                <div class="sign-out" style="cursor: pointer;"   @click="logout">退出</div>
            </div>
        </div>
      <storeHouse  v-if="dayIndex == 0"/>
      <energyConsumption v-if="dayIndex == 1"/>
      <security  v-if="dayIndex == 2"/>
    </div>
</template>

<script>
     import storeHouse from './storeHouse/index'
     import energyConsumption from './energyConsumption/index.vue'
     import security from './security/index.vue'
    export default {
        components: {
            storeHouse,
            energyConsumption,
            security
        },
        data() {
            return {
              dayIndex: 0,
              gettime:'',
              fullScreenName:'全屏',
            }
        },
        mounted() {
          this.setTimes()
        },
      methods: {
        tabButton(index) {
            this.dayIndex = index
        },
        toggleFullScreen(){
          if(document.fullscreenElement){
            //退出全屏
            this.fullScreenName = '全屏';
            document.exitFullscreen()
          }else{
            //全屏
            this.fullScreenName = '退出全屏';
            document.documentElement.requestFullscreen();
          }
        },
        logout() {
          this.$confirm('确定注销并退出可视化大屏吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('LogOut').then(() => {
              location.href = '/login?redirect=%2Fvisual';
            })
          }).catch(() => {});
        },
        // 当前时间
        setTimes() {
          let _this = this;
          let yy = new Date().getFullYear();
          let mm = new Date().getMonth() + 1;
          let dd = new Date().getDate();
          // let hh = new Date().getHours();
          // let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
          // let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
          let week = new Date().getDay();
          let weeks = ["日","一","二","三","四","五","六"];
          let getWeek = "星期" + weeks[week];
          _this.gettime = yy + "年" + mm + "月" + dd + "日" +  " " + getWeek ;
          console.log(_this.gettime)
        }
        },
    }
</script>
<style scoped>
     ul,li,ol{list-style:none;outline: none;}
    .unity-content {
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    #unity-infame {
        /* transform: scale(0.5);
        transform-origin: 0; */
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
        z-index: 0;
        position: fixed;
        top: 0;
        left: 0;
        /* background: pink; */
    }

    .top-box {
        position: relative;
        z-index: 999;
        /*margin: 0 25px 25px;*/
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%,rgba(94, 99, 99, 0.3) 70%, rgba(94, 99, 99, 0) 100%);
        height: 130px;
        padding: 0 25px;
    }


    .title-box {
        display: flex;
        margin: 25px 0 0;
    }
     .title-box img{
       height: 42px;
     }

     .title-box img:first-child {
        margin-right: 20px;
    }

    .tab-box {
        display: flex;
        flex: 1;
        position: absolute;
        left: 50%;
        top: 20px;
        transform: translate(-50%, 0);
    }

    .tab-box li {
        width: 120px;
        height: 46px;
        line-height: 42px;
        font-weight: 500;
        color: #00C6B3;
        font-size: 16px;
        text-align: center;
        background: url(~@/assets/images/tab.png) no-repeat center;
        background-size: cover;
        margin: 0 10px;
        cursor: pointer;
        list-style: none;
    }

    .tab-box li.active {
        color: #fff;
        background: url(~@/assets/images/tab_active.png) no-repeat center;
    }

    .right-box {
        display: flex;
        height: 30px;
        line-height: 30px;
        margin-top: 25px;
        font-size: 16px;
        color: #fff;
    }

    .time {}

    .line {
        width: 1px;
        height: 14px;
        background: #C4FFF9;
        opacity: 0.5;
        margin: 8px 20px 0;
    }

    .full-screen {
        background: url(~@/assets/images/full_screen_icon.png) no-repeat left center;
        padding-left: 20px;
    }

    .sign-out {
        background: url(~@/assets/images/out_icon.png) no-repeat left center;
        padding-left: 20px;
    }



    .content-box {
        /* position: relative; */
        /* height: calc(100vh - 90px); */
    }
</style>
