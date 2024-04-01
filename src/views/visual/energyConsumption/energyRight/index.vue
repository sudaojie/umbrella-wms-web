<template>
  <div class="right-content">
    <div class="frame-bg">
      <div class="energy-title energy-title-one">
        <div class="energy-title-name">碳排放量趋势</div>
        <div class="trend-title-tab">
<!--          <span :class="{active:shows==1}" @click="today_a">近七天</span>-->
<!--          <span :class="{active:shows==2}" @click="today_b">近15天</span>-->
<!--          <span :class="{active:shows==3}" @click="today_c">近1月</span>-->
          <span v-for="item in trendDayList"
                :key="item.id"
                :class="{active:trendIndex === item.id}"
                @click="trendTabIndex(item.id)">{{item.title}}</span>
        </div>
      </div>
      <div id="trend-echarts"></div>
    </div>
    <div class="frame-bg">
      <div class="energy-title energy-title-one">
        <div class="energy-title-name">温湿度监测</div>
      </div>
      <div class="monitor-box">
        <div class="monitor-list temperature-list">
          <img src="@/assets/images/wd_icon.png" alt="">
          <div class="monitor-title">
            <span>温度</span>|
            <span>舒适</span>
          </div>
          <div class="company">{{Number(monitorList.averageTemplature).toFixed(2)}}<i>°C</i></div>
        </div>
        <div class="line-box"></div>
        <div class="monitor-list">
          <img src="@/assets/images/sd_icon.png" alt="">
          <div class="monitor-title">
            <span>湿度</span>|
            <span>湿润</span>
          </div>
          <div class="company">{{Number(monitorList.averageHumidity).toFixed(2)}}%<i>rh</i></div>
        </div>
      </div>
    </div>
    <div class="frame-bg">
      <div class="energy-title analysis-title">
        <div class="energy-title-name">能耗分析</div>
        <div class="energy-title-tab">
          <span v-for="item in energyDayList"
                :key="item.id"
                :class="{active:energyIndex === item.id}"
                @click="energyTabIndex(item.id)">{{item.title}}</span>
        </div>
      </div>
      <div id="analysis-echarts"></div>
    </div>
  </div>
</template>

<script>

import * as echarts from "echarts";
import {monitoringList,energyConsumptionAnalysis,carbonEmissionList} from "@/api/visual/energyConsumption";
export default {
  data() {
    return{
      trendDayList: [
        { id: 2, title: '近七天'},
        { id: 5, title: '近15天'},
        { id: 3, title: '近1月'}
      ],
      trendIndex:2,
      energyDayList: [
        { id: 2, title: '近七天'},
        { id: 5, title: '近15天'},
        { id: 3, title: '本月'}
      ],
      energyIndex:2,
      shows: 1,
      show: 1,
      monitorList:{},
    }
  },
  mounted() {
    this.carbonEmissions()
    // this.analysis()
    this.monitoring()
    this.energyConsumptionAnalysisApi()
    this.carbonEmissionApi()
  },
  methods: {
    carbonEmissionApi(){
      carbonEmissionList('',this.trendIndex).then(res=>{
        if(res){
          let xTime = []
          let energyData = []
          let carbonData = []
          res.data.forEach(item => {
            xTime.push(item.time ? item.time.substring(item.time.indexOf('-') + 1) : '')
            energyData.push(Number(item.num).toFixed(2))
            carbonData.push(Number(item.num*0.75).toFixed(2))
          })
          this.carbonEmissions(xTime,energyData,carbonData)
        }
      })
    },
    trendTabIndex(id){
      this.trendIndex = id
      this.carbonEmissionApi()
    },

    carbonEmissions(xTime,energyData,carbonData){
    let trendChart = echarts.init(document.getElementById("trend-echarts"));
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        backgroundColor: 'rgba(9, 24, 48, 0.5)',
        borderColor: 'rgba(75, 253, 238, 0.4)',
        textStyle: {
          color: '#CFE3FC',
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '18%',
        bottom: '12%',
        containLabel: true
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        x: 'right',
        y: 'center'
      },
      dataZoom: [//滚动条
        {
          show: true,
          borderColor:'#0e2d70',
          backgroundColor:'rgba(30, 34, 35, 1)',
          type: 'slider',
          realtime: true,
          startValue: 0,
          endValue: 3,
          xAxisIndex: [0],
          bottom: '5%',
          left: '50',
          height: 10,
          textStyle: {
            color: '#fff',
          },
        },
      ],
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            show: false
          },
          data: xTime,
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.2)'
            }
          },
          axisLabel: {
            interval: 0,
            color: '#fff',
            fontSize: 14
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '吨',
          nameTextStyle: { color: '#fff', fontSize: 12 },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.2)'
            },
          },
          // max: 500,
          axisLabel: {
            interval: 0,
            color: '#fff',
            fontSize: 14
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#646766',
              width: 1,
              type: 'solid'
            }
          }
        },
        {
          type: 'value',
          name: 'kw',
          nameTextStyle: { color: '#fff', fontSize: 12 },
          axisTick: {
            show: false
          },

          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(207, 227, 252, 1)'
            },
          },
          // min: 0,
          // max: 50,
          axisLabel: {
            interval: 0,
            color: '#fff',
            fontSize: 14,
            // formatter: '{value} %'
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(39, 57, 75, 1)',
              width: 1,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          name: '碳排放量',
          yAxisIndex: 1,
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(255, 246, 0,.4)'
              },
              {
                offset: 1,
                color: 'rgba(255, 246, 0,0)'
              }
            ])
          },
          data: carbonData,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: '#fff600',
              borderColor: '#fff600',
              lineStyle: {
                color: '#fff600'
              }
            }
          },

        },
        {
          z: 2,
          type: 'bar',
          yAxisIndex: 0,
          name: '能耗',
          itemStyle: {
            normal: {
              color: '#00ffe7'
            }
          },
          barWidth: 12,
          data: energyData
        }
      ]
    }
    trendChart.setOption(option);
    },

    // 能耗分析
    energyConsumptionAnalysisApi(){
      energyConsumptionAnalysis(this.energyIndex).then(res=>{
        let currentYearNum = res.data.currentYearNum
        let historicalYearNum = res.data.historicalYearNum
        let currentMonthNum = res.data.currentMonthNum
        let historicalMonthNum = res.data.historicalMonthNum
        this.analysis(Number(currentYearNum).toFixed(2), Number(historicalYearNum).toFixed(2) ,Number(currentMonthNum).toFixed(2) ,Number(historicalMonthNum).toFixed(2))
      })
    },
    energyTabIndex(id){
      this.energyIndex = id
      this.energyConsumptionAnalysisApi()
    },
    analysis(currentYearNum, historicalYearNum ,currentMonthNum ,historicalMonthNum){
      let analysisChart = echarts.init(document.getElementById("analysis-echarts"));
      let titleArr = ['同比', '环比'];
      let allArr = [currentYearNum, currentMonthNum];
      let chuqinArr = [historicalYearNum, historicalMonthNum];
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top: '0%',
          icon:'circle',
          data: ['当前', '历史'],
          textStyle: {
            //字体颜色
            color: '#fff',
            fontSize: 12
          }
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          // max:5000,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#5e6363',
              type: 'solid'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#009dff'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: titleArr,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5e6363',
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff', //x轴字体颜色
            textStyle: {
              fontSize: 12
            },
          }
        },
        series: [
          {
            name: '当前',
            type: 'bar',
            barWidth: 25,
            barGap: '30%',
            data: allArr,
            itemStyle: {
              normal: {
                color: "#00ffe7"
              }
            }
          },
          {
            name: '历史',
            type: 'bar',
            barWidth: 25,
            barGap: '30%',
            data: chuqinArr,
            itemStyle: {
              normal: {
                color: "#fff600"
              }
            }
          }
        ]
      };
      analysisChart.setOption(option);
    },
    // 温湿度监测
    monitoring(){
      monitoringList().then(res => {
        if(res){
          this.monitorList = res.data
        }
      })
    }

  },
}
</script>

<style scoped>
.right-content{
  position: absolute;
  width: 300px;
  height: calc(100vh - 90px);
  right: 10px;
  top: 110px;
}
.frame-bg{
  width: 100%;
  height: 270px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
  margin-bottom: 20px;
}
.energy-title.energy-title-one{
  overflow: hidden;
}
.energy-title.energy-title-one .energy-title-name {
  background: url(~@/assets/images/frame.png) no-repeat 20px center;
  /*background-size: contain;*/
  color: #fff;
  font-size: 16px;
  padding:20px;
}
.energy-title.energy-title-one .energy-title-name::after {
  content: '';
  display: inline-block;
  background: url(~@/assets/images/title_icon.png) no-repeat;
  margin-left: 10px;
  width: 32px;
  height: 10px;
}
.trend-title-tab{
  width: 118px;
  height: 23px;
  line-height: 25px;
  border: 1px solid #00c6b3;
  border-radius: 5px;
  color: #a3fff6;
  display: flex;
  align-items: center;
  float: right;
  overflow: hidden;
  margin-right: 20px;
}
.trend-title-tab span {
  flex: 1 1 33.33%;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.trend-title-tab span:hover{
  color: #fff;
  background: #00c6b3;
}
.active{
  color: #fff;
  background: #00c6b3;
}
#trend-echarts{
  width: 100%;
  height: 180px;
}
.monitor-box{
  margin: 20px;
  display: flex;
  align-items: center;
}
.monitor-box .monitor-list{
  width: 49%;
  text-align: center;
}
.monitor-box .line-box {
  height: 115px;
  width: 2px;
  background: rgba(255,255,255,0.2);
}


.monitor-box .monitor-list .monitor-title{
  font-size: 16px;
  color: #ddd;
  margin: 10px 0;
}
.monitor-box .monitor-list .monitor-title span{
  margin: 10px;
  display: inline-block;
}
.monitor-box .monitor-list .company{
  color: #05ffe2;
  font-size: 30px;
}
.monitor-box .monitor-list .company i{
  color: #ddd;
  font-size: 16px;
  vertical-align: text-top;
}
.analysis-title{
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
}
.analysis-title .energy-title-name {
  background: url(~@/assets/images/frame.png) no-repeat 0px center;
  background-size: contain;
  color: #fff;
  font-size: 16px;
  padding: 20px 0 20px;
  width: 122px;
}
.analysis-title .energy-title-name::after {
  content: '';
  display: inline-block;
  background: url(~@/assets/images/title_icon.png) no-repeat;
  margin-left: 10px;
  width: 32px;
  height: 10px;
}
.analysis-title .energy-title-tab{
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
.analysis-title .energy-title-tab span {
  flex: 1 1 33.33%;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
/*.analysis-title .energy-title-tab span:first-child{*/
/*  color: #fff;*/
/*  background: #00c6b3;*/
/*}*/
#analysis-echarts{
  width: 100%;
  height: 200px;
}
</style>
