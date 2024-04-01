<template>
  <div class="energy-box">
    <div class="energy-left">
      <div class="equipment-title">设备</div>
      <el-tree
        class="filter-tree"
        :current-node-key="currentNodekey"
        :highlight-current="true"
        node-key="id"
        :data="equipmentData"
        @node-click="handleNodeClick"
        default-expand-all
        :expand-on-click-node="false">
      </el-tree>
    </div>
    <div class="energy-main">
      <div class="energy-data">
          <div class="top-data">
            <span>日期</span>
            <el-date-picker
              v-model="energyValue"
              value-format="yyyy-MM-dd"
              type="daterange"
              @change="changeTime"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
<!--      <div class="info-box">-->
<!--        <div class="y-info-box">-->
<!--          <el-table-->
<!--            :data="voltageAndCurrentData"-->
<!--            style="width: 100%">-->
<!--            <el-table-column-->
<!--              prop="name"-->
<!--              label=""-->
<!--              width="180">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="totalEnergy"-->
<!--              label="总电能">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="maxValue"-->
<!--              label="最大值">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="minValue"-->
<!--              label="最小值">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="difference"-->
<!--              label="峰谷差">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="average"-->
<!--              label="平均电能">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--        </div>-->
      <div class="echarts-box">
        <div id="powerEcharts"></div>
      </div>
      <div class="energy-table">
        <div class="table-title">历史记录</div>
        <el-table
          :data="energyDate"
          stripe
          style="width: 100%">
          <el-table-column
            prop="collectTime"
            label="时间"
            width="">
          </el-table-column>
          <el-table-column
            prop="deviceInfoId"
            label="电表名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="postalAddress"
            label="通讯地址">
          </el-table-column>
          <el-table-column
            prop="totalActivePower"
            label="总有功功率（kW）">
          </el-table-column>
          <el-table-column
            prop="phaseActivePowerA"
            label="A相有功功率">
          </el-table-column>
          <el-table-column
            prop="phaseActivePowerB"
            label="B相有功功率">
          </el-table-column>
          <el-table-column
            prop="phaseActivePowerC"
            label="C相有功功率">
          </el-table-column>
          <el-table-column
            prop="totalReactivePower"
            label="总无功功率（kvarh）">
          </el-table-column>
          <el-table-column
            prop="phaseReactivePowerA"
            label="A相无功功率">
          </el-table-column>
          <el-table-column
            prop="phaseReactivePowerB"
            label="B相无功功率">
          </el-table-column>
          <el-table-column
            prop="phaseReactivePowerC"
            label="C相无功功率">
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getSideList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { listSideDeviceInfoTree, loadHistoryRecords, loadPowerRecords, loadPowerChartData } from '@/api/wcs/energyConsumeMonitor'
export default {
  data() {
    return {
      // 总条数
      total: 0,
      queryParams: {
        id: '1',
        type: '1',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentNodekey: '3', //默认选中的节点树
      equipmentData: [],
      energyValue: '',
      energyDate:[],
      // voltageAndCurrentData:[
      //   {
      //     name:'电压（V）',
      //     totalEnergy:'1038',
      //     maxValue:'9.6',
      //     minValue:'4.8',
      //     difference:'4.8',
      //     average:'7.6324',
      //   },
      //   {
      //     name: '电流（A）',
      //     totalEnergy:'1038',
      //     maxValue:'9.6',
      //     minValue:'4.8',
      //     difference:'4.8',
      //     average:'7.6324',
      //   },
      // ],
    }
  },
  mounted(){
    this.powerEcharts()
    this.listSideTree()
    this.getSideList()
  },
  methods: {
    changeTime(e) {
      if (!e) {
        this.reset()
      }
    },
    getSideList() {
      loadPowerRecords(this.queryParams).then(response => {
        if (response) {
          this.energyDate = response.rows
          this.total= response.total
        } else {
          this.energyDate = []
        }
      })
    },
    listSideTree() {
      listSideDeviceInfoTree().then(response => {
        if (response) {
          this.equipmentData = []
          this.equipmentData.push(response.data)
        } else {
          this.equipmentData = []
        }
      })
    },
    query() {
      if (this.energyValue && this.energyValue.length === 2) {
        this.queryParams.startTime = this.energyValue[0]
        this.queryParams.endTime = this.energyValue[1]
      }
      this.getSideList()
      this.powerEcharts()
    },
    reset() {
      this.energyValue = []
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
    },
    // 树节点
    handleNodeClick(data) {
      this.queryParams.id = data.id
      this.queryParams.type = data.type
      this.getSideList()
      this.powerEcharts()
    },
    powerEcharts(){
      loadPowerChartData(this.queryParams).then(response => {
        if (response) {
          let item = response.data
          let xaxisList = item.xaxisList
          let yaxisList = item.yaxisList
          let secondaryAxisList = item.secondaryAxisList
          let thirdAxisList = item.thirdAxisList
          let fourthAxisList = item.fourthAxisList
          let fifthAxisList = item.fifthAxisList
          let sixthAxisList = item.sixthAxisList
          let seventhAxisList = item.seventhAxisList
          let eighthAxisList = item.eighthAxisList
          let powerChart = this.$echarts.init(document.getElementById('powerEcharts'));
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              x:'center',
              itemGap: 20,
              itemWidth: 14,
              itemHeight: 14,
              icon: 'rect',
            },
            dataZoom: [//滚动条
              {
                show: true,
                type: 'slider',
                realtime: true,
                startValue: 0,
                endValue: 5,
                xAxisIndex: [0],
                bottom: '3%',
                left: '30',
                height: 10,
                borderColor: 'rgba(0,0,0,0)',
                textStyle: {
                  color: '#05D5FF',
                },
              },
            ],
            grid: {
              top: '20%',
              left: '2%',
              right: '2%',
              bottom: '8%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xaxisList,
                axisPointer: {
                  type: 'shadow'
                },
                axisTick: false,
                axisLine: {
                  lineStyle: {
                    color: '#eee'
                  }
                },
                axisLabel: {
                  color: '#aaa'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                max: 250,
                interval: 50,
                name: 'kw',
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgba(52,78,130,0.2)',
                    width: 1,
                    type: 'dashed'
                  }
                }
              },
              {
                type: 'value',
                name: 'kvarh',
                min: 0,
                max: 500,
                interval: 100,
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgba(52,78,130,0.2)',
                    width: 1,
                    type: 'dashed'
                  }
                }
              },
            ],
            series: [
              {
                name: '总有功功率',
                type: 'line',
                // barWidth: 14,
                data: yaxisList,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#409eff'
                }
              },
              {
                name: 'A相有功功率',
                type: 'line',
                // barWidth: 14,
                data: secondaryAxisList,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#fda441'
                }
              },
              {
                name: 'B相有功功率',
                type: 'line',
                // barWidth: 14,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#38cc88'
                },
                data: thirdAxisList
              },
              {
                name: 'C相有功功率',
                type: 'line',
                // barWidth: 14,
                data: fourthAxisList,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#fde041'
                }
              },
              {
                name: '总无功功率',
                type: 'line',
                // barWidth: 14,
                data: fifthAxisList,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#bf4fe8'
                }
              },
              {
                name: 'A相无功功率',
                type: 'line',
                yAxisIndex: 1,
                // barWidth: 14,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#ff4d4d'
                },
                data: sixthAxisList
              },
              {
                name: 'B相无功功率',
                type: 'line',
                yAxisIndex: 1,
                // barWidth: 14,
                data: seventhAxisList,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#738bac'
                }
              },
              {
                name: 'C相无功功率',
                type: 'line',
                yAxisIndex: 1,
                // barWidth: 14,
                itemStyle: {
                  barBorderRadius: [30, 30, 0, 0],
                  color: '#174a8e'
                },
                data: eighthAxisList
              }
            ]
          }
          powerChart.setOption(option);
          setTimeout(function (){
            window.onresize = function () {
              powerChart.resize();
            }
          },200)
        }
      })
    }
  }
};
</script>


<style scoped>
.energy-box{
  min-height: 800px;
}
.energy-box .energy-left{
  width: 220px;
  /*border-right: 1px solid #DFE4ED;*/
  min-height: 800px;
  float: left;
}
.energy-box .energy-left .equipment-title{
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
}
.energy-main{
  background: #F5F7FA;
  padding: 10px;
  border-radius: 10px;
  margin-left: 240px;
}
.mian-top{
  min-height: 300px;
  margin-bottom: 20px;
}
.energy-data{
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  margin-bottom: 10px;
}
.energy-data .top-data{
  margin-right: 10px;
}
.energy-data .top-data span{
  font-size: 12px;
  color: #2f4256;
  margin-right: 10px;
  display: inline-block;
}

.data-info-name{
  font-size: 14px;
  color: #000;
  font-weight: bold;
}
.data-info-num{
  font-size: 24px;
  color: #000;
  margin: 10px 0;
}
.data-info-compare{
  font-size: 12px;
}
.data-info-compare span:last-child{
  color: #000;
  margin-left: 5px;
  display: inline-block;
}
.data-box .data-list .data-info-right{
  font-size: 12px;
  color: #888;
}

.info-box{
  margin: 10px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
}
.info-box .y-info-box{
  background: #fff;
  margin: 0 20px;
}
.el-table
.info-box .y-info-box .el-table{
  background: #fff;
}
.info-box .y-info-box .el-table thead{
  color: #333;
}
.el-table{
  color: #333;
}
::v-deep .info-box .y-info-box .el-table .el-table__header-wrapper th{
  background: #fff;
}
::v-deep .info-box .y-info-box .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: #fff !important;
}

::v-deep .el-table::before{
  height: 0;
}
::v-deep .el-table td.el-table__cell{
  border: none;
}
.echarts-box{
  min-height: 320px;
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  margin:20px 10px;
}
#powerEcharts{
  width: 100%;
  height: 320px;
}
.energy-table{
  background: #fff;
  border-radius: 5px;
  margin: 0 10px;
  padding: 20px;
}
.energy-table .table-title{
  margin-bottom: 10px;
  color: #000;
}
.energy-table .el-table{
}
.energy-table .el-table .el-table__header-wrapper th{
  background: #e7ecf3;
}
.el-table th.el-table__cell.is-leaf{
  border-bottom: none;
}
::v-deep .el-tree-node__content{
  font-size: 14px;
  color: #555;
  height: 35px;
}
::v-deep .el-pagination{
  display: flex;
  justify-content: flex-end;
}
</style>
