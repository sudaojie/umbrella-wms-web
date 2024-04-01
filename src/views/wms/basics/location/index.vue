<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size:14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="库位编码" prop="locationCode">
          <el-input
            v-model="queryParams.locationCode"
            placeholder="请输入库位编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库位名称" prop="locationName">
          <el-input
            v-model="queryParams.locationName"
            placeholder="请输入库位名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-select style="width: 100%;" filterable v-model="queryParams.warehouseId" @change="getAreaByWarehouse(queryParams)" placeholder="请选择所属仓库"  clearable>
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId">
          <el-select style="width: 100%;" filterable v-model="queryParams.areaId" placeholder="请选择所属库区"  clearable>
            <el-option
              v-for="item in areaData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
            v-hasPermi="['basics:location:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['basics:location:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['basics:location:export']"
          >全部导出</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-printer"
            size="mini"
            @click="handlePrinter"
            v-hasPermi="['basics:location:printer']"
          >标签打印</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="['basics:area:import']"
          >导入</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="locationList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="库位编码" minWidth="150" align="center" prop="locationCode" show-overflow-tooltip/>
        <el-table-column label="库位名称" minWidth="150" align="center" prop="locationName" show-overflow-tooltip/>
        <el-table-column label="所属仓库" minWidth="200" align="center" prop="warehouseId" show-overflow-tooltip/>
        <el-table-column label="所属库区" minWidth="200" align="center" prop="areaId" show-overflow-tooltip/>
        <el-table-column label="排序值" minWidth="100" align="center" prop="orderNum" />
        <el-table-column label="排数" minWidth="100" align="center" prop="platoon" />
        <el-table-column label="层数" minWidth="100" align="center" prop="layer" />
        <el-table-column label="列数" minWidth="100" align="center" prop="columnNum" />
        <el-table-column label="库位容量(m³)" minWidth="200" align="center" prop="totalCapacity" />
        <el-table-column label="可容重量(KG)" minWidth="200" align="center" prop="tolerableWeight" />
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
        <el-table-column label="操作" align="center" fixed="right" minWidth="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:location:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:location:remove']"
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

    <!-- 添加或修改库位基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="库位编码" prop="locationCode">
          <el-input :disabled="form.id?true:false" v-model="form.locationCode" placeholder="请输入库位编码" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="库位名称" prop="locationName">
          <el-input v-model="form.locationName" placeholder="请输入库位名称" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-select style="width: 100%;" filterable v-model="form.warehouseId" @change="getAreaByWarehouse(form)" @blur="getAreaByWarehouse(form)" placeholder="请选择所属仓库"  clearable>
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId">
          <el-select style="width: 100%;" filterable v-model="form.areaId" placeholder="请选择所属库区"  clearable>
            <el-option
              v-for="item in areaData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序值" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序值" show-word-limit maxlength="4"/>
        </el-form-item>
        <el-form-item label="排数" prop="platoon">
          <el-input v-model="form.platoon" placeholder="请输入排数" show-word-limit maxlength="3"/>
        </el-form-item>
        <el-form-item label="层数" prop="layer">
          <el-input v-model="form.layer" placeholder="请输入层数" show-word-limit maxlength="3"/>
        </el-form-item>
        <el-form-item label="列数" prop="columnNum">
          <el-input v-model="form.columnNum" placeholder="请输入列数" show-word-limit maxlength="3"/>
        </el-form-item>
        <el-form-item label="库位容量(m³)" prop="totalCapacity">
          <el-input-number style="width: 100%;" :min="0" :max="9999999"  v-model="form.totalCapacity" placeholder="请输入库位容量" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="可容重量(KG)" prop="tolerableWeight">
          <el-input-number style="width: 100%;" :min="0" :max="9999999"  v-model="form.tolerableWeight" placeholder="请输入可容重量" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="200"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-select style="width: calc(50% - 5px);margin-bottom: 10px;" v-model="upload.warehouseId" @change="getAreaByWarehouse(upload)" placeholder="请选择所属仓库" filterable clearable>
          <el-option
            v-for="item in warehouseData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select style="width: calc(50% - 5px);margin-bottom: 10px;margin-left: 10px;" v-model="upload.areaId" placeholder="请选择所属库区" filterable clearable>
          <el-option
            v-for="item in areaData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport+'&warehouseId='+upload.warehouseId+'&areaId='+upload.areaId"
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
        <el-button type="primary" @click="submitFileForm(upload)">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 打印预览框 -->
    <el-dialog title="标签打印" v-loading="print.loading" :visible.sync="print.open" width="800px" append-to-body>
      <div class="demo-image">
        <div v-for="item in print.dataList" class="block">
          <span class="demonstration">{{ item.name }}</span>
          <span class="demonstration code">{{ item.code }}</span>
          <el-image style="width: 200px; height: 200px" :src="item.url" fit="cover" />
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
import { listLocation, getLocation, delLocation, addLocation, updateLocation,checkData,getWarehouseData,getAreaData,getPrintData } from "@/api/wms/basics/location";
import { getToken } from "@/utils/auth";
export default {
  name: "Location",
  dicts: ['sys_yes_no', 'wms_enable_status'],
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
      // 库位基本信息表格数据
      locationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        locationCode: null,
        locationName: null,
        warehouseId: null,
        areaId: null,
        totalCapacity: null,
        tolerableWeight: null,
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
        url: process.env.VUE_APP_BASE_API + "/basics/location/importData",
        warehouseId:'',
        areaId:'',
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
      warehouseData:[],
      areaData:[],
      viewForm:{},
      // 表单参数
      form: {},
      //表格高度
      tableHeight:50,
      // 表单校验
      rules: {
        locationCode: [
            { required: true, message: "库位编码不能为空", trigger: "blur" }
        ],
        locationName: [
            { required: true, message: "库位名称不能为空", trigger: "blur" }
        ],
        warehouseId: [
            { required: true, message: "所属仓库编号不能为空", trigger: "blur" }
        ],
        areaId: [
            { required: true, message: "所属库区编号不能为空", trigger: "blur" }
        ],
        totalCapacity: [
            { required: true, message: "库位容量不能为空", trigger: "blur" }
        ],
        tolerableWeight: [
            { required: true, message: "可容重量不能为空", trigger: "blur" }
        ],
        orderNum: [
            { required: true, message: "排序值不能为空", trigger: "blur" },
            {
              pattern: /^[1-9]+[0-9]*$/,
              message: "请输入正确的整数",
              trigger: "blur"
            }
        ],
        columnNum: [
            { required: true, message: "所在列数不能为空", trigger: "blur" },
            {
              pattern: /^[1-9]+[0-9]*$/,
              message: "请输入正确的整数",
              trigger: "blur"
            }
        ],
        platoon: [
            { required: true, message: "所在排数不能为空", trigger: "blur" },
            {
              pattern: /^[1-9]+[0-9]*$/,
              message: "请输入正确的整数",
              trigger: "blur"
            }
        ],
        layer: [
            { required: true, message: "所在层数不能为空", trigger: "blur" },
            {
              pattern: /^[1-9]+[0-9]*$/,
              message: "请输入正确的整数",
              trigger: "blur"
            }
        ],
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
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );

      })
    },
    initData(){
      getWarehouseData().then(res => {
        this.warehouseData=res.data
      })

    },
    getAreaByWarehouse(data){
      data.areaId='';
      getAreaData({warehouseId:data.warehouseId}).then(res => {
        this.areaData=res.data
      })
    },
    /** 查询库位基本信息列表 */
    getList() {
      this.loading = true;
      listLocation(this.queryParams).then(response => {
        this.locationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.areaData=[];
      this.form = {
        id: null,
        locationCode: null,
        locationName: null,
        warehouseId: null,
        areaId: null,
        row: null,
        platoon: null,
        layer: null,
        totalCapacity: null,
        tolerableWeight: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加库位基本信息";
    },
    handleStatusChange(row) {
      let text = row.enableStatus === "0" ? "启用" : "禁用";
      this.$modal.confirm('确认要' + text  + row.locationCode + '库位吗？').then(function() {
        return updateLocation({id:row.id,enableStatus:row.enableStatus});
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.enableStatus = row.enableStatus === "0" ? "1" : "0";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLocation(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库位基本信息";
        getAreaData({warehouseId:response.data.warehouseId}).then(res => {
          this.areaData=res.data
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          checkData(this.form).then(res => {
            if(res.code==200){
              if (this.form.id != null) {
                updateLocation(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                addLocation(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
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
        return delLocation(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/location/export', {
        ...this.queryParams
      }, `location_${new Date().getTime()}.xlsx`)
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
          console.log(item.url);
        });
      })
    },
    /** 打印标签按钮 */
    printData(){

      this.print.open=false;
      this.$modal.msgSuccess("已打印"+this.print.dataList.length+"条码");
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "库位基本信息模板数据导入";
      this.upload.warehouseId='';
      this.upload.areaId='';
      this.areaData=[]
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('basics/location/importTemplate', {
      }, `库位基本信息导入模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.warehouseId = '';
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
    submitFileForm(data) {
      if(this.fileData.length<1){
        this.$modal.msgWarning('必须要上传文件，请检查！');
        return
      }
      if(data.warehouseId&&data.areaId){
        this.$refs.upload.submit();
      }else{
        this.$modal.msgError(`请选择库位对应的仓库以及库区`);
      }
    }
  }
};
</script>
<style scoped>
.demo-image .block {
  padding: 10px 0;
  text-align: center;
  border: solid 1px ;
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
  font-weight:bolder ;
  margin-bottom: 5px;
  height: 40px;
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
</style>
