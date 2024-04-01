<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <!-- 新增、修改数据 -->
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="新风设备" prop="freshAirDeviceNo">
          <el-select v-model="form.freshAirDeviceNo" filterable placeholder="请选择新风设备" clearable value="">
            <el-option
              v-for="item in deviceInfoList"
              :key="item.deviceNo"
              :label="item.deviceName"
              :value="item.deviceNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width: 100%;" label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容"
                    show-word-limit maxlength="200"/>
        </el-form-item>
        <el-form-item style="width: 100%;float: unset;" label=""/>
        <el-divider content-position="center">温湿度传感器详情信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="openSelectSensor" v-hasPermi="['wcs:freshAirThtbDetailRealtion:add']">添加传感器</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="handleDeleteInbillDetail" v-hasPermi="['wcs:freshAirThtbDetailRealtion:remove']">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :row-key="getRow" :data="inbillDetailLists" :row-class-name="rowInbillDetailIndex"
                  @selection-change="handleInbillDetailSelectionChange" ref="inbillDetailLists">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="设备编号" align="center" prop="deviceNo" show-overflow-tooltip/>
          <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip/>
          <!--<el-table-column label="设备区域" align="center" prop="deviceArea" show-overflow-tooltip>-->
            <!--<template slot-scope="scope">-->
              <!--<dict-tag :options="dict.type.wms_area_type" :value="scope.row.deviceArea"/>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="设备类型" align="center" prop="deviceType" show-overflow-tooltip>-->
            <!--<template slot-scope="scope">-->
              <!--<dict-tag :options="dict.type.device_type" :value="scope.row.deviceType"/>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-form>
      <div slot="footer" style="text-align: center;margin-top: 10px;">
        <el-button icon="el-icon-save" type="primary" @click="submitForm" v-hasPermi="['wcs:freshAirThtbDetailRealtion:save']">保 存</el-button>
        <el-button icon="el-icon-close" @click="cancel">关 闭</el-button>
      </div>
    </div>
    <!-- 产品数据-选择对话框 -->
    <el-dialog title="传感器选择" :visible.sync="selectGoods.open" width="50%" append-to-body>
      <el-form :model="selectDevice.queryParams" ref="queryDeviceForm" size="small" :inline="true" label-width="0px">
        <el-form-item  label="" prop="deviceNo">
          <el-input style="width: 260px;" v-model="selectDevice.queryParams.deviceNo" placeholder="请输入设备编码" clearable
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item style="width: unset;float: unset;">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGoods">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoods">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="selectGoods.loading" :data="selectGoods.goodsInfoList" height="350"
                @selection-change="handleSelectionChangeGoods">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="设备编号" align="center" prop="deviceNo" show-overflow-tooltip/>
        <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectedGoods">确 定</el-button>
        <el-button @click="selectGoods.open = false, selectGoods.queryParams.goodsCode = ''">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 货物唯一码查询 -->
    <el-dialog title="货物唯一码查询" :visible.sync="inbillGoodsDetail.open" width="65vw" append-to-body>
      <el-form :model="inbillGoodsDetail.queryParams" :rules="rules" label-width="0px" style="display: flex;">
        <el-form-item style="width: 30%;margin-right: 10px;float: none;" label="" prop="onlyCode">
          <el-input v-model="inbillGoodsDetail.queryParams.onlyCode" placeholder="关键词" clearable
                    @keyup.enter.native="handleQueryInbillGoodsDetail"/>
        </el-form-item>
        <el-form-item style="width: unset;float: unset;">
          <el-button type="primary" icon="el-icon-search" size="mini"
                     @click="handleQueryInbillGoodsDetail">搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryInbillGoodsDetail">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="inbillGoodsDetail.inbillDetailList" height="50vh" width="100%"
                :row-class-name="rowInbillDetailIndex" ref="inbillDetail">
        <el-table-column label="序号" align="center" prop="index" width="50"/>
        <el-table-column label="货物唯一码" align="center" prop="onlyCode" minWidth="150" show-overflow-tooltip/>
        <el-table-column label="机件码" align="center" prop="partsCode" minWidth="120" show-overflow-tooltip/>
        <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="120" show-overflow-tooltip/>
        <el-table-column v-if="type==2" label="库位编码" align="center" prop="locationCode" minWidth="100"
                         show-overflow-tooltip/>
        <el-table-column v-if="type==2" label="托盘编码" align="center" prop="trayCode" minWidth="100"
                         show-overflow-tooltip/>
        <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="100" show-overflow-tooltip/>
        <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" align="center" prop="model" minWidth="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="生产日期" align="center" prop="produceTime" minWidth="120">
        </el-table-column>
        <el-table-column label="质保期(天)" align="center" prop="warranty" minWidth="100">
        </el-table-column>
      </el-table>
      <pagination v-show="inbillGoodsDetail.total > 0" :total="inbillGoodsDetail.total"
                  :page.sync="inbillGoodsDetail.queryParams.pageNum"
                  :limit.sync="inbillGoodsDetail.queryParams.pageSize"
                  @pagination="getInbillGoodsDetail"/>
    </el-dialog>
  </div>
</template>

<script>

  import {
    getInbill,
    addInbill,
    updateInbill,
    getGoodsList,
    getInbillDetailList,
    getSupplierData,
    getInbillGoodsDetail,
    getInbillGoodsByLocation,
    removeDetail
  } from '@/api/wms/warehousing/inbill'
  import { listTypeDeviceInfos, addRealtion, addGateWayRealtion, queryRelationById } from '@/api/wcs/freshAirThtbRealtion'
  import { getSensorInfoList } from "@/api/wcs/deviceBaseInfo";

  export default {
    name: 'Inbill',
    dicts: ['wms_in_stock_category', 'wms_metering_unit'],
    data() {
      return {
        id: null,
        inBillCategory: null,
        queryParams: {
          pageNum: 1,
          pageSize: 50
        },
        total: 0,
        //页面类型(0新增、修改；1展示入库明细，2展示上架信息)
        type: null,
        //供应商
        supplierData: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 表单参数
        form: {
          oldDeviceNo: '',
          freshAirDeviceNo: '',
          remark: '',
          thtbDeviceNo: '',
          inBillCategory: '2'
        },
        // 入库单信息表格数据
        inbillList: [],
        // 入库单详情信息表格数据
        inbillDetailLists: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        //查看入库详情
        inbillDetail: {
          open: false,
          form: {},
          queryParams: {
            pageNum: 1,
            pageSize: 50
          },
          total: 0,
          inbillDetailList: []
        },
        //查看上架货位详情
        showLocation: {
          open: false,
          queryParams: {
            pageNum: 1,
            pageSize: 50
          },
          total: 0,
          inbillDetailList: []
        },
        //查看货物唯一码
        inbillGoodsDetail: {
          open: false,
          queryParams: {
            onlyCode: '',
            pageNum: 1,
            pageSize: 10
          },
          total: 0,
          inbillDetailList: []
        },
        //选择货物弹窗参数
        selectGoods: {
          queryParams: {
            pageNum: 1,
            pageSize: 50,
            goodsCode: null
          },
          goodsInfoList: [],
          // 是否显示弹出层
          open: false,
          loading: false,
          total: 0,
          goodsList: []//选中的货物数据
        },
        selectDevice:{
          queryParams: {
            deviceNo:null
          }
        },
        deleteList: [],//删除的id数组
        // 表单校验
        rules: {
          // freshAirDeviceNo: [
          //     { required: true, message: "新风设备不能为空", trigger: "blur" }
          // ]
        },
        deviceInfoList: [],
        deviceType: '7',
        checkedInbillDetail: [],
        checkedDetail: []
      }
    },
    created() {
      this.getSelectList()
      this.showLocation.charg = this.$route.query.charg
      let inBillCode = this.$route.query.inBillCode
      let id = this.$route.query.id
      this.id = id
      this.form.oldDeviceNo = id
      this.form.freshAirDeviceNo = id
      if (id) {
        this.initForm(id)
      }
      this.type = this.$route.query.type
      this.showLocation.queryParams.inBillCode = inBillCode
      this.initData()
    },
    methods: {
      initForm(id) {
        queryRelationById(id).then(response => {
          if (response) {
            if (response.data.relationList) {
              this.form.remark = response.data.relationList[0].remark
            }
            if (response.data.deviceBaseInfos) {
              this.inbillDetailLists = response.data.deviceBaseInfos
            }
          }
        })
      },
      /** 查询设备信息下拉列表 */
      getSelectList() {
        listTypeDeviceInfos(this.deviceType).then(response => {
          this.deviceInfoList = response.data
        })
      },
      //下拉框数据初始化
      initData() {
        getSupplierData().then(res => {
          this.supplierData = res.data
        })
      },
      getRow(row) {
        return row.id
      },
      /** 查询入库单情况 */
      getInbillDetailList() {
        this.queryParams.ids = this.deleteList
        getInbillDetailList(this.queryParams).then(response => {
          this.inbillDetailLists = response.rows
          this.total = response.total
        })
      },
      /** 查询入库单情况 */
      getGoodsLocationList1() {
        getInbillGoodsByLocation(this.inbillDetail.queryParams).then(response => {
          this.inbillDetail.inbillDetailList = response.rows
          this.inbillDetail.total = response.total
        })
      },
      /** 查询上架货位情况 */
      getGoodsLocationList() {
        getInbillGoodsByLocation(this.showLocation.queryParams).then(response => {
          response.rows.forEach(item => {
            item.charg = this.showLocation.charg
          })
          this.showLocation.inbillDetailList = response.rows
          this.showLocation.total = response.total
        })
      },

      /** 上架货物搜索按钮操作 */
      handleQueryLocation() {
        this.showLocation.queryParams.pageNum = 1
        this.getGoodsLocationList()
      },
      /** 上架货物重置按钮操作 */
      resetQueryLocation() {
        this.showLocation.queryParams.pageNum = 1
        this.showLocation.queryParams.goodsCode = ''
        this.getGoodsLocationList()
      },

      /** 货物唯一码搜索按钮操作 */
      handleQueryInbillGoodsDetail() {
        this.inbillGoodsDetail.queryParams.pageNum = 1
        this.getInbillGoodsDetail()
      },
      /** 货物唯一码重置按钮操作 */
      resetQueryInbillGoodsDetail() {
        this.inbillGoodsDetail.queryParams.pageNum = 1
        this.inbillGoodsDetail.queryParams.onlyCode = ''
        this.getInbillGoodsDetail()
      },

      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.deviceNo)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      // 货物多选框选中数据
      handleSelectionChangeGoods(selection) {
        this.selectGoods.goodsList = selection.map(item => item)
        let arr = selection.map(item => item.deviceNo)
      },
      //选择货物后将数据添加到入库单详情中
      selectedGoods() {
        if (this.selectGoods.goodsList.length > 0) {
          this.selectGoods.goodsList.forEach(element => {
            element.inBillNum = 0
            element.supplierCode = element.supplierId
            // element.id = ''

            let isHav = false
            this.inbillDetailLists.forEach(item => {
              if (item.id === element.id) {
                isHav = true
              }
            })
            if (!isHav) {
              this.inbillDetailLists.push(element)
            }
          })
          this.selectGoods.open = false
          this.selectGoods.queryParams.goodsCode = ''
        } else {
          this.$modal.msgError('请选择数据')
        }
      },

      // 取消按钮
      cancel() {
        this.$tab.closePage();
      },

      //打开传感器选择框
      openSelectSensor() {
        //加载传感器数据
        this.getSelectSensorList()
        this.selectGoods.open = true
      },
      //查询传感器列表信息
      getSelectSensorList() {
        this.selectGoods.loading = true
        let arr1 = []
        if (this.inbillDetailLists) {
          arr1 = this.inbillDetailLists.map(item => item.deviceNo)
        }
        let result = []
        getSensorInfoList(this.selectDevice.queryParams).then(res => {
          this.selectGoods.goodsInfoList = res.data
          if (this.selectGoods.goodsInfoList && this.inbillDetailLists) {
            this.selectGoods.goodsInfoList.forEach((item, index) => {
               if (arr1.indexOf(item.deviceNo) === -1) {
                 result.push(item)
               }
            })
          }
          this.selectGoods.goodsInfoList = result
          this.selectGoods.loading = false
        })
      },
      /** 货物搜索按钮操作 */
      handleQueryGoods() {
        this.getSelectSensorList()
      },

      /** 货物重置按钮操作 */
      resetQueryGoods() {
        this.resetForm('queryDeviceForm')
        this.handleQueryGoods()
      },
      /** 提交按钮 */
      submitForm() {

        this.$refs['form'].validate(valid => {
          if (valid) {
            if (!this.form.freshAirDeviceNo) {
              this.$modal.msgError('请维护新风设备')
              return
            }
            if (this.inbillDetailLists.length === 0) {
              this.$modal.msgError('温湿度传感器详情信息不可为空')
              return
            }
            let arr  = this.inbillDetailLists.map(item => item.deviceNo)
            if (arr) {
              this.form.thtbDeviceNo = arr.join(",")
            } else {
              this.form.thtbDeviceNo = ''
            }

            this.form.inbillDetailList = this.inbillDetailLists
            if (this.form.id != null) {
              this.form.ids = this.deleteList
              this.deleteList = []
              updateInbill(this.form).then(response => {
                this.form = response.data
                this.inbillDetailLists = response.data.inbillDetailList
                this.$modal.msgSuccess('修改成功')
                this.$tab.closePage();
                this.$tab.openPage("新风-温湿度传感器关系维护", "/wcs/wcsFreshAirThtbRealtion");
              })
            } else {
              addRealtion(this.form).then(response => {
                this.$modal.msgSuccess('建立关联关系成功')
                this.$tab.closePage();
                this.$tab.openPage("新风-温湿度传感器关系维护", "/wcs/wcsFreshAirThtbRealtion");
              })
            }
          }
        })
      },

      /** 入库单详情信息序号 */
      rowInbillDetailIndex({ row, rowIndex }) {
        row.index = rowIndex + 1
      },

      /** 入库单详情信息删除按钮操作 */
      handleDeleteInbillDetail() {
        if (this.checkedInbillDetail.length == 0) {
          this.$modal.msgError('请先选择要删除的数据')
        } else {
          const inbillDetailList = this.inbillDetailLists
          const checkedInbillDetail = this.checkedInbillDetail
          this.inbillDetailLists = inbillDetailList.filter(function(item) {
            return checkedInbillDetail.indexOf(item.index) == -1
          })
          let ids = []
          this.checkedDetail.forEach(item => {
            if (item.id) {
              ids.push(item.id)
              this.deleteList.push(item.id)
            }
          })
        }
      },
      /** 复选框选中数据 */
      handleInbillDetailSelectionChange(selection) {
        this.checkedInbillDetail = selection.map(item => item.index)
        this.checkedDetail = selection.map(item => item)
      },
      /** 查看货物唯一码 */
      showInbillGoodsDetail(data) {
        this.inbillGoodsDetail.inbillDetailList = []
        this.inbillGoodsDetail.queryParams.onlyCode = ''
        this.inbillGoodsDetail.queryParams.inbillDetailId = data.id
        this.inbillGoodsDetail.goodsCode = data.goodsCode
        this.inbillGoodsDetail.goodsName = data.goodsName
        this.inbillGoodsDetail.measureUnit = data.measureUnit
        this.inbillGoodsDetail.model = data.model
        this.inbillGoodsDetail.warranty = data.warranty
        this.inbillGoodsDetail.queryParams.inbillDetailId = data.id
        this.inbillGoodsDetail.open = true
        this.getInbillGoodsDetail()
      },
      //获取唯一码数据
      getInbillGoodsDetail() {
        getInbillGoodsDetail(this.inbillGoodsDetail.queryParams).then(response => {
          response.rows.forEach(item => {
            item.goodsCode = this.inbillGoodsDetail.goodsCode
            item.goodsName = this.inbillGoodsDetail.goodsName
            item.measureUnit = this.inbillGoodsDetail.measureUnit
            item.model = this.inbillGoodsDetail.model
            item.warranty = this.inbillGoodsDetail.warranty
          })
          this.inbillGoodsDetail.inbillDetailList = response.rows
          this.inbillGoodsDetail.total = response.total
        })
      }
    }
  }
</script>
<style scoped>
  .el-form >>> .el-form-item {
    width: 33.33%;
    float: left;
  }

  .el-form >>> .el-form-item__content:last-child {
    position: unset;
  }

  .el-form >>> .el-form-item__content {
    line-height: 40px;
  }

  #search >>> .el-form-item__content {
    width: 100%;
  }

  .el-form >>> .el-input-number__decrease {
    display: none;
  }

  .el-form >>> .el-input-number__increase {
    display: none;
  }

  .el-input-number >>> .el-input__inner {
    padding-left: 15px !important;
    padding-right: 15px;
    text-align: left;
  }

  .el-table >>> .el-table__fixed::before, .el-table >>> .el-table__fixed-right::before {
    display: none;
  }
</style>
