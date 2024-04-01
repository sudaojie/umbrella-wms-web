<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="库区编码" prop="areaCode">
          <el-input
            v-model="queryParams.areaCode"
            placeholder="请输入库区编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库区名称" prop="areaName">
          <el-input
            v-model="queryParams.areaName"
            placeholder="请输入库区名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库区类型" prop="areaType">
          <el-select v-model="queryParams.areaType" filterable placeholder="请选择库区类型" clearable>
            <el-option
              v-for="dict in dict.type.wms_area_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-select v-model="queryParams.warehouseId" filterable placeholder="请选择所属仓库" clearable>
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="库区容量" prop="totalCapacity">
          <el-input
            v-model="queryParams.totalCapacity"
            placeholder="请输入库区容量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="可用容量" prop="availableCapacity">
          <el-input
            v-model="queryParams.availableCapacity"
            placeholder="请输入可用容量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
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
            v-hasPermi="['basics:area:add']"
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
            v-hasPermi="['basics:area:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['basics:area:export']"
          >全部导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="areaList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="库区编码" align="center" prop="areaCode" show-overflow-tooltip/>
        <el-table-column label="库区名称" align="center" prop="areaName" show-overflow-tooltip/>
        <el-table-column label="库区类型" align="center" prop="areaType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_area_type" :value="scope.row.areaType"/>
          </template>
        </el-table-column>
        <el-table-column label="所属仓库" align="center" minWidth="200" prop="warehouseId" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="库区容量(m³)" align="center" prop="totalCapacity" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:area:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:area:remove']"
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

    <!-- 添加或修改库区基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="库区编码" prop="areaCode">
          <el-input :disabled="form.id?true:false" v-model="form.areaCode" placeholder="请输入库区编码" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="库区名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入库区名称" filterable show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="库区类型" prop="areaType">
          <el-select style="width: 100%;" v-model="form.areaType" filterable placeholder="请选择库区类型" clearable>
            <el-option
              v-for="dict in dict.type.wms_area_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouseId">
          <el-select style="width: 100%;" v-model="form.warehouseId" placeholder="请选择所属仓库" filterable clearable>
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="库区容量(m³)" prop="totalCapacity">
          <el-input disabled v-model="form.totalCapacity" placeholder="请输入库区容量" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="可用容量(m³)" prop="availableCapacity">
          <el-input disabled  v-model="form.availableCapacity" placeholder="请输入可用容量" show-word-limit maxlength="255"/>
        </el-form-item> -->
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

    <!-- 库区基本信息-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
        <el-descriptions :column="2" border>
          <!-- <el-descriptions-item label="编号">{{ viewForm.id }}</el-descriptions-item> -->
          <el-descriptions-item label="库区编码">{{ viewForm.areaCode }}</el-descriptions-item>
          <el-descriptions-item label="库区名称">{{ viewForm.areaName }}</el-descriptions-item>
          <el-descriptions-item label="库区类型">{{ viewForm.areaType }}</el-descriptions-item>
          <el-descriptions-item label="所属仓库">{{ viewForm.warehouseId }}</el-descriptions-item>
          <el-descriptions-item label="库区容量(m³)">{{ viewForm.totalCapacity }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ viewForm.createBy }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
          <el-descriptions-item label="修改人">{{ viewForm.updateBy }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{ viewForm.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
        <el-select style="width: 100%;margin-bottom: 10px;" v-model="upload.warehouseId" placeholder="请选择所属仓库" filterable  clearable>
          <el-option
            v-for="item in warehouseData"
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
        :action="upload.url + '?updateSupport=' + upload.updateSupport+'&warehouseId='+upload.warehouseId"
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
        <el-button type="primary" @click="submitFileForm(upload.warehouseId)">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArea, getArea, delArea, addArea, updateArea,checkData,getWarehouseData } from "@/api/wms/basics/area";
import { getToken } from "@/utils/auth";
export default {
  name: "Area",
  dicts: ['wms_area_type'],
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
      // 库区基本信息表格数据
      areaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaCode: null,
        areaName: null,
        areaType: null,
        warehouseId: null,
        totalCapacity: null,
        availableCapacity: null,
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
        url: process.env.VUE_APP_BASE_API + "/basics/area/importData",
        warehouseId:''
      },
      warehouseData:[],
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        areaCode: [
            { required: true, message: "库区编码不能为空", trigger: "blur" }
        ],
        areaName: [
            { required: true, message: "库区名称不能为空", trigger: "blur" }
        ],
        warehouseId: [
            { required: true, message: "所属仓库不能为空", trigger: "blur" }
        ],
        areaType: [
            { required: true, message: "库区类型不能为空", trigger: "blur" }
        ],
      },
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
    initData(){
      getWarehouseData().then(res => {
        this.warehouseData=res.data
      })
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );

      })
    },
    /** 查询库区基本信息列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then(response => {
        this.areaList = response.rows;
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
      this.form = {
        id: null,
        areaCode: null,
        areaName: null,
        warehouseId: null,
        totalCapacity: null,
        availableCapacity: null,
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
      this.title = "添加库区基本信息";
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
        getArea(id).then(response => {
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "库区基本信息-详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArea(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库区基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          checkData(this.form).then(res => {
            if(res.code==200){
              if (this.form.id != null) {
                updateArea(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                addArea(this.form).then(response => {
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
        return delArea(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/area/export', {
        ...this.queryParams
      }, `area_${new Date().getTime()}.xlsx`)
    },
    
  }
};
</script>
<style scoped>
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
 display: none;
}
</style>