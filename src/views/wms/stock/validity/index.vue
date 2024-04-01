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
      <el-table v-loading="loading" :data="tblstockList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="供应商名称" align="center" prop="supplierName" show-overflow-tooltip />
        <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip />
        <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
        <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip />
        <el-table-column label="计量单位" align="center" prop="measureUnit" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
          </template>
        </el-table-column>
        <el-table-column label="货物唯一码" align="center" prop="onlyCode" show-overflow-tooltip />
        <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip />
        <el-table-column label="有效期" align="center" prop="periodValidity" show-overflow-tooltip />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.validity_status" :value="scope.row.status" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { listTblstock } from "@/api/wms/stock/validity";
export default {
  name: "Tblstock",
  dicts: ['wms_metering_unit', 'validity_status'],
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
        goodsCode: null,
        goodsName: null
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {
        goodsCode: [
          { required: true, message: "货物编码不能为空", trigger: "blur" }
        ],
        goodsName: [
          { required: true, message: "货物名称不能为空", trigger: "blur" }
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
        produceTime: null
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
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        default:
          break;
      }
    }
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
