<template>
  <div class="shelf-box">
    <div class="shelf-top">
      <div>#{{instrumentSensor}}</div>
      <div class="shelf-button el-icon-close" @click="instrumentShelfButton()"></div>
    </div>
    <div class="shelf-details">
      <div class="shelf-list" v-for="(item,index) in instrumentList" :key="index">
        <el-descriptions :title="item.title" :column="1">
          <el-descriptions-item label="设备名称">{{item.deviceName}}</el-descriptions-item>
          <el-descriptions-item label="设备类型">{{item.deviceType == 4? "烟雾检测传感器": item.deviceType == 3? "温湿度传感器": item.deviceType == 5? "照明传感器":"新风"}}</el-descriptions-item>
          <el-descriptions-item label="设备区域">{{item.deviceArea == 0? "存储区": item.deviceArea == 1? "晾晒区": item.deviceArea == 2? "理货区":""}}</el-descriptions-item>
          <el-descriptions-item label="地址码">{{item.deviceAddress}}</el-descriptions-item>
<!--          烟雾检测传感器-->
          <el-descriptions-item label="烟雾状态"  v-if="item.deviceType == 4">{{item.smokeFlag == 0? "无烟": "有烟"}}</el-descriptions-item>
<!--          温湿度传感器-->
          <el-descriptions-item label="湿度" v-if="item.deviceType == 3">{{item.humidity}}%rh</el-descriptions-item>
          <el-descriptions-item label="温度" v-if="item.deviceType == 3">{{item.templature}}°C</el-descriptions-item>
<!--          新风系统-->
          <el-descriptions-item label="当前状态" v-if="item.deviceType == 7">{{item.lightStatus == 0? "关闭": "开启"}}</el-descriptions-item>
<!--          照明系统-->
          <el-descriptions-item label="当前状态" v-if="item.deviceType == 5">{{item.lightStatus == 0? "关闭": "开启"}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import { getInstrumentInformationByDeviceNo } from '@/api/visual/alllLocationList'
export default {
  data() {
    return {
      shelfDetailsShow: false,
      instrumentSensor:'',
      instrumentList: []
    }
  },
  mounted() {
  },
  methods: {
    instrumentShelfButton() {
      this.$emit('fatherMethod');
      // this.$parent.$parent.$refs.iframeDom.contentWindow.send(201)
    },
    popupDetails(instrumentSensorId){
      this.instrumentList = []
      this.instrumentSensor = ''
      let instrumentId = 'light01'
      getInstrumentInformationByDeviceNo(instrumentId).then(res => {
        this.instrumentList = []
        this.instrumentSensor = res.data.deviceNo
        let instrumentInfo = {
          deviceName: res.data.deviceName,
          deviceType: res.data.deviceType,
          deviceArea: res.data.deviceArea,
          deviceAddress: res.data.deviceAddress,
          // 烟雾传感器
          smokeFlag: res.data.smokeFlag,
          // 温湿度传感器
          humidity: res.data.humidity,
          templature: res.data.templature,
          // 新风
          freshAirStatus: res.data.freshAirStatus,
          // 照明
          lightStatus: res.data.lightStatus,
        }
        this.instrumentList.push(instrumentInfo)
      })
    },
  },
}
</script>

<style scoped>
.shelf-box {
  width: 20%;
  height: 300px;
  background: rgba(30, 34, 35, 0.7);
  border-radius: 20px;
  position: absolute;
  top: 20%;
  left: 50%;
  margin-left: -10%;
  overflow: hidden;
  /* display: none; */
}

.shelf-top {
  background: #5ecdbd;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.shelf-button {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  background: #ebf2f7;
  text-align: center;
  cursor: pointer;
}

.shelf-button:hover {
  background: #e5ebef;
}

.shelf-details {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 475px;
  overflow: auto;
}

.shelf-list {
  margin: 20px;
  /*width: 21.5%;*/
}

::v-deep .el-descriptions__header {
  color: #1ed6c4;
  margin-bottom: 0;
  line-height: 30px;
}

::v-deep .el-descriptions__title {
  font-size: 20px;
}

::v-deep .el-descriptions__body {
  background: transparent;
}

::v-deep .el-descriptions-item__label {
  color: #DCDCDC;
  font-size: 16px;
  width: 70px;
  justify-content: end;
}

::v-deep .el-descriptions-item__content {
  color: #fff;
  font-size: 18px;
}

::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
  padding-bottom: 0;
}
</style>
