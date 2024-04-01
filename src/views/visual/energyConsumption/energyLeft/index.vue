<template>
  <div class="left-content">
    <div class="frame-bg">
      <div class="energy-title">
        <div class="energy-title-name energy-title-one">用电情况</div>
        <div class="energy-title-tab">
          <span v-for="item in warehouseDayList"
                :key="item.id"
                :class="{active:warehouseIndex === item.id}"
                @click="warehouseTabIndex(item.id)">{{item.title}}</span>
        </div>
      </div>
      <div class="energy-name" v-if="warehouseIndex == 9" >本周用电量</div>
      <div class="energy-name" v-if="warehouseIndex == 3" >本月月用电量</div>
      <div class="energy-name" v-if="warehouseIndex == 4" >本年用电量</div>
      <div class="energy-num">{{warehouseList.powerConsumption}}kw</div>
      <div id="energy-line"></div>
      <div class="before-box">
        <div class="before-title" v-if="warehouseIndex == 9">上周用电量 {{ warehouseList.lastPowerConsumption }}kw</div>
        <div class="before-title" v-if="warehouseIndex == 3">上月用电量 {{ warehouseList.lastPowerConsumption }}kw</div>
        <div class="before-title" v-if="warehouseIndex == 4">去年用电量 {{ warehouseList.lastPowerConsumption }}kw</div>
        <div class="before-num" v-if="warehouseList.ratio == 'NaN'">0%
          <span :class="warehouseList.flag == 'up'?'up' : 'down'"></span>
        </div>
        <div class="before-num" v-else>{{ warehouseList.ratio}}%<span :class="warehouseList.flag == 'up'?'up' : 'down'"></span></div>
      </div>
    </div>
    <div class="frame-bg">
      <div class="energy-title">
        <div class="energy-title-name energy-title-one">能耗排名</div>
        <div class="energy-title-tab">
          <span v-for="item in energyDayList"
                :key="item.id"
                :class="{active:energyIndex === item.id}"
                @click="energyTabIndex(item.id)">{{item.title}}</span>
        </div>
      </div>
      <div id="rank-line"></div>
    </div>
    <div class="frame-bg">
      <div class="energy-title">
        <div class="energy-title-name energy-title-one">设备监控</div>
      </div>
      <div class="video-box">
        <div class="block">
          <el-carousel trigger="click" :autoplay="true" height="200px">
            <el-carousel-item v-for="item in videoList" :key="item.deviceName">
              <div class="video-list" v-for="(el,ind) in item" :key="ind">
                <div class="video-name">{{el.deviceName }}</div>
                <div class="video-center">
                  <div class="video-icon"><img src="~@/assets/images/x_icon.png" alt=""></div>
                  <div class="video-state">
                    <span>状态</span>
                    <span :class="el.enableStatus == 0 ?'blue-bg':'red-bg'"></span>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
<!--        <div class="video-list" v-for="item in videoList">-->
<!--          <div class="video-name">{{item.name}}</div>-->
<!--          <div class="video-center">-->
<!--            <div class="video-icon"><img src="~@/assets/images/x_icon.png" alt=""></div>-->
<!--            <div class="video-state">-->
<!--              <span>状态</span>-->
<!--              <span :class="item.state == 0 ?'blue-bg':'red-bg'"></span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>

import * as echarts from "echarts";
import {deviceMonitorList,electricityConsumptionStatistics,energyConsumptionRanking} from "@/api/visual/energyConsumption";
export default {
  data() {
    return{
      warehouseDayList: [
        { id: 9, title: '本周'},
        { id: 3, title: '本月'},
        { id: 4, title: '本年'}
      ],
      energyDayList: [
        { id: 2, title: '近七天'},
        { id: 5, title: '近15天'},
        { id: 3, title: '近1月'}
      ],
      energyIndex:2,
      warehouseIndex:9,
      warehouseList:{},
      videoList:[]
    }
  },
  mounted() {
    this.drawChart();
    this.energyRank()
    this.deviceApi()
    this.warehouse()
  },
  methods: {
    // 用电情况
    warehouse(){
      electricityConsumptionStatistics(this.warehouseIndex).then(res=>{
        this.warehouseList = {
          powerConsumption:Number(res.data.powerConsumption).toFixed(2),
          lastPowerConsumption:Number(res.data.lastPowerConsumption).toFixed(2),
          ratio:Number(res.data.ratio).toFixed(2),
          flag:res.data.flag
        }
        let xTime = []
        let ydata = []
        res.data.list.forEach(item => {
          // xTime.push(item.time)
          xTime.push(item.time ? item.time.substring(item.time.indexOf('-') + 1) : '')
          ydata.push(Number(item.num).toFixed(2))
        })
        this.drawChart(xTime,ydata)
      })
    },
    warehouseTabIndex(id){
      this.warehouseIndex = id
      this.warehouse()
    },
    drawChart(xTime,ydata) {
      let energyChart = echarts.init(document.getElementById("energy-line"));
      let option = {
        //你的代码
        //   grid: {
        //     top: '2%',
        //     left: '5%',
        //     right: '5%',
        //     bottom: '15%',
        //   },
        tooltip: {//提示框组件
          trigger: 'axis',//触发类型 柱状图
          axisPointer: { type: 'shadow',
            crossStyle: {
              color: '#fff'
            }
          }, //触发效果 移动上去 背景效果
        },
        xAxis: [
          {
            show: true,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgb(41,188,245)',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#eee',
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: xTime,
          },
        ],
        yAxis: [
          {
            show: true,
            interval: 150,//相差
            name: "",
            nameTextStyle: {
              color: "#fff",
              fontSize: 12,
              padding: [0, 60, 0, 0]
            },
            // minInterval: 1,
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#eee',
                fontSize: 12
              }
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '用电量',
            type: 'line',
            symbol: 'circle',
            smooth: true,
            lineStyle: {
              normal: {
                width: 2,
                color: '#f4d942', // 线条颜色
              },
            },
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#f4d942',//拐点颜色
                label: {
                  show: true, //开启显示
                  color: '#fff',
                  position: 'top', //在上方显示
                  formatter: function (res) {
                    if (res.value) {
                      return res.value
                    } else {
                      return 0
                    }
                  },
                },
              },
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [  // 渐变颜色
                  {
                    offset: 0,
                    color: 'rgba(253, 224, 65, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(253, 224, 65, 0.3)',
                  },
                ],
                global: false,
              },
            },
            data: ydata,
          }
        ]
      };
      energyChart.setOption(option);
    },

    energyTabIndex(id){
      this.energyIndex = id
      this.energyRank();
    },

    energyRank(){
      energyConsumptionRanking(this.energyIndex).then(res=>{
        let xData = []
        let yData = []
        res.data.forEach(item => {
          yData.push(item.name ? item.name.substring(0, item.name.indexOf('_')) : '');
          xData.push(Number(item.value).toFixed(2))
        })
        this.energyRankChart(xData,yData)
      })
    },
    // 能源排名
    energyRankChart(xData,yData){
      let rankChart = echarts.init(document.getElementById("rank-line"));
      let option = {
        tooltip: {
          trigger: 'item',
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '5%', //下边距,
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          min:0,
          max:1000,
          axisLabel: {
            //坐标轴字体颜色
            textStyle: {
              color: '#eee',
              fontSize: '12',
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            //y轴刻度线
            show: false
          },
          splitLine: {
            //网格
            show: true,
            lineStyle: {
              color: '#686d6d',
            }
          }
        },
        yAxis: {
          name:'单位：kW/h',
          nameLocation:'start',
          nameTextStyle:{
            color:"#e6fffd",
            fontSize: '12',
          },
          type: 'category',
          inverse: true,
          axisLabel: {
            //坐标轴字体颜色
            textStyle: {
              color: '#eee',
              fontSize: '12',
            }
          },
          axisLine: {
            lineStyle: {
              color: '#686d6d'
            }
          },
          axisTick: {
            //y轴刻度线
            show: false
          },
          splitLine: {
            //网格
            show: false
          },
          data: yData
        },
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '10px', //柱子宽度
            color: '#00ffe7',
            itemStyle: {
              barBorderRadius: [2, 2, 0, 0]
            },
            data: xData
          }
        ]
      };
      rankChart.setOption(option);
    },
    // 设备监控
    deviceApi(){
      deviceMonitorList().then(res=>{
        // this.videoList
        this.videoList = res.data
        let newDataList = []
        let current = 0
        if(this.videoList && this.videoList.length>0){
          for(let i = 0; i <= this.videoList.length - 1; i++){
            if(i % 4 !== 0 || i === 0 ){
              if(!newDataList[current]){
                newDataList.push([this.videoList[i]])
              }else{
                newDataList[current].push(this.videoList[i])
              }
            }else{
              current++
              newDataList.push([this.videoList[i]])
            }
          }
        }
        this.videoList = [...newDataList]
      })
    }

  },
}
</script>

<style scoped>
.left-content{
  position: absolute;
  width: 300px;
  height: calc(100vh - 90px);
  left: 10px;
  top: 110px;
}
.frame-bg{
  width: 100%;
  height: 270px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
  margin-bottom: 20px;
}
.energy-title{
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
}
.energy-title-name {
  background: url(~@/assets/images/frame.png) no-repeat 0px center;
  background-size: contain;
  color: #fff;
  font-size: 16px;
  padding: 20px 0 20px;
}
.energy-title-one{
  width: 122px;
}
.energy-title-name::after {
  content: '';
  display: inline-block;
  background: url(~@/assets/images/title_icon.png) no-repeat;
  margin-left: 10px;
  width: 32px;
  height: 10px;
}
.energy-title-tab{
  width: 118px;
  height: 23px;
  line-height: 25px;
  border: 1px solid #00c6b3;
  border-radius: 5px;
  color: #a3fff6;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 20px 0;
}
.energy-title-tab span {
  flex: 1 1 33.33%;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
/*.energy-title-tab span:first-child{*/
/*  color: #fff;*/
/*  background: #00c6b3;*/
/*}*/
.trend-title-tab span:hover{
  color: #fff;
  background: #00c6b3;
}
.active{
  color: #fff;
  background: #00c6b3;
}
.energy-name{
  font-size: 14px;
  color: #e6fffd;
  margin: 0 20px;
}
.energy-num{
  font-size: 24px;
  color: #fff;
  margin: 10px 20px;
}
#energy-line{
  width: 100%;
  height: 90px;
}
.before-box{
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
  font-size: 14px;
  color: #eee;
}
.before-box .before-num span.up{
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #ff4d4d;
  vertical-align: middle;
  margin-left: 5px;
}
.before-box .before-num span.down{
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #26cbb8;
  vertical-align: middle;
  margin-left: 5px;
}

#rank-line  {
  width: 100%;
  height: 190px;
}
.video-box{
  padding: 0 10px;
  overflow: hidden;
}
::v-deep .video-box .el-carousel__button{
  width: 20px;
}
::v-deep .video-box .el-carousel__indicator--horizontal{
  padding: 3px 4px;
}
.video-box .video-list{
  width: 44%;
  margin: 3%;
  height: 80px;
  border: 1px solid #00c6b3;
  border-radius: 5px;
  float: left;
  padding: 10px;
}
.video-box .video-list .video-name{
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;

}
.video-box .video-list .video-center{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.video-box .video-list .video-center .video-icon{
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background: #00c6b3;
  position: relative;
}
.video-box .video-list .video-center .video-icon img{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
/*.video-box .video-list .video-center .video-icon:nth-of-type(2){*/
/*  background: #d8b705;*/
/*}*/
.video-box .video-list .video-center .video-state{
  width: 68px;
  height: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  font-size: 12px;
  color: #fff;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.video-box .video-list .video-center .video-state span:last-child{
  display: inline-block;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  text-align: right;
}

.blue-bg{
  background: #00ff18;
  box-shadow: 0 0 5px #d4edb9;
}
.red-bg{
  background: #f11a52;
  box-shadow: 0 0 5px #e4718f;
}

</style>
