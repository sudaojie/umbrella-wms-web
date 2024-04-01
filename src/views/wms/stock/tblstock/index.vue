<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              v-model="queryParams.goodsName"
              placeholder="请输入货物名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="仓库" prop="warehouseName">
            <el-select v-model="queryParams.warehouseCode" filterable placeholder="请选择仓库" clearable>
              <el-option
                v-for="dict in warehouseData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDetailQuery">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :height="tableHeight" :data="tblstockList">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="批次" align="center" prop="charg" width="180px">
            <template slot-scope="scope">
              <a @click="showTblstockDetail(scope.row)" style="color:blue;">{{ scope.row.charg }}</a>
            </template>
          </el-table-column>
          <el-table-column label="货物编码" align="center" prop="goodsCode" />
          <el-table-column label="货物名称" align="center" prop="goodsName" />
          <el-table-column label="规格型号" align="center" prop="model" />
          <el-table-column label="计量单位" width="100" align="center" prop="measureUnit">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="库位编码" align="center" prop="locationCode" />
          <!-- <el-table-column label="库位名称" align="center" prop="locationName" /> -->
          <el-table-column label="托盘编号" align="center" prop="trayCode" />
          <el-table-column label="货物数量" align="center" prop="goodsNum" />
        </el-table>
        <pagination
          
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>

    <!-- 库存货位信息对话框 -->
    <el-dialog :title="title" :v-loading="tblstockDetailInfo.loading" :visible.sync="tblstockDetailInfo.open" append-to-body
               width="60%">

      <div style="background-color: white;border-radius: 10px;">
        <el-form :model="tblstockDetailInfo.queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px" style="padding-left: 10px;">
          <el-form-item label="货物唯一码" prop="onlyCode">
            <el-input
              v-model="tblstockDetailInfo.queryParams.onlyCode"
              placeholder="请输入货物唯一码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="机件号" prop="partsCode">
            <el-input
              v-model="tblstockDetailInfo.queryParams.partsCode"
              placeholder="请输入机件号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="产品编号" prop="goodsCode">
            <el-input
              v-model="tblstockDetailInfo.queryParams.goodsCode"
              placeholder="请输入产品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="产品名称" prop="goodsName">
            <el-input
              v-model="tblstockDetailInfo.queryParams.goodsName"
              placeholder="请输入产品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="产品规格" prop="model">
            <el-input
              v-model="tblstockDetailInfo.queryParams.model"
              placeholder="请输入产品规格"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDetailQuery">搜索</el-button>
<!--            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
          </el-form-item>
        </el-form>
      </div>

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-table :data="tblstockDetailList" :row-class-name="rowInbillDetailIndex" ref="tblstockDetailList">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="货物唯一码" align="center" prop="onlyCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="产品编码" align="center" prop="goodsCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="产品名称" align="center" prop="goodsName" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="计量单位" width="100" align="center" prop="measureUnit">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="120" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <pagination
          v-show="tblstockDetailInfo.total>0"
          :total="tblstockDetailInfo.total"
          :page.sync="tblstockDetailInfo.queryParams.pageNum"
          :limit.sync="tblstockDetailInfo.queryParams.pageSize"
          @pagination="getDetailList()"
        />
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { listTblstock, getWarehouseData, showTblstockDetail } from "@/api/wms/stock/tblstock";
export default {
  name: "Tblstock",
  dicts: [ 'wms_metering_unit'],
  data() {
    return {
      //仓库
      warehouseData:[],
      //货位基本信息
      tblstockDetailList: [],
      //批次号
      charg: null,
      //货物编码
      goodsCode: null,
      //货位号
      locationCode: null,
      //托盘号
      trayCode: null,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 库存总览表格数据
      tblstockList: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsCode: null,
        goodsName: null,
        warehouseName: null,
        onlyCode: null,
        partsCode: null,
        measureUnit: null,
        model: null,
        charg: null,
      },
      //库存信息弹窗参数
      tblstockDetailInfo: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
        },
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        // 表单参数
        form: {},
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inBillCategory: [
          { required: true, message: "入库类别不能为空", trigger: "blur" }
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
      getWarehouseData().then(res => {
        this.warehouseData = res.data
      })
    },
    /** 查询库存总览列表 */
    getList() {
      this.loading = true;
      listTblstock(this.queryParams).then(response => {
        this.tblstockList = response.rows;
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
    // 表单详情重置
    resetDetail() {
      this.tblstockDetailInfo.form = {
        goodsCode: null,
        goodsName: null,
        warehouseCode: null,
        warehouseName: null
      };
      this.resetForm("form");
    },
    // 表单重置
    reset() {
      this.form = {
        goodsCode: null,
        goodsName: null,
        warehouseCode: null,
        warehouseName: null
      };
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.printInbill.open = false;
      this.reset();
    },
    /** 库存信息按钮操作 */
    showTblstockDetail(row) {
      this.reset();
      this.queryParams.charg = row.charg;
      this.charg = row.charg;
      this.goodsCode = row.goodsCode;
      this.locationCode = row.locationCode;
      this.trayCode = row.trayCode;
      this.tblstockDetailInfo.open=true
      this.getDetailList();
    },

    /** 库存详情信息序号 */
    rowInbillDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /**
     * 库存详情搜索按钮操作
     * handleDetailQuery
     * */
    handleDetailQuery(){
      this.queryParams.pageNum = 1;
      this.tblstockDetailInfo.loading = true;
      this.getDetailList();
    },
    /** 查询货物唯一码列表 */
    getDetailList() {
      this.tblstockDetailInfo.queryParams.charg=this.charg,
      this.tblstockDetailInfo.queryParams.goodsCode=this.goodsCode,
      this.tblstockDetailInfo.queryParams.locationCode=this.locationCode,
      this.tblstockDetailInfo.queryParams.trayCode=this.trayCode,
      showTblstockDetail(this.tblstockDetailInfo.queryParams).then(response => {
        this.tblstockDetailList = response.rows;
        this.tblstockDetailInfo.total = response.total;
        this.tblstockDetailInfo.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 重置详情按钮操作 */
    resetDetailQuery() {
      this.resetForm("queryForm");
      this.handleDetailQuery();
    },
  }
};
</script>
<style scoped>
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
 display: none;
}
</style>
