<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
        margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
        style="padding-left: 10px;">
        <el-form-item label="入库单号" prop="inBillCode">
          <el-input v-model="queryParams.inBillCode" placeholder="请输入入库单号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="批次" prop="charg">
          <el-input v-model="queryParams.charg" placeholder="请输入批次" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="inBillStatus">
              <el-select v-model="queryParams.inBillStatus" filterable placeholder="请选择状态" clearable>
                <el-option
                  v-for="dict in dict.type.wms_warehousing_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item> -->
        <el-form-item label="入库类别" prop="inBillCategory">
          <el-select v-model="queryParams.inBillCategory" filterable placeholder="请选择入库类别" clearable>
            <el-option v-for="dict in dict.type.wms_in_stock_category" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-printer" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['warehousing:inbill:printer']">打印唯一码</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="inbillList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="入库单号" align="center" prop="inBillCode" minWidth="180">
          <!-- <template slot-scope="scope">
              <a @click="showInbillDetail(scope.row)" style="color:blue;">{{ scope.row.inBillCode }}</a>
            </template> -->
        </el-table-column>
        <el-table-column label="批次" align="center" prop="charg" minWidth="160" />
        <el-table-column label="入库类别" align="center" prop="inBillCategory" minWidth="120">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_in_stock_category" :value="scope.row.inBillCategory" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="inBillStatus" minWidth="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_warehousing_status" :value="scope.row.inBillStatus" />
          </template>
        </el-table-column>
        <el-table-column label="制单人" align="center" prop="createBy" minWidth="120" />
        <el-table-column label="制单时间" align="center" prop="createTime" minWidth="160" />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!--打印唯一码对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="80%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="入库单号" style="width: 33.33%;" prop="inBillCode">
          {{ form.inBillCode }}
        </el-form-item>
        <el-form-item label="批次" style="width: 33.33%;" prop="charg">
          {{ form.charg }}
        </el-form-item>
        <el-form-item label="入库类别" style="width: 33.33%;" prop="inBillCategory">
          <template slot-scope="form">
            <dict-tag :options="dict.type.wms_in_stock_category" :value="form.inBillCategory" />
          </template>
        </el-form-item>
        <el-form-item label="制单人" style="width: 33.33%;" prop="createBy">
          {{ form.createBy }}
        </el-form-item>
        <el-form-item label="制单时间" style="width: 33.33%;" prop="createTime">
          {{ form.createTime }}
        </el-form-item>

        <el-form-item style="width: 100%;float: none;"></el-form-item>
        <el-divider content-position="center">入库明细</el-divider>

        <el-table :data="inbillGoodsDetailList" height="280" :row-class-name="rowInbillDetailIndex"
          ref="inbillGoodsDetailList" @selection-change="handleSelectionChangeGoods">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="货物唯一码" align="center" prop="onlyCode" minWidth="150" show-overflow-tooltip />
          <!-- <el-table-column label="机件码" align="center" prop="partsCode" width="150" show-overflow-tooltip/> -->
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="150">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="打印状态" align="center" prop="printStatus" minWidth="150">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_print_status" :value="scope.row.printStatus" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printData(0)">打印</el-button>
        <el-button type="primary" @click="printData(1)">补打</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 打印预览框 -->
    <el-dialog title="二维码打印" :visible.sync="print.open" width="800px" append-to-body>
      <div class="demo-image">
        <div v-for="item in print.dataList" class="block">
          <!-- <span class="demonstration">{{ item.name }}</span> -->
          <span class="demonstration code">{{ item.code }}</span>
          <el-image style="width: 200px; height: 200px" :src="item.url" fit="cover" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printListData(print.dataList)">确定</el-button>
        <el-button @click="print.open = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInbill, getInbill, getSupplierData, getPrintData, updateInbillGoods } from "@/api/wms/warehousing/inbill";
import { getToken } from "@/utils/auth";
export default {
  name: "Inbill",
  dicts: ['wms_print_status', 'wms_warehousing_status', 'wms_in_stock_category', 'wms_metering_unit', 'wms_enable_status'],
  data() {
    return {
      //供应商
      supplierData: [],
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
      // 入库单详情的实际货物表格数据
      inbillGoodsDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //查看入库详情
      inbillDetail: {
        open: false,
        form: {},
        inbillDetailList: []
      },
      //查看上架货位详情
      showLocation: {
        open: false,
        queryParams: {},
        inbillDetailList: []
      },
      //查看货物唯一码
      inbillGoodsDetail: {
        open: false,
        queryParams: {
          onlyCode: ''
        },
        inbillDetailList: []
      },
      //打印参数
      print: {
        open: false,
        dataList: [
        ],
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inBillCode: null,
        charg: null,
        inBillStatus: '1-1',
        inBillCategory: null,
        weight: null,
        volume: null,
        docNo: null,
        inBillSerial: null,
        storageSerial: null,
      },
      //选择货物弹窗参数
      selectGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
        },
        goodsInfoList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        goodsList: [],//选中的货物数据
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
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
    initData() {
      getSupplierData().then(res => {
        this.supplierData = res.data
      })
    },
    /** 查询入库单信息列表 */
    getList() {
      this.loading = true;
      listInbill(this.queryParams).then(response => {
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
        remark: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 货物多选框选中数据
    handleSelectionChangeGoods(selection) {
      this.selectGoods.ids = selection.map(item => item.id)
      this.selectGoods.goodsList = selection.map(item => item)
    },
    //打印唯一码数据
    printData(type) {
      if (this.selectGoods.goodsList.length == 0) {
        this.$modal.msgError("请选择要打印的数据");
        return;
      }
      if (type == 0) {//打印
        for (var item in this.selectGoods.goodsList) {
          if (this.selectGoods.goodsList[item].printStatus != 0) {
            this.$modal.msgError("打印不可包含已打印状态的数据");
            return;
          }
        }
      } else {//补打
        for (var item in this.selectGoods.goodsList) {
          if (this.selectGoods.goodsList[item].printStatus != 1) {
            this.$modal.msgError("补打不可包含未打印状态的数据");
            return;
          }
        }
      }
      getPrintData({ ids: this.selectGoods.ids }).then(res => {
        this.print.dataList = res.data;
        this.print.type = type;
        this.print.dataList.forEach(item => {
          let src = process.env.VUE_APP_BASE_API + item.url;
          item.url = src
          console.log(item.url);
        });
        this.print.open = true;
      })
    },
    //确认打印
    printListData(data) {
      this.$prompt('请输入打印份数', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^[1-9]\d{0,1}$/,
        inputErrorMessage: "打印份数在1,99范围内"
      }).then(({ value }) => {
        if (this.print.type == 0) {
          updateInbillGoods({ ids: this.selectGoods.ids, printStatus: 1 }).then(res => {
            getInbill(this.ids).then(response => {
              this.form = response.data;
              // this.inbillDetailList = response.data.inbillDetailList;
              this.inbillGoodsDetailList = response.data.inbillGoodsDetailList;
              this.open = true;
              this.title = "修改入库单信息";
            });
          })
        }
        this.print.open = false;
        this.$modal.msgSuccess("成功" + (this.print.type == 0 ? "打印" : "补打") + data.length + "条数据" + value + "份");
      }).catch(() => { });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInbill(id).then(response => {
        this.form = response.data;
        // this.inbillDetailList = response.data.inbillDetailList;
        this.inbillGoodsDetailList = response.data.inbillGoodsDetailList;
        this.open = true;
        this.title = "修改入库单信息";
      });
    },

    /** 入库单详情信息序号 */
    rowInbillDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },

  }
};
</script>
<style scoped>
.el-dialog__wrapper>>>.el-form-item {
  width: 50%;
  float: left;
}

.demo-image .block {
  padding: 10px 0;
  text-align: center;
  border: solid 1px;
  display: inline-block;
  width: 32%;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 5px;
  margin-bottom: 10px;
}

.demo-image .block:last-child {
  margin-right: none;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-bottom: 5px;
  height: 32px;
}

.demo-image .code {
  font-size: 16px;
  font-weight: bolder;
  margin-bottom: 5px;
  height: 40px;
}
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
 display: none;
}
</style>
