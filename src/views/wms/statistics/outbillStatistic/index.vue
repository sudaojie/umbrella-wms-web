<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="出库单号" prop="outBillCode">
            <el-input
              v-model="queryParams.outBillCode"
              placeholder="请输入出库单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="供应商" prop="supplierCode">
            <el-select v-model="queryParams.supplierCode" filterable placeholder="请选择供应商" clearable>
              <el-option
                v-for="dict in supplierData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="出库类别" prop="outBillCategory">
            <el-select v-model="queryParams.outBillCategory" filterable placeholder="请选择出库类别" clearable>
              <el-option
                v-for="dict in dict.type.wms_outbill_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              v-model="queryParams.goodsName"
              placeholder="请输入货物名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :height="tableHeight" :data="outbillList">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="出库单号" align="center" prop="outBillCode" show-overflow-tooltip/>
          <el-table-column label="批次号" align="center" prop="charg" show-overflow-tooltip/>
          <el-table-column label="供应商" align="center" prop="supplierName" show-overflow-tooltip/>
          <el-table-column label="出库类别" align="center" prop="outBillCategory" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_outbill_type" :value="scope.row.outBillCategory" />
            </template>
          </el-table-column>
          <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="规格" align="center" prop="model" show-overflow-tooltip/>
          <el-table-column label="单位" width="100" align="center" prop="measureUnit">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="出库数量" align="center" prop="outBillNum" show-overflow-tooltip/>
          <el-table-column label="重量(kg)" align="center" prop="weight" show-overflow-tooltip/>
          <el-table-column label="体积(m³)" align="center" prop="volume" show-overflow-tooltip/>
          <el-table-column label="出库时间" align="center" prop="createTime" show-overflow-tooltip/>
        </el-table>

        <pagination
          
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>

  </div>
</template>

<script>
import { listOutbill, getSupplierData } from "@/api/wms/statistics/outbillStatistic";
import { getToken } from "@/utils/auth";
export default {
  name: "Outbill",
  dicts: ['wms_warehousing_status', 'wms_in_stock_category', 'wms_outbill_status', 'wms_outbill_type', 'wms_metering_unit'],
  data() {
    return {
      //供应商
      supplierData:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 出库单信息表格数据
      outbillList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outBillCode: null,
        outBillStatus: null,
        outBillCategory: null,
        freightVehicleNo: null,
        receiveAddress: null,
        issuingUnit: null,
        shippingType: null,
        receivingUnit: null,
        issuingBasis: null,
        address: null,
        outBillNo: null
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        outBillCode: [
            { required: true, message: "出库单号不能为空", trigger: "blur" }
        ],
        outBillStatus: [
            { required: true, message: "出库状态;(1.待拣货  2.拣货中  3.已出库 4.已作废)不能为空", trigger: "change" }
        ],
        outBillCategory: [
            { required: true, message: "出库类别;(1.正常出库 2.调拨出库  3.报损出库  4.盘亏出库)不能为空", trigger: "blur" }
        ],
        freightVehicleNo: [
            { required: true, message: "运货车牌号不能为空", trigger: "blur" }
        ],
        receiveAddress: [
            { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        issuingUnit: [
            { required: true, message: "发付单位不能为空", trigger: "blur" }
        ],
        shippingType: [
            { required: true, message: "运输方式不能为空", trigger: "change" }
        ],
        receivingUnit: [
            { required: true, message: "接收单位不能为空", trigger: "blur" }
        ],
        issuingBasis: [
            { required: true, message: "发付依据不能为空", trigger: "blur" }
        ],
        address: [
            { required: true, message: "到站不能为空", trigger: "blur" }
        ],
        outBillNo: [
            { required: true, message: "出库文号不能为空", trigger: "blur" }
        ],
      },
      //表格高度
      tableHeight:0,
    };
  },
  created() {
    this.getList();
    this.initData();
    this.setTableGeight()
    window.addEventListener('resize',this.setTableGeight)
  },
  methods: {
    //下拉框数据初始化
    initData(){
      getSupplierData().then(res => {
        this.supplierData = res.data
      })
    },
    /** 查询出库单信息列表 */
    getList() {
      this.loading = true
      listOutbill(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.outbillList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        outBillCode: null,
        outBillStatus: null,
        outBillCategory: null,
        freightVehicleNo: null,
        receiveAddress: null,
        issuingUnit: null,
        shippingType: null,
        receivingUnit: null,
        issuingBasis: null,
        address: null,
        outBillNo: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        dateRange: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style scoped>

  .el-form>>>.el-input-number__decrease{
    display: none;
  }
  .el-form>>>.el-input-number__increase{
    display: none;
  }
  .el-input-number>>>.el-input__inner{
    padding-left: 15px !important;
    padding-right: 15px;
    text-align: left;
  }

</style>
