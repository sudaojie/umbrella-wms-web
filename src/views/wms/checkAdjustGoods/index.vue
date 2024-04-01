<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="盘点调整详情主键" prop="checkAdjustDetail">
            <el-input
              v-model="queryParams.checkAdjustDetail"
              placeholder="请输入盘点调整详情主键"
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
          <el-form-item label="机件号" prop="partsCode">
            <el-input
              v-model="queryParams.partsCode"
              placeholder="请输入机件号"
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
          <el-form-item label="盘点托盘编号" prop="trayCode">
            <el-input
              v-model="queryParams.trayCode"
              placeholder="请输入盘点托盘编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="盘点托盘名称" prop="trayName">
            <el-input
              v-model="queryParams.trayName"
              placeholder="请输入盘点托盘名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="盘点库位编号" prop="locationCode">
            <el-input
              v-model="queryParams.locationCode"
              placeholder="请输入盘点库位编号"
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
            <el-select v-model="queryParams.measureUnit" filterable placeholder="请选择计量单位" clearable>
              <el-option
                v-for="dict in dict.type.wms_metering_unit"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="盘亏数量" prop="lossNum">
            <el-input
              v-model="queryParams.lossNum"
              placeholder="请输入盘亏数量"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="盘盈数量" prop="profitNum">
            <el-input
              v-model="queryParams.profitNum"
              placeholder="请输入盘盈数量"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="盘点单号" prop="checkBillCode">
            <el-input
              v-model="queryParams.checkBillCode"
              placeholder="请输入盘点单号"
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
              v-hasPermi="['wms:checkAdjustGoods:add']"
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
              v-hasPermi="['wms:checkAdjustGoods:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['wms:checkAdjustGoods:export']"
            >导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="info"
                plain
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
                v-hasPermi="['wms:checkAdjustGoods:import']"
            >导入</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="checkAdjustGoodsList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip/>
          <el-table-column label="货物唯一码" align="center" prop="onlyCode" show-overflow-tooltip/>
          <el-table-column label="盘点托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
          <el-table-column label="盘点库位编号" align="center" prop="locationCode" show-overflow-tooltip/>
          <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip/>
          <el-table-column label="计量单位" align="center" prop="measureUnit">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="盘亏数量" align="center" prop="lossNum" show-overflow-tooltip/>
          <el-table-column label="盘盈数量" align="center" prop="profitNum" show-overflow-tooltip/>
          <el-table-column label="打印状态" align="center" prop="printStatus" show-overflow-tooltip/>
          <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
          <el-table-column label="盘点单号" align="center" prop="checkBillCode" show-overflow-tooltip/>
          <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-view"
                        @click="handleView(scope.row)"
                        v-hasPermi="['wms:checkAdjustGoods:view']"
              >详情</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['wms:checkAdjustGoods:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['wms:checkAdjustGoods:remove']"
              >删除</el-button>
              <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                                    v-hasPermi="['system:user:resetPwd']">重置密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
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
    <!-- 添加或修改库存盘点调整详情货物对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="24">
            <el-form-item label="盘点调整详情主键" prop="checkAdjustDetail">
              <el-input v-model="form.checkAdjustDetail" placeholder="请输入盘点调整详情主键" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="货物编码" prop="goodsCode">
              <el-input v-model="form.goodsCode" placeholder="请输入货物编码" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="货物名称" prop="goodsName">
              <el-input v-model="form.goodsName" placeholder="请输入货物名称" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="机件号" prop="partsCode">
              <el-input v-model="form.partsCode" placeholder="请输入机件号" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="货物唯一码" prop="onlyCode">
              <el-input v-model="form.onlyCode" placeholder="请输入货物唯一码" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="盘点托盘编号" prop="trayCode">
              <el-input v-model="form.trayCode" placeholder="请输入盘点托盘编号" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="盘点托盘名称" prop="trayName">
              <el-input v-model="form.trayName" placeholder="请输入盘点托盘名称" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="盘点库位编号" prop="locationCode">
              <el-input v-model="form.locationCode" placeholder="请输入盘点库位编号" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="规格型号" prop="model">
              <el-input v-model="form.model" placeholder="请输入规格型号" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="计量单位" prop="measureUnit">
              <el-select v-model="form.measureUnit" filterable placeholder="请选择计量单位">
                <el-option
                  v-for="dict in dict.type.wms_metering_unit"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="盘亏数量" prop="lossNum">
              <el-input v-model="form.lossNum" placeholder="请输入盘亏数量" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="盘盈数量" prop="profitNum">
              <el-input v-model="form.profitNum" placeholder="请输入盘盈数量" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
        </el-col>
        <el-col :span="24">
            <el-form-item label="记录状态(0:未删除  1:已删除)" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入记录状态(0:未删除  1:已删除)" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" show-word-limit maxlength="255"/>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="盘点单号" prop="checkBillCode">
              <el-input v-model="form.checkBillCode" placeholder="请输入盘点单号" show-word-limit maxlength="32"/>
            </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 库存盘点调整详情货物-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键ID">{{ viewForm.id }}</el-descriptions-item>
          <el-descriptions-item label="盘点调整详情主键">{{ viewForm.checkAdjustDetail }}</el-descriptions-item>
          <el-descriptions-item label="货物编码">{{ viewForm.goodsCode }}</el-descriptions-item>
          <el-descriptions-item label="货物名称">{{ viewForm.goodsName }}</el-descriptions-item>
          <el-descriptions-item label="机件号">{{ viewForm.partsCode }}</el-descriptions-item>
          <el-descriptions-item label="货物唯一码">{{ viewForm.onlyCode }}</el-descriptions-item>
          <el-descriptions-item label="盘点托盘编号">{{ viewForm.trayCode }}</el-descriptions-item>
          <el-descriptions-item label="盘点托盘名称">{{ viewForm.trayName }}</el-descriptions-item>
          <el-descriptions-item label="盘点库位编号">{{ viewForm.locationCode }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ viewForm.model }}</el-descriptions-item>
          <el-descriptions-item label="计量单位">{{ viewForm.measureUnit }}</el-descriptions-item>
          <el-descriptions-item label="盘亏数量">{{ viewForm.lossNum }}</el-descriptions-item>
          <el-descriptions-item label="盘盈数量">{{ viewForm.profitNum }}</el-descriptions-item>
          <el-descriptions-item label="打印状态">{{ viewForm.printStatus }}</el-descriptions-item>
          <el-descriptions-item label="记录状态(0:未删除  1:已删除)">{{ viewForm.delFlag }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ viewForm.createBy }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
          <el-descriptions-item label="修改人">{{ viewForm.updateBy }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{ viewForm.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
          <el-descriptions-item label="盘点单号">{{ viewForm.checkBillCode }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
    <!-- 库存盘点调整详情货物-导入对话框 -->
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
import { listCheckAdjustGoods, getCheckAdjustGoods, delCheckAdjustGoods, addCheckAdjustGoods, updateCheckAdjustGoods } from "@/api/wms/checkAdjustGoods";
import { getToken } from "@/utils/auth";
export default {
  name: "CheckAdjustGoods",
  dicts: ['wms_metering_unit'],
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
      // 库存盘点调整详情货物表格数据
      checkAdjustGoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        checkAdjustDetail: null,
        goodsName: null,
        partsCode: null,
        onlyCode: null,
        trayCode: null,
        trayName: null,
        locationCode: null,
        model: null,
        measureUnit: null,
        lossNum: null,
        profitNum: null,
        printStatus: null,
        checkBillCode: null
      },
      fileData:[],//选择的文件
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
        url: process.env.VUE_APP_BASE_API + "/wms/checkAdjustGoods/importData"
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight:0,
      // 表单校验
      rules: {
        checkAdjustDetail: [
            { required: true, message: "盘点调整详情主键不能为空", trigger: "blur" }
        ],
        goodsCode: [
            { required: true, message: "货物编码不能为空", trigger: "blur" }
        ],
        goodsName: [
            { required: true, message: "货物名称不能为空", trigger: "blur" }
        ],
        partsCode: [
            { required: true, message: "机件号不能为空", trigger: "blur" }
        ],
        onlyCode: [
            { required: true, message: "货物唯一码不能为空", trigger: "blur" }
        ],
        trayCode: [
            { required: true, message: "盘点托盘编号不能为空", trigger: "blur" }
        ],
        locationCode: [
            { required: true, message: "盘点库位编号不能为空", trigger: "blur" }
        ],
        createBy: [
            { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
            { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        checkBillCode: [
            { required: true, message: "盘点单号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    /** 查询库存盘点调整详情货物列表 */
    getList() {
      this.loading = true;
      listCheckAdjustGoods(this.queryParams).then(response => {
        this.checkAdjustGoodsList = response.rows;
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
    // 表单重置
    reset() {
      this.form = {
        id: null,
        checkAdjustDetail: null,
        goodsCode: null,
        goodsName: null,
        partsCode: null,
        onlyCode: null,
        trayCode: null,
        trayName: null,
        locationCode: null,
        model: null,
        measureUnit: null,
        lossNum: null,
        profitNum: null,
        printStatus: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        checkBillCode: null
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
      this.title = "添加库存盘点调整详情货物";
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
        getCheckAdjustGoods(id).then(response => {
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "库存盘点调整详情货物-详情";
      });
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
      getCheckAdjustGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存盘点调整详情货物";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCheckAdjustGoods(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCheckAdjustGoods(this.form).then(response => {
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
        return delCheckAdjustGoods(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wms/checkAdjustGoods/export', {
        ...this.queryParams
      }, `checkAdjustGoods_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "模板数据导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('wms/checkAdjustGoods/importTemplate', {
      }, `库存盘点调整详情货物导入模板.xlsx`)
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
    //选择文件
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
