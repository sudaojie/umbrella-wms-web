<template>
  <div class="content-box">
    <storeHouseLeft />
    <storeHouseRight />
    <operation />
    <bottomContent />
    <shelfDetails v-show="shelfDetailsShow" @fatherMethod="initBtn" ref="dialog" />
    <instrumentDetails v-show="instrumentDetailsShow" @fatherMethod="instrumentInitBtn" ref="instrumentDialog" />
  </div>
</template>

<script>
import { allLocationList } from '@/api/visual/alllLocationList'
import storeHouseLeft from './storeHouseLeft/index'
import storeHouseRight from './storeHouseRight/index'
import bottomContent from './bottom/bottomContent'
import operation from './operation/index'
import shelfDetails from './shelfDetails/index.vue'
import instrumentDetails from './instrumentDetails/index.vue'
export default {
  components:{
    storeHouseLeft,
    storeHouseRight,
    bottomContent,
    operation,
    shelfDetails,
    instrumentDetails,
  },
  data() {
   return{
     storeHouse:true,
     energyConsumption:false,
     security:false,
     shelfDetailsShow: false,
     bottomShow:true,
     instrumentDetailsShow:false,
     // timer:null
   }
  },
  mounted() {
    // unity消息监听
    // window.addEventListener('message', this.unityWatch)
    // window.addEventListener('message', this.appearanceList)

    window.addEventListener("message",this.allJson)
    window.addEventListener('message', this.arrangeList)
    this.$once('hook:beforeDestroy',() =>{
      window.removeEventListener('message', this.allJson)
      window.removeEventListener('message', this.arrangeList)
    })

  },
  updated(){
    window.removeEventListener('message',this.allJson)
  },
  methods: {
    // unityWatch(e){
    //   console.log("unityWatch方法调用",e.data)
    // },
    arrangeList(e) {
      if(e.data.state == 'ok'){
        let trayModel = e.data.id.slice(0, 1)
        if (trayModel === '0') {
          let dataId = e.data.id.slice(7, 8)
          if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(dataId)) {
            let goodName = e.data.id.slice(0, 11)
            if (goodName) {
              this.$refs.dialog.popupDetails(goodName)
              this.shelfDetailsShow = true;
            } else {
              return;
            }
          } else {
            this.shelfDetailsShow = false;
          }
        } else if (trayModel === 'T') {
          let dataId = e.data.id.slice(6, 7)
          if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(dataId)) {
            let goodName = e.data.id.slice(2, 13)
            if (goodName) {
              this.$refs.dialog.popupDetails(goodName)
              this.shelfDetailsShow = true;
            } else {
              return;
            }
          } else {
            this.shelfDetailsShow = false;
          }
        }
      }else {
        return false;
      }
    },
    initBtn(){
      this.shelfDetailsShow = false;
    },
    allJson(){
      allLocationList().then(res => {
        if(res){
          this.$parent.$refs.iframeDom.contentWindow.sendAll(res.data)
        }
      })
    },
    // 烟感
    instrumentInitBtn(){
      this.instrumentDetailsShow = false;
    },
    instrumentList(e){
      if(e.data.state == "ok"){
        let instrumentSensorId = e.data.id.slice(0, -1)
        let instrumentSensorNum = e.data.id.slice(0, 2)
        if(["YW","PW"].includes(instrumentSensorNum)){
          if (instrumentSensorId) {
            this.$refs.instrumentDialog.popupDetails(instrumentSensorId)
            this.instrumentDetailsShow = true;
          } else {
            this.instrumentDetailsShow = false;
            return;
          }
        }
      }else {
        return;
      }
    },
  },
}
</script>
