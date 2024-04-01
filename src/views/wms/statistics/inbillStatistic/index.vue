<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="入库单号" prop="inBillCode">
            <el-input
              v-model="queryParams.inBillCode"
              placeholder="请输入入库单号"
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
          <el-form-item label="入库类别" prop="inBillCategory">
            <el-select v-model="queryParams.inBillCategory" filterable placeholder="请选择入库类别" clearable>
              <el-option
                v-for="dict in dict.type.wms_in_stock_category"
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

        <el-table v-loading="loading" :height="tableHeight" :data="inbillList">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="入库单号" align="center" prop="inBillCode" show-overflow-tooltip/>
          <el-table-column label="批次号" align="center" prop="charg" show-overflow-tooltip/>
          <el-table-column label="供应商" align="center" prop="supplierName" show-overflow-tooltip/>
          <el-table-column label="入库类别" align="center" prop="inBillCategory">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_in_stock_category" :value="scope.row.inBillCategory"/>
            </template>
          </el-table-column>

          <el-table-column label="货物编号" align="center" prop="goodsCode" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="规格" align="center" prop="model" show-overflow-tooltip/>
          <el-table-column label="单位" align="center" prop="measureUnit" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="入库数量" align="center" prop="inBillNum" show-overflow-tooltip/>
          <el-table-column label="体积(m³)" align="center" prop="volume" show-overflow-tooltip/>
          <el-table-column label="重量(kg)" align="center" prop="weight" show-overflow-tooltip/>
          <el-table-column label="入库时间" align="center" prop="createTime" show-overflow-tooltip/>
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
import { listInbill, getSupplierData} from "@/api/wms/statistics/inbillStatistic";
export default {
  name: "Inbill",
  dicts: ['wms_warehousing_status', 'wms_in_stock_category','wms_metering_unit'],
  data() {
    return {
      //供应商
      supplierData:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedInbillDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 入库单信息表格数据
      inbillList: [],
      // 入库单详情信息表格数据
      inbillDetailList: [],
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
        inBillCode: null,
        charg: null,
        inBillStatus: null,
        inBillCategory: null,
        weight: null,
        volume: null,
        docNo: null,
        inBillSerial: null,
        storageSerial: null
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inBillCode: [
            { required: true, message: "入库单号不能为空", trigger: "blur" }
        ],
        charg: [
            { required: true, message: "批次不能为空", trigger: "blur" }
        ],
        inBillStatus: [
            { required: true, message: "入库单状态;(1.待收货  2.验货中  3.上架中   4.已上架  5.已作废)不能为空", trigger: "change" }
        ],
        inBillCategory: [
            { required: true, message: "入库类别;(1.期初入库 2.普通入库  3.盘盈入库 4.晾晒入库  5.其他入库)不能为空", trigger: "change" }
        ],
        docNo: [
            { required: true, message: "根据文号不能为空", trigger: "blur" }
        ],
        inBillSerial: [
            { required: true, message: "入库流水号不能为空", trigger: "blur" }
        ],
        storageSerial: [
            { required: true, message: "库房流水号不能为空", trigger: "blur" }
        ],
        createTime: [
            { required: true, message: "创建时间不能为空", trigger: "blur" }
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
    /** 查询入库单信息列表 */
    getList() {
      this.loading = true;
      listInbill(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.inbillList = response.rows;
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
        inBillCode: null,
        charg: null,
        inBillStatus: null,
        supplierCode: null,
        supplierName: null,
        inBillCategory: null,
        weight: null,
        volume: null,
        docNo: null,
        inBillSerial: null,
        storageSerial: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.inbillDetailList = [];
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
