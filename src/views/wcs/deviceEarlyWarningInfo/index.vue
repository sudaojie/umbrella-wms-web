<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="设备编号" prop="deviceInfoId">
            <el-input
              v-model="queryParams.deviceInfoId"
              placeholder="请输入设备编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="infoList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备编号" align="center" prop="deviceInfoId" show-overflow-tooltip/>
        <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip/>
        <el-table-column label="设备类型" align="center" prop="deviceType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.device_type" :value="scope.row.deviceType"/>
          </template>
        </el-table-column>
        <el-table-column label="预警内容" align="center" prop="warningContent" show-overflow-tooltip/>
        <el-table-column label="预警时间" align="center" prop="warningTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.warningTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
            >详情</el-button>
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

    <!-- 设备预警信息-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备编号">{{ viewForm.deviceInfoId }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ viewForm.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">
              <dict-tag :options="dict.type.device_type" :value="viewForm.deviceType"/>
          </el-descriptions-item>
          <el-descriptions-item label="预警时间">{{ viewForm.warningTime }}</el-descriptions-item>
          <el-descriptions-item label="预警内容">
            <el-tooltip class="item" effect="dark" :content="viewForm.warningContent" placement="bottom">
              <span style="cursor: pointer">{{ viewForm.warningContent }}</span>
            </el-tooltip>
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>

  </div>
</template>

<script>
import { listInfo, getInfo } from "@/api/wcs/deviceEarlyWarningInfo";
import { getToken } from "@/utils/auth";
export default {
  name: "Info",
  dicts: ['device_type'],
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
      // 设备预警信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceInfoId: '',
        deviceName: '',
        deviceType: ''
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
        url: process.env.VUE_APP_BASE_API + "/wcs/deviceEarlyWarningInfo/importData"
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight:0,
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    /** 查询设备预警信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
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
        deviceInfoId: null,
        warningContent: null,
        warningTime: null
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
      this.ids = selection.map(item => item.deviceInfoId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 详情按钮操作 */
    handleView(row){
      const deviceInfoId = row.id;
        getInfo(deviceInfoId).then(response => {
          console.log(response)
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "设备预警信息-详情";
      });
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
