<template>
  <div>
    <div class="stacker-table">
      <div class="warn-title">堆垛机任务状态</div>
      <el-table
        :data="stackerTable"
        style="width: 100%">
        <el-table-column
          prop="number"
          label="编号"
          align="center"
          width="">
        </el-table-column>
        <el-table-column
          prop="taskNumber"
          label="堆垛机反馈任务号"
          align="center"
          width="">
          <template slot-scope="scope">
            <el-tag type="info" effect="plain" color="#F0F7FF">{{scope.row.taskNumber}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskType"
          label="堆垛机反馈任务类型"
          align="center">
          <template slot-scope="scope">
            <el-tag type="info" effect="plain" color="#FFF0F0">{{scope.row.taskType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentState"
          label="堆垛机当前状态"
          align="center">
          <template slot-scope="scope">
            <el-tag  type="info" effect="plain" color="#FFF0F0">{{scope.row.currentState}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="onLine"
          label="是否联机"
          align="center">
          <template slot-scope="scope">
            <el-tag  type="info" effect="plain" color="#FFF0F0">{{scope.row.onLine}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentRow"
          label="堆垛机当前排"
          align="center">
          <template slot-scope="scope">
            <el-tag  type="info" effect="plain">{{scope.row.currentRow}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="stacker-box">
      <div class="stacker-box-left">
        <div class="stacker-title">
          <div class="stacker-title-box">传感器状态</div>
          <div class="stacker-state">
            <div class="stacker-state-box">
              <span class="stacker-state-blue"></span>
              <span>TRUE</span>
            </div>
            <div class="stacker-state-box">
              <span class="stacker-state-red"></span>
              <span>FALSE</span>
            </div>
          </div>
        </div>
        <div class="stacker-list">
          <div class="stacker-list-box" v-for="(item,index) in stackerList" :key="index">
            <div class="stacker-list-title">{{item.title}}</div>
            <div class="stacker-list-center">
              <div class="stacker-list-left">
                <div class="stacker-list-text">
                  <span>{{item.stateNumOne}}</span>
                  <span :class="[item.stateOne==0?'stacker-state-blue':'stacker-state-red']"></span>
                </div>
                <div class="stacker-list-text">
                  <span>{{item.stateNumTwo}}</span>
                  <span :class="[item.stateTwo==0?'stacker-state-blue':'stacker-state-red']"></span>
                </div>
                <div class="stacker-list-text">
                  <span>{{item.stateNumThree}}</span>
                  <span :class="[item.stateThree==0?'stacker-state-blue':'stacker-state-red']"></span>
                </div>
              </div>
              <div class="stacker-img"><img :src="item.img" alt=""></div>
            </div>
          </div>
        </div>
      </div>
      <div class="stacker-box-right">
        <div class="stacker-title">
          <div class="stacker-title-box">传感器状态</div>
          <div class="stacker-state">
            <div class="stacker-state-box">
              <span class="stacker-state-blue"></span>
              <span>TRUE</span>
            </div>
            <div class="stacker-state-box">
              <span class="stacker-state-red"></span>
              <span>FALSE</span>
            </div>
          </div>
        </div>
        <div class="stacker-list">
          <div class="stacker-list-box" v-for="(item,index) in stackerStateList" :key="index">
            <div class="stacker-list-title">{{item.title}}</div>
            <div class="stacker-list-center">
              <div class="stacker-list-left">
                <div class="stacker-list-text">
                  <span>{{item.stateNumOne}}</span>
                  <span :class="[item.stateOne==0?'stacker-state-blue':'stacker-state-red']"></span>
                </div>
                <div class="stacker-list-text">
                  <span>{{item.stateNumTwo}}</span>
                  <span :class="[item.stateTwo==0?'stacker-state-blue':'stacker-state-red']"></span>
                </div>
                <div class="stacker-list-text">
                  <span>{{item.stateNumThree}}</span>
                  <span :class="[item.stateThree==0?'stacker-state-blue':'stacker-state-red']"></span>
                </div>
              </div>
              <div class="stacker-img"><img :src="item.img" alt=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
               stackerTable:[
                 {
                   number:'#1',
                   taskNumber:'0/1',
                   taskType:'入库',
                   currentState:'无任务',
                   onLine:'脱机',
                   currentRow:'无货'
                 },
                 {
                   number:'#2',
                   taskNumber:'0/1',
                   taskType:'入库',
                   currentState:'无任务',
                   onLine:'脱机',
                   currentRow:'无货'
                 },
                 {
                   number:'#3',
                   taskNumber:'0/1',
                   taskType:'入库',
                   currentState:'无任务',
                   onLine:'脱机',
                   currentRow:'无货'
                 }
               ],
               stackerList:[
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon1.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon2.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon3.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon4.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon5.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon6.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon7.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon8.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon3.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon9.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon10.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon13.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon13.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon14.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon14.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon19.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon19.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon19.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon19.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon21.png'),
                 },
                 {
                   title:'超重保护',
                   stateNumOne:'1#',
                   stateOne:0,
                   stateNumTwo:'2#',
                   stateTwo:0,
                   stateNumThree:'3#',
                   stateThree:1,
                   img:require('@/assets/wcsImages/stacker_icon21.png'),
                 },
               ],
                stackerStateList:[
               {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
                {
                  title:'超重保护',
                  stateNumOne:'1#',
                  stateOne:0,
                  stateNumTwo:'2#',
                  stateTwo:0,
                  stateNumThree:'3#',
                  stateThree:1,
                  img:require('@/assets/wcsImages/sb_icon1.png'),
                },
              ],
                stackerFormOne: {
                    detailsList: [{
                        name: '水平位置',
                        number: 0
                    }, {
                        name: '垂直位置',
                        number: 0
                    }, {
                        name: '货叉位置',
                        number: 0
                    }],
                    originList: [
                        {
                            name: '水平原点',
                            status:0

                        }, {
                            name: '垂直原点',
                            status:1
                        }, {
                            name: '货叉原点',
                            status:0
                        }
                    ],
                    stateList: [
                        {
                            name: '水平前进',
                            status:0
                        },
                        {
                            name: '水平后退',
                            status:1
                        }
                    ],
                    speedInput: '2',
                    stateListTwo: [
                        {
                            name: '垂直上升',
                            status:1
                        },
                        {
                            name: '垂直下降',
                            status:0
                        }
                    ],
                    speedInputTwo: '1',
                    stateListThree: [
                        {
                            name: '货叉左伸',
                            status:0
                        },
                        {
                            name: '货叉右伸',
                            status:0
                        }
                    ],
                    speedInputThree: '2',
                },
                stackerFormTwo: {
                    detailsList: [{
                        name: '水平位置',
                        number: 0
                    }, {
                        name: '垂直位置',
                        number: 0
                    }, {
                        name: '货叉位置',
                        number: 0
                    }],
                    originList: [
                        {
                            name: '水平原点',
                            status:0
                        }, {
                            name: '垂直原点',
                            status:1
                        }, {
                            name: '货叉原点',
                            status:0
                        }
                    ],
                    stateList: [
                        {
                            name: '水平前进',
                            status:0
                        },
                        {
                            name: '水平后退',
                            status:0
                        }
                    ],
                    speedInput: '2',
                    stateListTwo: [
                        {
                            name: '垂直上升',
                            status:0
                        },
                        {
                            name: '垂直下降',
                            status:0
                        }
                    ],
                    speedInputTwo: '1',
                    stateListThree: [
                        {
                            name: '货叉左伸',
                            status:0
                        },
                        {
                            name: '货叉右伸',
                            status:0
                        }
                    ],
                    speedInputThree: '2',
                },
                stackerFormThree: {
                    detailsList: [{
                        name: '水平位置',
                        number: 0
                    }, {
                        name: '垂直位置',
                        number: 0
                    }, {
                        name: '货叉位置',
                        number: 0
                    }],
                    originList: [
                        {
                            name: '水平原点',
                            status:0
                        }, {
                            name: '垂直原点',
                            status:0
                        }, {
                            name: '货叉原点',
                            status:0
                        }
                    ],
                    stateList: [
                        {
                            name: '水平前进',
                            status:0
                        },
                        {
                            name: '水平后退',
                            status:1
                        }
                    ],
                    speedInput: '2',
                    stateListTwo: [
                        {
                            name: '垂直上升',
                            status:1
                        },
                        {
                            name: '垂直下降',
                            status:0
                        }
                    ],
                    speedInputTwo: '1',
                    stateListThree: [
                        {
                            name: '货叉左伸',
                            status:0
                        },
                        {
                            name: '货叉右伸',
                            status:0
                        }
                    ],
                    speedInputThree: '2',
                },

                conveyorBelt: [
                    // {
                    //     title: '传输带1',
                    //     status:0
                    // },
                    {
                        name:'超宽',
                        status:0
                    },
                    {
                        name:'超高',
                        status:0
                    },
                    {
                        name:'有无货' ,
                        status:0
                    }

                ]

            }
        }
    }
</script>

<style scoped>
    .stacker-table{
      margin-bottom: 20px;
    }
    .warn-title{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 10px;
    }
    .el-tag--plain.el-tag--info{
      color: #333;
    }
    .stacker-box{
      overflow: hidden;
    }
    .stacker-box-left{
      width: 66.5%;
      float: left;
      background: #F5F7FA;
      border-radius: 10px;
      min-height: 800px;
      padding: 20px;
    }
    .stacker-title{
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      align-items: center;
    }
    .stacker-title-box{
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
    .stacker-state{
      display: flex;
      justify-content: space-between;
    }
    .stacker-state .stacker-state-box{
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      margin-right: 10px;
    }
    .stacker-state{
      font-size: 12px;
      color: #666;
    }
    .stacker-state-box span:first-child,
    .stacker-list-text span:last-child{
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .stacker-list-text span:last-child{
      margin-top: 10px;
    }
    .stacker-state-blue{
      background: #89D522;
      border: 2px solid #fff;
      box-shadow: 0 0 5px #d4edb9;
    }
    .stacker-state-red{
      background: #ff3333;
      border: 2px solid #fff;
      box-shadow: 0 0 5px #ffc4c4;
    }
    .stacker-list{
      display: flex;   /* flex布局 */
      justify-content: flex-start;   /* 左对齐 */
      flex-wrap: wrap;   /* 换行 */
    }
    .stacker-list-box{
      background: #FFFFFF;
      box-shadow: 0px 5px 10px 0px rgba(56,89,120,0.1);
      border-radius: 5px;
      padding: 20px;
      margin-right: 20px;
      width: calc((100% - 60px) / 4);
      margin-top: 20px;
    }
    .stacker-list-box:nth-of-type(4n+0) {
      margin-right: 0;
    }
    .stacker-list-center{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stacker-list-left{
      display: flex;
    }
    .stacker-list-left .stacker-list-text{
      margin-right: 10px;
    }
    .stacker-list-left .stacker-list-text span{
      display: block;
    }
    .stacker-img{
      width: 66px;
      height: 66px;
      background: #F0F7FF;
      border-radius: 10px;
      position: relative;
    }
    .stacker-img img{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }

    .stacker-box-right{
      width: 31%;
      float: right;
      background: #F5F7FA;
      border-radius: 10px;
      min-height: 800px;
      padding: 20px;
    }
    .stacker-box-right .stacker-list-box{
      width: calc((100% - 20px) / 2);
      margin-top: 20px;
    }
    .stacker-box-right .stacker-list-box:nth-of-type(2n+0) {
      margin-right: 0;
    }
    @media screen and (max-width : 1440px) {
      .stacker-box-left .stacker-list-box{
        width: calc((100% - 20px) / 2);
      }
      .stacker-box-left .stacker-list-box:nth-of-type(2n+0) {
        margin-right: 0 !important;
      }
      .stacker-box-right .stacker-list-box{
        width: calc((100% - 0px) / 1);
      }
      .stacker-box-right .stacker-list-box:nth-of-type(1n+0) {
        margin-right: 0;
      }
    }
</style>
