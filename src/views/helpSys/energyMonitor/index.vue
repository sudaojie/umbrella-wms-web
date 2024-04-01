<template>
  <div class="energy-monitor-container">
     <el-tabs v-model="activeName">
       <el-tab-pane label="能耗统计" name="first" lazy><energyStatistics /></el-tab-pane>
       <el-tab-pane label="电压/电流" name="second" lazy><voltageAndCurrent /></el-tab-pane>
       <el-tab-pane label="功率" name="third" lazy><power /></el-tab-pane>
     </el-tabs>
  </div>
</template>

<script>
  import { getToken } from "@/utils/auth";
  import energyStatistics from './energyStatistics/index'
  import voltageAndCurrent from './voltageAndCurrent/index'
  import power from './power/index'
  import { listSideDeviceInfoTree, loadHistoryRecords } from '@/api/wcs/energyConsumeMonitor'
  export default {
    name: "energyMonitor",
    components:{
      energyStatistics,
      voltageAndCurrent,
      power
    },
    data() {
      return {
        activeName:'first'
      };
    },
    created() {
    },
    methods: {
    }
  };
</script>

<style>
.energy-monitor-container {
  margin: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  min-height: 1000px;
}
</style>
