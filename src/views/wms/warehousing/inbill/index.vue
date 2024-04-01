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
        <el-form-item label="状态" prop="inBillStatus">
          <el-select v-model="queryParams.inBillStatus" filterable placeholder="请选择状态" clearable>
            <el-option v-for="dict in dict.type.wms_warehousing_status" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['warehousing:inbill:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-printer" size="mini" :disabled="single" @click="handlePrint"
            v-hasPermi="['warehousing:inbill:printer']">打印入库单</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['warehousing:inbill:remove']">删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="inbillList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="入库单号" align="center" prop="inBillCode" minWidth="180px">

        </el-table-column>
        <el-table-column label="批次" align="center" prop="charg" minWidth="160px" />
        <el-table-column label="状态" align="center" prop="inBillStatus" minWidth="100px">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_warehousing_status" :value="scope.row.inBillStatus" />
          </template>
        </el-table-column>
        <el-table-column label="入库类别" align="center" prop="inBillCategory" minWidth="120px">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_in_stock_category" :value="scope.row.inBillCategory" />
          </template>
        </el-table-column>
        <el-table-column label="体积(m³)" align="center" prop="volume" minWidth="100px" />
        <el-table-column label="重量(kg)" align="center" prop="weight" minWidth="100px" />
        <el-table-column label="制单人" align="center" prop="createBy" minWidth="120px" />
        <el-table-column label="制单时间" align="center" prop="createTime" minWidth="160px" />
        <!-- <el-table-column label="备注" align="center" prop="remark" width="200px"/> -->
        <el-table-column label="操作" align="center" fixed="right" minWidth="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-show="scope.row.inBillStatus != '1'" size="mini" type="text" icon="el-icon-view"
              @click="showInbillDetail(scope.row)" v-hasPermi="['warehousing:inbill:query']">详情</el-button>
            <el-button v-show="scope.row.inBillStatus == '1'" size="mini" type="text" icon="el-icon-edit"
              @click="handleUpdate(scope.row)" v-hasPermi="['warehousing:inbill:edit']">修改</el-button>
            <el-button v-show="scope.row.inBillStatus == '1'" size="mini" type="text" icon="el-icon-delete"
              @click="handleDelete(scope.row)" v-hasPermi="['warehousing:inbill:remove']">删除</el-button>
            <el-button v-show=" scope.row.inBillStatus == '2'" size="mini" type="text"
              icon="el-icon-delete" @click="updateStatus(scope.row.id,5)"
              v-hasPermi="['warehousing:inbill:remove']">作废</el-button>
            <!-- <el-button v-show="scope.row.inBillStatus == '3'" size="mini" type="text"
              icon="el-icon-check" @click="updateStatus(scope.row.id,4)"
              v-hasPermi="['warehousing:inbill:remove']">完成</el-button> -->
            <el-button v-show="scope.row.inBillStatus == '4'" size="mini" type="text" icon="el-icon-view"
              @click="showForLocation(scope.row)" v-hasPermi="['warehousing:inbill:remove']">查看上架货位</el-button>

          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>


    <!-- 打印入库单信息对话框 -->
    <el-dialog :v-loading="printInbill.loading" :visible.sync="printInbill.open" append-to-body
               width="60%">
      <div style="text-align:center; font-size: 30px;height: 100px;">
        <div class="print-title">入库单</div>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="入库单号" style="width: 33.33%;" prop="inBillCode">
          {{ form.inBillCode }}
        </el-form-item>
        <el-form-item label="批次号" style="width: 30%;" prop="charg">
          {{ form.charg }}
        </el-form-item>
        <el-form-item label="入库类别" style="width: 33.33%;">
          <div v-for="dict in dict.type.wms_in_stock_category" v-show="form.inBillCategory==dict.value">{{dict.label }}</div>
        </el-form-item>
        <el-form-item style="width: 33.33%;" label="制单人" prop="weight">
          {{ form.createBy }}
        </el-form-item>
        <el-form-item style="width: 33.33%;" label="制单时间" prop="volume">
          {{ form.createTime }}
        </el-form-item>

        <el-table :data="inbillDetailList" :row-class-name="rowInbillDetailIndex" height="34vh"
                  @selection-change="handleInbillDetailSelectionChange" ref="inbillDetail">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="供应商" align="center" prop="supplierCode  " minWidth="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="dict in supplierData" v-show="scope.row.supplierCode==dict.value">{{ dict.label }}</div>
            </template>
          </el-table-column>
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="重量(kg)" align="center" prop="weight" minWidth="100">
          </el-table-column>
          <el-table-column label="体积(m³)" align="center" prop="volume" minWidth="100">
          </el-table-column>
          <el-table-column label="预报数量" align="center" prop="reportNum" minWidth="120">
          </el-table-column>
          <el-table-column label="入库数量" align="center" prop="inBillNum" minWidth="120">
          </el-table-column>
          <el-table-column label="差异量" align="center" prop="variance" minWidth="100">
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printData">下 载</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 打印入库单信息对话框 -->
    <el-dialog :v-loading="genData.loading" :visible.sync="genData.open" append-to-body width="20%">

      <el-select v-model="options.value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="genArtificial()">确 认</el-button>
        <el-button @click="genCancel">取 消</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { listInbill, delInbill, getSupplierData, updateStatus, getInbillGoodsDetail, getInbillGoodsByLocation, getPrintData1,printData} from "@/api/wms/warehousing/inbill";
import { getToken } from "@/utils/auth";
import{genData,boolAgv} from "@/api/wms/genData";
export default {
  name: "Inbill",
  dicts: ['wms_warehousing_status', 'wms_in_stock_category', 'wms_metering_unit', 'wms_enable_status'],
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
      //二维码打印信息
      printCodeList: [],
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
        storageSerial: null,
      },

      //打印入库单弹窗参数
      printInbill: {
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
        url: [],
      },

      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {

        inBillCategory: [
          { required: true, message: "入库类别不能为空", trigger: "blur" }
        ],

      },

      printTitle: '入库单',
      //表格高度
      tableHeight:0,

      //生成代码弹框
      genData:{
        // 是否显示弹出层
        open: false,
        loading: false,
      },
      options: [{
        value: 'CCQ01',
        label: '存储1区'
      }, {
        value: 'CCQ02',
        label: '存储2区'
      }, {
        value: 'CCQ03',
        label: '存储3区'
      }],
      param:{
        inBillCode:"",
        endAreaCode:"",
      }
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
    /** 查询上架货位情况 */
    getGoodsLocationList(params) {
      getInbillGoodsByLocation(params).then(response => {
        response.rows.forEach(item => {
          item.charg = this.showLocation.charg
        })
        this.showLocation.inbillDetailList = response.rows
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.printInbill.open = false;
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
        supplierCode: null,
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

  /** 新增按钮操作 */
  handleAdd() {
    this.$tab.openPage("入库单新增","/wmsJob/InbillDetail",{type:0})
  },
  /** 查看入库详情 */
  showInbillDetail(data) {
    const id = data.id;
    this.$tab.openPage("入库详情","/wmsJob/InbillDetail",{id:id,type:1})
  },

    /** 查看货物唯一码 */
    showInbillGoodsDetail(data) {
      this.inbillGoodsDetail.inbillDetailList = []
      this.inbillGoodsDetail.queryParams.onlyCode = ''
      this.inbillGoodsDetail.queryParams.inbillDetailId = data.id;
      this.inbillGoodsDetail.goodsCode = data.goodsCode;
      this.inbillGoodsDetail.goodsName = data.goodsName;
      this.inbillGoodsDetail.measureUnit = data.measureUnit;
      this.inbillGoodsDetail.model = data.model;
      this.inbillGoodsDetail.warranty = data.warranty;
      this.inbillGoodsDetail.queryParams.inbillDetailId = data.id;
      this.inbillGoodsDetail.open = true;
      this.getInbillGoodsDetail(this.inbillGoodsDetail.queryParams);
    },
    getInbillGoodsDetail(data) {
      getInbillGoodsDetail(data).then(response => {
        response.rows.forEach(item => {
          item.goodsCode = this.inbillGoodsDetail.goodsCode;
          item.goodsName = this.inbillGoodsDetail.goodsName;
          item.measureUnit = this.inbillGoodsDetail.measureUnit;
          item.model = this.inbillGoodsDetail.model;
          item.warranty = this.inbillGoodsDetail.warranty;
        })
        this.inbillGoodsDetail.inbillDetailList = response.rows
      })
    },
    /** 查看上架货位信息 */
    showForLocation(data) {
      this.$tab.openPage("上架货位信息","/wmsJob/InbillDetail",{inBillCode:data.inBillCode,type:2,charg:data.charg})
    },


    /** 修改按钮操作 */
    handleUpdate(row) {
        this.$tab.openPage("入库单修改","/wmsJob/InbillDetail",{id:row.id,type:0});
    },
    /** 打印入库单按钮操作 */
    handlePrint(row) {
      this.reset();
      const id = row.id || this.ids[0]
      getPrintData1({id:id}).then(response => {
        response.data.printCodeList = process.env.VUE_APP_BASE_API + response.data.printCodeList;
        this.form = response.data;
        this.inbillDetailList = response.data.inbillDetailList;
        this.printCodeList = response.data.printCodeList
        this.printInbill.url =  this.printCodeList;
        this.printInbill.open = true;
        // this.title = " ";
      });
    },
    /** 打印确认按钮 */
    printData() {
      // this.reset();
      this.downloadPdf('warehousing/inbill/printData', {
        ...this.form
      }, `入库单信息${new Date().getTime()}.pdf`)
    },
    /** 作废 */
    updateStatus(id,inBillStatus) {

      this.$modal.confirm('是否确认'+(inBillStatus==5?'作废':'完成')+'该记录？').then(function () {
        return updateStatus({ id: id, inBillStatus:inBillStatus});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除记录？').then(function () {
        return delInbill(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },


    gen(row){
      //判断agv是否开启
      boolAgv().then(res => {
        this.param.inBillCode=row.inBillCode
        //agv关闭
        if(res.data.data<1){
          this.genData.open = true;
          this.genData.loading = true;
          this.param.endAreaCode = this.options.value;
        }else{
          genData(this.param).then(res => {
            this.getList();
            if(res.data.code === 500){
              this.$modal.msgError(res.data.msg);
            }else{
              this.$modal.msgSuccess("生成成功");
            }
            this.genData.open = false;
            this.genData.loading = false;
          })
        }

      })
    },
    //agv关闭
    genArtificial(){
      this.param.endAreaCode = this.options.value;
      if(!this.param.endAreaCode){
        this.$modal.msgError("请选择储存库区！");
        return;
      }
        genData(this.param).then(res => {
          this.getList();
          if(res.data.code === 500){
            this.$modal.msgError(res.data.msg);
          }else{
            this.$modal.msgSuccess("生成成功");
          }
          this.genData.open = false;
          this.genData.loading = false;
        })
    },


    genCancel(){
      this.genData.open = false;
      this.genData.loading = false;
    },

    /** 入库单详情信息序号 */
    rowInbillDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 复选框选中数据 */
    handleInbillDetailSelectionChange(selection) {
      this.checkedInbillDetail = selection.map(item => item.index)
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

.print-box {
  display: flex;
  justify-content: flex-end;
  margin-top: -50px;
}

.print-title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}

/* .el-dialog__wrapper>>>.el-form-item>>>.el-form-item__content:last-child {
    display: block;
    width: 100%;
} */
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
 display: none;
}
</style>
