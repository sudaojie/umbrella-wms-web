<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;"
      >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
               style="padding-left: 10px;"
      >
        <el-form-item label="库位编码" prop="tranferLocationCode">
          <el-input
            v-model="queryParams.tranferLocationCode"
            placeholder="请输入库位编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属库区" prop="areaCode">
          <el-select v-model="queryParams.areaCode" filterable placeholder="请选择所属库区" clearable>
            <el-option
              v-for="dict in areaList"
              :key="dict.areaCode"
              :label="dict.areaName"
              :value="dict.areaCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="朝向" prop="tranferLocationArrow">
          <el-select v-model="queryParams.tranferLocationArrow" filterable placeholder="请选择朝向" clearable>
            <el-option
              v-for="dict in dict.type.tranfer_location_arrow"
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
            v-hasPermi="['basics:transferLocation:add']"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['basics:transferLocation:remove']"
          >删除
          </el-button>
        </el-col>
        <!--          <el-col :span="1.5">-->
        <!--            <el-button-->
        <!--              type="warning"-->
        <!--              plain-->
        <!--              icon="el-icon-download"-->
        <!--              size="mini"-->
        <!--              @click="handleExport"-->
        <!--              v-hasPermi="['basics:transfer:export']"-->
        <!--            >导出</el-button>-->
        <!--          </el-col>-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button-->
        <!--                type="info"-->
        <!--                plain-->
        <!--                icon="el-icon-upload2"-->
        <!--                size="mini"-->
        <!--                @click="handleImport"-->
        <!--                v-hasPermi="['basics:transfer:import']"-->
        <!--            >导入</el-button>-->
        <!--          </el-col>-->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table ref="multipleTable"
                v-loading="loading"
                :data="transferList"
                :height="tableHeight"
                :row-key="getRowKey"
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
        <el-table-column label="库位编码" align="center" prop="tranferLocationCode" show-overflow-tooltip/>
        <el-table-column label="所属库区" align="center" prop="areaCode" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.areaCode === 'CCQ03'">存储3区</span>
              <span v-if="scope.row.areaCode === 'CCQ02'">存储2区</span>
              <span v-if="scope.row.areaCode === 'CCQ01'">存储1区</span>
            </template>
        </el-table-column>
        <el-table-column label="朝向" align="center" prop="tranferLocationArrow" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.tranfer_location_arrow" :value="scope.row.tranferLocationArrow"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              v-hasPermi="['basics:transferLocation:view']"
            >详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:transferLocation:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:transferLocation:remove']"
            >删除
            </el-button>
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
    <!-- 添加或修改传输带库位信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="24">
          <el-form-item label="库位编码" prop="tranferLocationCode">
            <el-input v-model="form.tranferLocationCode" placeholder="请输入库位编码" show-word-limit maxlength="20"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属库区" prop="areaCode">
            <el-select style="width: 100%;" v-model="form.areaCode" filterable placeholder="请选择所属库区">
              <el-option v-for="dict in areaList" :key="dict.areaCode" :label="dict.areaName"
                         :value="dict.areaCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="朝向" prop="tranferLocationArrow">
            <el-select style="width: 100%;" v-model="form.tranferLocationArrow" filterable placeholder="请选择朝向">
              <el-option
                v-for="dict in dict.type.tranfer_location_arrow"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 传输带库位信息-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="主键">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="库位编码">{{ viewForm.tranferLocationCode }}</el-descriptions-item>
        <el-descriptions-item label="所属库区">
          <span v-if="viewForm.areaCode === 'CCQ03'">存储3区</span>
          <span v-if="viewForm.areaCode === 'CCQ02'">存储2区</span>
          <span v-if="viewForm.areaCode === 'CCQ01'">存储1区</span>
        </el-descriptions-item>
        <el-descriptions-item label="朝向">
          <dict-tag :options="dict.type.tranfer_location_arrow" :value="viewForm.tranferLocationArrow"/>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 传输带库位信息-导入对话框 -->
    <!--    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>-->
    <!--      <el-upload-->
    <!--          ref="upload"-->
    <!--          :limit="1"-->
    <!--          accept=".xlsx,.xls"-->
    <!--          :headers="upload.headers"-->
    <!--          :action="upload.url + '?updateSupport=' + upload.updateSupport"-->
    <!--          :disabled="upload.isUploading"-->
    <!--          :on-progress="handleFileUploadProgress"-->
    <!--          :on-success="handleFileSuccess"-->
    <!--          :auto-upload="false"-->
    <!--          :on-change="uploadFile"-->
    <!--          drag-->
    <!--      >-->
    <!--        <i class="el-icon-upload"></i>-->
    <!--        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
    <!--        <div class="el-upload__tip text-center" slot="tip">-->
    <!--          <div class="el-upload__tip" slot="tip">-->
    <!--            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的数据-->
    <!--          </div>-->
    <!--          <span>仅允许导入xls、xlsx格式文件。</span>-->
    <!--          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>-->
    <!--        </div>-->
    <!--      </el-upload>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="submitFileForm">确 定</el-button>-->
    <!--        <el-button @click="upload.open = false">取 消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import {
  listTransfer,
  getTransfer,
  delTransfer,
  addTransfer,
  updateTransfer,
  getAreaCcq
} from '@/api/wms/basics/transfer'
import { getToken } from '@/utils/auth'

export default {
  name: 'Transfer',
  dicts: ['tranfer_location_arrow'],
  data() {
    return {
      // 遮罩层
      loading: true,
      //复选框标题文字内容
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
      // 传输带库位信息表格数据
      transferList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tranferLocationCode: null,
        areaCode: null,
        tranferLocationArrow: null
      },
      fileData: [],//选择的文件
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/basics/transfer/importData'
      },
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 库区选择
      areaList: [],
      // 表单校验
      rules: {
        tranferLocationCode: [
          { required: true, message: '传输带库位编码不能为空', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '传输带所属库区不能为空', trigger: 'blur' }
        ],
        tranferLocationArrow: [
          { required: true, message: '传输带朝向(1.左侧  2.右侧)不能为空', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '记录状态(0:未删除  1:已删除)不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.initData()
    this.setTableGeight()
    window.addEventListener('resize', this.setTableGeight)
  },
  methods: {
    //页面初始化
    initData() {
      getAreaCcq().then(response => {
        this.areaList = response.data
      })
    },
    /** 查询传输带库位信息列表 */
    getList() {
      this.loading = true
      listTransfer(this.queryParams).then(response => {
        this.transferList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    //表格动态高度
    setTableGeight() {
      this.$nextTick(() => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240)

      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        tranferLocationCode: null,
        areaCode: null,
        tranferLocationArrow: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    getRowKey(row) {
      return row.id
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //清空表格选中的复选框项
    onClearSelected(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加传输带库位信息'
    },
    /** 详情按钮操作 */
    handleView(row) {
      const id = row.id
      getTransfer(id).then(response => {
        this.viewForm = response.data
        this.viewModalOpen = true
        this.title = '传输带库位信息-详情'
      })
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        default:
          break
      }
    },
    /** 示例：重置密码按钮操作 */
    handleResetPwd(row) {
      //todo 按需求修改
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getTransfer(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改传输带库位信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTransfer(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addTransfer(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除该记录？').then(function() {
        return delTransfer(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/transfer/export', {
        ...this.queryParams
      }, `transfer_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '模板数据导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('basics/transfer/importTemplate', {}, `传输带库位信息导入模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    //选择文件
    uploadFile(file, fileList) {
      this.fileData = fileList
    },
    // 提交上传文件
    submitFileForm() {
      if (this.fileData.length < 1) {
        this.$modal.msgWarning('必须要上传文件，请检查！')
        return
      }
      this.$refs.upload.submit()
    }
  }
}
</script>
<style scoped>
.el-form >>> .el-input-number__decrease {
  display: none;
}

.el-form >>> .el-input-number__increase {
  display: none;
}

.el-input-number >>> .el-input__inner {
  padding-left: 15px !important;
  padding-right: 15px;
  text-align: left;
}

.el-table >>> .el-table__fixed::before, .el-table >>> .el-table__fixed-right::before {
  display: none;
}

::v-deep .el-alert--warning.is-light {
  margin-top: 10px;
}

::v-deep .el-alert__content {
  display: flex;
  align-items: center;
}

::v-deep .el-alert .el-alert__description {
  margin: 0;
}

.clear-button {
  color: #1890ff;
  margin-left: 10px;
  cursor: pointer;
}
</style>
