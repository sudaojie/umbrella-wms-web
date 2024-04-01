<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <!-- 新增、修改数据 -->
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
      <el-form ref="queryForm" :model="queryParams" :rules="rules" label-width="80px">
        <el-form-item label="入库单号" prop="inBillCode">
          <el-select v-loading="loading" style="width: 100%;" filterable v-model="queryParams.inBillCode"
            @change="getCategoryCode(queryParams)" placeholder="请选择入库单" clearable>
            <el-option v-for="item in inBillCodeList" :key="item.categoryCode" :label="item.inBillCode"
              :value="item.inBillCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsCode" :key="Math.random()">
          <el-select style="width: 100%;" filterable @change="$forceUpdate()" v-model="queryParams.goodsCode"
            placeholder="请选择货物名称" clearable>
            <el-option v-for="item in categoryCodeList" :key="item.categoryCode" :label="item.goods_name"
              :value="item.goods_code" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-table v-loading="loading" :data="partsList" @selection-change="handleSelectionChange">
          <el-table-column label="入库单号" align="center" prop="inBillCode" show-overflow-tooltip />
          <el-table-column label="货物编码" align="center" width="150" prop="goodsCode"   show-overflow-tooltip />
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
          <el-table-column label="唯一码" align="center" prop="onlyCode" show-overflow-tooltip />
          <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.partsCode" placeholder="请输入机件号" show-word-limit />
            </template>
          </el-table-column>
          <el-table-column label="生产日期" align="center" prop="produceTime" width="230">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.produceTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择生产日期">
              </el-date-picker>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
      <div slot="footer" style="text-align: center;margin-top: 10px;">
        <el-button icon="el-icon-save" type="primary" @click="submitForm">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import { addListParts, getCategoryCode, findAddInbillCode, updateParts } from "@/api/wms/warehousing/parts";
import { getToken } from "@/utils/auth";
export default {
  name: "Inbill",
  dicts: ['wms_print_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //选中的数据
      selectedData: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 机件号记录表格数据
      partsList: [],
      //货物类型列表
      categoryCodeList: [],
      //初始化入库单号列表
      inBillCodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partsCode: null,
        produceTime: null,
        periodValidity: null,
        printStatus: null,
        inBillCode: null,
        categoryCode: null,
        onlyCode: null,
      },
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
        url: process.env.VUE_APP_BASE_API + "/warehousing/parts/importData"
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {
        partsCode: [
          { required: true, message: "机件号不能为空", trigger: "blur" }
        ],
        produceTime: [
          { required: true, message: "生产日期不能为空", trigger: "blur" }
        ],
        // periodValidity: [
        //   { required: true, message: "有效期不能为空", trigger: "blur" }
        // ],
      },
      activeTab: 'first'
    };
  },
  created() {
    this.getList();
    this.findInbillCode();
  },
  methods: {
    /** 初始化获取入库单号 */
    findInbillCode() {
      this.inBillCodeList = [];
      this.loading = true;
      findAddInbillCode(this.queryParams).then(response => {
        this.inBillCodeList = response.data;
      });
    },
    /** 级联获取物品类型 */
    getCategoryCode(data) {
      this.queryParams.goodsCode = "";
      getCategoryCode(this.queryParams).then(response => {
        this.categoryCodeList = response.data;
      })
    },
    /** 查询机件号记录列表 */
    getList() {
      this.loading = true;
      this.findInbillCode();
      console.log('queryParams', this.queryParams)
      addListParts(this.queryParams).then(response => {
        this.partsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      const obj = { path: "/wmsJob/parts" };
      this.$tab.closeOpenPage(obj);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.selectedData = selection.map(item => item)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.goodsCode = "";
      this.queryParams.inBillCode = "";
      this.categoryCodeList = [];
      // this.inBillCodeList=[];
      this.handleQuery();
    },

    /** 提交按钮 */
    submitForm() {
      let count = 0;
      let arr = [];
      for (let i=0;i<this.partsList.length;i++) {
        let obj = this.partsList[i];
        obj.produceDate = obj.produceTime;
        if(!obj.partsCode&&!obj.produceDate){
          continue;
        }
        if(!obj.partsCode){
          this.$modal.msgError("请维护机件号");
          return;
        }else{
          if(!obj.produceDate){
            this.$modal.msgError("请维护生产日期");
            return;
          }
        }
        if(!obj.produceDate){
          this.$modal.msgError("请维护生产日期");
          return;
        }
        if(obj.partsCode&&obj.produceDate){
          arr.push(obj);
        }
      }
      if(arr.length>0){
        updateParts(arr).then(response => {
          this.resetQuery();
          this.$modal.msgSuccess("保存成功");
          this.getList();
        })
      }else{
        this.$modal.msgError("请先维护数据");
      }

    },
  }
};
</script>
<style scoped>
.el-form>>>.el-form-item {
  width: 33.33%;
  float: left;
}

.el-form>>>.el-form-item__content:last-child {
  position: unset;
}

.el-form>>>.el-form-item__content {
  line-height: 40px;
}

#search>>>.el-form-item__content {
  width: 100%;
}

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
