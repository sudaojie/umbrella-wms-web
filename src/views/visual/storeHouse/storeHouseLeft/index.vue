<template>
  <div class="left-content">
    <!-- 库位情况 -->
    <div class="warehouse-box">
      <div class="title-name">库位情况</div>
      <div class="warehouse-center">
        <div id="warehouse-echarts"></div>
        <ul class="warehouse-list">
          <li v-for="(item,index) in libraryList" :key="index">
            <img class="list-left" :src="item.img" alt="">
            <div class="list-right">
              <div class="list-num">{{item.num}}</div>
              <div class="list-state">{{item.state}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 库存周转率 -->
    <div class="inventory-box">
      <div class="title-name">库存周转率</div>
      <div id="inventory-echarts">

      </div>
    </div>
    <!-- 出入库统计 -->
    <div class="beout-box">
      <div class="title-name">出入库统计</div>
      <el-select v-model="accessValue" placeholder="请选择" :popper-append-to-body="false"  @change="accessChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div id="beout-echarts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { selectLocationInfo,getInventoryTurnover,getInboundAndOutboundStatistics } from '@/api/visual/storeHouse'
// import { allLocationList } from '@/api/visual/alllLocationList'
export default {
  data() {
    return{
      libraryList: [],
      options: [{
        value: '2',
        label: '近七天'
      }, {
        value: '6',
        label: '近五天'
      }, {
        value: '7',
        label: '近三天'
      }, {
        value: '8',
        label: '近一天'
      }],
      accessValue: '2'
    }
  },
  mounted() {
    this.warehouseLocation()
    this.inventoryTurnoverRate()
    this.inboundAndOutbound()
  },
  methods: {
    // 库位情况
    warehouseLocation(){
      selectLocationInfo().then(res=>{
        if(res){
          let totalCount = res.data.totalCount
          let inUseCount = res.data.inUseCount
          let spareCount = res.data.spareCount
          this.libraryList = [
            {
              img: require('@/assets/images/state_icon_one.png'),
              num:res.data.totalCount,
              state: '总库位'
            },
            {
              img: require('@/assets/images/state_icon_two.png'),
              num:res.data.inUseCount,
              state: '已使用'
            },
            {
              img: require('@/assets/images/state_icon_three.png'),
              num:res.data.spareCount,
              state: '空闲'
            }
          ]
          this.drawChart(totalCount,inUseCount);
        }
      })
    },
    drawChart(totalCount,inUseCount) {
      let warehouseChart = echarts.init(document.getElementById("warehouse-echarts"));
      let value =( (inUseCount/totalCount)*100).toFixed(2);
      let option = {
        title: [
          {
            text: '库位使用率',
            textStyle: {
              color: '#E5FFFD',
              fontSize: 16,
              fontWeight: 'bold',
            },
            itemGap: 20,
            left: 'center',
            bottom: '30%',
          }, {
            text: value + '%',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 20,
              padding: [0, 0, 0, 0],

            },
            x: 'center',
            y: '23%',
          }],
        grid: [
          {
            containLabel: true,
          },
        ],
        angleAxis: {
          polarIndex: 0,
          min: 0,
          max: 100,
          show: false,
          boundaryGap: ['40%', '40%'],
          startAngle: 90,
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        polar: [
          {
            center: ['50%', '30%'], //中心点位置
            radius: '120%', //图形大小
          },
        ],
        tooltip: {
          show: false,
        },
        xAxis: {
          show: false,
          type: 'value',
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLabel: {
              show: false,
              textStyle: {
                color: '#444444',
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: 'bar',
            z: 10,
            name: '',
            data: [value],
            showBackground: false,
            backgroundStyle: {
              borderWidth: 10,
              width: 10,
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: '14%', //大的占比环
            itemStyle: {
              normal: {
                opacity: 1,
                color: '#00C6B3',
              },
            },

          },
          {
            type: 'pie',
            name: '内层细圆环',
            radius: ['67%', '53%'],
            center: ['50%', '30%'], //中心点位置
            startAngle: 90,
            hoverAnimation: false,
            clockWise: true,
            silent: true,
            itemStyle: {
              normal: {
                color: 'rgba(0, 2, 4, 0.15)',
                shadowBlur: 0,
                shadowColor: 'rgba(0, 2, 4, 0.15)',
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [100],

          },
        ],
      };
      warehouseChart.setOption(option);
    },
    // 库存周转率
    inventoryTurnoverRate(){
      getInventoryTurnover().then(res=>{
        if(res){
          // 本月库存周转率
          let thisMonthNum = ''
          let thisMonth = res.data.outGoodsNumOfThisMonth / (res.data.endingInventoryOfThisMonth - res.data.opendingInventoryOfThisMonth)
          if(thisMonth == '0' || isNaN(thisMonth) || thisMonth == 'undefined'){
            thisMonthNum = 0
          }else {
            thisMonthNum = thisMonth
          }
          let lastMonthNum = ''
          let lastMonth =  res.data.outGoodsNumOfLastMonth / ( res.data.endingInventoryOfLastMonth -  res.data.opendingInventoryOfLastMonth)
          if(lastMonth == '0' || isNaN(lastMonth) || lastMonth == 'undefined'){
            lastMonthNum = 0
          }else {
            lastMonthNum = lastMonth
          }
          let synchronous = lastMonthNum - thisMonthNum
          this.drawMeter(thisMonthNum,synchronous)
        }
      })
    },
    drawMeter(thisMonthNum,synchronous) {
      let inventoryChart = echarts.init(document.getElementById("inventory-echarts"));
      let synchronousName = ''
      if(synchronous>0){
        synchronousName = synchronous +'%↑'
      }else if(synchronous<0){
        synchronousName = synchronous +'%↓'
      }else{
        synchronousName = synchronous +'%'
      }
      const dataArr = thisMonthNum;
      const dataX = 100;
      let option = {
        /** 标题*/
        title: [
          {
            text: '{name|' + '月度库存周转率' + '}\n{val|' + dataArr + '%' + '}\n{unit|' + '同步' + synchronousName  + '}',
            bottom: '17%',
            left: 'center',
            textStyle: {
              rich: {
                val: {
                  fontSize: 28,
                  color: '#E5E5E5',
                  fontWeight: '900',
                  padding: [15,0,20,0],
                },
                name: {
                  fontSize: 12,
                  color: '#DBFFFC',
                  // padding: [0,0,0,0],
                },
                unit: {
                  fontSize: 12,
                  color: '#00FF30',
                },
              },
            },
            triggerEvent: true,
          },
        ],

        /** 关闭必图例*/
        legend: {
          show: false,
        },
        series: [
          // 外圆线
          {
            type: 'pie',
            radius: ['93%', '90%'],
            center: ['50%', '50%'],
            hoverAnimation: false, //鼠标移入变大
            startAngle: 205,//起始角度
            labelLine: {
              show: false,
            },
            label: {
              position: 'center',
            },
            data: [
              {
                value: 65,
                itemStyle: {
                  shadowBlur: 0,
                  shadowColor: '#fff',
                  color: '#D4F8FF'
                },
              },
              {
                value: 35,
                itemStyle: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                  color: 'rgba(0,0,0,0)',
                  borderWidth: 0,
                },
              },
            ],
          },
          // 底圈
          {
            type: 'pie',
            radius: ['80%', '77%'],
            center: ['50%', '50%'],
            hoverAnimation: false, //鼠标移入变大
            startAngle: 210,//起始角度
            labelLine: {
              show: false,
            },
            label: {
              position: 'center',
            },
            data: [
              {
                value: 65,
                itemStyle: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },

                  color: 'rgba(0,0,0,0)',
                  borderWidth: 0,
                },
              },
              {
                value: 33,
                itemStyle: {
                  shadowBlur: 0,
                  shadowColor: '#fff',

                  color: '#717E81'

                },
              },
            ],
          },
          {
            name: '刻度尺',
            type: 'gauge',
            radius: '81%',
            splitNumber: 10, // 刻度数量
            startAngle: '205',
            endAngle: '-25',
            min: 0, // 最小刻度
            max: dataX, // 最大刻度
            // 仪表盘轴线相关配置
            axisLine: {
              lineStyle: {
                color: [
                  [
                    1,
                    {
                      type: 'radial',
                      x: 0.5,
                      y: 0.6,
                      r: 0.6,
                      colorStops: [
                        {
                          offset: 0.65,
                          color: 'transparent', // 0% 处的颜色
                        },
                        {
                          offset: 0.93,
                          color: 'rgba(0, 255, 231, 0.3)', // 100% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'rgba(0, 255, 231, 0.5)', // 100% 处的颜色
                        },
                      ],
                    },
                  ],
                ],
                width: 30,
              },
            },
            /** 分隔线样式*/
            splitLine: {
              show: true,
              length: -5,
              lineStyle: {
                width: 1,
                color: 'rgba(30, 34, 35, 0.5)', // 用颜色渐变函数不起作用
              },
            },
            /** 刻度线*/
            axisTick: {
              show: false,
              splitNumber: 20,
              lineStyle: {
                color: '#12E5FE', // 用颜色渐变函数不起作用
                width: 1,
              },
              length: 5,
            },
            /** 刻度标签*/
            axisLabel: {
              show: true,
              distance: -5,   //距离刻度的距离
              lineHeight: -25,
              color: '#D4F8FF',
              formatter: function (val) { // 底部0和100
                if (val == 0) {
                  return '0'
                }
                if (val == 100) {
                  return '100'
                }
              }
            },
            detail: {
              show: false,
            },
            animationDuration: 4000,
          },
          {
            name: '渐变进度',
            type: 'gauge',
            radius: '80%',
            splitNumber: 15,
            startAngle: '205',
            endAngle: '-25',
            axisLine: {
              lineStyle: {
                color: [
                  [
                    dataArr / dataX,
                    {
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 0,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'rgba(0, 255, 231,0)', // 0% 处的颜色
                        },
                        {
                          offset: 0.9,
                          color: 'rgba(0, 255, 231,0.5)', // 100% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'rgba(0, 255, 231,0)', // 100% 处的颜色
                        },
                      ],
                      global: false, // 缺省为 false
                    },
                  ],
                ],
                width: 30,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              show: false,
            },
            detail: {
              show: false,
            },
            title: {
              // 标题
              show: false,
            },
            data: [
              {
                name: 'title',
                value: dataArr,
              },
            ],
            pointer: {
              show: false,
            },
            animationDuration: 4000,
          },
        ],

      };
      inventoryChart.setOption(option);
    },
    // 出入库统计
    inboundAndOutbound(){
      getInboundAndOutboundStatistics(this.accessValue).then(res=>{
        if(res){
          let xTime = []
          let inbill = []
          let outbill = []
          res.data.inbill.forEach(item =>{
            xTime.push(item.time ? item.time.substring(item.time.indexOf('-') + 1) : '')
            inbill.push(Number(item.num).toFixed(2))
          })
          res.data.outbill.forEach(item =>{
            outbill.push(Number(item.num).toFixed(2))
          })
          this.drawLine(xTime,inbill,outbill)
        }
      })
    },
    drawLine(xTime,inbill,outbill) {
      let beoutChart = echarts.init(document.getElementById("beout-echarts"));
      let option = {
        // backgroundColor: '#1b2735',
        tooltip: {//提示框组件
          trigger: 'axis',//触发类型 柱状图
          axisPointer: { type: 'shadow' } //触发效果 移动上去 背景效果
        },
        legend: {
          top: '0%',
          right: '5%',
          textStyle: {
            // 图例文字的样式
            color: '#A3FFF6',
            fontSize: 14,
            padding: [2, 0, 0, 2],
            fontWeight: 100,
          },
          icon: 'rect',
          itemGap: 12,// 设置间距
          itemWidth: 10,
          itemHeight: 10,
        },
        grid: {
          top: '8%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [//x轴
          {
            type: 'category',//坐标轴类型 离散
            data: xTime,//数据
            axisTick: false,//是否显示刻度
            axisLine: {//坐标轴样式
              show: false,//是否显示
            },
            axisLabel: {
              color: "#1C9489",
              fontSize: 12,
              fontWeight: 400,
            }
          },
        ],
        yAxis: [//y轴
          {
            min: 0,//最小
            max: 100,//最大
            // interval: 150,//相差
            name: '单位：单',//名称
            nameTextStyle: {
              color: "#9EF6ED",
              fontSize: 14,
              // padding: [0, 0, 6, -60],
            },
            type: 'value',//连续类型
            axisTick: false,//是否显示刻度
            axisLine: {//坐标轴样式
              show: false, //不显示
            },
            splitLine: {//分隔辅助线
              show: false,
            },
            axisLabel: {
              color: "#1C9489",
              fontSize: 12,
              fontWeight: 400,
            }
          },
        ],
        series: [//系统列表
          {
            name: '入库',//名称
            type: 'bar',//类型
            barWidth: 8,//宽度
            data: inbill,//数值
            z: 2,
            itemStyle: {
              color: '#00FFE7'
            },
          },
          {
            name: '出库',
            type: 'bar',
            barWidth: 8,
            data: outbill,
            z: 1,
            itemStyle: {
              color: '#FFF600'
            },
          }
        ],

      };
      beoutChart.setOption(option);
    },
    accessChange(value){
      this.accessValue = value
      this.inboundAndOutbound()
    },
  },
}
</script>

<style scoped>
.left-content {
  position: absolute;
  width: 300px;
  height: calc(100vh - 90px);
  left: 10px;
  top: 110px;
  /* background: blue; */
  /*display: none;*/
}
.title-name {
  background: url(~@/assets/images/frame.png) no-repeat 20px center;
  color: #fff;
  padding: 20px;
  font-size: 16px;
}

.title-name::after {
  content: '';
  display: inline-block;
  background: url(~@/assets/images/title_icon.png) no-repeat;
  margin-left: 10px;
  width: 32px;
  height: 10px;
}
.warehouse-box {
  width: 100%;
  height: 270px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
  margin-bottom: 20px;
}

.warehouse-center {
  display: flex;
}

#warehouse-echarts {
  width: 50%;
  height: 200px;
}

.warehouse-list li {
  display: flex;
  margin-bottom: 10px;
}

.warehouse-list .list-left {
  margin-right: 10px;
  width: 40px;
  height: 40px;
}

.warehouse-list .list-right {}

.warehouse-list .list-right .list-num {
  font-size: 20px;
  font-weight: 800;
  color: #00FFE7;
  line-height: 24px;
}

.warehouse-list li:nth-child(2) .list-right .list-num {
  color: #FFF600;
}

.warehouse-list li:nth-child(2) .list-right .list-num {
  color: #00FF30;
}

.warehouse-list .list-right .list-state {
  color: #DCDCDC;
  line-height: 24px;
}
.inventory-box {
  width: 100%;
  height: 250px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
  margin-bottom: 20px;
}

#inventory-echarts {
  width: 100%;
  height: 180px;
}
.beout-box {
  width: 100%;
  height: 285px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
  position: relative;
}

.el-select {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 71px;
  height: 25px;
  background: rgba(0, 198, 179, 0.1);
  border: 1px solid #00C6B3;
  border-radius: 5px;
}

::v-deep .el-input__inner {
  height: 25px;
  line-height: 25px;
  background: transparent;
  border: none;
  color: #A3FFF6;
  padding: 0 5px;
}

::v-deep .el-input__suffix {
  right: 0;
}

::v-deep .el-input__icon {
  line-height: 25px;

}

::v-deep .el-input--suffix .el-input__inner {
  padding-right: 10px;
}

/* // option选项-最外层 */
::v-deep .el-select-dropdown {
  border: none !important;
  background: rgba(30, 34, 35, 0.8) !important;
  z-index: 999;
  top: 10px;
}

/* // option选项-文字样式 */
::v-deep .el-select-dropdown__item {
  color: rgba(163, 255, 246, 1) !important;
  z-index: 999;
}

/* // 移入option选项-样式调整 */
::v-deep .el-select-dropdown__item.hover {
  background-color: rgba(30, 34, 35, 1);
  color: rgba(163, 255, 246, 0.8) !important;
  z-index: 999;
}

::v-deep .el-popper[x-placement^=bottom] .popper__arrow {
  display: none
}
::v-deep .el-select .el-input .el-select__caret{
  color: #00C6B3;
  font-size: 12px;
}


::v-deep .el-icon-arrow-up:before {
  content: "\e790";
}

#beout-echarts {
  width: 100%;
  height: 220px;
}
</style>
