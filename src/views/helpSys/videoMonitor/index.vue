<template>
  <div class="app-container video-container">
    <div class="video-title">视频监控</div>
    <div class="video-box">
      <el-tabs v-model="activeName" :tab-position="tabPosition" class="video-tab" @tab-click="handleClick">
        <el-tab-pane label="理货区" name="first"><tallyArea :deviceInfoList="deviceInfoList" /></el-tab-pane>
        <el-tab-pane label="存储区" name="second"><storageArea :deviceInfoList="deviceInfoList"/></el-tab-pane>
        <el-tab-pane label="晾晒区" name="third"><dryingArea :deviceInfoList="deviceInfoList"/></el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  import { getCameraListByType } from '@/api/wcs/deviceBaseInfo'
  import { getToken } from "@/utils/auth";
  import tallyArea from "./tallyArea/index";
  import storageArea from "./storageArea/index";
  import dryingArea from "./dryingArea/index";

  export default {
    name: "videoMonitor",
    components:{
      tallyArea,
      storageArea,
      dryingArea
    },
    data() {
      return {
        activeName:'first',
        tabPosition: 'left',
        deviceInfoList: []
      };
    },
    created() {
       this.init()
    },
    methods: {
      init() {
        //理货区
        getCameraListByType('2').then(response => {
          this.deviceInfoList = response.data
        })
      },
      targetDetail(){
        this.$tab.openPage("安防视频-监控详情", "/green/videoMonitorDetail");
      },
      handleClick(targetName, action) {
        let name  = targetName.paneName
        if (name) {
          if (name === 'first') {
            //理货区
            getCameraListByType('2').then(response => {
              this.deviceInfoList = response.data
            })
          }
          if (name === 'second') {
            //存储区
            getCameraListByType('0').then(response => {
              this.deviceInfoList = response.data
            })
          }
          if (name === 'third') {
            //晾晒区
            getCameraListByType('1').then(response => {
              this.deviceInfoList = response.data
            })
          }
        }
      }

    }
  };
</script>

<style scoped>
.video-container {
  margin: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  min-height: 1000px;
}
.video-box{
  /*display: flex;*/
}

.video-left {
  width: 100px;
  /*float: left;*/
  /*height: 880px;*/
}

.video-button {
  width: 83px;
  height: 30px;
  background: #F0F7FF;
  color: #666;
  border-radius: 3px;
  line-height: 30px;
  margin: 10px 0;
  text-align: center;
  cursor: pointer;
}

.active {
  background: #409EFF;
  color: #fff;
}
::v-deep .video-tab .el-tabs__item{
  width: 83px;
  height: 30px;
  background: #F0F7FF;
  color: #666;
  border-radius: 3px;
  line-height: 30px;
  margin: 10px 20px 10px 0;
  text-align: center;
  cursor: pointer;
}
::v-deep .video-tab .el-tabs__item.is-active{
  background: #409EFF;
  color: #fff;
}
::v-deep .el-tabs--left .el-tabs__header.is-left{
  margin-right: 20px;
}
::v-deep .video-tab .el-tabs__active-bar{
  background: transparent;
}
::v-deep .video-tab .el-tabs__nav-wrap::after{
  background-color: #DFE4ED;
  width: 1px;
}
::v-deep .el-tabs__nav{
  min-height: 100vh;
}
</style>
