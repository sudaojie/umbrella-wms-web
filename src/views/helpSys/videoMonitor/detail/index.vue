<template>
  <div class="video-monitor-detail-container">
    <div class="video-title">视频监控</div>
    <div class="video-info">
      <div class="video-info-left">
        <div class="angle-box">
          <div class="video-title">角度调节</div>
          <div class="angle-button">
            <div class="angle-triangle angle-left" @mousedown="adjustDirection('left')" @mouseleave="stopAdjust('stop')" @mouseup="stopAdjust('stop')"></div>
            <div class="angle-triangle angle-top" @mousedown="adjustDirection('up')"  @mouseleave="stopAdjust('stop')" @mouseup="stopAdjust('stop')"></div>
            <div class="angle-center-button angle-center" @click="pausePlay()"></div>
            <div class="angle-triangle angle-right" @mousedown="adjustDirection('right')"  @mouseleave="stopAdjust('stop')" @mouseup="stopAdjust('stop')"></div>
            <div class="angle-triangle angle-bottom" @mousedown="adjustDirection('down')" @mouseleave="stopAdjust('stop')"  @mouseup="stopAdjust('stop')"></div>
          </div>
        </div>
        <div class="device-list">
          <div class="video-title">设备列表</div>
          <div class="device-list-box">
            <div class="device-name">理货区</div>
            <div class="device-video">
              <div class="device-video-info" v-for="item in tallyVideoList">
                <div class="camera-img"><img src="@/assets/videoImages/camera_img.png" alt=""></div>
                <div class="device-state" :class="item.enableStatus==='0'?'online-bg':'offline-bg'">
                  <span v-if="item.enableStatus==='0'">在线</span>
                  <span v-if="item.enableStatus==='1'">离线</span>
                </div>
                <el-tooltip :content="item.deviceName" placement="top">
                <div class="device-model">{{item.deviceName}}</div>
                </el-tooltip>
                <div v-if="item.enableStatus==='0'" class="device-button" @click="targetDetail(item.id)"><img src="@/assets/videoImages/broadcast_button.png" alt=""></div>
              </div>
            </div>
          </div>
          <div class="device-list-box">
            <div class="device-name">晾晒区</div>
            <div class="device-video">
              <div class="device-video-info" v-for="item in airVideoList">
                <div class="camera-img"><img src="@/assets/videoImages/camera_img.png" alt=""></div>
                <div class="device-state" :class="item.enableStatus==='0'?'online-bg':'offline-bg'">
                  <span v-if="item.enableStatus==='0'">在线</span>
                  <span v-if="item.enableStatus==='1'">离线</span>
                </div>
                <el-tooltip :content="item.deviceName" placement="top">
                <div class="device-model">{{item.deviceName}}</div>
                </el-tooltip>
                <div v-if="item.enableStatus==='0'" class="device-button" @click="targetDetail(item.id)"><img src="@/assets/videoImages/broadcast_button.png" alt=""></div>
              </div>
            </div>
          </div>
          <div class="device-list-box">
            <div class="device-name">存储区</div>
            <div class="device-video">
              <div class="device-video-info" v-for="item in storageVideoList">
                <div class="camera-img"><img src="@/assets/videoImages/camera_img.png" alt=""></div>
                <div class="device-state" :class="item.enableStatus==='0'?'online-bg':'offline-bg'">
                  <span v-if="item.enableStatus==='0'">在线</span>
                  <span v-if="item.enableStatus==='1'">离线</span>
                </div>
                <el-tooltip :content="item.deviceName" placement="top">
                <div class="device-model">{{item.deviceName}}</div>
                </el-tooltip>
                <div v-if="item.enableStatus==='0'" class="device-button" @click="targetDetail(item.id)"><img src="@/assets/videoImages/broadcast_button.png" alt=""></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="video-info-right">
        <div class="video-title">摄像头信息</div>
        <div class="detailed-info" v-for="item in detailedInfo" :key="item.deviceName">
          <div class="detailed-img"><img src="@/assets/videoImages/camera_img.png" alt=""></div>
          <div class="detailed-line"><span>名称：</span><span>{{item.deviceName}}</span></div>
          <div class="detailed-line"><span>IP地址：</span><span>{{item.deviceIp}}</span></div>
          <div class="detailed-line"><span>端口：</span><span>{{item.devicePort}}</span></div>
          <div class="detailed-line">
            <span>状态：</span>
            <span v-if="item.enableStatus==='0'" class="on-line">在线</span>
            <span v-if="item.enableStatus==='1'" class="off-line">离线</span></div>
        </div>
        <div class="video-box">
          <sup-video-player
            :split="6"
            ref="supPlayer"
            :idx="id"
          >
          </sup-video-player>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import SupVideoPlayer from '../videoPlayer/SupVideoPlayer'

  import {
    getCameraInfoById,
    getCameraListByType,
    startPlay,
    adjustCameraDirection,
    getCameraListGroup
  } from '@/api/wcs/deviceBaseInfo'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'videoMonitorDetail',
    components: {
      SupVideoPlayer
    },
    data() {
      return {
        id: '',
        src: '',
        tallyVideoList: [],
        airVideoList: [],
        storageVideoList: [],
        detailedInfo: [
          {
            name: '摄像头1',
            ip: '192.168.0.1',
            port: '8080',
            state: '0'
          }
        ],
        timer: null
      }
    },
    created() {
      this.id = this.$route.query.id
      console.log(this.id)
      this.init()
      this.startPlay()
      this.getCameraListGroup()
    },
    methods: {
      targetDetail(id) {
        this.id = id
        this.init()
        this.startPlay()
      },
      getCameraListGroup() {
        /**
         * 获取摄像头分组列表
         */
        getCameraListGroup().then(response => {
          if (response.data) {
            this.tallyVideoList = response.data.tally
            this.airVideoList = response.data.dryOut
            this.storageVideoList = response.data.storage
          }
        })
      },
      pausePlay() {
        if (this.$refs.supPlayer) {
          console.log(this.$refs.supPlayer)
          this.$refs.supPlayer.pause()
        }
      },
      stopAdjust(command) {
        if (command === "stop") {
          let id = this.id;
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log("11111-----" + command)
            adjustCameraDirection(id,command).then(response => {})
          }
        }
      },
      adjustDirection(command) {
          let id = this.id;
          this.timer = setInterval(function () {
            /**
             * 调整摄像头方向
             */
            console.log("22222-----"+command)
            adjustCameraDirection(id,command).then(response => {})
          }, 500);
      },
      init() {
        getCameraInfoById(this.id).then(response => {
          this.detailedInfo = []
          this.detailedInfo.push(response.data)
        })
      },
      startPlay() {
        startPlay(this.id).then(response => {
          let arr = response.data
          if (arr) {
            this.src = arr[0].wsFlv
            // this.src = "https://flvplayer.js.org/assets/video/weathering-with-you.flv"
            this.$refs.supPlayer.play(this.src, arr)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .video-monitor-detail-container {
    margin: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    min-height: 1000px;
  }

  .video-title {

  }

  .video-info {
    display: flex;
    margin-top: 10px;
  }

  .video-info .video-info-left {
    width: 400px;
  }

  .video-info .video-info-left .angle-box {
    height: 355px;
    border-radius: 10px;
    background: #f5f7fa;
    padding: 20px;
    margin-bottom: 20px;
  }

  .video-info .video-info-left .angle-box .angle-button {
    background: url("~@/assets/videoImages/angle_bg.png") no-repeat center;
    height: 280px;
    margin-top: 20px;
    position: relative;
  }

  .angle-button .angle-center-button {
    background: url("~@/assets/videoImages/broadcast.png") no-repeat center;
    width: 25px;
    height: 31px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .angle-button .angle-triangle {
    background: url("~@/assets/videoImages/triangle_icon.png") no-repeat center;
    width: 28px;
    height: 18px;
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .angle-button .angle-left {
    transform: rotate(-90deg);
    margin-top: -9px;
    margin-left: -95px;
  }

  .angle-button .angle-top {
    margin-top: -85px;
    margin-left: -14px;
  }

  .angle-button .angle-right {
    transform: rotate(90deg);
    margin-top: -9px;
    margin-left: 64px;
  }

  .angle-button .angle-bottom {
    transform: rotate(-180deg);
    margin-top: 70px;
    margin-left: -14px;
  }

  .video-info .video-info-left .device-list {
    min-height: 355px;
    border-radius: 10px;
    background: #f5f7fa;
    padding-bottom: 20px;
  }

  .device-list .video-title {
    padding: 20px;
  }

  .device-list .device-list-box {

  }

  .device-list .device-list-box .device-name {
    padding: 0 20px;
  }

  .device-list .device-list-box .device-video {
    display: flex;
    padding: 0 10px;
  }

  .device-list .device-list-box .device-video .device-video-info {
    width: 46%;
    margin: 2%;
    height: 125px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #e1e5eb;
    position: relative;
  }

  .device-video-info .camera-img {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .device-video-info .device-state {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 56px;
    height: 25px;
    line-height: 25px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
  }

  .device-video-info .device-state::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .online-bg {
    background: #eaffec;
    color: #27c436;
  }

  .online-bg::before {
    background: #27c436;
  }

  .offline-bg {
    background: #ffeaea;
    color: #ff4545;
  }

  .offline-bg::before {
    background: #ff4545;
  }

  .device-video-info .device-model {
    position: absolute;
    left: 20px;
    bottom: 10px;
  }

  .device-video-info .device-button {
    position: absolute;
    right: 20px;
    bottom: 10px;
    width: 21px;
    height: 21px;
    cursor: pointer;
  }

  .device-video-info .device-button img {
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .video-info-right {
    flex: 1;
    background: #f5f7fa;
    margin-left: 20px;
    border-radius: 10px;
    padding: 20px;
  }

  .video-info-right .detailed-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 88px;
    line-height: 88px;
    font-size: 14px;
    color: #333;
    font-weight: bold;
    background: #fff;
    border: 1px solid #e1e5eb;
    border-radius: 5px;
    margin-top: 20px;
  }

  .video-info-right .detailed-info .detailed-img img {
    margin-top: 35px;
  }

  .video-info-right .detailed-info .detailed-line {
    /*width: 20%;*/
  }

  .video-info-right .detailed-info .detailed-line::before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 30px;
    vertical-align: middle;
    background: #e1e5eb;
    margin-right: 30px;
  }

  .on-line {
    color: #28c236;
  }

  .off-line {
    color: #27c436;
  }

  .video-box {
    margin-top: 30px;
    height: 700px;
    border-radius: 5px;
    background: #000;
  }
</style>
