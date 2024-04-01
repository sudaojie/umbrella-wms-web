<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="车牌号" prop="vehicleNo">
          <el-input
            v-model="queryParams.vehicleNo"
            placeholder="请输入车牌号"
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
            v-hasPermi="['basics:vehicle:add']"
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
            v-hasPermi="['basics:vehicle:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['basics:vehicle:export']"
          >全部导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="vehicleList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="车牌号" align="center" prop="vehicleNo" show-overflow-tooltip/>
        <el-table-column label="车辆类型" align="center" prop="vehicleType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_vehicle_type" :value="scope.row.vehicleType"/>
          </template>
        </el-table-column>
        <el-table-column label="车辆载重(kg)" width="200" align="center" prop="vehicleLoad" />
        <el-table-column label="司机姓名" align="center" prop="driverName" show-overflow-tooltip/>
        <el-table-column label="司机电话" width="200" align="center" prop="driverPhone" />
        <el-table-column label="所属单位" align="center" width="300" prop="company" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:vehicle:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:vehicle:remove']"
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

    <!-- 添加或修改车辆基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="车牌号" prop="vehicleNo">
          <el-input v-model="form.vehicleNo" placeholder="请输入车牌号" show-word-limit maxlength="10"/>
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleType">
          <el-select style="width: 100%;" v-model="form.vehicleType" filterable placeholder="请选择车辆类型">
            <el-option
              v-for="dict in dict.type.wms_vehicle_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆载重(kg)" prop="vehicleLoad">
          <el-input-number style="width: 100%;" :min="0" :max="999999" v-model="form.vehicleLoad" placeholder="请输入车辆载重(kg)" show-word-limit maxlength="10"/>
        </el-form-item>
        <el-form-item label="司机姓名" prop="driverName">
          <el-input v-model="form.driverName" placeholder="请输入司机姓名" show-word-limit maxlength="10"/>
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone">
          <el-input v-model="form.driverPhone" placeholder="请输入司机电话" show-word-limit maxlength="11"/>
        </el-form-item>
        <el-form-item label="所属单位" prop="company">
          <el-input v-model="form.company" placeholder="请输入所属单位" show-word-limit maxlength="20"/>
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
import { listVehicle, getVehicle, delVehicle, addVehicle, updateVehicle,checkData } from "@/api/wms/basics/vehicle";
import { getToken } from "@/utils/auth";
export default {
  name: "Vehicle",
  dicts: ['wms_vehicle_type'],
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
      // 车辆基本信息表格数据
      vehicleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vehicleNo: null,
        vehicleType: null,
        vehicleLoad: null,
        driverName: null,
        driverPhone: null,
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
        url: process.env.VUE_APP_BASE_API + "/basics/vehicle/importData"
      },
      viewForm:{},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        vehicleNo: [
            { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        vehicleType: [
            { required: true, message: "车辆类型不能为空", trigger: "change" }
        ],
        vehicleLoad: [
            { required: true, message: "车辆载重(kg)不能为空", trigger: "blur" }
        ],
        driverName: [
            { required: true, message: "司机姓名不能为空", trigger: "blur" }
        ],
        driverPhone: [
            { required: true, message: "司机电话不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
        ],
        // company: [
        //     { required: true, message: "所属单位不能为空", trigger: "blur" }
        // ],
        createTime: [
            { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      },
      //表格高度
      tableHeight:0,
    };
  },
  created() {
    this.getList();
    this.setTableGeight()
    window.addEventListener('resize',this.setTableGeight)
  },
  methods: {
    /** 查询车辆基本信息列表 */
    getList() {
      this.loading = true;
      listVehicle(this.queryParams).then(response => {
        this.vehicleList = response.rows;
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
        vehicleNo: null,
        vehicleType: null,
        vehicleLoad: null,
        driverName: null,
        driverPhone: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.title = "添加车辆基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVehicle(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          checkData(this.form).then(res => {
            if(res.code==200){
              if (this.form.id != null) {
                updateVehicle(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                addVehicle(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
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
        return delVehicle(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/vehicle/export', {
        ...this.queryParams
      }, `vehicle_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
<style scoped>
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
 display: none;
}
</style>