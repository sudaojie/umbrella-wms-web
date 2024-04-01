<template>
  <div class="app-container light-check-container">
    <div class="title-style">照明系统</div>
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline" ref="searchForm" :model="searchForm" label-width="80px">
        <el-form-item label="设备编号">
          <el-input v-model="searchForm.deviceNo"
                    placeholder="输入编号"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="区域类型">
          <el-select v-model="searchForm.deviceArea" placeholder="请选择活动区域" clearable>
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="center-box">
      <div class="top-button">
        <el-checkbox v-model="flag" @change="selectAll">全选</el-checkbox>
        <el-button size="small" type="primary" @click="batchSet">批量设置</el-button>
        <el-button size="small" type="primary" @click="start">启动</el-button>
        <el-button size="small" type="warning" @click="pause">停止</el-button>
      </div>
      <div class="card-warp">
        <div class="card-list" v-for="(item,index) in cardList" :key="index">
            <el-checkbox-group v-model="item.choose" @change="change(item)">
            <el-checkbox></el-checkbox>
          </el-checkbox-group>
          <div class="card-list-left">
            <img src="@/assets/lightCheck/zm_img.png" alt="">
          </div>
          <div class="card-list-right">
            <div class="card-name">{{item.deviceNo}}</div>
            <div class="switch-box">
              <el-switch
                v-model="item.switchStatus"
                active-color=""
                inactive-color="#ff4949"
                @change="startOrPause(item)">
                >
              </el-switch>
            </div>
            <div class="card-system">
              <span>{{item.deviceName}}</span>
              <span
                :class="item.systemStatus === 0?'normal':'abnormal'">{{item.systemStatus === 0 ? '正常' : '异常'}}</span>
            </div>
            <div class="card-form">
              <el-form ref="lightingForm">
                <el-form-item label="开始时间">
                  <el-time-picker
                    v-model="item.beginTime"
                    placeholder="">
                  </el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-time-picker
                    v-model="item.endTime"
                    placeholder="">
                  </el-time-picker>
                </el-form-item>
                <el-button size="mini" type="primary" @click="saveData(item)">保存</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    弹出框-->
    <el-dialog
      title="批量设置"
      :visible.sync="dialogVisible"
      custom-class="dialog-box"
      width="20%">
      <div class="saveBatchForm">
        <el-form ref="batchForm" :model="batchForm">
          <div class="switch-box">
            <el-switch
              v-model="batchForm.batchOpenCloseFlag"
              active-color=""
              inactive-color="#ff4949">
              >
            </el-switch>
          </div>
          <el-form-item label="开始时间">
            <el-time-picker
              v-model="batchForm.beginTime"
              placeholder="">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-time-picker
              v-model="batchForm.endTime"
              placeholder="">
            </el-time-picker>
            <el-button size="mini" type="primary" @click="saveBatchSetTime()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import { listInfo, saveData, start, pause, getBatchSetTime, saveBatchSetTime } from '@/api/wcs/smartLightingDetailInfo'

  export default {
    name: 'lightCheck',
    data() {
      return {
        switchStatus:'',
        dialogVisible: false,
        batchForm: {
          beginTime: '',
          endTime: '',
          batchOpenCloseFlag: true,
        },
        flag: false,
        regionOptions: [{
          value: '1',
          label: '晾晒区'
        }, {
          value: '0',
          label: '存储区'
        }, {
          value: '2',
          label: '理货区'
        }],
        searchForm: {
          deviceNo: '',
          deviceArea: ''
        },
        cardList: [],
        chooseArr: [],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      saveBatchSetTime() {
        saveBatchSetTime(this.batchForm).then(response => {
          if (response) {
            if (response.data) {
              this.$message.success('保存成功')
              this.dialogVisible = false
            }
          }
        })
      },
      batchSet() {
        this.dialogVisible = true
        getBatchSetTime().then(response => {
          if (response) {
            if (response.data) {
              this.batchForm.beginTime = response.data.beginTime
              this.batchForm.endTime = response.data.endTime
              this.batchForm.batchOpenCloseFlag = response.data.batchOpenCloseFlag
            }
          }
        })
      },
      startOrPause(item) {
        if (item.switchStatus) {
          start(item.smartLightId).then(response => {
            if (response) {
              if (response.data) {
                this.$message.success('开启成功')
                this.flag = false;
                this.getList()
                this.clear()
              }
            }
          })
        } else {
          pause(item.smartLightId).then(response => {
            if (response) {
              if (response.data) {
                this.$message.success('停止成功')
                this.flag = false;
                this.getList()
                this.clear()
              }
            }
          })
        }
      },
      start() {
        if (this.chooseArr && this.chooseArr.length > 0) {
          start(this.chooseArr.join(',')).then(response => {
            if (response) {
              if (response.data) {
                this.$message.success('开启成功')
                this.flag = false;
                this.getList()
                this.clear()
              }
            }
          })
        } else {
          this.$message.warning('请选择至少一个照明设备启动')
        }
      },
      pause() {
        if (this.chooseArr && this.chooseArr.length > 0) {
          pause(this.chooseArr.join(',')).then(response => {
            if (response) {
              if (response.data) {
                this.$message.success('停止成功')
                this.flag = false;
                this.getList()
                this.clear()
              }
            }
          })
        } else {
          this.$message.warning('请选择至少一个照明设备停止')
        }
      },
      saveData(item) {
        if (item.switchStatus) {
          item.switchStatus = 1
        } else {
          item.switchStatus = 0
        }
        let object = {
          id: item.smartLightId,
          deviceInfoId: item.id,
          switchStatus: item.switchStatus,
          beginTime: item.beginTime,
          endTime: item.endTime
        }
        item.switchStatus = item.switchStatus === 1
        saveData(object).then(response => {
          if (response) {
            if (response.data) {
              this.$message.success('保存成功')
            }
          }
        })
      },
      selectAll() {
        if (this.flag) {
          let cardArr = this.cardList
          let arr = cardArr.map((item, index, cardArr) => {
              return item.smartLightId
            }
          )
          this.chooseArr = []
          this.chooseArr = this.chooseArr.concat(arr)
          this.cardList.map(item => item.choose = true)
        } else {
          this.chooseArr = []
          this.cardList.map(item => item.choose = false)
        }
      },
      change(item) {
        if (item.choose) {
          if (this.chooseArr.indexOf(item.smartLightId) === -1) {
            this.chooseArr.push(item.smartLightId)
          }
        } else {
          this.flag = false
          if (this.chooseArr.indexOf(item.smartLightId) !== -1) {
            this.chooseArr.splice(this.chooseArr.indexOf(item.smartLightId), 1)
          }
        }
      },
      getList() {
        listInfo(this.searchForm).then(response => {
          if (response) {
            this.cardList = response.data
            this.cardList.forEach(item => {
              item.switchStatus = item.switchStatus === 1
              item.choose = false
            })
          }
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.searchForm = {
          deviceNo: '',
          deviceArea: ''
        }
        this.handleQuery()
      }
    }
  }
</script>

<style scoped>
  .light-check-container {
    margin: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    min-height: 1000px;
  }

  .title-style {
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  ::v-deep .search-box .el-icon-search {
    color: #419fff;
  }

  .top-button {
    margin: 10px;
  }

  .top-button .el-checkbox {
    margin-right: 30px;
  }

  ::v-deep .top-button .el-button--small {
    padding: 5px 12px;
  }

  .center-box {
    background: #f5f7fa;
    border-radius: 10px;
    min-height: 300px;
    padding: 10px;
    overflow: hidden;
  }

  .card-warp {

  }

  .card-warp .card-list {
    position: relative;
    width: 31%;
    height: 285px;
    margin: 1%;
    background: #fff;
    box-shadow: 0px 10px 20px 0px rgba(0, 38, 66, 0.1);
    border-radius: 5px;
    float: left;
    display: flex;
  }

  .el-checkbox-group {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .card-warp .card-list .card-list-left {
    width: 30%;
    height: 100%;
    background-image: -moz-linear-gradient(180deg, rgb(255, 248, 240) 0%, rgb(245, 233, 220) 100%);
    background-image: -webkit-linear-gradient(180deg, rgb(255, 248, 240) 0%, rgb(245, 233, 220) 100%);
    background-image: linear-gradient(180deg, rgb(255, 248, 240) 0%, rgb(245, 233, 220) 100%);
    position: relative;
  }

  .card-warp .card-list .card-list-left img {
    position: absolute;
    width: 70px;
    height: 84px;
    left: 50%;
    top: 50%;
    margin-left: -42px;
    margin-top: -35px;
    display: block;
  }

  .card-warp .card-list .card-list-right {
    position: relative;
    width: 70%;
    padding: 20px;
  }

  .card-warp .card-list .card-list-right .card-name {
    font-size: 20px;
    color: #333
  }

  .card-warp .card-list .card-list-right .switch-box {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .card-warp .card-list .card-list-right .card-system {
    font-size: 14px;
    margin: 10px 0;
  }

  .card-warp .card-list .card-list-right .card-system span:first-child {
    color: #333;
    border-right: 1px solid #333;
    padding-right: 10px;
    margin-right: 10px;
  }

  .card-form .el-button {
    float: right;
  }

  .card-warp .card-list .card-list-right .normal {
    color: #24a432;
  }

  .card-warp .card-list .card-list-right .abnormal {
    color: pink;
  }

  .saveBatchForm .el-button {
    float: right;
    margin-top: 10px;
  }

  ::v-deep .el-switch {
    height: 25px;
    line-height: 25px;
  }

  ::v-deep .el-switch__core {
    height: 25px;
    border: 1px solid #dde1e8 !important;
    border-radius: 12px;
    width: 60px !important;
  }

  ::v-deep .el-switch__core:after {
    width: 20px;
    height: 20px;
    background: #ffffff;
  }

  ::v-deep .el-switch.is-checked .el-switch__core:after {
    box-shadow: 0px 3px 6px 0px rgba(64, 158, 255, 0.3);
    background: #409eff;
    width: 20px;
    height: 20px;
  }

  ::v-deep .el-switch.is-checked .el-switch__core::after {
    margin-left: -22px;
  }

  ::v-deep .el-switch.is-checked .el-switch__core {
    border-color: #dde1e8;
    background: #f5f7fa;
  }

  ::v-deep .el-form-item--medium .el-form-item__label {
    width: 100%;
    text-align: left;
  }

  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }

  ::v-deep .el-date-editor.el-input {
    width: 100%;
  }
  ::v-deep .el-dialog__body{
    padding: 10px 20px !important;

  }
  ::v-deep .dialog-box .switch-box{
    display: flex;
    justify-content: flex-end;
  }
  ::v-deep .dialog-box .switch-box .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  ::v-deep .dialog-box .switch-box .el-switch__label--right {
    z-index: 1;
    left: 3px;
    line-height: 20px;
    color: #bbbfc7;
  }
  ::v-deep .dialog-box .switch-box .el-switch__label--left {
    z-index: 1;
    left: 28px;
    line-height: 20px;
  }
  ::v-deep .dialog-box .switch-box .el-switch__label.is-active {
    display: block;
  }
</style>

