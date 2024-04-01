<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="任务号" prop="taskNo">
            <el-input
              v-model="queryParams.taskNo"
              placeholder="请输入任务号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="单据号" prop="inBillNo">
            <el-input
              v-model="queryParams.inBillNo"
              placeholder="单据号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="托盘号" prop="trayNo">
            <el-input
              v-model="queryParams.trayNo"
              placeholder="托盘号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="任务设备类型" label-width="auto" prop="taskDeviceType">
            <el-select v-model="queryParams.taskDeviceType" filterable placeholder="请选择任务设备类型" clearable>
              <el-option v-for="dict in dict.type.wcs_task_device_type" :key="dict.value" :label="dict.label"
                         :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型" label-width="auto" prop="taskType">
            <el-select v-model="queryParams.taskType" filterable placeholder="请选择任务类型" clearable>
              <el-option v-for="dict in dict.type.wcs_task_type" :key="dict.value" :label="dict.label"
                         :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型" label-width="auto" prop="operateType">
            <el-select v-model="queryParams.operateType" filterable placeholder="请选择操作类型" clearable>
              <el-option v-for="dict in dict.type.wcs_task_operate_type" :key="dict.value" :label="dict.label"
                         :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态" label-width="auto" prop="taskStatus">
            <el-select v-model="queryParams.taskStatus" filterable placeholder="请选择任务状态" clearable>
              <el-option v-for="dict in dict.type.wcs_task_status" :key="dict.value" :label="dict.label"
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
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
      </el-row>
        <el-table v-loading="loading" :data="taskList" :height="tableHeight" @selection-change="handleSelectionChange">
<!--          <el-table-column type="selection" width="55" align="center" />-->
          <el-table-column label="任务号" align="center" prop="taskNo" show-overflow-tooltip/>
          <el-table-column label="单据号" align="center" prop="inBillNo" show-overflow-tooltip/>
          <el-table-column label="任务设备类型" width="100" align="center" prop="taskDeviceType" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wcs_task_device_type" :value="scope.row.taskDeviceType" />
            </template>
          </el-table-column>
          <el-table-column label="任务类型" align="center" prop="taskType" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wcs_task_type" :value="scope.row.taskType" />
            </template>
          </el-table-column>
          <el-table-column label="操作类型" align="center" prop="operateType" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wcs_task_operate_type" :value="scope.row.operateType" />
            </template>
          </el-table-column>
          <el-table-column label="起始库区" align="center" prop="startAreaCode" show-overflow-tooltip/>
          <el-table-column label="目标库区" align="center" prop="endAreaCode" show-overflow-tooltip/>
          <el-table-column label="起始位置" align="center" prop="startPosition" show-overflow-tooltip/>
          <el-table-column label="目标位置" align="center" prop="endPosition" show-overflow-tooltip/>
          <el-table-column label="托盘号" align="center" prop="trayNo" show-overflow-tooltip/>
          <el-table-column label="执行开始时间" align="center" prop="operateBeginTime" width="180"/>
          <el-table-column label="执行结束时间" align="center" prop="operateEndTime" width="180"/>
          <el-table-column label="任务状态" fixed="right" align="center" prop="taskStatus" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wcs_task_status" :value="scope.row.taskStatus" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.taskDeviceType == '2' && (scope.row.taskStatus == '3' || scope.row.taskStatus == '1')"
                size="mini"
                type="text"
                icon="el-icon-refresh-right"
                @click="forceComplete(scope.row)"
              >强制完成</el-button>
              <el-button
                v-if="scope.row.taskDeviceType == '2' && (scope.row.taskStatus == '1')"
                size="mini"
                type="text"
                icon="el-icon-refresh-right"
                @click="handleCancel(scope.row)"
              >手动取消</el-button>
              <el-button
                v-if="scope.row.taskStatus == '0'"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >WCS任务取消</el-button>
              <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-view"
                        @click="handleView(scope.row)"
                        v-hasPermi="['wcs:operateTask:view']"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>

    <!-- WCS任务信息-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务号">{{ viewForm.taskNo }}</el-descriptions-item>
          <el-descriptions-item label="单据号">{{ viewForm.inBillNo }}</el-descriptions-item>
          <el-descriptions-item label="任务设备类型">
            <dict-tag :options="dict.type.wcs_task_device_type" :value="viewForm.taskDeviceType" />
          </el-descriptions-item>
          <el-descriptions-item label="任务类型">
            <dict-tag :options="dict.type.wcs_task_type" :value="viewForm.taskType" />
          </el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <dict-tag :options="dict.type.wcs_task_operate_type" :value="viewForm.operateType" />
          </el-descriptions-item>
          <el-descriptions-item label="起始库区">{{ viewForm.startAreaCode }}</el-descriptions-item>
          <el-descriptions-item label="目标库区">{{ viewForm.endAreaCode }}</el-descriptions-item>
          <el-descriptions-item label="起始位置">{{ viewForm.startPosition }}</el-descriptions-item>
          <el-descriptions-item label="目标位置">{{ viewForm.endPosition }}</el-descriptions-item>
          <el-descriptions-item label="托盘号">{{ viewForm.trayNo }}</el-descriptions-item>
          <el-descriptions-item label="执行开始时间">{{ viewForm.operateBeginTime }}</el-descriptions-item>
          <el-descriptions-item label="执行结束时间">{{ viewForm.operateEndTime }}</el-descriptions-item>
          <el-descriptions-item span="2" label="任务状态">
            <dict-tag :options="dict.type.wcs_task_status" :value="viewForm.taskStatus" />
          </el-descriptions-item>
          <el-descriptions-item span="2" label="任务请求json">{{ viewForm.taskReqJson }}</el-descriptions-item>
          <el-descriptions-item span="2" label="任务响应json">{{ viewForm.taskRspJson }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { listTask, getTask, delTask, addTask, updateTask,forceCompleteStacker,handleCancelStacker } from "@/api/wcs/mgr/operaTask";
import { getToken } from "@/utils/auth";
export default {
  name: "wcsOperaTask",
  dicts:["wcs_task_device_type","wcs_task_type","wcs_task_status","wcs_task_operate_type"],
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
      // WCS任务信息表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskNo: null,
        taskDeviceType: null,
        taskType: null,
        startPosition: null,
        endPosition: null,
        trayNo: null,
        goodsPartsCode: null,
        goodsOnlyCode: null,
        operateBeginTime: null,
        operateEndTime: null,
        taskReqJson: null,
        taskRspJson: null,
        taskStatus: null,
        inBillNo: null
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight:0,
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    /** 查询WCS任务信息列表 */
    getList() {
      this.loading = true;
      listTask(this.queryParams).then(response => {
        this.taskList = response.rows;
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
        taskNo: null,
        taskDevice: null,
        taskType: null,
        startPosition: null,
        endPosition: null,
        trayNo: null,
        goodsPartsCode: null,
        goodsOnlyCode: null,
        operateBeginTime: null,
        operateEndTime: null,
        taskReqJson: null,
        taskRspJson: null,
        taskStatus: null,
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
      this.title = "添加WCS任务信息";
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
        getTask(id).then(response => {
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "WCS任务信息-详情";
      });
    },
    handleCancel(row){
      const ids = row.id || this.ids;
      this.$modal.confirm('确认手动取消该任务吗？').then(function() {
        return handleCancelStacker(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("手动取消成功");
      }).catch(() => {});
    },
    //强制完成
    forceComplete(row){
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认强制完成吗？').then(function() {
        return forceCompleteStacker(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("强制完成成功");
      }).catch(() => {});

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
      getTask(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改WCS任务信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTask(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTask(this.form).then(response => {
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
        return delTask(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/wcs/operateTask/export', {
        ...this.queryParams
      }, `task_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "模板数据导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/wcs/operateTask/importTemplate', {
      }, `WCS任务信息导入模板.xlsx`)
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
</style>
