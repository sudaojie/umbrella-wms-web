<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="规格编号" prop="trayModelCode">
            <el-input
              v-model="queryParams.trayModelCode"
              placeholder="请输入规格编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="规格名称" prop="trayModelName">
            <el-input
              v-model="queryParams.trayModelName"
              placeholder="请输入规格名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
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
              v-hasPermi="['basics:model:add']"
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
              v-hasPermi="['basics:model:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['basics:model:export']"
            >全部导出</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
                type="info"
                plain
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
                v-hasPermi="['basics:model:import']"
            >导入</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="modelList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="规格编号" align="center" prop="trayModelCode" show-overflow-tooltip/>
          <el-table-column label="规格名称" align="center" prop="trayModelName" show-overflow-tooltip/>
          <el-table-column label="长(cm)" align="center" width="180" prop="modelLength" show-overflow-tooltip/>
          <el-table-column label="宽(cm)" align="center" width="180" prop="modelWidth" show-overflow-tooltip/>
          <el-table-column label="高(cm)" align="center" width="180" prop="modelHeight" show-overflow-tooltip/>
          <el-table-column label="容量(m³)" align="center" prop="modelVolume" show-overflow-tooltip/>
          <el-table-column label="限重(kg)" align="center" prop="modelWeight" show-overflow-tooltip/>
          <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['basics:model:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['basics:model:remove']"
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
    <!-- 添加或修改托盘规格对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="24">
            <el-form-item label="规格编号" prop="trayModelCode">
              <el-input :disabled="form.id?true:false" v-model="form.trayModelCode" placeholder="请输入规格编号" show-word-limit maxlength="50"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="规格名称" prop="trayModelName">
              <el-input v-model="form.trayModelName" placeholder="请输入规格名称" show-word-limit maxlength="100"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="长(cm)" prop="modelLength">
            <el-input-number style="width: 100%;" :min="0" :max="9999999" v-model="form.modelLength" @blur="countArea(form)" placeholder="请输入长(cm)" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="宽(cm)" prop="modelWidth">
            <el-input-number style="width: 100%;" :min="0" :max="9999999" v-model="form.modelWidth" @blur="countArea(form)" placeholder="请输入宽(cm)" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="高(cm)" prop="modelHeight">
            <el-input-number style="width: 100%;" :min="0" :max="9999999" v-model="form.modelHeight" @blur="countArea(form)" placeholder="请输入高(cm)" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="容量(m³)" prop="modelVolume">
            <el-input-number disabled style="width: 100%;" :min="0" :max="9999999" v-model="form.modelVolume" placeholder="请输入容量(m³)" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="限重(kg)" prop="modelWeight">
            <el-input-number style="width: 100%;" :min="0" :max="9999999" v-model="form.modelWeight" placeholder="请输入限重(kg)" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 托盘规格-导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx,.xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
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
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listModel, getModel, delModel, addModel, updateModel } from "@/api/wms/basics/model";
import { getToken } from "@/utils/auth";
export default {
  name: "Model",
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
      // 托盘规格表格数据
      modelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        trayModelCode: null,
        trayModelName: null,
        modelLength: null,
        modelWidth: null,
        modelHeight: null,
        modelVolume: null,
        modelWeight: null
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
        url: process.env.VUE_APP_BASE_API + "/basics/model/importData"
      },
      viewForm:{},
      // 表单参数
      form: {},
      //表格高度
      tableHeight:0,
      // 表单校验
      rules: {
        trayModelCode: [
          { required: true, message: "托盘类型编码不能为空", trigger: "blur" }
        ],
        trayModelName: [
          { required: true, message: "托盘类型名称不能为空", trigger: "blur" }
        ],
        modelLength: [
          { required: true, message: "长(cm)不能为空", trigger: "blur" },
          {
            pattern: /^\d*(\.\d{1,20})?$/,
            message: "请输入正确的数",
            trigger: "blur"
          }
        ],
        modelWidth: [
          { required: true, message: "宽(cm)不能为空", trigger: "blur" },
          {
            pattern: /^\d*(\.\d{1,20})?$/,
            message: "请输入正确的数",
            trigger: "blur"
          }
        ],
        modelHeight: [
          { required: true, message: "高(cm)不能为空", trigger: "blur" },
          {
            pattern: /^\d*(\.\d{1,20})?$/,
            message: "请输入正确的数",
            trigger: "blur"
          }
        ],
        modelWeight: [
          { required: true, message: "限重(kg)不能为空", trigger: "blur" },
          {
            pattern: /^\d*(\.\d{1,20})?$/,
            message: "请输入正确的数",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    /** 查询托盘规格列表 */
    getList() {
      this.loading = true;
      listModel(this.queryParams).then(response => {
        this.modelList = response.rows;
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
    // 根据输入数据计算容量
    countArea(data) {
      if(data.modelLength&&data.modelWidth&&data.modelHeight){
        data.modelVolume = parseFloat(data.modelLength*data.modelWidth*90/1000000).toFixed(2);
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        trayModelCode: null,
        trayModelName: null,
        modelLength: null,
        modelWidth: null,
        modelHeight: null,
        modelVolume: null,
        modelWeight: null
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
      this.title = "添加托盘规格";
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
      getModel(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改托盘规格";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.countArea(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateModel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addModel(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
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
        return delModel(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/model/export', {
        ...this.queryParams
      }, `model_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "模板数据导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('basics/model/importTemplate', {
      }, `托盘规格导入模板.xlsx`)
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
      this.$refs.upload.submit();
    }
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
</style>
