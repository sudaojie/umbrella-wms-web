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
       <div class="mian-top">
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
         <div class="data-box">
           <div class="data-list" v-for="(item,index) in energyList">
             <div class="data-info-left">
               <div class="data-info-name">{{item.name}}</div>
               <div class="data-info-num">{{Number(item.num).toFixed(2)}}</div>
               <!--<div class="data-info-compare">-->
                 <!--<span>{{item.compare}}</span>-->
                 <!--<span>{{item.compareNum}}</span>-->
               <!--</div>-->
             </div>
<!--             <div class="data-info-right">{{item.time}}</div>-->
           </div>
         </div>
<!--         <div class="info-box">-->
<!--           <div class="y-info-box">-->
<!--               <el-table-->
<!--                 :data="attributeData">-->
<!--                 <el-table-column-->
<!--                   prop="name"-->
<!--                   label=""-->
<!--                   width="180">-->
<!--                 </el-table-column>-->
<!--                 <el-table-column-->
<!--                   prop="totalEnergy"-->
<!--                   label="总电能">-->
<!--                 </el-table-column>-->
<!--                 <el-table-column-->
<!--                   prop="maxValue"-->
<!--                   label="最大值">-->
<!--                 </el-table-column>-->
<!--                 <el-table-column-->
<!--                   prop="minValue"-->
<!--                   label="最小值">-->
<!--                 </el-table-column>-->
<!--                 <el-table-column-->
<!--                   prop="difference"-->
<!--                   label="峰谷差">-->
<!--                 </el-table-column>-->
<!--                 <el-table-column-->
<!--                   prop="average"-->
<!--                   label="平均电能">-->
<!--                 </el-table-column>-->
<!--               </el-table>-->
<!--           </div>-->
<!--         </div>-->
       </div>
       <div class="echarts-box">
         <div id="energyEcharts"  ref="myChart"></div>
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
             prop="activeTotalElectricalEnergy"
             label="正向有功总电能(kWh)">
           </el-table-column>
<!--           <el-table-column-->
<!--             prop="kvarh"-->
<!--             label="正向无功总电能(kvarh)">-->
<!--           </el-table-column>-->
<!--           <el-table-column-->
<!--             prop="assemble"-->
<!--             label="总电能(kvarh)">-->
<!--           </el-table-column>-->
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

  import { listSideDeviceInfoTree, loadHistoryRecords, loadEnergyHeaderData, loadEnergyChartData } from '@/api/wcs/energyConsumeMonitor'

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
        energyDate: [],
        energyList: [
          // {
          //   time: '00：00-10：00',
          //   name: '累计用电量（kWh）',
          //   num: '297.6',
          //   compare: '同比',
          //   compareNum: '0.0%'
          // },
          // {
          //   time: '00：00-10：00',
          //   name: '最大值',
          //   num: '9.6',
          //   compare: '昨天最大值',
          //   compareNum: '9.6'
          // },
          // {
          //   time: '00：00-10：00',
          //   name: '最小值',
          //   num: '4.8',
          //   compare: '昨天最小值',
          //   compareNum: '4.8'
          // },
          // {
          //   time: '00：00-10：00',
          //   name: '平均用电',
          //   num: '29.76',
          //   compare: '同比',
          //   compareNum: '0.0%'
          // }
        ]
        // attributeData:[
        //   {
        //     name:'有功总电能（kWh）',
        //     totalEnergy:'1038',
        //     maxValue:'9.6',
        //     minValue:'4.8',
        //     difference:'4.8',
        //     average:'7.6324',
        //   },
        //   {
        //     name:'无功总电能（kavrh）',
        //     totalEnergy:'1038',
        //     maxValue:'9.6',
        //     minValue:'4.8',
        //     difference:'4.8',
        //     average:'7.6324',
        //   }
        // ],
      }
    },
    mounted() {
      this.energyEcharts()
      this.listSideTree()
      this.getSideList()
      this.loadEnergyHeaderData()
    },
  methods: {
    changeTime(e) {
      if (!e) {
        this.reset()
      }
    },
    loadEnergyHeaderData() {
      loadEnergyHeaderData(this.queryParams).then(response => {
        if (response) {
          this.energyList = response.data
        } else {
          this.energyList = []
        }
      })
    },
    query() {
      if (this.energyValue && this.energyValue.length === 2) {
        this.queryParams.startTime = this.energyValue[0]
        this.queryParams.endTime = this.energyValue[1]
      }
      this.getSideList()
      this.loadEnergyHeaderData()
      this.energyEcharts()
    },
    reset() {
        this.energyValue = []
        this.queryParams.startTime = ''
        this.queryParams.endTime = ''
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
    // 树节点
    handleNodeClick(data) {
      this.queryParams.id = data.id
      this.queryParams.type = data.type
      this.getSideList()
      this.loadEnergyHeaderData()
      this.energyEcharts()
    },
    getSideList() {
      loadHistoryRecords(this.queryParams).then(response => {
        if (response) {
          // console.log(response.rows.length)
          // console.log(response.rows)
          this.energyDate = response.rows
          this.total= response.total
        } else {
          this.energyDate = []
        }
      })
    },
    energyEcharts(){
      loadEnergyChartData(this.queryParams).then(response => {
        if (response) {
          let xAxisList = response.data.xaxisList
          let yAxisList = response.data.yaxisList
          let energyChart = this.$echarts.init(document.getElementById('energyEcharts'));
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              itemGap: 20,
              itemWidth: 14,
              itemHeight: 14,
              icon: 'rect'
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
              top: '12%',
              left: '2%',
              right: '2%',
              bottom: '8%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisList,
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
                max: 100,
                interval: 10,
                name: 'kwh',
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
                name: 'kavrh',
                min: 0,
                max: 100,
                interval: 10,
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
                name: '有功电能',
                type: 'bar',
                stack: 'Ad',
                barWidth: 14,
                data: yAxisList,
                itemStyle: {
                  // barBorderRadius: [30, 30, 0, 0],
                  color: '#409eff'
                }
              },
            ]
          }
          energyChart.setOption(option);
          setTimeout(function (){
            window.onresize = function () {
              energyChart.resize();
            }
          },200)
        }
      })
    }
  }
  }
</script>

<style scoped>
.energy-box{
  min-height: 800px;
}
.energy-box .energy-left{
  width: 220px;
  float: left;
  min-height: 800px;
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
  /*min-height: 300px;*/
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
.data-box{
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
  margin: 0 -5px;
}
.data-box .data-list{
  width: 23%;
  background: #fff url("~@/assets/energyMonitorImages/e_icon.png") no-repeat 104% 120%;
  box-shadow: 0px 5px 10px 0px rgba(56,89,120,0.1);
  border-radius: 5px;
  padding: 15px;
  margin: 10px 1%;
  display: flex;
  justify-content: space-between;
}
.data-box .data-list .data-info-left{
  color: #888;
  font-size: 14px;
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
  margin:10px 10px 20px;
}
#energyEcharts{
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

@media screen and (max-width: 1440px){
  .data-box{
    margin: 0;
  }
  .data-box .data-list {
    width: 48%;
  }
}

</style>
