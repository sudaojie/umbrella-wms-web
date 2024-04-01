<template>
    <div>
        <el-tabs v-model="agvName" class="agv-tab">
            <el-tab-pane label="AGV1" name="first">
              <div class="status-info-box">
                <div class="agv-box">
                  <div class="agv-title">AGV信息</div>
                  <div class="agv-list">
                    <div class="agv-list-box" v-for="item in agvList" :key="item.name">
                      <span>{{item.name}}</span>
                      <span>{{item.state}}</span>
                      <span>{{item.company}}</span>
                    </div>
                  </div>
                </div>
                <div class="agv-box">
                  <div class="agv-title">AGV位置</div>
                  <div class="agv-list">
                    <div class="agv-list-box" v-for="item in positionList" :key="item.name">
                      <span>{{item.name}}</span>
                      <span>{{item.state}}</span>
                      <span>{{item.company}}</span>
                    </div>
                  </div>
                </div>
                <div class="agv-box">
                  <div class="agv-title">电池参数</div>
                  <div class="agv-list">
                    <div class="agv-list-box" v-for="item in parameterList" :key="item.name">
                      <span>{{item.name}}</span>
                      <span>{{item.state}}</span>
                      <span>{{item.company}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="AGV2" name="second">
              <div class="status-info-box">
                <div class="agv-box">
                  <div class="agv-title">AGV1信息</div>
                  <div class="agv-list">
                    <div class="agv-list-box" v-for="item in agvList" :key="item.name">
                      <span>{{item.name}}</span>
                      <span>{{item.state}}</span>
                      <span>{{item.company}}</span>
                    </div>
                  </div>
                </div>
                <div class="agv-box">
                  <div class="agv-title">AGV位置</div>
                  <div class="agv-list">
                    <div class="agv-list-box" v-for="item in positionList" :key="item.name">
                      <span>{{item.name}}</span>
                      <span>{{item.state}}</span>
                      <span>{{item.company}}</span>
                    </div>
                  </div>
                </div>
                <div class="agv-box">
                  <div class="agv-title">电池参数</div>
                  <div class="agv-list">
                    <div class="agv-list-box" v-for="item in parameterList" :key="item.name">
                      <span>{{item.name}}</span>
                      <span>{{item.state}}</span>
                      <span>{{item.company}}</span>
                    </div>
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
                        name: '车载状态',
                        state: '系统启动中',
                    },
                    {
                        name: '速度',
                        state: '000',
                        company:'mm/s',
                    },
                    {
                        name: '工作任务总数',
                        state: '0000'
                    },
                    {
                        name: '车载模式',
                        state: '在线模式'
                    },
                    {
                        name: '里程',
                        state: '0000',
                        company:'m',
                    },
                    {
                        name: '障碍物距离',
                        state: '0000'
                    },
                    {
                        name: '任务状态',
                        state: '空闲'
                    },
                    {
                        name: '角度',
                        state: '0000',
                        company:'°',
                    },
                    {
                        name: '下个任务位置',
                        state: '0000'
                    },
                    {
                        name: '行驶状态',
                        state: '停止'
                    },
                    {
                        name: '编号',
                        state: '0000'
                    },
                    {
                        name: '定位状态',
                        state: '0000'
                    },
                    {
                        name: '充电任务',
                        state: '初始化'
                    },
                    {
                        name: '叉臂高度',
                        state: '000',
                        company:'m',
                    },
                    {
                        name: '位置',
                        state: '000'
                    },
                    // {
                    //     name: '叉臂任务',
                    //     state: '初始化'
                    // },
                    // {
                    //     name: '路线',
                    //     state: '初始化'
                    // },
                    {
                        name: '避障类型',
                        state: '顶端雷达避障停止区出发'
                    }
                ],
                positionList:[
                    {
                        name: 'X坐标',
                        state: '00',
                        company:'m/s',
                    },
                    {
                        name: 'Y坐标',
                        state: '00',
                        company:'m/s',
                    },
                    {
                        name: '角度',
                        state: '00',
                        company:'°',
                    }
                ],
                parameterList:[
                {
                        name: '电量',
                        state: '100',
                        company:'%',
                    },
                    {
                        name: '电压',
                        state: '00',
                        company:'V',
                    },
                    {
                        name: '电流',
                        state: '00',
                        company:'A',
                    }
                ]
            }
        }
    }
</script>
<style scoped>
   /* ::v-deep .el-tabs__header{
        height: 100% !important;
    } */
   .status-info-box {
     /*display: flex;*/
   }
    .agv-box{
        /*border: 1px solid #ede6e6;*/
      width: 100%;
      margin-bottom: 20px;
      background: #F5F7FA;
      border-radius: 10px;
      padding: 10px;
      float: left;
      /*height: 360px;*/
    }
    .agv-title {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #DFE4ED;
        /*background: #f5f5f5;*/
        text-align: center;
    }
    .agv-list{
        display: flex;
        align-content: flex-start;
        flex-flow: row wrap;
        margin: 20px 0;
    }
    .agv-list-box{
        height: 40px;
        line-height: 40px;
        width: 33.33%;
        margin: 5px 0;
        /*margin: 0 1%;*/
    }
   .agv-list-box span{
     display: inline-block;
     font-size: 12px;
   }
    .agv-list-box span:first-child{
        /*min-width: 68px;*/
         width: 30%;
         margin-right: 2%;
        text-align: right;
        color: #888
    }
   .agv-list-box span:nth-child(2){
     width: 55%;
     /*width: 169px;*/
     height: 30px;
     line-height: 30px;
     text-align: center;
     font-size: 12px;
     background: #FFFFFF;
     border: 1px solid #DFE4ED;
     border-radius: 3px;
   }
   .agv-list-box span:nth-child(3){
     width: 3%;
     font-size: 12px;
     margin-left: 5px;
   }
   .agv-box-two .agv-list-box,
   .agv-box-three .agv-list-box{
     width: 100%;
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

   /*//当屏幕最小宽度为1440px*/
   @media screen and (max-width : 1440px) {
     .agv-box-one{
       width: 99%;
     }
     .agv-box-two{
       width: 49%;
     }
     .agv-box-three{
       width: 49%;
     }
   }
</style>
