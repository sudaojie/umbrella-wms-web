<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="移库单号" prop="moveCode">
            <el-input
              v-model="queryParams.moveCode"
              placeholder="请输入移库单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="移库状态" prop="moveStatus">
            <el-select v-model="queryParams.moveStatus" filterable placeholder="请选择移库状态" clearable>
              <el-option
                v-for="dict in dict.type.wms_move_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建人" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder="请输入创建人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间">
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['wms:move:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="moveList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="移库单号" align="center" prop="moveCode" show-overflow-tooltip>
            <template slot-scope="scope">
              <a  v-show="scope.row.moveStatus==2" @click="getDetailGoods(scope.row)" style="color:blue;">{{ scope.row.moveCode }}</a>
              <div v-show="scope.row.moveStatus!=2">{{ scope.row.moveCode }}</div>
            </template>
          </el-table-column>
          <el-table-column label="移库状态" align="center" prop="moveStatus">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_move_status" :value="scope.row.moveStatus"/>
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" prop="createBy" show-overflow-tooltip/>
          <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip/>
          <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-show="scope.row.moveStatus!=0"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-hasPermi="['wms:move:edit']"
              >详情</el-button>
              <el-button v-show="scope.row.moveStatus==0"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['wms:move:edit']"
              >修改</el-button>
              <el-button v-show="scope.row.moveStatus==0"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['wms:move:remove']"
              >删除</el-button>
              <el-button v-show="scope.row.moveStatus==0"
                size="mini"
                type="text"
                @click="startTask(scope.row)"
                v-hasPermi="['wms:move:edit']"
              ><svg-icon icon-class="play" />
              开始</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>
    <!-- 添加或修改移库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col v-show="form.id?true:false" :span="12">
            <el-form-item label="移库单号" prop="moveCode">
              <el-input disabled v-model="form.moveCode" placeholder="自动生成" show-word-limit maxlength="50"/>
            </el-form-item>
        </el-col>
        <el-col v-show="form.id?true:false" :span="12">
            <el-form-item label="移库状态" prop="moveStatus">
              <el-select disabled style="width: 100%;" v-model="form.moveStatus" filterable placeholder="请选择移库状态">
                <el-option
                  v-for="dict in dict.type.wms_move_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="24" style="float: unset;">
            <el-form-item label="备注" prop="remark">
              <el-input :disabled="isView" v-model="form.remark" type="textarea" :autosize="{maxRows:3,minRows:3}" placeholder="请输入备注" show-word-limit maxlength="200"/>
            </el-form-item>
        </el-col>
        <el-divider content-position="center">移库单详情信息</el-divider>
        <el-row :gutter="10" class="mb8" v-if="!isView">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddWmsMoveDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWmsMoveDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :row-key="getRow" :data="wmsMoveDetailList" :row-class-name="rowWmsMoveDetailIndex" height="30vh" @before-close="cancel" @selection-change="handleWmsMoveDetailSelectionChange" ref="wmsMoveDetail">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="仓库编号" align="center" prop="outWarehouseCode" minWidth="150">
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.outWarehouseCode" placeholder="请输入移出仓库编号" show-word-limit maxlength="32"/>
            </template> -->
          </el-table-column>
          <el-table-column label="移出库区编号" align="center" prop="outAreaCode" minWidth="150">
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.outAreaCode" placeholder="请输入移出库区编号" show-word-limit maxlength="32"/>
            </template> -->
          </el-table-column>
          <el-table-column label="移出库位编号" align="center" prop="outLocationCode" minWidth="150">
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.outLocationCode" placeholder="请输入移出库位编号" show-word-limit maxlength="32"/>
            </template> -->
          </el-table-column>
          <!-- <el-table-column label="移入仓库编号" align="center" prop="inWarehouseCode" minWidth="150"/> -->
          <el-table-column label="移入库区编号" align="center" prop="inAreaCode" minWidth="150">
          </el-table-column>
          <el-table-column label="移入库位编号" align="center" prop="inLocationCode" minWidth="150"/>
          <el-table-column fixed="right" v-if="!isView"  label="操作" align="center" prop="selectLocationCode" minWidth="240">
            <template slot-scope="scope" >
              <el-cascader style="width: 100%;" v-model="scope.row.selectLocationCode" @change="updateOptions(scope.row)" :show-all-levels="false" :options="options" filterable clearable/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <pagination
        v-show="showDetail.total>0"
        :total="showDetail.total"
        :page.sync="showDetail.queryParams.pageNum"
        :limit.sync="showDetail.queryParams.pageSize"
        @pagination="getDetaiList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 移库单-选择库位弹窗 -->
    <el-dialog title="库位选择" :visible.sync="selectLocation.open" @close="selectLocationDialogClose" width="60%" append-to-body>
      <el-form :model="selectLocation.queryParams"  @submit.native.prevent ref="selectLocationQueryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="库位编码" prop="locationCode">
          <el-input
            v-model="selectLocation.queryParams.locationCode"
            placeholder="请输入库位编码"
            clearable
            @keyup.enter.native="handleLocationQuery"
          />
        </el-form-item>
        <el-form-item label="库位名称" prop="locationName">
          <el-input
            v-model="selectLocation.queryParams.locationName"
            placeholder="请输入库位名称"
            clearable
            @keyup.enter.native="handleLocationQuery"
          />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-select style="width: 100%;" filterable v-model="selectLocation.queryParams.warehouseId" @change="getAreaByWarehouse(selectLocation.queryParams)" placeholder="请选择所属仓库"  clearable>
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId" :key="Math.random()">
          <el-select style="width: 100%;" filterable @change="$forceUpdate()" v-model="selectLocation.queryParams.areaId" placeholder="请选择所属库区"  clearable>
            <el-option
              v-for="item in areaData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleLocationQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetLocationQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-alert
          v-if="this.selectLocation.selectedList.length>0"
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
                :data="selectLocation.locationData"
                height="36vh"
                ref="multipleTable"
                :row-key="getRowKey"
                @selection-change="handleSelectionChangeLocation">
        <el-table-column type="selection" width="55" align="center"  :reserve-selection="true"/>
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="库位编码" minWidth="150" align="center" prop="locationCode" show-overflow-tooltip/>
        <el-table-column label="库位名称" minWidth="150" align="center" prop="locationName" show-overflow-tooltip/>
        <el-table-column label="所属仓库" minWidth="200" align="center" prop="warehouseId" show-overflow-tooltip/>
        <el-table-column label="所属库区" minWidth="200" align="center" prop="areaId" show-overflow-tooltip/>
        <el-table-column label="排数" minWidth="100" align="center" prop="platoon" />
        <el-table-column label="层数" minWidth="100" align="center" prop="layer" />
        <el-table-column label="列数" minWidth="100" align="center" prop="columnNum" />
      </el-table>

      <pagination
        v-show="selectLocation.total>0"
        :total="selectLocation.total"
        :page.sync="selectLocation.queryParams.pageNum"
        :limit.sync="selectLocation.queryParams.pageSize"
        @pagination="getLocationData"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectLocation()">确 定</el-button>
        <el-button @click="selectLocation.open = false;selectLocation.queryParams={pageNum:1,pageSize:10};">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 移库单货物详情 -->
    <el-dialog title="移库单货物详情" :visible.sync="showDetailGoods.open" width="65%" append-to-body>
      <el-form :model="showDetailGoods.queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              v-model="showDetailGoods.queryParams.goodsName"
              placeholder="请输入货物名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="移出库位" prop="outLocationCode">
            <el-input
              v-model="showDetailGoods.queryParams.outLocationCode"
              placeholder="请输入移出库位编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="移入库位" prop="inLocationCode">
            <el-input
              v-model="showDetailGoods.queryParams.inLocationCode"
              placeholder="请输入移入库位编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="托盘编号" prop="trayCode">
            <el-input
              v-model="showDetailGoods.queryParams.trayCode"
              placeholder="请输入托盘编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleShowQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetShowQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="showDetailGoods.loading" :data="showDetailGoods.moveList" height="34vh">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="原库区编号" align="center" prop="outAreaCode" show-overflow-tooltip/>
          <el-table-column label="原库位编号" align="center" prop="outLocationCode" show-overflow-tooltip/>
          <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
          <el-table-column label="新库区编号" align="center" prop="inAreaCode" show-overflow-tooltip/>
          <el-table-column label="新库位编号" align="center" prop="inLocationCode" show-overflow-tooltip/>
          <el-table-column label="唯一码" align="center" prop="onlyCode" show-overflow-tooltip/>
          <el-table-column label="机件号" align="center" prop="mpCode" show-overflow-tooltip/>
          <!-- <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/> -->
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="计量单位" align="center" prop="measureUnit" show-overflow-tooltip>

          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip/>
          <!-- <el-table-column label="批次" align="center" prop="charg" show-overflow-tooltip/>
          <el-table-column label="移出仓库编号" align="center" prop="outWarehouseCode" show-overflow-tooltip/>
          <el-table-column label="移出仓库名称" align="center" prop="outWarehouseName" show-overflow-tooltip/>
          <el-table-column label="移出库区名称" align="center" prop="outAreaName" show-overflow-tooltip/>
          <el-table-column label="移出库位名称" align="center" prop="outLocationName" show-overflow-tooltip/>
          <el-table-column label="移入仓库编号" align="center" prop="inWarehouseCode" show-overflow-tooltip/>
          <el-table-column label="移入仓库名称" align="center" prop="inWarehouseName" show-overflow-tooltip/>
          <el-table-column label="移入库区名称" align="center" prop="inAreaName" show-overflow-tooltip/>
          <el-table-column label="移入库位名称" align="center" prop="inLocationName" show-overflow-tooltip/> -->
        </el-table>

        <pagination
          v-show="showDetailGoods.total>0"
          :total="showDetailGoods.total"
          :page.sync="showDetailGoods.queryParams.pageNum"
          :limit.sync="showDetailGoods.queryParams.pageSize"
          @pagination="getDetailGoodsList"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDetailGoods.open = false;showDetailGoods.queryParams={pageNum:1,pageSize:10};showDetailGoods.moveList=[]">关 闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMove, getMove, delMove, addMove, updateMove,getLocationData,getWarehouseData,getAreaData,removeDeatil,getDetaiList,getLocations,updateStatus,getDetailGoodsList } from "@/api/wms/move";
import { getToken } from "@/utils/auth";
export default {
  name: "Move",
  dicts: ['wms_move_status'],
  data() {
    return {
      selectLocationTitle:'未选中任何数据',
      isView:false,//是否查看
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据下标
      checkedWmsMoveDetail: [],
      // 子表选中数据
      checkedWmsMoveDetailData: [],
      deteleList:[],//删除数据id（临时）
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 移库单表格数据
      moveList: [],
      // 移库单详情表格数据
      wmsMoveDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        moveCode: null,
        moveStatus: null,
        createTime: null,
      },
      //显示货物详情弹窗参数
      showDetailGoods:{
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          id:null,
          locationCode: null,
          createTime: null
        },
        moveList:[]//列表数据
      },
      //选择弹窗参数
      selectLocation:{
        // 总条数
        total: 0,
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          id:null,
          locationCode: null,
          createTime: null
        },
        selectedLocationData:[],//选择的列表数据
        selectedList:[],
        locationData:[]//列表数据
      },
      warehouseData:[],
      areaData:[],
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
        url: process.env.VUE_APP_BASE_API + "/move/move/importData"
      },
      viewForm:{},
      // 表单参数
      form: {},
      //选择的库位数据
      options:[],
      //表格高度
      tableHeight:0,
      // 表单校验
      rules: {
        // moveCode: [
        //     { required: true, message: "移库单号不能为空", trigger: "blur" }
        // ],
      },
      oldOptions:[],//获取的原始数据
      showDetail:{
        queryParams:{
          pageNum:1,
          pageSize:10
        },
        total:0
      }
    };
  },
  created() {
    this.getList();
    this.initData();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    initData(){
      getWarehouseData().then(res => {
        this.warehouseData=res.data
      })
    },
    getRow(row){
      return row.id;
    },
    getAreaByWarehouse(data){
      data.areaId='';
      getAreaData({warehouseId:data.warehouseId,areaType:0}).then(res => {
        this.areaData=res.data
      })
    },
    /** 查询移库单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listMove(this.queryParams).then(response => {
        this.moveList = response.rows;
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
      this.isView=false;
      this.options=[]
      this.deteleList=[]
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        moveCode: null,
        moveStatus: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.wmsMoveDetailList = [];
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      //批量添加模态框
      this.reset();
      this.open = true;
      this.title = "添加移库单";
      // this.$tab.openPage("移库单新增","/kngl/addMove");
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
    /** 示例：重置密码按钮操作 */
    handleResetPwd(row) {
        //todo 按需求修改
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMove(id).then(response => {
        this.form = response.data;
        this.showDetail.queryParams.moveCode = this.form.moveCode
        this.getDetaiList();
        this.open = true;
        this.title = "修改移库单";
        //加载选择的移入库位数据
        this.getLocations();
      });
    },
    /** 修改按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getMove(id).then(response => {
        this.form = response.data;
        this.showDetail.queryParams.moveCode = this.form.moveCode
        this.getDetaiList();
        this.open = true;
        this.title = "修改移库单";
        this.isView=true;
        //加载选择的移入库位数据
        this.getLocations();
      });
    },
    //加载详情数据
    getDetaiList(){
      this.showDetail.queryParams.ids = this.deteleList
      getDetaiList(this.showDetail.queryParams).then(res => {
        this.wmsMoveDetailList = res.rows
        this.showDetail.total = res.total
      })
    },
    /** 开始按钮操作 */
    startTask(row) {
      let _this = this;
      this.$modal.confirm('是否确认开始移库任务？').then(function() {
        updateStatus({id:row.id,moveCode:row.moveCode,moveStatus:1}).then(response => {
          _this.$modal.msgSuccess("操作成功");
          _this.getList();
        });
      }).then(() => {

      }).catch(() => {

      });
    },
    /** 打开显示详情货物弹窗 */
    getDetailGoods(data){
      this.showDetailGoods.open=true;
      this.showDetailGoods.queryParams={
        pageNum:1,pageSize:10,moveCode:data.moveCode
      }
      this.showDetailGoods.moveList=[]
      this.showDetailGoods.loading = true
      this.getDetailGoodsList();
    },
    handleShowQuery(){
      this.showDetailGoods.queryParams.pageNum=1
      this.showDetailGoods.queryParams.pageSize=10
      this.showDetailGoods.moveList=[]
      this.showDetailGoods.loading = true
      this.getDetailGoodsList();
    },
    resetShowQuery(){
      let moveCode = this.showDetailGoods.queryParams.moveCode
      this.showDetailGoods.queryParams={
        pageNum:1,pageSize:10,moveCode:moveCode
      }
      this.showDetailGoods.moveList=[]
      this.showDetailGoods.loading = true
      this.getDetailGoodsList();
    },
    /** 查询详情货物数据 */
    getDetailGoodsList(){
      getDetailGoodsList(this.showDetailGoods.queryParams).then(response => {
        this.showDetailGoods.moveList = response.rows
        this.showDetailGoods.total = response.total
        this.showDetailGoods.loading = false
      })
    },
    /** 提交按钮 */
    submitForm() {
      if(this.wmsMoveDetailList !== null &&this.wmsMoveDetailList.length === 0){
        this.$modal.msgError("请添加移库子任务");
        return;
      }
      for(let i in this.wmsMoveDetailList){
        if(!this.wmsMoveDetailList[i].inLocationCode){
          this.$modal.msgError('请维护移入库位编号');
          return
        }else{
          for(let j in this.wmsMoveDetailList){
            if(i!=j&&this.wmsMoveDetailList[i].inLocationCode==this.wmsMoveDetailList[j].inLocationCode){
              let n1 = parseInt(i)+1
              let n2 = parseInt(j)+1
              this.$modal.msgError('第'+n1+'行和第'+n2+'行移入库位编号冲突，请重新选择');
              return
            }
          }
        }
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.wmsMoveDetailList = this.wmsMoveDetailList;
          if (this.form.id != null) {
            this.form.ids = this.deteleList
            this.deteleList=[]
            updateMove(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.options=[]
              this.getList();
            });
          } else {
            addMove(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.options=[]
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该记录？').then(function() {
        return delMove(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	  /** 移库单详情序号 */
    rowWmsMoveDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 移库单详情添加按钮操作 */
    handleAddWmsMoveDetail() {
      // let obj = {};
      // obj.outWarehouseCode = "";
      // obj.outAreaCode = "";
      // obj.outLocationCode = "";
      // obj.inWarehouseCode = "";
      // obj.inAreaCode = "";
      // obj.inLocationCode = "";
      // this.wmsMoveDetailList.push(obj);
      this.selectLocation.open = true;
      //加载数据
      this.getLocationData();

    },
    //查询库位数据
    getLocationData(){
      let codes = []
      this.wmsMoveDetailList.forEach(element => {
        codes.push(element.outLocationCode)
        if(element.inLocationCode){
          codes.push(element.inLocationCode)
        }
      })
      this.selectLocation.queryParams.locationCodes=codes;
      getLocationData(this.selectLocation.queryParams).then(response => {
        this.selectLocation.locationData = response.rows
        this.selectLocation.total = response.total
      })
    },
    //加载选择的移入库位数据
    getLocations(){
      this.options = []
      let codes = []
      this.wmsMoveDetailList.forEach(element => {
        codes.push(element.outLocationCode)
        if(element.inLocationCode){
          codes.push(element.inLocationCode)
        }
      });
      getLocations({locationCodes:codes}).then(res => {
        res.forEach(item => {
          if(this.options.length<1){
            this.options.push({value:item.warehouseId,label:item.warehouseId,children:[{value:item.areaId,label:item.areaId,children:[{value:item.locationCode+'-'+item.locationName+'-'+item.trayCode,label:item.locationCode+'-'+item.locationName}]}]})
          }else{
            let isHav = false;
            this.options.forEach(element => {
              if(element.value==item.warehouseId){
                isHav = true;
              }
            })
            if(!isHav){
              this.options.push({value:item.warehouseId,label:item.warehouseId,children:[{value:item.areaId,label:item.areaId,children:[{value:item.locationCode+'-'+item.locationName+'-'+item.trayCode,label:item.locationCode+'-'+item.locationName}]}]})
            }else{
              this.options.forEach(element => {
                if(element.value == item.warehouseId){
                  let isHavChild = false;
                  element.children.forEach(child => {
                    if(child.value==item.areaId){
                      isHavChild = true;
                    }
                  })
                  if(!isHavChild){
                    element.children.push({value:item.areaId,label:item.areaId,children:[{value:item.locationCode+'-'+item.locationName+'-'+item.trayCode,label:item.locationCode+'-'+item.locationName}]});
                  }else{
                    element.children.forEach(child => {
                      if(child.value==item.areaId){
                        child.children.push({value:item.locationCode+'-'+item.locationName+'-'+item.trayCode,label:item.locationCode+'-'+item.locationName})
                      }
                    })
                  }
                }

              })

            }

          }
        })
        this.oldOptions = this.options;
      })
    },
    handleLocationQuery(){
      this.selectLocation.queryParams.pageNum=1;
      //加载数据
      this.getLocationData();
    },
    resetLocationQuery(){
      this.areaData = []
      this.selectLocation.queryParams={};
      this.selectLocation.queryParams.pageNum=1;
      this.selectLocation.queryParams.pageSize=10;
      //加载数据
      this.getLocationData();
    },
    // 多选框选中数据
    handleSelectionChangeLocation(selection) {
      this.selectLocation.selectedList = selection.map(item => item);
      if(selection.length>0){
        this.selectLocationTitle = '已选中 '+  selection.length +' 条记录(可跨页)'
      }else {
        this.selectLocationTitle ='未选中任何数据'
      }
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
    selectLocationDialogClose(){
      this.areaData = [];
      this.selectLocation.selectedList = [];
      this.selectLocationTitle ='未选中任何数据';
      this.selectLocation.queryParams={};
      this.selectLocation.queryParams.pageNum=1;
      this.selectLocation.queryParams.pageSize=10;
      this.$refs.multipleTable.clearSelection();
    },
    //库位选择后的确定
    saveSelectLocation(){
      if(!this.selectLocation.selectedList || this.selectLocation.selectedList.length === 0){
        this.$modal.msgError("请先选择库位数据");
        return;
      }else{
        this.selectLocation.selectedList.forEach(element => {
          element.id = ''
          element.outWarehouseCode = element.warehouseId.split('-')[0]
          element.outWarehouseName = element.warehouseId.split('-')[1]
          element.outAreaCode = element.areaId.split('-')[0]
          element.outAreaName = element.areaId.split('-')[1]
          element.outLocationCode = element.locationCode
          element.outLocationName = element.locationname
          element.outTrayCode = element.trayCode
          let isHav = false;
          this.wmsMoveDetailList.forEach(item => {
            if(item.outLocationCode==element.locationCode){
              isHav = true
            }
          })
          if(!isHav){
            this.wmsMoveDetailList.push(element)
          }
        });
        this.selectLocation.open = false;
        this.selectLocation.queryParams={pageNum:1,pageSize:10};
        //加载选择的移入库位数据
        this.getLocations();
      }
    },
    /** 移库单详情删除按钮操作 */
    handleDeleteWmsMoveDetail() {
      if (this.checkedWmsMoveDetail.length == 0) {
        this.$modal.msgError("请先选择要删除的移库单详情数据");
      } else {
        const wmsMoveDetailList = this.wmsMoveDetailList;
        const checkedWmsMoveDetail = this.checkedWmsMoveDetail;
        this.wmsMoveDetailList = wmsMoveDetailList.filter(function(item) {
          return checkedWmsMoveDetail.indexOf(item.index) == -1
        });
        //后台执行删除数据
        const ids = []
        this.checkedWmsMoveDetailData.forEach(item => {
          if(item.id){
            ids.push(item.id);
            this.deteleList.push(item.id)
          }
        })
        //加载选择的移入库位数据
        this.getLocations();
        if(ids.length>0){
          //重新加载详情数据
          this.getDetaiList()
        }
      }
    },
    //更新级联选择数据
    updateOptions(obj){
      obj.inWarehouseCode = obj.selectLocationCode[0].split('-')[0]
      obj.inWarehouseName = obj.selectLocationCode[0].split('-')[1]
      obj.inAreaCode = obj.selectLocationCode[1].split('-')[0]
      obj.inAreaName = obj.selectLocationCode[1].split('-')[1]
      obj.inLocationCode = obj.selectLocationCode[2].split('-')[0]
      obj.inLocationName = obj.selectLocationCode[2].split('-')[1]
      obj.inTrayCode = obj.selectLocationCode[2].split('-')[2]=='null'?null:obj.selectLocationCode[2].split('-')[2]
    },
    /** 复选框选中数据 */
    handleWmsMoveDetailSelectionChange(selection) {
      this.checkedWmsMoveDetail = selection.map(item => item.index)
      this.checkedWmsMoveDetailData = selection.map(item => item)
    },
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
  .el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
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
