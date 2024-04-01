<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="" prop="receiver" style="width: 25%;">
          <el-input
            v-model="queryParams.receiver"
            placeholder="收货人、手机号、所属单位模糊查询"
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
            v-hasPermi="['basics:address:add']"
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
            v-hasPermi="['basics:address:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['basics:address:export']"
          >全部导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="addressList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="所属单位" minWidth="150" align="center" prop="company" show-overflow-tooltip/>
        <el-table-column label="收货人" minWidth="150" align="center" prop="receiver" show-overflow-tooltip/>
        <el-table-column label="手机号" minWidth="150" align="center" prop="mobilePhone" />
        <el-table-column label="邮编" minWidth="150" align="center" prop="postalCode" />
        <el-table-column label="行政区划" minWidth="150"  align="center" prop="selected" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:address:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:address:remove']"
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

    <!-- 添加或修改地址基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属单位" prop="company">
          <el-input v-model="form.company" placeholder="请输入所属单位" show-word-limit maxlength="30"/>
        </el-form-item>
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="form.receiver" placeholder="请输入收货人" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobilePhone">
          <el-input v-model="form.mobilePhone" placeholder="请输入手机号" show-word-limit maxlength="11"/>
        </el-form-item>
        <el-form-item label="邮编" prop="postalCode">
          <el-input v-model="form.postalCode" placeholder="请输入邮编" show-word-limit maxlength="10"/>
        </el-form-item>
        <el-form-item label="行政区划" prop="selected">
          <!-- <el-input v-model="form.province" placeholder="请输入行政区划" show-word-limit maxlength="50"/> -->
          <el-cascader style="width: 100%;" v-model="form.selected" :options="options" clearable filterable />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" show-word-limit maxlength="50"/>
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
import { listAddress, getAddress, delAddress, addAddress, updateAddress,getCitiesData } from "@/api/wms/basics/address";
import { getToken } from "@/utils/auth";
export default {
  name: "Address",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      options : [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 地址基本信息表格数据
      addressList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiver: null,
        mobilePhone: null,
        postalCode: null,
        province: null,
        address: null,
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
        url: process.env.VUE_APP_BASE_API + "/basics/address/importData"
      },
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        receiver: [
            { required: true, message: "收货人不能为空", trigger: "blur" }
        ],
        company: [
            { required: true, message: "所属单位不能为空", trigger: "blur" }
        ],
        mobilePhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        postalCode: [
            { required: true, message: "邮编不能为空", trigger: "blur" },
            {
              pattern: /^[1-9]\d{5}$/,
              message: "请输入正确的邮编",
              trigger: "blur"
            }
        ],
        selected: [
            { required: true, message: "行政区划不能为空", trigger: "blur" }
        ],
        address: [
            { required: true, message: "地址不能为空", trigger: "blur" }
        ],
      },
      //表格高度
      tableHeight:0,
    };
  },
  created() {
    this.getList();
    this.initData();
    this.setTableGeight()
    window.addEventListener('resize',this.setTableGeight)
  },
  methods: {
    initData(){
      this.options=getCitiesData();
      try {
        this.options.forEach(item => {
          item.value = item.label
          item.children.forEach(item1 => {
            item1.value = item1.label
            item1.children.forEach(item2 => {
              item2.value = item2.label
            })
          })
        })
      } catch (error) {
      }
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );

      })
    },
    /** 查询地址基本信息列表 */
    getList() {
      this.loading = true;
      listAddress(this.queryParams).then(response => {
        response.rows.forEach(element => {
          element.selected = element.province.split('/')
        });
        this.addressList = response.rows;
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
        receiver: null,
        mobilePhone: null,
        postalCode: null,
        province: null,
        address: null,
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
      this.title = "添加地址基本信息";
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
        getAddress(id).then(response => {
          this.viewForm = response.data;
          this.viewModalOpen = true;
          this.title = "地址基本信息-详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAddress(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改地址基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAddress(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAddress(this.form).then(response => {
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
        return delAddress(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/address/export', {
        ...this.queryParams
      }, `address_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
<style scoped>
.el-form-item>>>.el-form-item__content:first-child {
    display: block;
}
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
 display: none;
}
</style>
