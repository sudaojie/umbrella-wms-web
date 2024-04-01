<template>
  <div class="right-content">
    <!-- 预警信息 -->
    <div class="warning-box">
      <div class="title-name">预警信息</div>
      <div class="table-box">
        <el-table :data="tableData" stripe :header-row-style="{height:'30px'}" :row-style="{height:'35px'}"
                  style="width: 100%"
                  height="220">
          <el-table-column prop="num" label="序号" type="index" width="40">
          </el-table-column>
          <el-table-column prop="warningContent" label="报警信息">
          </el-table-column>
          <el-table-column prop="warningTime" label="报警时间">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 任务列表 -->
    <div class="warning-box">
      <div class="title-name">任务列表</div>
      <div class="table-box">
        <el-table :data="taskTable" stripe :header-row-style="{height:'30px'}" :row-style="{height:'35px'}" height="220"
                  style="width: 100%">
          <el-table-column prop="num" label="序号" type="index" width="40">
          </el-table-column>
          <el-table-column prop="inBillNo" label="单号" width="">
          </el-table-column>
          <el-table-column prop="taskType" label="类型" width="">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wcs_task_type" :value="scope.row.taskType" />
            </template>
          </el-table-column>
<!--          <el-table-column prop="taskStatus" label="进度" >-->
<!--            <template slot-scope="scope">-->
<!--              <el-progress v-if="scope.row.taskStatus==0||scope.row.taskStatus==4" :stroke-width="10" :percentage="0"></el-progress>-->
<!--              <el-progress v-if="scope.row.taskStatus==1" :stroke-width="10" :percentage="50"></el-progress>-->
<!--              <el-progress v-if="scope.row.taskStatus==2||scope.row.taskStatus==3" :stroke-width="10" :percentage="100"></el-progress>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </div>
    </div>
    <!-- 设备情况 -->
    <div class="equipment-box">
      <div class="title-name">设备情况</div>
      <ul class="equipment-list">
        <li>
          <img src="@/assets/images/equipment_icon_one.png" alt="">
        <div class="equipment-title">设备总数</div>
          <p>{{equipmentList.deviceNum}}</p>
        </li>
        <li>
          <img src="@/assets/images/equipment_icon_two.png" alt="">
          <div class="equipment-title">正常设备</div>
          <p>{{equipmentList.normalDeviceNum}}</p>
        </li>
        <li>
          <img src="@/assets/images/equipment_icon_three.png" alt="">
          <div class="equipment-title">异常设备</div>
          <p>{{equipmentList.abNormalDeviceNum}}</p>
        </li>
      </ul>
    </div>
<!--    <shelfDetails v-show="shelfDetailsShow" @fatherMethod="initBtn" ref="dialog" />-->
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getWarningList,getTaskList,getDeviceStatus } from '@/api/visual/storeHouse'


export default {
  dicts:["wcs_task_type"],
  data() {
    return{
      tableData: [],
      taskTable: [],
      equipmentList: {},
    }
  },
  mounted() {
    this.getWarningTable()
    this.getTaskTable()
    this.getDeviceList()
  },
  methods: {
    // 预警信息
    getWarningTable(){
      getWarningList().then(res => {
        if(res){
          this.tableData = res.data;
        }
      })
    },
    // 任务列表
    getTaskTable(){
      getTaskList().then(res => {
        if(res){
          this.taskTable = res.data
        }
      })
    },
    // 设备情况
    getDeviceList(){
      getDeviceStatus().then(res => {
        if(res){
          this.equipmentList = res.data
        }
      })
    }

  },
}
</script>

<style scoped>
.right-content {
  position: absolute;
  width: 300px;
  height: calc(100vh - 90px);
  right: 10px;
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
.warning-box {
  width: 100%;
  height: 300px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
  margin-bottom: 20px;
}
::v-deep .warning-box .el-tag--medium{
  height: 22px;
  line-height: 20px;
}
::v-deep .warning-box .el-tag{
  padding: 0 4px;
}

#beout-echarts {
  width: 100%;
  height: 220px;
}

.table-box {
  margin: 0 15px;
}

::v-deep .el-table {
  background-color: transparent !important;
}

::v-deep .el-table__header {
  width: 100%;
}

::v-deep .el-table thead {
  background-color: rgba(0, 198, 179, 0.2) !important;
}
::v-deep .el-table thead .cell{
  color: #ABFFF7 !important;
  font-weight: 600;
}

::v-deep .el-table th {
  background-color: transparent !important;
  border-bottom: 0 !important;
  color: #fefefe !important;
}

::v-deep .el-table tr {
  background-color: transparent !important;
}

::v-deep .el-table--enable-row-transition .el-table__body td,
::v-deep .el-table .cell {
  background-color: transparent !important;
  color: #fff !important;
  font-weight: 400;
  border: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0;
  text-align: center;
}

::v-deep .el-table tr.el-table__row--striped {
  background-color: rgba(0, 198, 179, 0.15) !important;
}

::v-deep .el-table::before {
  height: 0;
}
#beout-echarts {
  width: 100%;
  height: 220px;
}

.table-box {
  margin: 0 15px;
}

::v-deep .el-table {
  background-color: transparent !important;
}

::v-deep .el-table__header {
  width: 100%;
}

::v-deep .el-table thead {
  background-color: rgba(0, 198, 179, 0.2) !important;
}
::v-deep .el-table thead .cell{
  color: #ABFFF7 !important;
  font-weight: 600;
}

::v-deep .el-table th {
  background-color: transparent !important;
  border-bottom: 0 !important;
  color: #fefefe !important;
}

::v-deep .el-table tr {
  background-color: transparent !important;
}

::v-deep .el-table--enable-row-transition .el-table__body td,
::v-deep .el-table .cell {
  background-color: transparent !important;
  color: #fff !important;
  font-weight: 400;
  border: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0;
  text-align: center;
}

::v-deep .el-table tr.el-table__row--striped {
  background-color: rgba(0, 198, 179, 0.15) !important;
}

::v-deep .el-table::before {
  height: 0;
}
::v-deep .el-progress-bar__outer{
  background: #15304C !important;
}
::v-deep .el-progress-bar__inner{
  background: #0BFC7C;
}
::v-deep .el-progress__text{
  color: #fff !important;
  font-size: 14px !important;
}
.equipment-box {
  width: 100%;
  height: 205px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 20px;
}

.equipment-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 0;
}

.equipment-list li {
  width: 33%;
  text-align: center;
  list-style: none;
}

.equipment-list li img {
  display: block;
  margin: auto;
}

.equipment-list li .equipment-title {
  color: #fff;
  font-size: 14px;
  margin: 10px 0;
}

.equipment-list li p {
  color: #00FFE7;
  font-size: 20px;
  font-weight: 800;
  margin: 10px 0;
}

.equipment-list li:nth-child(2) p {
  color: #0BFC7C;
}

.equipment-list li:nth-child(3) p {
  color: #FFF600;
}
</style>
