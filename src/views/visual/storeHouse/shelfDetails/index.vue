<template>
  <div class="shelf-box">
    <div class="shelf-top">
      <div>#{{goodName}}</div>
      <div class="shelf-button el-icon-close" @click="shelfButton()"></div>
    </div>
    <div class="shelf-details">
      <div class="shelf-list" v-for="(item,index) in shelfList" :key="index">
        <el-descriptions :title="item.title" :column="1" v-if="item.goodsName == undefined ||item.goodsName == null || item.goodsName == ''">
          <el-descriptions-item label="托盘号">{{item.trayCode}}</el-descriptions-item>
          <el-descriptions-item label="库位号">{{item.locationName}}</el-descriptions-item>
          <el-descriptions-item label="库位状态">
            <span v-if="item.locationStatus == '0'">有货</span>
            <span v-if="item.locationStatus == '1'">有托盘无货</span>
            <span v-if="item.locationStatus == '2'">无托盘</span>
            <span v-if="item.locationStatus == '3'">禁用</span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :title="item.title" :column="1" v-else>
          <el-descriptions-item label="唯一码">{{item.onlyCode}}</el-descriptions-item>
          <el-descriptions-item label="机件号">{{item.partCode}}</el-descriptions-item>
          <el-descriptions-item label="生产日期">{{item.produceTime}}</el-descriptions-item>
          <el-descriptions-item label="托盘号">{{item.trayCode}}</el-descriptions-item>
          <el-descriptions-item label="货物类型">{{item.goodsName}}</el-descriptions-item><el-descriptions-item label="库位状态">
          <span v-if="item.locationStatus == '0'">有货</span>
          <span v-if="item.locationStatus == '1'">有托盘无货</span>
          <span v-if="item.locationStatus == '2'">无托盘</span>
          <span v-if="item.locationStatus == '3'">禁用</span>
        </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import { cargoInfo } from '@/api/visual/alllLocationList'
export default {
  data() {
    return {
      // shelfBox: true,
      goodName:'',
      shelfList: []
    }
  },
  mounted() {
    // this.shelfButton()
    // this.popupDetails()
  },
  methods: {
    shelfButton() {
      this.$emit('fatherMethod');
      this.$parent.$parent.$refs.iframeDom.contentWindow.send(201)
    },
    popupDetails(goodName){
      this.shelfList = []
      this.goodName = ''
      cargoInfo(goodName).then(res => {
        this.shelfList = []
        let cargoInfoData = res.data
        this.goodName = cargoInfoData.locationCode
        if(cargoInfoData.goodsDetailVoList == undefined ||cargoInfoData.goodsDetailVoList == null ||cargoInfoData.goodsDetailVoList.length <= 0){
            let goodsInfo = {
              // partCode: item.partCode,
              // produceTime: item.produceTime,
              trayCode: cargoInfoData.trayCode,
              goodsName: cargoInfoData.goodsName,
              locationName: cargoInfoData.locationName,
              locationStatus:cargoInfoData.locationStatus
            }
            this.shelfList.push(goodsInfo)
        }else {
          cargoInfoData.goodsDetailVoList.forEach(item => {
            let goodsInfo = {
                onlyCode: item.onlyCode,
                partCode: item.partCode,
                produceTime: item.produceTime,
                trayCode: cargoInfoData.trayCode,
                goodsName: cargoInfoData.goodsName,
                locationName: cargoInfoData.locationName,
                locationStatus:cargoInfoData.locationStatus
            }
              this.shelfList.push(goodsInfo)
          })
        }

      })
    },
    // init(e) {
    //     this.shelfBox = true;
    //     //data是父组件弹窗传递过来的值，我们可以打印看看
    //     console.log(e.data.id);
    // }
  },
}
</script>

<style scoped>
.shelf-box {
  width: 60%;
  min-height: 300px;
  background: rgba(30, 34, 35, 0.7);
  border-radius: 20px;
  position: absolute;
  top: 20%;
  left: 50%;
  margin-left: -30%;
  overflow: hidden;
  /* display: none; */
}

.shelf-top {
  background: #5ecdbd;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
}

.shelf-button {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  background: #ebf2f7;
  text-align: center;
  cursor: pointer;
}

.shelf-button:hover {
  background: #e5ebef;
}

.shelf-details {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 475px;
  overflow: auto;
}

.shelf-list {
  margin: 20px;
  width: 21.5%;
}

::v-deep .el-descriptions__header {
  color: #1ed6c4;
  margin-bottom: 0;
  line-height: 30px;
}

::v-deep .el-descriptions__title {
  font-size: 20px;
}

::v-deep .el-descriptions__body {
  background: transparent;
}

::v-deep .el-descriptions-item__label {
  color: #DCDCDC;
  font-size: 16px;
  width: 70px;
  justify-content: end;
}

::v-deep .el-descriptions-item__content {
  color: #fff;
  font-size: 18px;
}

::v-deep .el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
  padding-bottom: 0;
}
</style>
