<template>
    <div>
        <el-tabs v-model="agvName" class="agv-tab">
            <el-tab-pane label="AGV1" name="first">
              <div class="agv-box">
                <div class="agv-title">AGV1信息</div>
                <div class="agv-list">
                    <div class="agv-list-box" v-for="(item,index) in agvList" :key="index">
                        <span>{{item.name}}</span>
                        <span :class="[item.state==0?'state-blue':[item.state=='1'?'state-red':'']]"></span>
                    </div>
                </div>
                <div class="agv-list">
                  <div class="agv-list-box" v-for="(item,index) in positionList" :key="index">
                    <span>{{item.name}}</span>
                    <span :class="[item.state==0?'state-blue':[item.state=='1'?'state-red':'']]"></span>
                  </div>
                </div>
              </div>
              <div class="agv-box">
                <div class="agv-title">I/O输出</div>
                <div class="agv-list agv-list-io">
                  <div class="agv-list-box" v-for="(item,index) in parameterList" :key="index">
                    <span>{{item.name}}</span>
                    <span :class="[item.state==0?'state-blue':[item.state=='1'?'state-red':'']]"></span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="AGV2" name="second">
              <div class="agv-box">
                <div class="agv-title">AGV2信息</div>
                <div class="agv-list">
                  <div class="agv-list-box" v-for="(item,index) in agvList" :key="index">
                    <span>{{item.name}}</span>
                    <span :class="[item.state==0?'state-blue':[item.state=='1'?'state-red':'']]"></span>
                  </div>
                </div>
                <div class="agv-list">
                  <div class="agv-list-box" v-for="(item,index) in positionList" :key="index">
                    <span>{{item.name}}</span>
                    <span :class="[item.state==0?'state-blue':[item.state=='1'?'state-red':'']]"></span>
                  </div>
                </div>
              </div>
              <div class="agv-box">
                <div class="agv-title">I/O输出</div>
                <div class="agv-list agv-list-io">
                  <div class="agv-list-box" v-for="(item,index) in parameterList" :key="index">
                    <span>{{item.name}}</span>
                    <span :class="[item.state==0?'state-blue':[item.state=='1'?'state-red':'']]"></span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                agvName: 'first',
                agvList: [
                    {
                        name: '手动模式',
                        state:0
                    },
                    {
                        name: '自动模式',
                        state:0
                    },
                    {
                        name: '充电受光器',
                        state:0
                    },
                   {
                         name: '急停按钮',
                         state:0
                   },
                    {
                        name: '绿色按钮',
                        state: 0
                    },
                    {
                        name: '红色按钮',
                        state: 1
                    },
                    {
                        name: '左避障停止区',
                        state: 0
                    },
                    {
                        name: '右避障停止区',
                        state: 0
                    },
                    {
                        name: '障碍物距离传感器',
                        state: 0
                    },
                    {
                        name: '安全触边',
                        state: 1
                    },
                    {
                        name: '货叉上限位',
                        state: 0
                    },
                    {
                        name: '',
                        state: 2
                    }
                ],
                positionList:[
                    {
                        name: '左叉尖传感器',
                        state: 0,
                    },
                    {
                        name: '右叉尖传感器',
                        state: 0,
                    },
                    {
                        name: '左叉根传感器',
                        state: 0,
                    },
                  {
                    name: '右叉根传感器',
                    state: 0,
                  },
                  {
                    name: '左支腿传感器',
                    state: 0,
                  },
                  {
                    name: '右支腿传感器',
                    state: 0,
                  },
                  {
                    name: '左叉夹臂尖传感器',
                    state: 0,
                  },
                  {
                    name: '右叉夹臂尖传感器',
                    state: 0,
                  },
                  {
                    name: '左叉夹臂打开到位',
                    state: 0,
                  },
                  {
                    name: '',
                    state: 2,
                  },
                  {
                    name: '',
                    state: 2,
                  },
                  {
                    name: '',
                    state: 2,
                  }
                ],
                parameterList:[
                {
                        name: '初始化',
                        state: 0,
                    },
                    {
                        name: '手动继电器',
                        state: 0,
                    },
                    {
                        name: '充电续电器',
                        state: 1,
                    },
                  {
                    name: '左三色灯-黄',
                    state: 0,
                  },{
                    name: '左三色灯-绿',
                    state: 0,
                  },
                  {
                    name: '左三色灯-红',
                    state: 0,
                  },
                  {
                    name: '右三色灯-黄',
                    state: 0,
                  },
                  {
                    name: '右三色灯-绿',
                    state: 0,
                  },{
                    name: '右三色灯-红',
                    state: 0,
                  },
                  {
                    name: '示宽灯',
                    state: 0,
                  },
                  {
                    name: '驱动器电源',
                    state: 0,
                  },
                  {
                    name: '充电发光器',
                    state: 0,
                  }
                ]
            }
        }
    }
</script>
<style scoped>
    /* ::v-deep .agv-tab .el-tabs__header{
        height: 100% !important;
    } */
    .agv-box{
       font-size: 14px;
       /*margin-bottom: 30px;*/
       overflow: hidden;
    }
    .agv-title {
        height: 50px;
        line-height: 50px;
        background: #F5F7FA;
        text-align: center;
        margin-bottom: 20px;
    }
    ::v-deep .el-descriptions{
      width: 50%;
    }
    ::v-deep .my-label {
      background: #F5F7FA;
      border-right: none !important;
    }

    ::v-deep .my-content {
      background: #F5F7FA;
      border-left: none !important;
    }
    ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell{
       border-right: none !important;
     }





    .agv-list{
        width: 49%;
        margin: 0 0.5% 20px;
        float: left;
        /*border-radius: 10px;*/
    }
    .agv-list-io{
      width: 99%;
    }
    .agv-list-box{
        height: 60px;
        line-height: 60px;
        width: 25%;
        float: left;
        margin-left: -1px;
        margin-top: -1px;
        list-style: none;
        border: 1px solid #DFE4ED;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
    }
    .agv-list-box:nth-child(1),
    .agv-list-box:nth-child(3),
    .agv-list-box:nth-child(6),
    .agv-list-box:nth-child(8),
    .agv-list-box:nth-child(9),
    .agv-list-box:nth-child(11),
    .agv-list-box:nth-child(14),
    .agv-list-box:nth-child(16),
    .agv-list-box:nth-child(17),
    .agv-list-box:nth-child(19){
      background: #F5F7FA;
    }
    .agv-list-box:nth-child(1){
      border-radius: 10px 0 0 0 ;
    }
    .agv-list-box:nth-child(4){
      border-radius: 0 10px 0 0 ;
    }
    .agv-list-box:nth-child(9){
      border-radius: 0 0 0  10px;
    }
    .agv-list-box:nth-child(12){
      border-radius: 0 0 10px 0;
    }

    .agv-list-box span:first-child{
        font-size: 14px;
        color: #333;
        font-weight: bold;
        display: inline-block;
        margin-left: 15px;
    }
    .agv-list-box span:last-child{
      display: inline-block;
      width: 23px;
      height: 23px;
      border-radius: 50%;
      margin-right: 15px;
    }
    .state-blue {
      background: #89D522;
      border: 2px solid #fff;
      box-shadow:0 0 5px #d4edb9;
    }
    .state-red {
      background: #f11a52;
      border: 2px solid #fff;
      box-shadow:0 0 5px #e4718f;
    }
    ::v-deep .agv-tab .el-tabs__nav-wrap::after{
      background-color: transparent;
    }
    ::v-deep .agv-tab .el-tabs__nav{
      width: 160px;
      height: 32px;
      background: #F5F7FA;
      border: 1px solid #DFE4ED;
      border-radius: 5px;
      overflow: hidden;
    }
    ::v-deep .agv-tab .el-tabs__active-bar{
      height: 0;
      background: #fff;
    }
    ::v-deep .agv-tab .el-tabs__item{
      width: 50%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding: 0 ;
    }
    ::v-deep .agv-tab .el-tabs__item.is-active{
      color: #fff;
      background-color: #1890ff;
    }
    @media screen and (max-width : 1440px) {
      .agv-list{
        width: 99%;
        /*margin: 20px 0;*/
      }
    }
</style>
