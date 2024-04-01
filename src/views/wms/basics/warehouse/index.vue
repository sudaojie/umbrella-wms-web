<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
        margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="仓库编码" prop="warehouseCode">
          <el-input v-model="queryParams.warehouseCode" placeholder="请输入仓库编码" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="queryParams.warehouseName" placeholder="请输入仓库名称" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="仓库容量(m³)" prop="totalCapacity">
          <el-input
            v-model="queryParams.totalCapacity"
            placeholder="请输入仓库容量(m³)"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="可用容量(m³)" prop="availableCapacity">
          <el-input
            v-model="queryParams.availableCapacity"
            placeholder="请输入可用容量(m³)"
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['basics:warehouse:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['basics:warehouse:remove']">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['basics:warehouse:export']">全部导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="warehouseList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="仓库编码" align="center" prop="warehouseCode" show-overflow-tooltip />
        <el-table-column label="仓库名称" align="center" prop="warehouseName" show-overflow-tooltip />
        <el-table-column label="仓库容量(m³)" align="center" prop="totalCapacity" />
        <!-- <el-table-column label="可用容量(m³)" align="center" prop="availableCapacity" /> -->
        <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:warehouse:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['basics:warehouse:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>

    <!-- 添加或修改仓库基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="仓库编码" prop="warehouseCode">
          <el-input :disabled="form.id ? true : false" v-model="form.warehouseCode" placeholder="请输入仓库编码" show-word-limit
            maxlength="20" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" show-word-limit maxlength="20" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容" show-word-limit
            maxlength="200" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx,.xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false"
        :on-change="uploadFile" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
            @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse, checkData } from "@/api/wms/basics/warehouse";
import { getToken } from "@/utils/auth";
import { EOL } from "os";
export default {
  name: "Warehouse",
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
      // 仓库基本信息表格数据
      warehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      isAdd: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseCode: null,
        warehouseName: null,
        totalCapacity: null,
        availableCapacity: null,
      },
      //上传文件列表
      fileData: [],
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basics/warehouse/importData"
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseCode: [
          { required: true, message: "仓库编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "仓库名称不能为空", trigger: "blur" }
        ],
        totalCapacity: [
          { required: true, message: "仓库容量(m³)不能为空且必须为数字", trigger: "blur" },
          // { required: true,maxlength: 10, message: '最大长度不能超过10', trigger: 'blur' },
          // { required: true,min:0, max:9999999.999, message: '只能为0~9999999.999的数字', trigger: 'blur' },
        ],
      },
      //表格高度
      tableHeight: 0,
    };
  },
  created() {
    this.getList();
    this.setTableGeight()
    window.addEventListener('resize', this.setTableGeight)
  },
  methods: {
    /** 查询仓库基本信息列表 */
    getList() {
      this.loading = true;
      listWarehouse(this.queryParams).then(response => {
        this.warehouseList = response.rows;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseCode: null,
        warehouseName: null,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isAdd = true;
      this.title = "添加仓库基本信息";
    },
    /**
     * 动态赋值可用容量
     * @param {*} data
     */
    change(data) {
      if (this.isAdd) {
        data.availableCapacity = data.totalCapacity;
      } else {
        data.availableCapacity = data.availableCapacity + (data.totalCapacity - data.oldTotalCapacity)
        if (data.availableCapacity < 0) {
          data.availableCapacity = 0;
        }
      }
      data.oldTotalCapacity = data.totalCapacity;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isAdd = false;
      this.reset();
      const id = row.id || this.ids;
      getWarehouse(id).then(response => {
        this.form = response.data;
        this.form.oldTotalCapacity = this.form.totalCapacity;
        this.open = true;
        this.title = "修改仓库基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //检查是否满足要求
          checkData(this.form).then(res => {
            if (res.code == 200) {
              if (this.form.id != null) {
                updateWarehouse(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              }
              else {
                addWarehouse(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm("是否确认删除该记录？").then(function () {
        return delWarehouse(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download("basics/warehouse/export", {
        ...this.queryParams
      }, `warehouse_${new Date().getTime()}.xlsx`);
    },
    
  },
  components: { EOL }
};
</script>
<style scoped>
#app>>>.app-main {
  background-color: #f0f2f5;
}

.el-form>>>.el-input-number__decrease {
  display: none;
}

.el-form>>>.el-input-number__increase {
  display: none;
}

.el-table>>>.el-table__fixed::before,
.el-table>>>.el-table__fixed-right::before {
  display: none;
}
</style>