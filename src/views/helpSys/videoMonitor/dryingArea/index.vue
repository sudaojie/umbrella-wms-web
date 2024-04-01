<template>
  <div class="tally-box">
    <el-row class="tally-video" :gutter="20">
      <el-col :lg="12" :xl="6"  v-for="item in deviceInfoList" :key="item.name">
        <div class="tally-list">
          <div class="device-number"><i class="video-camera"></i>{{item.deviceNo}}</div>
          <div class="video-img" v-if="item.deviceImagePath"><img :src="processEnvPath + item.deviceImagePath" alt=""></div>
          <div class="no-signal-img" v-if="!item.deviceImagePath">
            <img src="@/assets/videoImages/no_signal.png" alt="">
            <span>无信号</span>
          </div>
          <div class="video-bottom">
            <div>{{item.deviceName}}</div>
            <div class="video-use">
              <span>{{item.createTime}}</span>
              <i class="el-icon-d-arrow-right" @click="targetDetail(item.id)"></i>
              <i class="el-icon-full-screen"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--    <div><button @click="targetDetail">详情</button></div>-->
  </div>
</template>

<script>

export default {
  props: {
    deviceInfoList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
    };
  },
  created() {

  },
  methods: {
    targetDetail(id){
      this.$tab.openPage("安防视频-监控详情", "/green/videoMonitorDetail",{id:id});
    }
  }
};
</script>

<style scoped>
.tally-box{
  background: #f5f7fa;
  border-radius: 10px;
  min-height: 300px;
}
.tally-video{
  /*display: flex;*/
  /*justify-content: flex-start;*/
  /*flex-wrap: wrap;*/
  margin: 0;
  padding: 20px;
}
.tally-video .tally-list{
  /*width: 23%;*/
  /*margin: 1%;*/
  height: 260px;
  background: #48637e;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}
.tally-video .tally-list .video-img{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
}
.tally-video .tally-list .video-img img{
  width: 100%;
  height: 100%;
  display: inline-block;
}
.tally-video .tally-list .no-signal-img{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  z-index: 9;
}
.tally-video .tally-list .no-signal-img span{
  display: block;
  font-size: 14px;
  color: #9fadbc;
  margin-top: 10px;
}

.tally-video .tally-list .device-number{
  line-height: 30px;
  color: #fff;
  margin-left: 10px;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}
.tally-video .tally-list .device-number .video-camera{
  background: url("~@/assets/videoImages/video_icon.png") no-repeat center;
  width: 20px;
  height: 12px;
  display: inline-block;
}
.tally-video .tally-list .device-number i{
  margin-right: 10px;
  cursor: pointer;
}
.tally-video .tally-list .video-bottom{
  width: 100%;
  padding: 0 10px;
  height: 30px;
  color: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(64, 158, 255,0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.video-use{

}
.video-use i{
  margin-left: 10px;
  cursor: pointer;
}
.video-use i.el-icon-d-arrow-right{
  font-weight: bold;
}
</style>
