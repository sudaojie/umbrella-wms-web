<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div
        style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
                              margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
        style="padding-left: 10px;">
        <el-form-item label="货物编码" prop="goodsCode">
          <el-input v-model="queryParams.goodsCode" placeholder="请输入货物编码" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsName">
          <el-input v-model="queryParams.goodsName" placeholder="请输入货物名称" clearable @keyup.enter.native="handleQuery" />
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
      <el-table v-loading="loading" :data="tblstockList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip />
        <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
        <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip />
        <el-table-column label="库存数量" align="center" prop="goodsNum" show-overflow-tooltip />
        <el-table-column label="可用数量" align="center" prop="availableNum" show-overflow-tooltip />
        <el-table-column label="计量单位" align="center" prop="measureUnit" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
          </template>
        </el-table-column>
        <el-table-column label="最低库存" align="center" prop="inventoryCountMin" show-overflow-tooltip />
        <el-table-column label="最高库存" align="center" prop="inventoryCountMax" show-overflow-tooltip />
        <el-table-column label="缺货量" align="center" prop="lackNum" show-overflow-tooltip />
        <el-table-column label="超储量" align="center" prop="overNum" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>

  </div>
</template>

<script>
import { listTblstock, getTblstock, delTblstock, addTblstock, updateTblstock } from "@/api/wms/stock/warning";
import { getToken } from "@/utils/auth";
export default {
  name: "Tblstock",
  dicts: ['wms_metering_unit'],
  data() {
    return {
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
      // 库存总览表格数据
      tblstockList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        onlyCode: null,
        partsCode: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        charg: null,
        supplierCode: null,
        supplierName: null,
        warehouseCode: null,
        warehouseName: null,
        areaCode: null,
        areaName: null,
        locationCode: null,
        locationName: null,
        trayCode: null,
        listingTime: null,
        produceTime: null,
        warranty: null,
        lockStatus: null,
      },
      fileData: [],//选择的文件
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/tblstock/importData"
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {
        onlyCode: [
          { required: true, message: "货物唯一码不能为空", trigger: "blur" }
        ],
        partsCode: [
          { required: true, message: "机件号不能为空", trigger: "blur" }
        ],
        goodsCode: [
          { required: true, message: "货物编码不能为空", trigger: "blur" }
        ],
        goodsName: [
          { required: true, message: "货物名称不能为空", trigger: "blur" }
        ],
        measureUnit: [
          { required: true, message: "计量单位不能为空", trigger: "blur" }
        ],
        charg: [
          { required: true, message: "批次不能为空", trigger: "blur" }
        ],
        supplierCode: [
          { required: true, message: "供应商编码不能为空", trigger: "blur" }
        ],
        warehouseCode: [
          { required: true, message: "仓库编号不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "仓库名称不能为空", trigger: "blur" }
        ],
        areaCode: [
          { required: true, message: "库区编号不能为空", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "库区名称不能为空", trigger: "blur" }
        ],
        locationCode: [
          { required: true, message: "库位编号不能为空", trigger: "blur" }
        ],
        locationName: [
          { required: true, message: "库位名称不能为空", trigger: "blur" }
        ],
        trayCode: [
          { required: true, message: "托盘编号不能为空", trigger: "blur" }
        ],
        listingTime: [
          { required: true, message: "上架时间不能为空", trigger: "blur" }
        ],
        produceTime: [
          { required: true, message: "生产日期不能为空", trigger: "blur" }
        ],
        warranty: [
          { required: true, message: "质保期;天不能为空", trigger: "blur" }
        ],
        delFlag: [
          { required: true, message: "记录状态;(0:未删除  1:已删除)不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize', this.setTableGeight);
  },
  methods: {
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
    setTableGeight() {
      this.$nextTick(() => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240);

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
        onlyCode: null,
        partsCode: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        charg: null,
        supplierCode: null,
        supplierName: null,
        warehouseCode: null,
        warehouseName: null,
        areaCode: null,
        areaName: null,
        locationCode: null,
        locationName: null,
        trayCode: null,
        listingTime: null,
        produceTime: null,
        warranty: null,
        lockStatus: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
   
    
  }
};
</script>
<style scoped>
.el-form>>>.el-input-number__decrease {
  display: none;
}

.el-form>>>.el-input-number__increase {
  display: none;
}

.el-input-number>>>.el-input__inner {
  padding-left: 15px !important;
  padding-right: 15px;
  text-align: left;
}

.el-table>>>.el-table__fixed::before,
.el-table>>>.el-table__fixed-right::before {
  display: none;
}
</style>
