<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div
        style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);                                                                                                                                                                                                      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
        style="padding-left: 10px;">
        <el-form-item label="盘点单号" prop="checkBillCode">
          <el-input v-model="queryParams.checkBillCode" placeholder="请输入盘点单号" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="盘点状态" prop="checkStatus">
          <el-select v-model="queryParams.checkStatus" filterable placeholder="请选择单据类型" clearable>
            <el-option v-for="dict in dict.type.wms_check_status" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="daterangeCheckPlanTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
            v-hasPermi="['check:add']">新增</el-button>
        </el-col>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table  v-loading="loading" :data="checkList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="盘点单号" align="center" prop="checkBillCode" minWidth="180px">
          <template slot-scope="scope">
            <a v-show="scope.row.checkStatus != 0" @click="handleView(scope.row)" style="color:blue;">{{
              scope.row.checkBillCode }}</a>
            <div v-show="scope.row.checkStatus == 0">{{ scope.row.checkBillCode }}</div>
            <!-- <a @click="handleView(scope.row)" style="color:blue;">{{ scope.row.checkBillCode }}</a> -->
          </template>
        </el-table-column>
        <el-table-column label="盘点状态" align="center" prop="checkStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_check_status" :value="scope.row.checkStatus" />
          </template>
        </el-table-column>
        <el-table-column label="盘点方式" align="center" prop="checkMethod" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_check_method" :value="scope.row.checkMethod" />
          </template>
        </el-table-column>
        <el-table-column label="开始盘点时间" align="center" prop="startTime" width="180">
        </el-table-column>
        <el-table-column label="结束盘点时间" align="center" prop="endTime" width="180">
        </el-table-column>
        <el-table-column label="盘点人" align="center" prop="checkBy" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-show="scope.row.checkStatus == 2" size="mini" type="text" icon="el-icon-view"
              @click="handleView(scope.row)" v-hasPermi="['check:query']">详情</el-button>
            <el-button v-show="scope.row.checkStatus == 0" size="mini" type="text" icon="el-icon-edit"
              @click="handleUpdate(scope.row)" v-hasPermi="['check:edit']">修改</el-button>
            <el-button v-show="scope.row.checkStatus == 0" size="mini" type="text" icon="el-icon-delete"
              @click="handleDelete(scope.row)" v-hasPermi="['check:remove']">删除</el-button>
            <el-button v-show="scope.row.checkStatus == 0" size="mini" type="text"
              @click="handleStart(scope.row)" v-hasPermi="['check:checkDetail:edit']">
              <svg-icon icon-class="play" />开始</el-button>
            <el-button v-show="scope.row.checkStatus == 1" size="mini" type="text" icon="el-icon-time"
              @click="handleEnd(scope.row)" v-hasPermi="['check:checkDetail:edit']">结束</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- 添加或修改库存盘点对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="12">
          <el-form-item label="盘点模式" prop="checkMethod">
            <el-select style="width: 100%;" :disabled="form.id ? true : false" v-model="form.checkMethod" filterable
              @change="changeCheckMethod" placeholder="请选择盘点模式">
              <el-option v-for="dict in dict.type.wms_check_method" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="this.form.checkMethod == 0 ? false : true" :span="12">
          <el-form-item label="盘点模式" prop="checkMethod">
            <el-select style="width: 100%;" :disabled="form.id ? true : false" v-model="form.checkType" @change="changeCheckType"
              filterable placeholder="请选择盘点类型">
              <el-option v-for="dict in dict.type.wms_check_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="盘点人" prop="checkBy">
            <el-input v-model="form.checkBy" placeholder="请输入盘点人" show-word-limit maxlength="30"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="float:none;"><el-form-item /></el-col>
        <el-divider content-position="center">库存盘点详情信息</el-divider>
        <el-row v-show="this.form.checkMethod == 0 ? false : true" :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini"
              @click="handleAddWmsWarehouseCheckDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteWmsWarehouseCheckDetail">删除</el-button>
          </el-col>
        </el-row>
        <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
          <el-table :row-key="getRow" :data="checkbillGoodsList" :row-class-name="rowWmsWarehouseCheckDetailIndex"
            @selection-change="handleWmsWarehouseCheckDetailSelectionChange" ref="wmsWarehouseCheckDetail" height="300px">
            <el-table-column type="selection" width="50" align="center" :resrve-selection="true"/>
            <el-table-column label="库区编码" align="center" prop="areaCode" v-if="!form.checkType|| form.checkType==0 || form.checkMethod == 0" />
            <!-- <el-table-column v-show="false" label="库区名称" align="center" prop="areaName" v-if="form.checkType == 0" /> -->
            <el-table-column label="库位编号" align="center" prop="locationCode"
              v-if="!form.checkType|| form.checkType==0 || form.checkMethod == 0" />

            <el-table-column label="货物编码" align="center" prop="goodsCode"
              v-if="form.checkType == 1 && form.checkMethod == 1" />
            <el-table-column label="货物名称" align="center" prop="goodsName"
              v-if="form.checkType == 1 && form.checkMethod == 1" />
          </el-table>
          <pagination v-show="detailList.total > 0" :total="detailList.total"
          :page.sync="detailList.pageNum" :limit.sync="detailList.pageSize"
          @pagination="getDetailList" />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 盘点库位信息选择列表 -->
    <el-dialog title="库位选择" :visible.sync="selectLocation.open" @close="selectLocationDialogClose" append-to-body width="65%">
      <el-form :model="selectLocation.queryParams" @submit.native.prevent ref="selectGoods.queryForm" size="small" :inline="true"
        v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="所属库区" prop="locationCode">
          <el-select v-model="selectLocation.queryParams.areaId" filterable placeholder="请选择库区" clearable>
            <el-option v-for="dict in areaOptions" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="库位编码" prop="locationCode">
          <el-input v-model="selectLocation.queryParams.locationCode" placeholder="请输入库位编码" @keyup.enter.native="getSelectLocationList" clearable />
        </el-form-item>
        <el-form-item label="排数" prop="platoon">
          <el-select v-model="selectLocation.queryParams.platoon" filterable placeholder="请选择排数" clearable>
            <el-option v-for="dict in locationData.platoon" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="层数" prop="layer">
          <el-select v-model="selectLocation.queryParams.layer" filterable placeholder="请选择层数" clearable>
            <el-option v-for="dict in locationData.layer" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="列数" prop="columnNum">
          <el-select v-model="selectLocation.queryParams.columnNum" filterable placeholder="请选择列数" clearable>
            <el-option v-for="dict in locationData.columnNum" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getSelectLocationList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetSelectLocationQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <div>
          <el-alert
            v-if="this.selectLocation.selectLocationList.length>0"
            style="margin-bottom: 10px"
            :title="selectLocationTitle"
            type="warning"
            show-icon
            :closable="false">
            <span class="clear-button" @click="onClearSelected()">清空</span>
          </el-alert>
          <el-alert
            v-else
            style="margin-bottom: 10px"
            :title="selectLocationTitle"
            type="warning"
            show-icon
            :closable="false">
          </el-alert>
        </div>

        <el-table v-loading="loading"
                  height="36vh"
                  ref="multipleTable"
                  :row-key="getRowKey"
                  :data="selectLocation.locationInfoList"
                  @selection-change="handleSelectionChangeLocation">
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
          <el-table-column label="库区编码" align="center" prop="areaCode" v-if="form.checkType == 3" />
          <el-table-column label="库区名称" align="center" prop="areaName" v-if="form.checkType == 3" />
          <el-table-column label="库位编号" align="center" prop="locationCode" show-overflow-tooltip />
          <el-table-column label="库位名称" align="center" prop="locationName" show-overflow-tooltip />
        </el-table>
        <pagination v-show="selectLocation.total > 0" :total="selectLocation.total"
          :page.sync="selectLocation.queryParams.pageNum" :limit.sync="selectLocation.queryParams.pageSize"
          @pagination="getSelectLocationList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormLocation">确 定</el-button>
        <el-button @click="cancelLocation">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 盘点货物信息选择列表 -->
    <el-dialog title="货物类型选择" :visible.sync="selectGoods.open" append-to-body width="65%">
      <el-form :model="selectGoods.queryParams" ref="selectGoods.queryForm" size="small" :inline="true"
        v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="货物编码" prop="goodsCode">
          <el-input v-model="selectGoods.queryParams.goodsCode" placeholder="请输入货物编码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getSelectGoodsList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetSelectQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <el-table v-loading="loading" :data="selectGoods.goodsInfoList" height="36vh" @selection-change="handleSelectionChangeGoods">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip />
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
        </el-table>
        <pagination v-show="selectGoods.total > 0" :total="selectGoods.total" :page.sync="selectGoods.queryParams.pageNum"
          :limit.sync="selectGoods.queryParams.pageSize" @pagination="getSelectGoodsList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormGoods">确 定</el-button>
        <el-button @click="cancelGoods">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 库存盘点-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="主键ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="盘点单号">{{ viewForm.checkBillCode }}</el-descriptions-item>
        <el-descriptions-item label="盘点状态">{{ viewForm.checkStatus }}</el-descriptions-item>
        <el-descriptions-item label="盘点时间">{{ viewForm.checkPlanTime }}</el-descriptions-item>
        <el-descriptions-item label="盘点类型">{{ viewForm.checkType }}</el-descriptions-item>
        <el-descriptions-item label="库位数">{{ viewForm.locationNum }}</el-descriptions-item>
        <el-descriptions-item label="开始盘点时间">{{ viewForm.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束盘点时间">{{ viewForm.endTime }}</el-descriptions-item>
        <el-descriptions-item label="盘点人">{{ viewForm.checkBy }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ viewForm.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
        <el-descriptions-item label="修改人">{{ viewForm.updateBy }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{ viewForm.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { listCheck, getCheck, delCheck, addAllCheck, updateCheck, getGoodsList, getAllCheckbill, getLocationList, startCheck, endCheck,getAreaCode,getLocationData } from "@/api/wms/check";
import { getToken } from "@/utils/auth";
import { addLocationCheck, addGoodsTypeCheck, delCheckDetail, delCheckConfig,getDetailListData } from "@/api/wms/check";
export default {
  name: "Check",
  dicts: ['wms_check_status', 'wms_check_method', 'wms_metering_unit', 'wms_check_type'],
  data() {
    return {
      selectLocationTitle:'未选中任何数据',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsWarehouseCheckDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 库存盘点表格数据
      checkList: [],
      deleteList: [],//删除数据的id
      // 库存盘点详情表格数据
      wmsWarehouseCheckDetailList: [],
      // 盘点时间范围
      daterangeCheckPlanTime: [],
      // 库存盘点详情表格数据
      checkbillGoodsList: [],
      // 已选择的库存盘点详情表格数据
      checkbillGoodsLists: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 盘点类型
      checkMethod: "",
      //新增/修改
      addOrUpdate: 0,
      //库区选项
      areaOptions:[],
      //库位排、层、列选项
      locationData:{
        platoon:[],
        layer:[],
        columnNum:[]
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        checkBillCode: null,
        checkStatus: null,
        checkPlanTime: null,
        checkType: null,
        locationNum: null,
        startTime: null,
        endTime: null,
        checkBy: null,
        daterangeCheckPlanTime: [],
      },
      //盘点详情
      selectGoodsDetail: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          checkBillCode: null,
        },
        open: false,
        loading: false,
        total: 0,
      },
      //选择库位弹窗参数
      selectLocation: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          locationCode: null
        },
        locationInfoList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        selectLocationList: [],//选中的库位数据
      },
      //选择货物类型弹窗参数
      selectGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 40,
          goodsCode: null
        },
        goodsInfoList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        selectGoodsList: [],//选中的货物数据
      },
      detailList:{
        total:0,
        pageNum:1,
        pageSize:10,
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
        url: process.env.VUE_APP_BASE_API + "/stock/check/importData"
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {
        checkBy: [
          { required: true, message: "盘点人不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.initData();
    this.setTableGeight();
    window.addEventListener('resize', this.setTableGeight);
  },
  methods: {
    /** 查询库存盘点列表 */
    getList() {
      this.loading = true;
      listCheck(this.queryParams).then(response => {
        this.checkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    initData(){
      getAreaCode().then(res=>{
        this.areaOptions=res.data
      })
      getLocationData().then(res=>{
        this.locationData=res.data
      })
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
      this.checkbillGoodsList = [];
      this.reset();
    },
    cancelLocation() {
      this.selectLocation.queryParams.locationCode = null;
      this.selectLocation.open = false;
      this.ids = [];
    },
    cancelGoods() {
      this.selectGoods.queryParams.goodsCode = null;
      this.selectGoods.open = false;
      this.ids = [];
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        checkBillCode: null,
        checkStatus: null,
        checkPlanTime: null,
        checkType: null,
        locationNum: null,
        startTime: null,
        endTime: null,
        checkBy: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.wmsWarehouseCheckDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      console.log(this.daterangeCheckPlanTime);
      this.queryParams.daterangeCheckPlanTime = this.daterangeCheckPlanTime;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.daterangeCheckPlanTime = [];
      this.handleQuery();
    },
    selectLocationDialogClose(){
      this.selectLocation.queryParams = { pageNum: 1, pageSize: 10 }
      this.$refs.multipleTable.clearSelection();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.deleteList=[]
      this.reset();
      this.open = true;
      this.title = "添加库存盘点";
      this.form.checkType = '0';
      this.form.checkMethod = '0';
      this.getSelectAllList();
      this.addOrUpdate = 0;
    },
    //加载全盘数据列表
    getSelectAllList() {
      this.selectGoodsDetail.loading = true;
      getAllCheckbill().then(res => {
        this.checkbillGoodsList = res.data;
        this.selectGoodsDetail.loading = false;
      })
    },
    /** 详情按钮操作 */
    handleView(data) {
      const checkBillCode = data.checkBillCode;
      this.$tab.openPage("盘点详情","/kngl/checkDetail", { id: checkBillCode, type: 1 } )
    },
    /** 盘点模式 */
    changeCheckMethod() {
      if (this.form.checkMethod == 0) {
        this.getSelectAllList();
        this.checkMethod = 0;
      } else {
        this.checkbillGoodsList = [];
        this.selectGoodsDetail.total = 0;
        this.checkMethod = 1;
      }
    },
    /** 选择盘点类型 */
    changeCheckType() {
      this.checkbillGoodsList = [];
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
      this.deleteList = []
      this.reset();
      this.addOrUpdate = 1;
      const checkBillCode = row.checkBillCode;
      this.checkbillGoodsLists=[]
      getCheck(checkBillCode).then(response => {
        this.form = response.data;
        this.checkMethod = this.form.checkMethod;
        this.checkbillGoodsLists = response.data.wmsWarehouseCheckDetailList;
        this.getDetailList();
        this.open = true;
        this.title = "修改库存盘点";
      });
    },
    //获取盘点详情数据
    getDetailList(){
      this.form.pageNum = this.detailList.pageNum
      this.form.pageSize = this.detailList.pageSize
      getDetailListData(this.form).then(res=>{
        this.checkbillGoodsList = res.rows;
        this.detailList.total = res.total;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsWarehouseCheckDetailList = this.wmsWarehouseCheckDetailList;
          if (this.form.checkBillCode != null) {
            this.form.checkDetailsList = this.checkbillGoodsList;
            if(this.deleteList.length>0){
              if (this.form.checkType == 1 && this.form.checkStatus == 0) {
                delCheckConfig(this.deleteList).then(res => { })
              } else {
                delCheckDetail(this.deleteList).then(res => { })
              }
              this.deleteList=[]
            }
            if (this.form.checkMethod == 0) {
              /** 新增全盘或按货位部分盘 */
              addAllCheck(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              if (this.form.checkType == 0) {
                addLocationCheck(this.form).then(res => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                addGoodsTypeCheck(this.form).then(res => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              }
            }
          } else {
            this.form.checkDetailsList = this.checkbillGoodsList;
            if (this.form.checkMethod == 0) {
              /** 新增全盘或按货位部分盘 */
              addAllCheck(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            } else {
              if (this.form.checkType == undefined) {
                this.$modal.msgError("请选择盘点类型！");
              } else {
                if (this.form.checkType == 0) {
                  addLocationCheck(this.form).then(res => {
                    this.$modal.msgSuccess("新增成功");
                    this.open = false;
                    this.getList();
                  });
                } else {
                  addGoodsTypeCheck(this.form).then(res => {
                    this.$modal.msgSuccess("新增成功");
                    this.open = false;
                    this.getList();
                  });
                }
              }

            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该记录？').then(function () {
        return delCheck(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 库存盘点任务开始 */
    handleStart(row) {
      this.$modal.confirm('是否确认开始执行该盘点？').then(function () {
        return startCheck({ checkBillCode: row.checkBillCode });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },
    /** 库存盘点任务结束 */
    handleEnd(row) {
      this.$modal.confirm('是否确认结束该盘点任务？').then(function () {
        return endCheck({ checkBillCode: row.checkBillCode });
      }).then(res => {
        if (res.code == 600) {
          this.$modal.confirm(res.msg).then(function () {
            return endCheck({ checkBillCode: row.checkBillCode, checkStatus: '2' });
          }).then(() => {
            this.getList();
            this.$modal.msgSuccess("操作成功");
          }).catch(() => { });
          return;
        }
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(res => { });
    },
    /** 库存盘点详情序号 */
    rowWmsWarehouseCheckDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 库存盘点添加按钮操作 */
    handleAddWmsWarehouseCheckDetail() {
      if (this.form.checkType == undefined) {
        this.$modal.msgError("请选择盘点类型！");
      } else {
        if (this.form.checkType == 0) {
          this.selectLocation.queryParams.pageNum = 1;
          //加载库位数据
          this.getSelectLocationList();
          this.selectLocation.open = true
        } else {
          this.selectGoods.queryParams.pageNum = 1;
          //加载货物数据
          this.getSelectGoodsList();
          this.selectGoods.open = true
        }
      }
    },
    //加载库位数据列表
    getSelectLocationList() {
      this.selectLocation.loading = true;
      getLocationList(this.selectLocation.queryParams).then(response => {
        this.selectLocation.locationInfoList = response.rows;
        this.selectLocation.total = response.total;
        this.selectLocation.loading = false;
      })
    },
    //加载货物数据列表
    getSelectGoodsList() {
      this.selectGoods.loading = true;
      getGoodsList(this.selectGoods.queryParams).then(response => {
        this.selectGoods.goodsInfoList = response.rows;
        this.selectGoods.total = response.total;
        this.selectGoods.loading = false;
      })
    },
    // 多选框选中货架数据
    handleSelectionChangeLocation(selection) {
      this.selectLocation.selectLocationList = selection.map(item => item);
      if(selection.length>0){
        this.selectLocationTitle = '已选中 '+  selection.length +' 条记录(可跨页)'
      }else {
        this.selectLocationTitle ='未选中任何数据'
      }
    },
    // 多选框选中货物数据
    handleSelectionChangeGoods(selection) {
      this.selectGoods.selectGoodsList = selection.map(item => item)
    },
    //重置查询库位列表
    resetSelectLocationQuery() {
      this.selectLocation.queryParams = { pageNum: 1, pageSize: 10 }
      this.getSelectLocationList();
    },
    //重置查询货物列表
    resetSelectQuery() {
      this.selectGoods.queryParams = { pageNum: 1, pageSize: 10 }
      this.getSelectGoodsList();
    },
    //确认选择货架
    submitFormLocation() {
      if (this.selectLocation.selectLocationList.length == 0) {
        this.$modal.msgError("请选择添加的库位数据");
        return;
      }
      this.selectLocation.open = false;
      this.selectLocation.selectLocationList.forEach(element => {
        element.outBillNum = 1;
        element.id = null;
        let isHav = false;
        this.checkbillGoodsLists.forEach(item => {
          if (item.locationCode == element.locationCode) {
            isHav = true;
          }
        })
        if(!isHav){
          this.checkbillGoodsList.forEach(item => {
            if (item.locationCode == element.locationCode) {
              isHav = true;
            }
          })
        }
        if (!isHav) {
          this.checkbillGoodsList.push(element)
        }
      });
    },
    //确认选择货物
    submitFormGoods() {
      if (this.selectGoods.selectGoodsList.length == 0) {
        this.$modal.msgError("请选择添加的货物数据");
        return;
      }
      this.selectGoods.open = false;
      this.selectGoods.selectGoodsList.forEach(element => {
        element.outBillNum = 1;
        element.id = null;
        let isHav = false;
        this.checkbillGoodsLists.forEach(item => {
          if (item.goodsCode == element.goodsCode) {
            isHav = true;
          }
        })
        if(!isHav){
          this.checkbillGoodsList.forEach(item => {
            if (item.goodsCode == element.goodsCode) {
              isHav = true;
            }
          })
        }
        if (!isHav) {
          this.checkbillGoodsList.push(element)
        }
      });
    },
    /** 库存盘点详情删除按钮操作 */
    handleDeleteWmsWarehouseCheckDetail() {
      if (this.checkedWmsWarehouseCheckDetail.length == 0) {
        this.$modal.msgError("请先选择要删除的库存盘点详情数据");
      } else {
        const checkbillGoodsList = this.checkbillGoodsList;
        const checkedWmsWarehouseCheckDetail = this.checkedWmsWarehouseCheckDetail;
        this.checkbillGoodsList = checkbillGoodsList.filter(function (item) {
          return checkedWmsWarehouseCheckDetail.indexOf(item.index) == -1
        });
      }
      if (this.ids.length>0) {
        this.ids.forEach(element => {
          if(element){
            this.deleteList.push(element);
          }
        });
      }
    },
    /** 复选框选中数据 */
    handleWmsWarehouseCheckDetailSelectionChange(selection) {
      this.checkedWmsWarehouseCheckDetail = selection.map(item => item.index)
      this.ids = selection.map(item => item.id)
    },
    getRowKey(row){
      return row.locationCode
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
.el-form>>>.el-form-item__content:last-child {
  position: unset;
}

.el-form>>>.el-form-item__error {
  position: unset;
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
