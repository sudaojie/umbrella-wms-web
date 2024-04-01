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
        <el-form-item style="width: 20%;" label="出库单号" prop="dryOutbillCode">
          <el-input v-model="queryParams.dryOutbillCode" placeholder="请输入晾晒出库单号" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item style="width: 20%;" label="状态" prop="dryOutbillStatus">
          <el-select v-model="queryParams.dryOutbillStatus" filterable placeholder="请选择状态" clearable>
            <el-option v-for="dict in dict.type.dry_outbill_status" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item style="width: 20%;" label="制单时间" prop="createTime">
          <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择制单时间">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="制单时间">
          <el-date-picker
            v-model="daterangeCreateTime"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item style="width: 20%;" label="出库时间" prop="dryOutbillTime">
          <el-date-picker clearable v-model="queryParams.dryOutbillTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择出库时间">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="出库时间">
          <el-date-picker
            v-model="daterangeDryOutbillTime"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
            v-hasPermi="['stock:dryoutbill:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['stock:dryoutbill:remove']">删除</el-button>
        </el-col> -->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="outbillList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="出库单号" align="center" prop="dryOutbillCode" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="handleView(scope.row)" style="color:blue;">{{ scope.row.dryOutbillCode }}</a>
          </template>
        </el-table-column>
        <el-table-column label="出库状态" align="center" prop="dryOutbillStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.dry_outbill_status" :value="scope.row.dryOutbillStatus" />
          </template>
        </el-table-column>
        <el-table-column label="出库时间" align="center" prop="dryOutbillTime" width="180">
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createBy" show-overflow-tooltip />
        <el-table-column label="制单时间" align="center" prop="createTime" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} ') }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" align="center" width="260" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" v-show="scope.row.dryOutbillStatus == '0'" type="text" icon="el-icon-edit"
              @click="handleUpdate(scope.row)" v-hasPermi="['stock:dryoutbill:edit']">修改</el-button>
            <el-button size="mini" v-show="scope.row.dryOutbillStatus == '0'" type="text" icon="el-icon-delete"
              @click="handleDelete(scope.row)" v-hasPermi="['stock:dryoutbill:remove']">删除</el-button>
            <el-button size="mini" v-show="scope.row.dryOutbillStatus == '0'" type="text"
              @click="handleStart(scope.row)" v-hasPermi="['stock:dryoutbill:edit']">
              <svg-icon icon-class="play" />开始</el-button>
            <el-button v-show="scope.row.dryOutbillStatus != '0'"
                       size="mini"
                       type="text"
                       icon="el-icon-view"
                       @click="handleView(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- 添加或修改晾晒出库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" @before-close="cancel" append-to-body width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-show="(form.id ? true : false)" label="出库单号">
          <el-input disabled v-model="form.dryOutbillCode" placeholder="自动生成" show-word-limit maxlength="255" />
        </el-form-item>
        <el-form-item style="width: 100%;" label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容" show-word-limit
            maxlength="200" />
        </el-form-item>
        <el-divider content-position="center">晾晒出库单货物信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="openSelectGoods">添加产品</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteWmsDryOutbillGoods(form)">删除</el-button>
          </el-col>
        </el-row>
        <el-table :row-key="getRow" style="width: 100%;" :data="wmsDryOutbillGoodsList" :row-class-name="rowWmsDryOutbillGoodsIndex"
          @selection-change="handleWmsDryOutbillGoodsSelectionChange" ref="wmsDryOutbillGoods">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="托盘编码" align="center" prop="trayCode" minWidth="100" show-overflow-tooltip />
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="150" show-overflow-tooltip />
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip />
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="单位规格" align="center" prop="model" minWidth="150" show-overflow-tooltip />
          <el-table-column label="出库数量" align="center" prop="goodsNum" minWidth="150" show-overflow-tooltip />
        </el-table>
        <pagination v-show="selectOutbillGoods.total > 0" :total="selectOutbillGoods.total"
          :page.sync="selectOutbillGoods.queryParams.pageNum"
          :limit.sync="selectOutbillGoods.queryParams.pageSize" @pagination="handleUpdatePage" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 产品数据-选择对话框 -->
    <el-dialog title="货物选择" :visible.sync="selectGoods.open" width="60%" @close="selectGoodsDialogClose" append-to-body>
      <el-form :model="selectGoods.queryParams"  @submit.native.prevent ref="queryGoodsForm" size="small" :inline="true">
        <el-form-item label="货位编号" prop="locationCode">
          <el-input style="width: 200px;" v-model="selectGoods.queryParams.locationCode" placeholder="请输入货位编号"  clearable @keyup.enter.native="handleQueryGoods"  />
        </el-form-item>
        <el-form-item label="机件号" prop="partsCode">
          <el-input style="width: 200px;" v-model="selectGoods.queryParams.partsCode" placeholder="请输入机件号" clearable @keyup.enter.native="handleQueryGoods"  />
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsName">
          <el-input style="width: 200px;" v-model="selectGoods.queryParams.goodsName" placeholder="请输入货物名称" clearable @keyup.enter.native="handleQueryGoods"  />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            v-model="daterangeInBillDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上次晾晒时间">
          <el-date-picker
            v-model="daterangeLastDryDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="width: unset;float: unset;">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGoods">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoods">重置</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-alert
          v-if="this.selectGoods.goodsList.length>0"
          style="margin-bottom: 10px"
          :title="selectGoodsTitle"
          type="warning"
          show-icon
          :closable="false">
          <span class="clear-button" @click="onClearSelected()">清空</span>
        </el-alert>
        <el-alert
          v-else
          style="margin-bottom: 10px"
          :title="selectGoodsTitle"
          type="warning"
          show-icon
          :closable="false">
        </el-alert>
      </div>

      <el-table v-loading="selectGoods.loading"
                :data="selectGoods.goodsInfoList"
                height="350"
                ref="multipleTable"
                :row-key="getRowKey"
                @selection-change="handleSelectionChangeGoods">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
        <el-table-column label="货位编号" align="center" prop="locationCode" show-overflow-tooltip />
        <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip />
        <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip />
        <el-table-column label="入库时间" align="center" prop="inBillDate" width="180" />
        <el-table-column label="上次晾晒时间" align="center" prop="lastDryDate" width="180" />
        <el-table-column label="货物名称" align="center" prop="goodsName" />
        <el-table-column label="规格名称" align="center" prop="model" />
        <el-table-column label="计量单位" align="center" prop="measureUnit">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="selectGoods.total > 0" :total="selectGoods.total" :page.sync="selectGoods.queryParams.pageNum"
        :limit.sync="selectGoods.queryParams.pageSize" @pagination="getSelectGoodsList" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectedGoods">确 定</el-button>
        <el-button @click="selectGoods.open = false, selectGoods.queryParams.goodsName = '', selectGoods.queryParams.partsCode = '',
          selectGoods.queryParams.locationCode = ''">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 晾晒出库单-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" width="60%" append-to-body>
      <el-form :model="selectGoodsDetail.queryParams" ref="queryGoodsDetailForm" size="small" :inline="true">
        <el-form-item label="出库单号" width="30%">
          <el-input disabled v-model="viewForm.dryOutbillCode" placeholder="自动生成" show-word-limit />
        </el-form-item>
        <el-form-item label="机件号" prop="partsCode" width="275px">
          <el-input v-model="viewForm.partsCode" placeholder="请输入机件号" clearable />
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsName" width="275px">
          <el-input v-model="viewForm.goodsName" placeholder="请输入货物名称" clearable />
        </el-form-item>
        <el-form-item style="width: unset;float: unset;" width="275px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleViewPage">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoodsDetail">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="viewForm" :rules="rules" label-width="40px">
        <el-form-item style="width: 100%;" label="备注" prop="remark">
          <el-input disabled v-model="viewForm.remark" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容"
            show-word-limit maxlength="200" />
        </el-form-item>
        <el-divider content-position="center">晾晒出库单货物信息</el-divider>
        <el-table style="width: 100%;" :data="selectGoodsDetail.goodsInfoList"
          :row-class-name="rowWmsDryOutbillGoodsIndex" ref="wmsDryOutbillGoods">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="托盘编码" align="center" prop="trayCode" minWidth="100" show-overflow-tooltip />
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="150" show-overflow-tooltip />
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip />
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="单位规格" align="center" prop="model" minWidth="150" show-overflow-tooltip />
          <el-table-column label="出库数量" align="center" prop="goodsNum" minWidth="150" show-overflow-tooltip />
        </el-table>
        <pagination v-show="selectGoodsDetail.total > 0" :total="viewFormPaging.total" :page.sync="viewFormPaging.pageNum"
          :limit.sync="viewFormPaging.pageSize" @pagination="handleViewPage" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDetail">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listOutbill, getOutbill, delOutbill, addOutbill, updateOutbill, getGoodsList, getAreaData, clickStart, getDryOutbillGoods,checkData } from "@/api/wms/stock/dryoutbill";
import { getToken } from "@/utils/auth";
import { removeDetail } from "@/api/wms/stock/dryoutbill";
export default {
  name: "Outbill",
  dicts: ['dry_outbill_status', 'wms_metering_unit'],
  data() {
    return {
      selectGoodsTitle:'未选中任何数据',
      // 时间范围
      daterangeCreateTime: [],
      // 时间范围
      daterangeDryOutbillTime: [],
      // 时间范围
      daterangeInBillDate: [],
      // 时间范围
      daterangeLastDryDate: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      deleteList: [],//临时删除id
      // 子表选中数据
      checkedWmsDryOutbillGoods: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 晾晒出库单表格数据
      outbillList: [],
      // 晾晒出库单货物表格数据
      wmsDryOutbillGoodsList: [],
      //出库单新添加数据
      wmsDryOutbillGoodsAddList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dryOutbillCode: null,
        dryOutbillStatus: null,
        dryOutbillTime: null,
        createTime: null,
        delFlat: null,
        areaCode: null,
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
        url: process.env.VUE_APP_BASE_API + "/system/outbill/importData"
      },
      // 详情查询参数
      viewForm: {
        pageNum: 1,
        pageSize: 10,
        dryOutbillCode: null,
        dryOutbillStatus: null,
        dryOutbillTime: null,
        partsCode: null,
        goodsName: null,
        createTime: null,
        delFlat: null,
        areaCode: null,
      },
      viewModalOpen: false,
      // 表单参数
      form: {
        pageNum: 1,
        pageSize: 10,
        dryOutbillCode: null,
        dryOutbillStatus: null,
        dryOutbillTime: null,
        partsCode: null,
        goodsName: null,
        createTime: null,
        delFlat: null,
        areaCode: null,
      },
      //表格高度
      tableHeight: 0,
      //货物添加/修改弹窗参数
      selectOutbillGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        goodsInfoList: [],
        total: 0,
        loading: false,
      },
      //选择货物弹窗参数
      selectGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
          partsCode: null,
        },
        goodsInfoList: [],
        //所属库区
        areaData: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        goodsList: [],//选中的货物数据
      },
      //选择货物详情弹窗参数
      selectGoodsDetail: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
          partsCode: null,
          loading: false,
        },
        goodsInfoList: [],
        //所属库区
        areaData: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        id: '',
      },
      /** 下拉库区 */
      areaData: [],
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键ID不能为空", trigger: "blur" }
        ],
        dryOutbillCode: [
          { required: true, message: "晾晒出库单号不能为空", trigger: "blur" }
        ],
        dryOutbillStatus: [
          { required: true, message: "晾晒出库类型;(1、待出库 2、出库中 3、已出库)不能为空", trigger: "change" }
        ],
        delFlat: [
          { required: true, message: "是否删除;(0、未删除 1、已删除)不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      },

      viewFormPaging: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }

    };
  },
  created() {
    this.getList();
    this.getAreaData();
    this.setTableGeight();
    window.addEventListener('resize', this.setTableGeight);
  },
  methods: {
    /** 所属库区 */
    getAreaData() {
      getAreaData().then(res => {
        this.areaData = res.data
      })
    },
    /** 查询晾晒出库单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDryOutbillTime && '' != this.daterangeDryOutbillTime) {
        this.queryParams.params["beginDryOutbillTime"] = this.daterangeDryOutbillTime[0];
        this.queryParams.params["endDryOutbillTime"] = this.daterangeDryOutbillTime[1];
      }
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listOutbill(this.queryParams).then(response => {
        this.outbillList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getRow(row){
      return row.id;
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
      this.deleteList=[];
      this.selectOutbillGoods.total = 0;
      this.reset();
    },
    // 开始按钮
    handleStart(row) {
      let _this = this;
      this.$modal.confirm('是否确认开始晾晒出库任务？').then(function () {
        _this.selectGoodsDetail.queryParams.id = row.id;
        _this.selectGoodsDetail.queryParams.dryOutbillCode = row.dryOutbillCode;
        clickStart(_this.selectGoodsDetail.queryParams).then(res => {
          _this.getList();
          _this.$modal.msgSuccess("开始晾晒出库");
        })
      }).then(() => {
      }).catch(() => {

      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        dryOutbillCode: null,
        dryOutbillStatus: null,
        dryOutbillTime: null,
        delFlat: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.wmsDryOutbillGoodsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.daterangeDryOutbillTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.wmsDryOutbillGoodsAddList=[]
      this.reset();
      this.open = true;
      this.selectOutbillGoods.total = 0;
      this.title = "添加晾晒出库单";
    },
    /** 详情按钮操作 */
    handleView(row) {
      this.wmsDryOutbillGoodsAddList=[]
      const id = row.id;
      getOutbill(id).then(res => {
        this.viewForm = res.data;
        this.viewForm.pageNum = this.viewFormPaging.pageNum;
        this.viewForm.pageSize = this.viewFormPaging.pageSize;
        this.viewForm.dryOutbillStatus = ''
        getDryOutbillGoods(this.viewForm).then(response => {
          this.selectGoodsDetail.goodsInfoList = response.rows;
          this.selectGoodsDetail.total = response.total;
          this.viewFormPaging.total = response.total;
          this.selectGoodsDetail.loading = false;
        });
        this.viewModalOpen = true;
        this.title = "晾晒出库单-详情";
      });
    },
    /** 分页查询详情数据 */
    handleViewPage() {
      this.viewForm.pageNum = this.viewFormPaging.pageNum;
      this.viewForm.pageSize = this.viewFormPaging.pageSize;
      getDryOutbillGoods(this.viewForm).then(response => {
        this.selectGoodsDetail.goodsInfoList = response.rows;
        this.viewFormPaging.total = response.total;
        this.selectGoodsDetail.loading = false;
      });
      this.loading = false;
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
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.wmsDryOutbillGoodsAddList=[]
      this.reset();
      const id = row.id || this.ids
      getOutbill(id).then(res => {
        this.form = res.data;
        this.viewForm = res.data;
        this.viewForm.pageNum = this.viewFormPaging.pageNum;
        this.viewForm.pageSize = this.viewFormPaging.pageSize;
        this.viewForm.dryOutbillStatus = ''
        getDryOutbillGoods(this.viewForm).then(response => {
          this.wmsDryOutbillGoodsList = response.rows;
          this.selectOutbillGoods.total = response.total;
          this.selectOutbillGoods.queryParams = { pageNum: 1, pageSize: 10 }
          this.selectOutbillGoods.loading = false;
        });
        this.open = true;
        this.title = "修改晾晒出库单";
      });
    },
    /** 分页查询修改数据 */
    handleUpdatePage() {
      this.form.pageNum = this.selectOutbillGoods.queryParams.pageNum
      this.form.pageSize = this.selectOutbillGoods.queryParams.pageSize
      this.form.ids = this.deleteList
      this.form.dryOutbillStatus=''
      getDryOutbillGoods(this.form).then(response => {
        this.wmsDryOutbillGoodsList = response.rows;
        this.selectOutbillGoods.total = response.total;
        this.selectOutbillGoods.loading = false;
      });
      this.loading = false;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsDryOutbillGoodsList = this.wmsDryOutbillGoodsList;
          /** 校验晾晒库区是否能容纳选择的托盘 */
          checkData(this.form).then(res=>{
            if(!res.data){
              this.$modal.msgError("现在选择的托盘已超出晾晒区可容纳数量");
              return;
            }
            if (this.form.id != null) {
              this.form.ids = this.deleteList
              this.deleteList = []
              this.form.dryOutbillStatus=null;
              updateOutbill(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addOutbill(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          })
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该记录？').then(function () {
        return delOutbill(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 晾晒出库单货物序号 */
    rowWmsDryOutbillGoodsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 晾晒出库单货物添加按钮操作 */
    openSelectGoods() {
      //加载货物数据
      this.selectGoods.open = true
      this.selectGoods.queryParams.pageNum = 1;
      this.getSelectGoodsList();
    },
    /** 货物搜索按钮操作 */
    handleQueryGoods() {
      this.selectGoods.queryParams.pageNum = 1;
      this.getSelectGoodsList();
    },
    /** 货物重置按钮操作 */
    resetQueryGoods() {
      this.resetForm("queryGoodsForm");
      this.selectGoods.queryParams.locationCode = null;
      this.selectGoods.queryParams.partsCode = null;
      this.selectGoods.queryParams.goodsName = null;
      this.daterangeInBillDate=[]
      this.daterangeLastDryDate=[]
      this.handleQueryGoods();
    },
    /** 订单详情查询，重置按钮操作 */
    resetQueryGoodsDetail() {
      this.viewForm.goodsName = "";
      this.viewForm.partsCode = "";
      this.handleViewPage();
      this.selectGoodsDetail.loading = false;
      this.loading = false;
    },
    /** 订单详情 取消按钮 */
    cancelDetail() {
      this.selectGoodsDetail.queryParams.goodsName = null;
      this.selectGoodsDetail.queryParams.partsCode = null;
      this.viewModalOpen = false
    },
    /** 查询货物信息 */
    getSelectGoodsList() {
      this.selectGoods.loading = true;
      this.selectGoods.queryParams.params = {};
      if (null != this.daterangeInBillDate && '' != this.daterangeInBillDate) {
        this.selectGoods.queryParams.params["beginInBillDate"] = this.daterangeInBillDate[0];
        this.selectGoods.queryParams.params["endInBillDate"] = this.daterangeInBillDate[1];
      }
      if (null != this.daterangeLastDryDate && '' != this.daterangeLastDryDate) {
        this.selectGoods.queryParams.params["beginLastDryDate"] = this.daterangeLastDryDate[0];
        this.selectGoods.queryParams.params["endLastDryDate"] = this.daterangeLastDryDate[1];
      }
      getGoodsList(this.selectGoods.queryParams).then(res => {
        this.selectGoods.goodsInfoList = res.rows;
        this.selectGoods.total = res.total;
        this.selectGoods.loading = false;
      })
    },
    // 货物多选框选中数据
    handleSelectionChangeGoods(selection) {
      this.selectGoods.goodsList = selection.map(item => item);
      if(selection.length>0){
        this.selectGoodsTitle = '已选中 '+  selection.length +' 条记录(可跨页)'
      }else {
        this.selectGoodsTitle ='未选中任何数据'
      }
    },
    selectGoodsDialogClose(){
      this.resetForm("queryGoodsForm");
      this.selectGoods.queryParams.locationCode = null;
      this.selectGoods.queryParams.partsCode = null;
      this.selectGoods.queryParams.goodsName = null;
      this.daterangeInBillDate=[];
      this.daterangeLastDryDate=[];
      this.$refs.multipleTable.clearSelection();
    },
    //选择货物后将数据添加到入库单详情中
    selectedGoods() {
      if (this.selectGoods.goodsList.length > 0) {
        let addList = []
        this.selectGoods.goodsList.forEach(element => {
          let isHav = false;
          this.wmsDryOutbillGoodsList.forEach(item => {
            if (item.partsCode == element.partsCode) {
              isHav = true;
            }
          })
          if (!isHav) {
            addList.push({
              "inBillNum":0,
              "createBy": element.createBy,
              "createTime":element.createTime,
              "updateBy":element.updateBy,
              "updateTime":element.updateTime,
              "remark":element.remark,
              "ids":element.ids,
              "id":'',
              "onlyCode":element.onlyCode,
              "partsCode":element.partsCode,
              "goodsCode":element.goodsCode,
              "goodsName":element.goodsName,
              "model":element.model,
              "measureUnit":element.measureUnit,
              "charg":element.charg,
              "supplierCode":element.supplierId,
              "supplierName":element.supplierName,
              "warehouseCode":element.warehouseCode,
              "warehouseName":element.warehouseName,
              "areaCode":element.areaCode,
              "areaName":element.areaName,
              "locationCode":element.locationCode,
              "locationName":element.locationName,
              "trayCode":element.trayCode,
              "listingTime":element.listingTime,
              "produceTime":element.produceTime,
              "periodValidity":element.periodValidity,
              "warranty":element.warranty,
              "lockStatus":element.lockStatus,
              "goodsNum":element.goodsNum,
              "inBillDate":element.inBillDate,
              "lastDryDate":element.lastDryDate
            });
          }
        });
        /** 校验晾晒库区是否能容纳选择的托盘 */
        this.form.wmsDryOutbillGoodsList = []
        this.wmsDryOutbillGoodsAddList.forEach(element=>{
          this.form.wmsDryOutbillGoodsList.push(element);
        })
        addList.forEach(element =>{
          this.form.wmsDryOutbillGoodsList.push(element);
        })
        checkData(this.form).then(res=>{
          if(!res.data){
            this.$modal.msgError("现在选择的托盘已超出晾晒区可容纳数量");
          }else{
            addList.forEach(element =>{
              this.wmsDryOutbillGoodsList.push(element);
              this.wmsDryOutbillGoodsAddList.push(element);
            })
            this.selectGoods.open = false
            this.selectGoods.queryParams.goodsCode = '';
          }
        })
      } else {
        this.$modal.msgError("请选择数据");
      }
    },
    /** 晾晒出库单货物删除按钮操作 */
    handleDeleteWmsDryOutbillGoods(obj) {
      if (this.checkedWmsDryOutbillGoods.length == 0) {
        this.$modal.msgError("请先选择要删除的出库单货物数据");
      } else {
        const wmsDryOutbillGoodsList = this.wmsDryOutbillGoodsList
        const checkedWmsDryOutbillGoods = this.checkedWmsDryOutbillGoods;
        this.wmsDryOutbillGoodsList = wmsDryOutbillGoodsList.filter(function (item) {
          return checkedWmsDryOutbillGoods.indexOf(item.index) == -1
        });
        let ids = []
        this.checkedDryOutbillGoodsList.forEach(item => {
          if (item.id) {
            ids.push(item.id)
            this.deleteList.push(item.id);
          }
        })
        if (ids.length > 0) {
          this.handleUpdatePage()
        }

      }
    },
    /** 复选框选中数据 */
    handleWmsDryOutbillGoodsSelectionChange(selection) {
      this.checkedWmsDryOutbillGoods = selection.map(item => item.index)
      this.checkedDryOutbillGoodsList = selection.map(item => item)
    },
    getRowKey(row){
      return row.id
    },
    onClearSelected(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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


::v-deep .el-alert--warning.is-light{
  margin-top: 10px;
}
::v-deep .el-alert__content{
  display: flex;
  align-items: center;
}
::v-deep .el-alert .el-alert__description{
  margin: 0;
}

.clear-button{
  color: #1890ff;
  margin-left: 10px;
  cursor: pointer;
}
</style>
