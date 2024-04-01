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
        <el-form-item label="单据编号" prop="accountCode">
          <el-input v-model="queryParams.accountCode" placeholder="请输入单据编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="单据类型" prop="codeType">
          <el-select v-model="queryParams.codeType" filterable placeholder="请选择单据类型" clearable>
            <el-option v-for="dict in dict.type.account_bill_type" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="批次号" prop="charg">
          <el-input v-model="queryParams.charg" placeholder="请输入批次号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
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

      <el-table v-loading="loading" :data="accountList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column label="单据编号" align="center" prop="accountCode" show-overflow-tooltip />
        <el-table-column label="单据类型" align="center" prop="codeType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.account_bill_type" :value="scope.row.codeType" />
          </template>
        </el-table-column>
        <el-table-column label="批次号" align="center" prop="charg" show-overflow-tooltip />
        <!-- <el-table-column label="仓库名称" align="center" prop="warehouseName" show-overflow-tooltip /> -->
        <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip />
        <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
        <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip />
        <el-table-column label="计量单位" align="center" prop="measureUnit" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
          </template>
        </el-table-column>
        <el-table-column label="变动数量" align="center" prop="changeNum" show-overflow-tooltip />
        <el-table-column label="结存量" align="center" prop="stockNum" show-overflow-tooltip />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { listAccount } from "@/api/wms/stock/account";
export default {
  name: "Account",
  dicts: ['wms_metering_unit', 'account_bill_type'],
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
      // 库存台账表格数据
      accountList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accountCode: null,
        codeType: null,
        charg: null,
        goodsCode: null,
        goodsName: null,
      },
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize', this.setTableGeight);
  },
  methods: {
    /** 查询库存台账列表 */
    getList() {
      this.loading = true;
      listAccount(this.queryParams).then(response => {
        this.accountList = response.rows;
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

    // 表单重置
    reset() {
      this.form = {
        id: null,
        accountCode: null,
        codeType: null,
        charg: null,
        warehouseCode: null,
        warehouseName: null,
        changeNum: null,
        stockNum: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
