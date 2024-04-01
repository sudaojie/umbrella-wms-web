<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size:14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="托盘编码" prop="trayCode" style="margin-left: 10px;">
          <el-input style="width: 100%;"
            v-model="queryParams.trayCode"
            placeholder="请输入托盘编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="托盘规格" prop="trayModelCode">
          <el-select v-model="queryParams.trayModelCode" filterable placeholder="请选择托盘规格" clearable>
            <el-option
              v-for="dict in trayModelData"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="enableStatus">
          <el-select v-model="queryParams.enableStatus" filterable placeholder="请选择启用状态" clearable>
            <el-option
              v-for="dict in dict.type.wms_enable_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
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
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['basics:tray:add']"
          >新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['basics:tray:edit']"
          >修改</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['basics:tray:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['basics:tray:export']"
          >全部导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-printer"
            size="mini"
            @click="handlePrinter"
            v-hasPermi="['basics:tray:printer']"
          >标签打印</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['basics:tray:import']"
          >导入</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

      </el-row>
      <div>
        <el-alert
          v-if="this.ids.length>0"
          style="margin-bottom: 10px"
          :title="trayListTitle"
          type="warning"
          show-icon
          :closable="false">
          <span class="clear-button" @click="onClearSelected()">清空</span>
        </el-alert>
        <el-alert
          v-else
          style="margin-bottom: 10px"
          :title="trayListTitle"
          type="warning"
          show-icon
          :closable="false">
        </el-alert>
      </div>

      <el-table v-loading="loading"
                ref="multipleTable"
                :data="trayList"
                :height="tableHeight"
                @selection-change="handleSelectionChange"
                :row-key="getRowKey">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <!-- <el-table-column label="所属库位" width="150" align="center" prop="locationId">
          <template slot-scope="scope">
              <div v-if="scope.row.locationId==item.value" v-for="item in locationData1">{{ item.label }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="托盘编码" width="150" align="center" prop="trayCode" show-overflow-tooltip/>
        <el-table-column label="托盘规格" width="150" align="center" prop="trayModelCode" show-overflow-tooltip/>
        <!-- <el-table-column label="托盘名称" width="150" align="center" prop="trayName" show-overflow-tooltip/>
        <el-table-column label="托盘简称" width="150" align="center" prop="traySimpleName"  show-overflow-tooltip/> -->
        <!-- <el-table-column label="所属仓库" align="center" prop="warehouseId" minWidth="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="overflow: hidden;white-space:nowrap;text-overflow: ellipsis;" v-for="item in warehouseData" v-show="item.value==scope.row.warehouseId">{{ item.label }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属库区" align="center" prop="areaId" minWidth="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="overflow: hidden;white-space:nowrap;text-overflow: ellipsis;" v-for="item in areaData1" v-show="item.value==scope.row.areaId">{{ item.label }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="长(cm)" align="center" prop="trayLength" />
        <el-table-column label="宽(cm)" align="center" prop="trayWidth" />
        <el-table-column label="高(cm)" align="center" prop="trayHeight" />
        <el-table-column label="容量(m³)" align="center" prop="trayVolume" />
        <el-table-column label="可用容量(m³)" width="180" align="center" prop="trayUsableVolume" />
        <el-table-column label="限重(kg)" align="center" prop="trayLimitWeight" />
        <el-table-column label="可用重量(kg)" width="180" align="center" prop="trayUsableWeight" />
        <el-table-column fixed="right" label="启用状态" align="center" prop="enableStatus">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enableStatus"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:tray:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:tray:remove']"
            >删除</el-button>
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

    <!-- 添加或修改托盘基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="托盘编码" prop="trayCode">
          <el-input :disabled="form.id?true:false" v-model="form.trayCode" placeholder="请输入托盘编码" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="托盘规格" prop="trayModelCode">
          <el-select style="width: 100%;" v-model="form.trayModelCode"  @change="getTrayModelByCode(form)"  filterable clearable placeholder="请选择托盘规格">
            <el-option
              v-for="dict in trayModelData"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长(cm)" prop="trayLength">
          <el-input-number disabled style="width: 100%;" :min="0" :max="9999999" v-model="form.trayLength" placeholder="请输入长(cm)" show-word-limit maxlength="50"/>
        </el-form-item>
        <el-form-item label="宽(cm)" prop="trayWidth">
          <el-input-number disabled style="width: 100%;" :min="0" :max="9999999" v-model="form.trayWidth" placeholder="请输入宽(cm)" show-word-limit maxlength="50"/>
        </el-form-item>
        <el-form-item label="高(cm)" prop="trayHeight">
          <el-input-number disabled style="width: 100%;" :min="0" :max="9999999" v-model="form.trayHeight" placeholder="请输入高(cm)" show-word-limit maxlength="50"/>
        </el-form-item>
        <el-form-item label="容量(m³)" prop="trayVolume">
          <el-input-number disabled style="width: 100%;" :min="0" :max="9999999" v-model="form.trayVolume" placeholder="请输入容量(m³)" show-word-limit maxlength="50"/>
        </el-form-item>
        <el-form-item label="限重(kg)" prop="trayLimitWeight">
          <el-input-number disabled style="width: 100%;" :min="0" :max="9999999" v-model="form.trayLimitWeight" placeholder="请输入限重(kg)" @blur="countArea(form)" show-word-limit maxlength="50"/>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"
                    type="textarea"
                    :autosize="{minRows:3}"
                    placeholder="请输入内容"
                    show-word-limit
                    maxlength="200" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 托盘基本信息-导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" align="center" append-to-body>
      <el-select style="width: 100%;margin-bottom: 10px;" v-model="upload.modelCode" placeholder="请选择托盘规格" filterable clearable>
        <el-option
          v-for="item in trayModelData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <el-select style="width: calc(50% - 5px);margin-bottom: 10px;" v-model="upload.warehouseId" @change="getAreaByWarehouse(upload)"  @blur="getAreaByWarehouse(upload)" placeholder="请选择所属仓库" filterable clearable>
        <el-option
          v-for="item in warehouseData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <!-- @blur="getLocationByArea(upload)" @change="getLocationByArea(upload)"  -->
      <!-- <el-select style="width: calc(50% - 5px);margin-bottom: 10px;margin-left: 10px;"
      v-model="upload.areaId" placeholder="请选择所属库区" filterable clearable>
        <el-option
          v-for="item in areaData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <!-- <el-select style="width: calc(33% - 5px);margin-bottom: 10px;margin-left: 10px;" v-model="upload.locationId" placeholder="请选择所属库位" filterable clearable>
        <el-option
          v-for="item in locationData"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        />
      </el-select> -->
      <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx,.xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport+'&modelCode=' + upload.modelCode+'&warehouseId=' + upload.warehouseId+ '&areaId=' + upload.areaId+ '&locationId=' + upload.locationId"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          :on-change="uploadFile"
          drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false;">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 打印预览框 -->
    <el-dialog title="标签打印" v-loading="print.loading" :visible.sync="print.open" width="60%" append-to-body>
      <div class="demo-image">
        <div v-for="item in print.dataList" class="block" style="text-align: center;">
          <div style="text-align: center;font-weight: bold;">托盘{{ item.code }}</div>
          <div style="display: flex;align-items: center;justify-content: center;">
            <div style="flex: 1;">
              <el-image :src="item.url" fit="cover"/>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printData">打印标签</el-button>
        <el-button @click="print.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTray, getTray, delTray, addTray, updateTray,checkData,getAreaData,getLocationData,getPrintData,getTrayModelData,printDataList } from "@/api/wms/basics/tray";
import { getToken } from "@/utils/auth";
export default {
  name: "Tray",
  dicts: ['sys_yes_no', 'wms_enable_status'],
  data() {
    return {
      // 警告文字
      trayListTitle:"未选中任何数据",
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
      // 托盘基本信息表格数据
      trayList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        trayCode: null,
        trayName: null,
        traySimpleName: null,
        warehouseId: null,
        areaId: null,
        locationId: null,
        trayLength: null,
        trayWidth: null,
        trayHeight: null,
        trayVolume: null,
        trayUsableVolume: null,
        trayLimitWeight: null,
        trayUsableWeight: null,
        enableStatus: null,
      },
      //上传文件列表
      fileData:[],
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
        url: process.env.VUE_APP_BASE_API + "/basics/tray/importData",
        modelCode:''
      },
      //打印参数
      print:{
        loading:false,
        open:false,
        dataList:[
          // {code:'KW01-21-0101',name:'21区01层01库位',url:'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'},
          // {code:'KW01-21-0102',name:'21区01层02库位',url:'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'},
          // {code:'KW01-21-0103',name:'21区01层03库位',url:'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'}
        ],
      },
      viewForm:{},
      // 表单参数
      form: {},
      warehouseData:[],
      areaData:[],
      trayModelData: [],
      trayModelByCodeData: [],
      locationData1:[],
      locationData:[],
      isAdd:false,
      // 表单校验
      rules: {
        trayCode: [
            { required: true, message: "托盘编码不能为空", trigger: "blur" }
        ],
        trayName: [
            { required: true, message: "托盘名称不能为空", trigger: "blur" }
        ],
        traySimpleName: [
            { required: true, message: "托盘简称不能为空", trigger: "blur" }
        ],
        trayModelCode: [
            { required: true, message: "托盘规格不能为空", trigger: "blur" }
        ],
        // warehouseId: [
        //     { required: true, message: "所属仓库不能为空", trigger: "change" }
        // ],
        // areaId: [
        //     { required: true, message: "所属库区不能为空", trigger: "change" }
        // ],
        // locationId: [
        //     { required: true, message: "所属库位编号不能为空", trigger: "change" }
        // ],
        // trayLength: [
        //     { required: true, message: "长(cm)不能为空", trigger: "blur" },
        //     {
        //       pattern: /^[1-9]+[0-9]*$/,
        //       message: "请输入正确的整数",
        //       trigger: "blur"
        //     }
        // ],
        // trayWidth: [
        //     { required: true, message: "宽(cm)不能为空", trigger: "blur" },
        //     {
        //       pattern: /^[1-9]+[0-9]*$/,
        //       message: "请输入正确的整数",
        //       trigger: "blur"
        //     }
        // ],
        // trayHeight: [
        //     { required: true, message: "高(cm)不能为空", trigger: "blur" },
        //     {
        //       pattern: /^[1-9]+[0-9]*$/,
        //       message: "请输入正确的整数",
        //       trigger: "blur"
        //     }
        // ],
        // trayVolume: [
        //     { required: true, message: "体积(m³)不能为空", trigger: "blur" }
        // ],
        // trayUsableVolume: [
        //     { required: true, message: "可用容量(m³)不能为空", trigger: "blur" }
        // ],
        // trayLimitWeight: [
        //     { required: true, message: "限重(kg)不能为空", trigger: "blur" }
        // ],
        // trayUsableWeight: [
        //     { required: true, message: "可用重量(kg)不能为空", trigger: "blur" }
        // ],
        enableStatus: [
            { required: true, message: "启用状态不能为空", trigger: "change" }
        ],

      },
      //表格高度
      tableHeight:0,
    };
  },
  created() {
    this.getList();
    // this.initData();
    this.initModelData();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    // initData(){
      // getWarehouseData().then(res => {
      //   this.warehouseData=res.data
      // })
      //
      // getAreaData({warehouseId:''}).then(res => {
      //   this.areaData1=res.data
      // })
      // getLocationData({areaId:''}).then(res => {
      //   this.locationData1=res.data
      // })

    // },

    initModelData(){
      getTrayModelData().then(res => {
        this.trayModelData=res.data
        // console.log(this.trayModelData)
      })
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );

      })
    },
    getAreaByWarehouse(data){
      data.areaId='';
      this.areaData = []
      getAreaData({warehouseId:data.warehouseId,areaType:0}).then(res => {
        this.areaData=res.data
      })
    },
    getLocationByArea(data){
      data.locationId='';
      this.locationData=[];
      getLocationData({areaId:data.areaId}).then(res => {
        this.locationData=res.data
      })
    },
    /** 查询托盘规格 */
    getTrayModelByCode(data){
      for (let i of this.trayModelData){
        if (data.trayModelCode==i.value){
          this.form.trayLength = i.trayLength
          this.form.trayHeight = i.trayHeight
          this.form.trayWidth = i.trayWidth
          this.form.trayVolume = i.trayVolume
          this.form.trayLimitWeight = i.trayLimitWeight
        }
      }
    },
    /** 查询托盘基本信息列表 */
    getList() {
      this.loading = true;
      listTray(this.queryParams).then(response => {
        this.trayList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {

      this.open = false;
      this.reset();
    },
    // 根据输入数据计算容积
    countArea(data) {
      data.trayUsableVolume = data.trayVolume?data.trayVolume:0;
      data.trayUsableWeight = data.trayLimitWeight?data.trayLimitWeight:0;
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.enableStatus === "0" ? "启用" : "禁用";
      this.$modal.confirm('确认要' + text  + row.trayCode + '托盘吗？').then(function() {
        return updateTray({id:row.id,enableStatus:row.enableStatus});
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.enableStatus = row.enableStatus === "0" ? "1" : "0";
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        trayCode: null,
        trayName: null,
        traySimpleName: null,
        warehouseId: null,
        areaId: null,
        locationId: null,
        trayLength: null,
        trayWidth: null,
        trayHeight: null,
        trayVolume: null,
        trayUsableVolume: null,
        trayLimitWeight: null,
        trayUsableWeight: null,
        enableStatus: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.isAdd = false;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.$refs.multipleTable.clearSelection();
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.$refs.multipleTable.clearSelection();
      this.handleQuery();
    },
    getRowKey(row){
      return row.id
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      // this.single = selection.length!==1
      this.multiple = !selection.length
      if(selection.length>0){
        this.trayListTitle = '已选中 '+  selection.length +' 条记录(可跨页)'
      }else {
        this.trayListTitle ='未选中任何数据'
      }

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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isAdd = true;
      this.title = "添加托盘基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTray(id).then(response => {
        this.form = response.data;

        getAreaData({warehouseId:response.data.warehouseId}).then(res => {
          this.areaData=res.data
        })
        this.open = true;
        this.title = "修改托盘基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.countArea(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          checkData(this.form).then(res => {
            if(res.code==200){
              if (this.form.id != null) {
                updateTray(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.$refs.multipleTable.clearSelection();
                  this.open = false;
                  this.getList();
                });
              } else {
                addTray(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.$refs.multipleTable.clearSelection();
                  this.open = false;
                  this.getList();
                });
              }
            }
          })
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该记录？').then(function() {
        return delTray(ids);
      }).then(() => {
        this.getList();
        this.$refs.multipleTable.clearSelection();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/tray/export', {
        ...this.queryParams
      }, `tray_${new Date().getTime()}.xlsx`)
    },
    /** 打印标签弹窗 */
    handlePrinter(){
      this.print.dataList=[];
      this.print.open=true;
      this.print.loading=true;
      let data = {};
      //判断是否勾选数据
      if(this.ids.length>0){//勾选了就传勾选数据
        data = {ids:this.ids}
      }else{//未勾选就是查询过滤后的数据
        data = this.queryParams
      }
      //后台获取数据
      getPrintData(data).then(res => {
        this.print.loading=false;
        this.print.dataList=res.data;
        this.print.dataList.forEach(item => {
          let src = process.env.VUE_APP_BASE_API+item.url;
          item.url = src
          // console.log(item.url);
        });
      })
    },
    /** 打印标签按钮 */
    printData(){
       this.print.open=false;
      console.log(this.print.dataList)
      printDataList(this.print.dataList).then(res=>{
        this.$modal.msgSuccess("已打印"+this.print.dataList.length+"条码");
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.modelCode='';
      this.upload.title = "托盘数据导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('basics/tray/importTemplate', {
      }, `托盘基本信息导入模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    uploadFile(file,fileList){
      this.fileData = fileList;
    },
    // 提交上传文件
    submitFileForm() {
      if(this.fileData.length<1){
        this.$modal.msgWarning('必须要上传文件，请检查！');
        return
      }
      if(!this.upload.modelCode){
        this.$modal.msgWarning('必须要选择托盘规格！');
        return
      }
      this.$refs.upload.submit();
    }
  }
};
</script>
<style scoped>
.el-form-item>>>.el-form-item__content:first-child {
    display: block;
}
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

.demo-image .block {
  padding: 10px 0;
  text-align: center;
  border: solid 1px #d1d1d1;
  display: inline-block;
  width: 16%;
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
  font-weight:bolder ;
  margin-bottom: 5px;
  height: 40px;
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
