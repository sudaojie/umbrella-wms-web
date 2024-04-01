<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="125px" style="padding-left: 1px;">
          <el-form-item label="新风设备" prop="freshAirDeviceNo">
            <el-select v-model="queryParams.freshAirDeviceNo" filterable placeholder="请选择新风设备" clearable value="" @change="handleQuery">
              <el-option
                v-for="item in deviceInfoList"
                :key="item.deviceNo"
                :label="item.deviceName"
                :value="item.deviceNo"
              />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="温湿度传感器设备" prop="thtbDeviceNo">-->
            <!--<el-select v-model="queryParams.thtbDeviceNo" filterable placeholder="请选择温湿度传感器设备" clearable value="" @change="handleQuery">-->
              <!--<el-option-->
                <!--v-for="item in wsDeviceInfoList"-->
                <!--:key="item.id"-->
                <!--:label="item.deviceName"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
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
              v-hasPermi="['wcs:freshAirThtbDetailRealtion:add']"
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
              v-hasPermi="['wcs:freshAirThtbDetailRealtion:remove']"
            >删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="realtionList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="新风设备名称" align="center" prop="initDeviceName" show-overflow-tooltip/>
          <el-table-column label="温湿度传感器设备数量" align="center" prop="num" show-overflow-tooltip/>
          <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['wcs:freshAirThtbRealtion:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['wcs:freshAirThtbRealtion:remove']"
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
    <!-- 添加或修改WCS新风温湿度传感器关联关系对话框 -->
    <el-drawer :title="title" :visible.sync="open" append-to-body size="35%">
      <el-form ref="form" :model="form" :rules="rules" label-width="190px" class="deviceForm">
        <el-col :span="24">
            <el-form-item label="新风设备" prop="freshAirDeviceNo">
              <el-select v-model="form.freshAirDeviceNo" filterable placeholder="请选择新风设备" clearable value="">
                <el-option
                  v-for="item in deviceInfoList"
                  :key="item.id"
                  :label="item.deviceName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark"
                          type="textarea"
                          :autosize="{minRows:3}"
                          placeholder="请输入内容" />
            </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>

    <!-- WCS新风温湿度传感器关联关系-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="新风设备编号">{{ viewForm.freshAirDeviceNo }}</el-descriptions-item>
          <el-descriptions-item label="温湿度传感器设备编号">{{ viewForm.thtbDeviceNo }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ viewForm.createBy }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { listRealtion, listTypeDeviceInfos, getRealtion, delRealtion, addRealtion, updateRealtion } from "@/api/wcs/freshAirThtbRealtion";
import { getToken } from "@/utils/auth";
export default {
  name: "wcsFreshAirThtbRealtion",
  data() {
    return {
      addDeviceInfoList: [],
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
      // WCS新风温湿度传感器关联关系表格数据
      realtionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        freshAirDeviceNo: null,
        thtbDeviceNo: null,
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
        url: process.env.VUE_APP_BASE_API + "/wcs/freshAirThtbRealtion/importData"
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight:0,
      // 表单校验
      rules: {
        freshAirDeviceNo: [
            { required: true, message: "新风设备编号不能为空", trigger: "blur" }
        ],
        thtbDeviceNo: [
            { required: true, message: "温湿度传感器设备编号不能为空", trigger: "blur" }
        ],
      },
      deviceInfoList: [],
      wsDeviceInfoList: [],
      deviceType: '7',
      wsDeviceType: '3',
      checkedInbillDetail: [],
      checkedDetail: [],
      //选择货物弹窗参数
      selectGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 50,
          goodsCode: null,
        },
        goodsInfoList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        goodsList: [],//选中的货物数据
      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
    this.getSelectList()
    this.getSelectWSList()
  },
  methods: {
    /** 复选框选中数据 */
    handleInbillDetailSelectionChange(selection) {
      this.checkedInbillDetail = selection.map(item => item.index)
      this.checkedDetail = selection.map(item => item)
    },
    getRow(row){
      return row.id;
    },
    /** 设备详情信息序号 */
    deviceDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 查询WCS新风温湿度传感器关联关系列表 */
    getList() {
      this.loading = true;
      listRealtion(this.queryParams).then(response => {
        this.realtionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询设备信息下拉列表 */
    getSelectList() {
      listTypeDeviceInfos(this.deviceType).then(response => {
        this.deviceInfoList = response.data;
      });
    },
    /** 查询温湿传感器信息下拉列表 */
    getSelectWSList() {
      listTypeDeviceInfos(this.wsDeviceType).then(response => {
        this.wsDeviceInfoList = response.data;
      });
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight;
        this.tableHeight = (height - 240 );
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
        freshAirDeviceNo: null,
        thtbDeviceNo: null,
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
      this.ids = selection.map(item => item.freshAirDeviceNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$tab.openPage("新增新风-温湿度传感器关系", "/wcs/wcsFreshAirThtbRealtion/detail");
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
        getRealtion(id).then(response => {
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "WCS新风温湿度传感器关联关系-详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      this.$tab.openPage("修改新风-温湿度传感器关系", "/wcs/wcsFreshAirThtbRealtion/detail",{id:row.freshAirDeviceNo});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRealtion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRealtion(this.form).then(response => {
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
      const ids = row.freshAirDeviceNo || this.ids;
      this.$modal.confirm('是否确认删除该记录？').then(function() {
        return delRealtion(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wcs/freshAirThtbRealtion/export', {
        ...this.queryParams
      }, `WCS新风温湿度传感器关联关系_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "模板数据导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('wcs/freshAirThtbRealtion/importTemplate', {
      }, `WCS新风温湿度传感器关联关系导入模板.xlsx`)
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
  .deviceForm {
    padding: 20px;
  }
  .deviceForm >>>.el-form-item__content{
    width: 50%;
  }
</style>
