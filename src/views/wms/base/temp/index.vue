<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="模板编码" prop="tempId">
          <el-input
            v-model="queryParams.tempId"
            placeholder="请输入模板ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模板名称" prop="tempName">
          <el-input
            v-model="queryParams.tempName"
            placeholder="请输入模板名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属模块" prop="module">
          <el-input
            v-model="queryParams.module"
            placeholder="请输入所属模块"
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
            v-hasPermi="['wms:temp:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['wms:temp:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wms:temp:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['wms:temp:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="tempList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="模板编码" align="center" prop="tempId" />
        <el-table-column label="模板名称" align="center" prop="tempName" />
        <el-table-column label="所属模块" align="center" prop="module" />
        <el-table-column label="文件名称" align="center" prop="fileName" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wms:temp:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wms:temp:remove']"
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

    <!-- 添加或修改模板配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板编码" prop="tempId">
          <el-input v-model="form.tempId" placeholder="请输入模板ID" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="模板名称" prop="tempName">
          <el-input v-model="form.tempName" placeholder="请输入模板名称" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="所属模块" prop="module">
          <el-input v-model="form.module" placeholder="请输入所属模块" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="文件名称" prop="fileName">
          <file-upload v-model="form.fileKey" :accept="accept" :limit="1" :buinessId="form.id" :fileType="['ftl']"  ref="child_id" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"
                    type="textarea"
                    :autosize="{minRows:3}"
                    placeholder="请输入内容"
                    show-word-limit
                    maxlength="1024" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listTemp, getTemp, delTemp, addTemp, updateTemp,checkTempId } from "@/api/wms/base/temp";
import { uploadFormal } from '@/api/system/file'
import { getToken } from "@/utils/auth";

export default {
  name: "Temp",
  data() {
    return {
      accept:'.ftl',
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
      // 模板配置表格数据
      tempList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tempId: null,
        tempName: null,
        module: null,
        fileName: null,
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
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/wms/temp/importData"
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tempId: [
            { required: true, message: "模板ID不能为空", trigger: "blur" }
        ],
        tempName: [
            { required: true, message: "模板名称不能为空", trigger: "blur" }
        ],
        module: [
            { required: true, message: "所属模块不能为空", trigger: "blur" }
        ],
        fileName: [
            { required: false, message: "文件名称不能为空", trigger: "blur" }
        ],
        createTime: [
            { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询模板配置列表 */
    getList() {
      this.loading = true;
      listTemp(this.queryParams).then(response => {
        this.tempList = response.rows;
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
        tempId: null,
        tempName: null,
        module: null,
        fileName: null,
        fileKey: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
      this.title = "添加模板配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      const id = row.id || this.ids
      getTemp(id).then(response => {
        this.$refs['child_id'].isInitLoad = true;//让文件组件可以重新加载file.url
        this.form = response.data;
        this.title = "修改模板配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if(this.$refs['child_id'].fileList.length<1){
        this.$modal.msgWarning('必须要上传模板，请检查！');
        return
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          checkTempId(this.form).then(res => {
            if(res.code==200){
              if (this.form.id != null) {
                updateTemp(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                  this.$refs['child_id'].fileList = []; 
                });
              } else {
                addTemp(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  this.$refs['child_id'].fileList = []; 
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
        return delTemp(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/temp/export', {
        ...this.queryParams
      }, `temp_${new Date().getTime()}.xlsx`)
    },

  }
};
</script>
