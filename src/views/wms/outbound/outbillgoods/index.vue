
<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="出库单抬头主键" prop="outBillId">
            <el-input
              v-model="queryParams.outBillId"
              placeholder="请输入出库单抬头主键"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="出库单号" prop="outBillCode">
            <el-input
              v-model="queryParams.outBillCode"
              placeholder="请输入出库单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="货物唯一码" prop="onlyCode">
            <el-input
              v-model="queryParams.onlyCode"
              placeholder="请输入货物唯一码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="机件号" prop="partsCode">
            <el-input
              v-model="queryParams.partsCode"
              placeholder="请输入机件号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="货物编码" prop="goodsCode">
            <el-input
              v-model="queryParams.goodsCode"
              placeholder="请输入货物编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              v-model="queryParams.goodsName"
              placeholder="请输入货物名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="规格型号" prop="model">
            <el-input
              v-model="queryParams.model"
              placeholder="请输入规格型号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计量单位" prop="measureUnit">
            <el-input
              v-model="queryParams.measureUnit"
              placeholder="请输入计量单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="批次" prop="charg">
            <el-input
              v-model="queryParams.charg"
              placeholder="请输入批次"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input
              v-model="queryParams.supplierCode"
              placeholder="请输入供应商编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input
              v-model="queryParams.supplierName"
              placeholder="请输入供应商名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="托盘编号" prop="trayCode">
            <el-input
              v-model="queryParams.trayCode"
              placeholder="请输入托盘编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="出库数量" prop="outBillNum">
            <el-input
              v-model="queryParams.outBillNum"
              placeholder="请输入出库数量"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="出库时间" prop="outBillTime">
            <el-date-picker clearable
              v-model="queryParams.outBillTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择出库时间">
            </el-date-picker>
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
              v-hasPermi="['outbound:outbillgoods:add']"
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
              v-hasPermi="['outbound:outbillgoods:edit']"
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
              v-hasPermi="['outbound:outbillgoods:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['outbound:outbillgoods:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="info"
                plain
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
                v-hasPermi="['outbound:outbillgoods:import']"
            >导入</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="outbillgoodsList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="主键" align="center" prop="id" />
          <el-table-column label="出库单抬头主键" align="center" prop="outBillId" />
          <el-table-column label="出库单号" align="center" prop="outBillCode" />
          <el-table-column label="货物唯一码" align="center" prop="onlyCode" />
          <el-table-column label="机件号" align="center" prop="partsCode" />
          <el-table-column label="货物编码" align="center" prop="goodsCode" />
          <el-table-column label="货物名称" align="center" prop="goodsName" />
          <el-table-column label="规格型号" align="center" prop="model" />
          <el-table-column label="计量单位" align="center" prop="measureUnit" />
          <el-table-column label="批次" align="center" prop="charg" />
          <el-table-column label="供应商编码" align="center" prop="supplierCode" />
          <el-table-column label="供应商名称" align="center" prop="supplierName" />
          <el-table-column label="托盘编号" align="center" prop="trayCode" />
          <el-table-column label="出库数量" align="center" prop="outBillNum" />
          <el-table-column label="出库状态;(0-待拣货 1-已取出 2-已拣货)" align="center" prop="outBillStatus" />
          <el-table-column label="出库时间" align="center" prop="outBillTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.outBillTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['outbound:outbillgoods:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['outbound:outbillgoods:remove']"
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
    <!-- 添加或修改出库单货物对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="出库单抬头主键" prop="outBillId">
          <el-input v-model="form.outBillId" placeholder="请输入出库单抬头主键" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="出库单号" prop="outBillCode">
          <el-input v-model="form.outBillCode" placeholder="请输入出库单号" show-word-limit maxlength="50"/>
        </el-form-item>
        <el-form-item label="货物唯一码" prop="onlyCode">
          <el-input v-model="form.onlyCode" placeholder="请输入货物唯一码" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="机件号" prop="partsCode">
          <el-input v-model="form.partsCode" placeholder="请输入机件号" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="货物编码" prop="goodsCode">
          <el-input v-model="form.goodsCode" placeholder="请输入货物编码" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入货物名称" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入规格型号" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="计量单位" prop="measureUnit">
          <el-input v-model="form.measureUnit" placeholder="请输入计量单位" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="批次" prop="charg">
          <el-input v-model="form.charg" placeholder="请输入批次" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplierCode">
          <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入供应商名称" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="托盘编号" prop="trayCode">
          <el-input v-model="form.trayCode" placeholder="请输入托盘编号" show-word-limit maxlength="32"/>
        </el-form-item>
        <el-form-item label="出库数量" prop="outBillNum">
          <el-input v-model="form.outBillNum" placeholder="请输入出库数量" show-word-limit maxlength="24,3"/>
        </el-form-item>
        <el-form-item label="出库时间" prop="outBillTime">
          <el-date-picker clearable
            v-model="form.outBillTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择出库时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录状态;(0:未删除  1:已删除)" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入记录状态;(0:未删除  1:已删除)" show-word-limit maxlength="10"/>
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

    <!-- 出库单货物-导入对话框 -->
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
import { listOutbillgoods, getOutbillgoods, delOutbillgoods, addOutbillgoods, updateOutbillgoods } from "@/api/wms/outbound/outbillgoods";
import { getToken } from "@/utils/auth";
export default {
  name: "Outbillgoods",
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
      // 出库单货物表格数据
      outbillgoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outBillId: null,
        outBillCode: null,
        onlyCode: null,
        partsCode: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        charg: null,
        supplierCode: null,
        supplierName: null,
        trayCode: null,
        outBillNum: null,
        outBillStatus: null,
        outBillTime: null,
      },
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
        url: process.env.VUE_APP_BASE_API + "/outbound/outbillgoods/importData"
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        outBillId: [
            { required: true, message: "出库单抬头主键不能为空", trigger: "blur" }
        ],
        outBillCode: [
            { required: true, message: "出库单号不能为空", trigger: "blur" }
        ],
        onlyCode: [
            { required: true, message: "货物唯一码不能为空", trigger: "blur" }
        ],
        partsCode: [
            { required: true, message: "机件号不能为空", trigger: "blur" }
        ],
        goodsCode: [
            { required: true, message: "货物编码不能为空", trigger: "blur" }
        ],
        goodsName: [
            { required: true, message: "货物名称不能为空", trigger: "blur" }
        ],
        model: [
            { required: true, message: "规格型号不能为空", trigger: "blur" }
        ],
        measureUnit: [
            { required: true, message: "计量单位不能为空", trigger: "blur" }
        ],
        charg: [
            { required: true, message: "批次不能为空", trigger: "blur" }
        ],
        supplierCode: [
            { required: true, message: "供应商编码不能为空", trigger: "blur" }
        ],
        supplierName: [
            { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        trayCode: [
            { required: true, message: "托盘编号不能为空", trigger: "blur" }
        ],
        outBillNum: [
            { required: true, message: "出库数量不能为空", trigger: "blur" }
        ],
        outBillStatus: [
            { required: true, message: "出库状态;(0-待拣货 1-已取出 2-已拣货)不能为空", trigger: "change" }
        ],
        outBillTime: [
            { required: true, message: "出库时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询出库单货物列表 */
    getList() {
      this.loading = true;
      listOutbillgoods(this.queryParams).then(response => {
        this.outbillgoodsList = response.rows;
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
        outBillId: null,
        outBillCode: null,
        onlyCode: null,
        partsCode: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        charg: null,
        supplierCode: null,
        supplierName: null,
        trayCode: null,
        outBillNum: null,
        outBillStatus: null,
        outBillTime: null,
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
      this.title = "添加出库单货物";
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
        getOutbillgoods(id).then(response => {
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "出库单货物-详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOutbillgoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改出库单货物";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOutbillgoods(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOutbillgoods(this.form).then(response => {
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
        return delOutbillgoods(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('outbound/outbillgoods/export', {
        ...this.queryParams
      }, `outbillgoods_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "模板数据导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('outbound/outbillgoods/importTemplate', {
      }, `出库单货物导入模板.xlsx`)
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
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>

