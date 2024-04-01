<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div
        style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
                                                                                                    margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
        style="padding-left: 10px;">
        <el-form-item label="入库单号" prop="inBillCode">
          <el-select style="width: 100%;" filterable v-model="queryParams.inBillCode" @change="getCategoryCode(form)"
            placeholder="请选择入库单" clearable>
            <el-option v-for="item in inBillCodeList" :key="item.categoryCode" :label="item.inBillCode"
              :value="item.inBillCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="货物类型" prop="goodsCode" :key="Math.random()">
          <el-select style="width: 100%;" filterable @change="$forceUpdate()" v-model="queryParams.goodsCode"
            placeholder="请选择货物类型" clearable>
            <el-option v-for="item in categoryCodeList" :key="item.categoryCode" :label="item.goods_name"
              :value="item.goods_code" />
          </el-select>
        </el-form-item>
        <el-form-item label="机件号" prop="partsCode">
          <el-input v-model="queryParams.partsCode" placeholder="请输入机件号" clearable @keyup.enter.native="handleQuery"
            @input="$forceUpdate()" />
        </el-form-item>
        <el-form-item label="唯一码" prop="onlyCode">
          <el-input v-model="queryParams.onlyCode" placeholder="请输入唯一码" clearable @keyup.enter.native="handleQuery"
            @input="$forceUpdate()" />
        </el-form-item>
        <el-form-item label="打印状态" prop="printStatus">
          <el-select v-model="queryParams.printStatus" filterable placeholder="请选择是否打印" clearable>
            <el-option v-for="dict in dict.type.wms_print_status" :key="dict.value" :label="dict.label"
              :value="dict.value" />
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
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleAdd"
            v-hasPermi="['warehousing:parts:add']">维护机件号</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
            v-hasPermi="['warehousing:parts:import']">导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-printer" size="mini" @click="handlePrinter(0)"
            v-hasPermi="['warehousing:parts:printer']">打印机件码</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-printer" size="mini" @click="handlePrinter(1)"
            v-hasPermi="['warehousing:parts:printer']">补打机件码</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <!--      <el-tabs v-model="activeTab" type="card" @tab-click="tabClick">-->
      <!--        <el-tab-pane label="未打印" name="first"></el-tab-pane>-->
      <!--        <el-tab-pane label="已打印" name="second"></el-tab-pane>-->
      <!--      </el-tabs>-->
      <el-table v-loading="loading" :data="partsList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="入库单号" align="center" prop="inBillCode" show-overflow-tooltip />
        <el-table-column label="货物编码"  width="150" align="center" prop="goodsCode" show-overflow-tooltip />
        <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
        <el-table-column label="唯一码" align="center" prop="onlyCode" show-overflow-tooltip />
        <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip />
        <el-table-column label="生产日期" align="center" prop="produceTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.produceTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center" prop="periodValidity" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.periodValidity, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="打印状态" align="center" prop="printStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_print_status" :value="scope.row.printStatus" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- 添加或修改机件号记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="24">
          <el-form-item label="机件号" prop="partsCode">
            <el-input v-model="form.partsCode" placeholder="请输入机件号" show-word-limit maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生产日期" prop="produceTime">
            <el-date-picker clearable v-model="form.produceTime" type="date" value-format="yyyy-MM-dd"
              placeholder="请选择生产日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效期" prop="periodValidity">
            <el-date-picker clearable v-model="form.periodValidity" type="date" value-format="yyyy-MM-dd"
              placeholder="请选择有效期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容" show-word-limit
              maxlength="1024" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 机件号记录-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="机件号">{{ viewForm.partsCode }}</el-descriptions-item>
        <el-descriptions-item label="生产日期">{{ viewForm.produceTime }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ viewForm.periodValidity }}</el-descriptions-item>
        <el-descriptions-item label="打印状态">{{ viewForm.printStatus }}</el-descriptions-item>
        <el-descriptions-item label="记录状态">{{ viewForm.delFlag }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ viewForm.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
        <el-descriptions-item label="修改人">{{ viewForm.updateBy }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{ viewForm.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 机件号记录-导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="importDialog" width="400px" :show-close="false" append-to-body>
      <el-select style="width: 100%;margin-bottom: 10px;" filterable v-model="upload.inBillCode"
        @change="getCategoryCodes(form)" placeholder="请选择入库单" clearable>
        <el-option v-for="item in inBillCodeList" :key="item.categoryCode" :label="item.inBillCode"
          :value="item.inBillCode" />
      </el-select>
      <el-select style="width: 100%;margin-bottom: 10px;" multiple filterable v-model="upload.goodsCodeList"
        placeholder="请选择物品类型" clearable>
        <el-option v-for="item in categoryCodeList" :key="item.categoryCode" :label="item.goods_name"
          :value="item.goods_code" />
      </el-select>
      <el-upload ref="upload" :limit="1" accept=".xlsx,.xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :before-upload="beforeAvatarUpload" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
        :auto-upload="false" :on-change="uploadFile" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
            @click="importTemplate(upload)">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="cancelUpload">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 打印预览框 -->
    <el-dialog title="标签打印" v-loading="print.loading" :visible.sync="print.open" width="60%" append-to-body>
      <div class="demo-image">
        <div v-for="item in print.dataList" class="block">
          <div style="display: flex;align-items: center;">
              <div style="flex:2;">
                <el-image style="width: 90%; height: 90%" :src="item.url" fit="cover" />
<!--                <span class="demonstration code">{{ item.code }}</span>-->
              </div>
              <div style="flex: 4;padding: 10px 10px 10px 0px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">编 号</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.onlyCode }}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">货物名称</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.goodsName }}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">型 号</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.model }}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">生 产 商</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.gys }}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">生产日期</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{ parseTime(item.produceTime, '{y}-{m}-{d}')}}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">封存截止日期</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{  parseTime(item.periodValidity, '{y}-{m}-{d}') }}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">封存保管日期</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{item.storageDate}}</div>
                </div>
                <div style="border: solid black 1px;border-bottom: 0px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">机 件 号</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">{{ item.partsCode }}</div>
                </div>
                <div style="border: solid black 1px;display: flex;align-items: center;justify-content: space-around;">
                  <div style="width: 30%;border-right: solid black 1px; padding-left: 5px;">印 制</div>
                  <div style="width: 70%;text-align: left;padding-left: 5px;">洛阳造</div>
                </div>
<!--                <div style="border: solid black 1px;height: 60px;display: flex;align-items: center;justify-content: space-around;">-->
<!--                  <div style="width: 30%;height: 100%;;border-right: solid black 1px;">货物描述</div>-->
<!--                  <div style="width: 70%;height: 100%;text-align: left;padding-left: 5px;">{{ item.goodsName }}</div>-->
<!--                </div>-->
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
import { listParts, getParts, delParts, addParts, updateParts, getPrintData, getCategoryCode, findInbillCode, updatePartsPrint,printDataList } from "@/api/wms/warehousing/parts";
import { getToken } from "@/utils/auth";
export default {
  name: "Parts",
  dicts: ['wms_print_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //选中的数据
      selectedData: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 机件号记录表格数据
      partsList: [],
      //货物类型列表
      categoryCodeList: [],
      //初始化入库单号列表
      inBillCodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        partsCode: null,
        produceTime: null,
        periodValidity: null,
        printStatus: null,
        inBillCode: null,
        categoryCode: null,
        onlyCode: null,
        goodsCode: null,
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
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/warehousing/parts/importData",
        inBillCode: "",
        goodsCode: "",
        //物品类型多选
        goodsCodeList: []
      },
      //打印参数
      print: {
        loading: false,
        open: false,
        dataList: [],
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {
        partsCode: [
          { required: true, message: "机件号不能为空", trigger: "blur" }
        ],
        produceTime: [
          { required: true, message: "生产日期不能为空", trigger: "blur" }
        ],
        periodValidity: [
          { required: true, message: "有效期不能为空", trigger: "blur" }
        ],
      },
      activeTab: 'first',

      importDialog: false
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    this.findInbillCode();
    window.addEventListener('resize', this.setTableGeight)
  },
  methods: {
    //打印、未打印标签
    tabClick(tab) {
      if (tab.name == "first") {
        this.partsStatus = 0;
        this.queryParams.partsStatus = this.partsStatus
        this.getList();
      } else {
        this.partsStatus = 1;
        this.queryParams.partsStatus = this.partsStatus
        this.getList();
      }
    },
    /** 查询机件号记录列表 */
    getList() {
      this.loading = true;
      listParts(this.queryParams).then(response => {
        this.partsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 初始化获取入库单号 */
    findInbillCode() {
      // this.loading = true;
      findInbillCode(this.queryParams).then(response => {
        this.inBillCodeList = response.data;
      });
    },
    /** 级联获取物品类型 */
    getCategoryCode(data) {
      this.queryParams.goodsCode = "";
      getCategoryCode(this.queryParams).then(response => {
        this.categoryCodeList = response.data;
      })
    },
    /** 下载级联获取物品类型 */
    getCategoryCodes(data) {
      getCategoryCode(this.upload).then(response => {
        this.categoryCodeList = response.data;
      })
      this.upload.goodsCodeList = [];
    },
    cancelUpload() {
      this.upload.inBillCode = "";
      this.upload.goodsCode = "";
      this.upload.goodsCodeList = [];
      this.importDialog = false;
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
      // this.loading = true;
      // this.resetQuery();
      // this.getList();
    },
    /** 打印标签弹窗 */
    handlePrinter(type) {
      this.print.dataList = [];
      this.print.type = type;
      let data = {};
      //判断是否勾选数据
      if (this.ids.length > 0) {//勾选了就传勾选数据
        data = { ids: this.ids }
      } else {//未勾选就是查询过滤后的数据
        data = this.queryParams
      }
      data.type = type
      //后台获取数据
      getPrintData(data).then(res => {
        this.print.open = true;
        this.print.dataList = res.data;
        this.print.dataList.forEach(item => {
          let src = process.env.VUE_APP_BASE_API + item.url;
          item.url = src
        });
      })
    },
    /** 打印标签按钮 */
    printData() {
      let ids = []
      this.print.dataList.forEach(item => {
        ids.push(item.id)
      })
      if (this.print.type == '0') {
        updatePartsPrint({ ids: ids, partsStatus: 1 }).then(response => {
          this.getList();
        });
      }
      this.print.open = false;
      //打印机件号二维码
      console.log(this.print.dataList)
      printDataList(this.print.dataList).then(res=>{
        this.$modal.msgSuccess((this.print.type == '0' ? "已打印" : "已补打") + this.print.dataList.length + "条机件号");
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        partsCode: null,
        produceTime: null,
        periodValidity: null,
        partsStatus: null,
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
      this.upload.inBillCode = '';
      this.upload.goodsCodeList = [];
      this.upload.inBillCode = this.queryParams.inBillCode;
      if (this.queryParams.goodsCode != null && this.queryParams.goodsCode != undefined && this.queryParams.goodsCode != '') {
        this.upload.goodsCodeList.push(this.queryParams.goodsCode);
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.goodsCode = "";
      this.categoryCodeList = [];
      this.queryParams.inBillCode = "";
      this.queryParams.pageNum = 1;
      this.queryParams.partsCode = "";
      this.queryParams.onlyCode = "";
      this.queryParams.printStatus = "";
      this.upload.goodsCodeList = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.selectedData = selection.map(item => item)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$tab.openPage("维护机件号", "/wmsJob/PartsDetail");
    },
    /** 详情按钮操作 */
    handleView(row) {
      const id = row.id;
      getParts(id).then(response => {
        this.viewForm = response.data;
        this.viewModalOpen = true;
        this.title = "机件号记录-详情";
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
      getParts(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改机件号记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateParts(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addParts(this.form).then(response => {
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
      if (this.ids) {
        for (const item in this.selectedData) {
          if (this.selectedData[item].partsStatus == 1) {
            this.$modal.msgError("已打印状态机件码不准删除");
            return
          }
        }
      }
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中记录？').then(function () {
        return delParts(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('warehousing/parts/export', {
        ...this.queryParams
      }, `parts_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      if (this.upload.goodsCodeList === undefined || this.upload.goodsCodeList <= 0) {
        this.upload.goodsCodeList = [];
      }
      this.inBillCodeList = [];
      this.upload.title = "模板数据导入";
      this.importDialog = true;
      this.findInbillCode();
    },
    /** 下载模板操作 */
    importTemplate(data) {
      if (data.inBillCode) {
        this.download('warehousing/parts/importTemplate', {
          ...this.upload
        }, `机件号记录导入模板.xlsx`)
      } else {
        this.$modal.msgError(`请选择对应的入库单号`);
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    //
    beforeAvatarUpload(rawFile) {
      if (rawFile.size / 1024 > 300) {
        this.$modal.msgError(`选择文件不可大于300K`);
        return false
      }
      return true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    uploadFile(file, fileList) {
      this.fileData = fileList;
    },
    // 提交上传文件
    submitFileForm() {
      if (this.fileData.length < 1) {
        this.$modal.msgWarning('必须要上传文件，请检查！');
        return
      }
      this.$refs.upload.submit();
      this.this.upload.goodsCodeList = []
    }
  }
};
</script>
<style scoped>
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

.demo-image .block {
  text-align: center;
  border: solid 2px;
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 5px;
  margin-bottom: 10px;
}

.demo-image .block:last-child {
  /*margin-right: none;*/
}

.demonstration {
  display: block;
  /*color: var(--el-text-color-secondary);*/
  font-size: 12px;
  padding: 0px 3px;
  margin-bottom: 5px;
  height: 42px;
}

.demo-image .code {
  font-size: 14px;
  font-weight: bolder;
  margin-bottom: 5px;
}

.el-table>>>.el-table__fixed::before,
.el-table>>>.el-table__fixed-right::before {
  display: none;
}
</style>
