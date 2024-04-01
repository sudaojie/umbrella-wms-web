<template>
  <div class="temperature-humidity-container">
    <div class="title-style">爆闪灯系统</div>
    <div class="center-box">
      <div class="search-box"></div>
      <div class="top-button">
        <label class="labelButton"></label><label/>
        <el-button size="small" type="primary" @click="openAlarm">启动</el-button>
        <el-button size="small" type="warning" @click="closeAlarm">停止</el-button>
      </div>
      <div class="card-warp">
        <div class="card-list" v-for="(item,index) in cardList" :key="index">
<!--          <el-checkbox-group v-model="item.choose" @change="change(item)">-->
<!--            <el-checkbox></el-checkbox>-->
<!--          </el-checkbox-group>-->
          <div class="card-list-left">
            <img src="@/assets/freshAir/bsd_img.png" alt="">
          </div>
          <div class="card-list-right">
              <div class="info-box">
                <div class="temperature-box">
                  <div class="temperature">
                    <span>温度</span>
                    <span>{{item.templature}}<i>°C</i></span>
                  </div>
                  <div class="icon-box"><img src="@/assets/freshAir/temperature_icon.png" alt=""></div>
                  <div class="info-title">温度设置</div>
                  <div class="block">
                    <el-slider
                      v-model="item.temperatureArrange"
                      range
                      :max="item.tMax"
                      :marks="item.tMarks">
                    </el-slider>
                  </div>
                </div>
                <div class="humidity-box">
                  <div class="humidity">
                    <span>湿度</span>
                    <span>{{item.humidity}}<i>%rh</i></span>
                  </div>
                  <div class="icon-box"><img src="@/assets/freshAir/humidity_icon.png" alt=""></div>
                  <div class="info-title">湿度设置</div>
                  <div class="block">
                    <el-slider
                      v-model="item.humidityArrange"
                      range
                      :max="item.hMax"
                      :marks="item.hMarks">
                    </el-slider>
                  </div>
                </div>

              </div>
              <el-button size="mini" type="primary" @click="saveData(item)">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryExplosiveFlashList, saveExplosiveFlash } from '@/api/wcs/freshAirDetailInfo'
import { closeAlarmLight, openAlarmLight } from '@/api/wcs/alarmLight'

  export default {
    name: "temperatureHumidityCheck",
    data() {
      return {
        cardList: []
      };
    },
    created() {
      this.getList();
    },
    methods: {
      openAlarm(){
        openAlarmLight().then(res => {
          this.$modal.msgSuccess("开启成功");
        })
      },
      closeAlarm(){
        closeAlarmLight().then(res => {
          this.$modal.msgSuccess("关闭成功");
        })
      },
      getList() {
        queryExplosiveFlashList().then(response => {
          if (response) {
            this.cardList = response.data
            this.cardList.forEach(item => {
              if (item.templatureLow && item.templatureHigh) {
                item.temperatureArrange = []
                item.temperatureArrange.push(Number(item.templatureLow))
                item.temperatureArrange.push(Number(item.templatureHigh))
              }
              if (item.humidityLow && item.humidityHigh) {
                item.humidityArrange = []
                item.humidityArrange.push(Number(item.humidityLow))
                item.humidityArrange.push(Number(item.humidityHigh))
              }
              item.hMax = 100
              item.hMarks = {
                0: '0',
                100: '100'
              }
              item.tMax = 100
              item.tMarks = {
                0: '0',
                100: '100'
              }
              item.switchStatus = item.switchStatus === 1
              item.choose = false
            })
          }
        })
      },
      saveData(item) {
        if (item.temperatureArrange && item.temperatureArrange.length === 2) {
          item.templatureLow = item.temperatureArrange[0]
          item.templatureHigh = item.temperatureArrange[1]
        }
        if (item.humidityArrange && item.humidityArrange.length === 2) {
          item.humidityLow = item.humidityArrange[0]
          item.humidityHigh = item.humidityArrange[1]
        }
        let object = {
          templatureLow: item.templatureLow,
          templatureHigh: item.templatureHigh,
          humidityLow: item.humidityLow,
          humidityHigh: item.humidityHigh
        }
        saveExplosiveFlash(object).then(response => {
          if (response) {
            if (response.data) {
              this.$message.success("保存成功")
              this.getList()
            }
          }
        })
      },
    }
  };
</script>

<style scoped>
.temperature-humidity-container {
  margin: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  min-height: 1000px;
}

.title-style {
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

::v-deep .search-box .el-icon-search {
  color: #419fff;
}

.top-button {
  margin: 10px;
}

.top-button .labelButton {
  margin-right: 30px;
}

::v-deep .top-button .el-button--small {
  padding: 5px 12px;
}

.center-box {
  background: #f5f7fa;
  border-radius: 10px;
  min-height: 300px;
  padding: 10px;
  overflow: hidden;
}

.card-warp {

}

.card-warp .card-list {
  position: relative;
  width: 48%;
  height: 242px;
  margin: 1%;
  background: #fff;
  box-shadow: 0px 10px 20px 0px rgba(0, 38, 66, 0.1);
  border-radius: 5px;
  float: left;
  display: flex;
}

.el-checkbox-group {
  position: absolute;
  left: 20px;
  top: 20px;
}


.card-warp .card-list .card-list-left {
  width: 30%;
  height: 100%;
  background-image: -moz-linear-gradient(180deg, rgb(239, 255, 241) 0%, rgb(219, 244, 222) 100%);
  background-image: -webkit-linear-gradient(180deg, rgb(239, 255, 241) 0%, rgb(219, 244, 222) 100%);
  background-image: linear-gradient(180deg, rgb(239, 255, 241) 0%, rgb(235 235 235) 100%);
  position: relative;
}

.card-warp .card-list .card-list-left img {
  position: absolute;
  width: 70px;
  height: 84px;
  left: 50%;
  top: 50%;
  margin-left: -42px;
  margin-top: -35px;
  display: block;
}

.card-warp .card-list .card-list-right {
  position: relative;
  width: 70%;
  padding: 20px;
}

.card-warp .card-list .card-list-right .card-name {
  font-size: 20px;
  color: #333
}

.card-warp .card-list .card-list-right .switch-box {
  position: absolute;
  top: 20px;
  right: 20px;
}

.card-warp .card-list .card-list-right .card-system {
  font-size: 14px;
  margin: 15px 0;
}

.card-warp .card-list .card-list-right .card-system span:first-child {
  color: #333;
  border-right: 1px solid #333;
  padding-right: 10px;
  margin-right: 10px;
}

.card-warp .card-list .card-list-right .el-button {
  float: right;
  margin-top: 10px;
}

.card-warp .card-list .card-list-right .normal {
  color: #24a432;
}

.card-warp .card-list .card-list-right .abnormal {
  color: pink;
}

.info-box {
  display: flex;
  justify-content: space-between;
}

.info-box .temperature-box,
.info-box .humidity-box {
  width: 48%;
  border-radius: 5px;
  border: 1px solid #dde1e9;
  background: #f5f7fa;
  padding: 20px;
}

.info-box .temperature-box .temperature,
.info-box .humidity-box .humidity {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #000;
  font-weight: bold;
}

.info-box .temperature-box .temperature span i,
.info-box .humidity-box .humidity span i {
  font-size: 14px;
}

.info-box .icon-box {
  margin: 10px 0;
}

.info-box .info-title {
  font-size: 14px;
  color: #666;
}

::v-deep .el-switch {
  height: 25px;
  line-height: 25px;
}

::v-deep .el-switch__core {
  height: 25px;
  border: 1px solid #dde1e8 !important;
  border-radius: 12px;
  width: 60px !important;
}

::v-deep .el-switch__core:after {
  width: 20px;
  height: 20px;
  background: #ffffff;
}

::v-deep .el-switch.is-checked .el-switch__core:after {
  box-shadow: 0px 3px 6px 0px rgba(64, 158, 255, 0.3);
  background: #409eff;
  width: 20px;
  height: 20px;
}

::v-deep .el-switch.is-checked .el-switch__core::after {
  margin-left: -22px;
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: #dde1e8;
  background: #f5f7fa;
}
</style>
