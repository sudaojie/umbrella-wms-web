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
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="queryParams.configName" placeholder="请输入参数名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="queryParams.configKey" placeholder="请输入参数键名" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="queryParams.configValue" placeholder="请输入参数键值" clearable @keyup.enter.native="handleQuery" />
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['warning:config:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['warning:config:remove']">删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="configList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="参数名称" align="center" prop="configName" show-overflow-tooltip />
        <el-table-column label="参数键名" align="center" prop="configKey" show-overflow-tooltip />
        <el-table-column label="参数键值" align="center" prop="configValue" show-overflow-tooltip />
        <el-table-column fixed="right" label="启用状态" align="center" prop="configType">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.configType" active-value="0" inactive-value="1"
              @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['warning:config:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['warning:config:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- 添加或修改库存预警策略对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="配置名称" prop="configName">
          <el-select :disabled="form.id ? true : false" v-model="form.configName" style="width: 100%;" filterable
            placeholder="请选择参数名称" @change="getConfigName" clearable>
            <el-option v-for=" dict in dict.type.wms_warehouse_warning" :key="dict.value" :label="dict.label"
              :value="dict.label" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="参数键名" prop="configKey">
          <el-input :disabled="form.id ? true : false" v-model="form.configKey" placeholder="请输入参数键值" />
        </el-form-item> -->
        <el-form-item label="阈值(天)" prop="configValue" style="width: auto;">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from "@/api/wms/stock/config";
import { getToken } from "@/utils/auth";
export default {
  name: "Config",
  dicts: ['wms_warehouse_warning'],
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
      // 库存预警策略表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configName: null,
        configKey: null,
        configValue: null,
        configType: null,
        createDy: null,
      },
      fileData: [],//选择的文件
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
        url: process.env.VUE_APP_BASE_API + "/system/config/importData"
      },
      viewForm: {},
      // 表单参数
      form: {},
      //表格高度
      tableHeight: 0,
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize', this.setTableGeight);
  },
  methods: {
    /** 查询库存预警策略列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ID: null,
        configName: null,
        configKey: null,
        configValue: null,
        configType: null,
        createDy: null,
        createTime: null,
        updateBy: null,
        delFlag: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 获取字段属性值 */
    getConfigName(data) {
      console.log(data);
      this.dict.type.wms_warehouse_warning.forEach((item) => {
        if (item.label === data) {
          this.form.configKey = item.value;
        }
      })
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加库存预警策略";
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
      getConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存预警策略";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除该记录？').then(function () {
        return delConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.configType === "0" ? "启用" : "禁用";
      this.$modal.confirm('确认要' + text + '预警策略吗？').then(function () {
        return updateConfig({ id: row.id, configType: row.configType });
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.configType = row.configType === "0" ? "1" : "0";
      });
    },
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

.el-table>>>.el-table__fixed::before,
.el-table>>>.el-table__fixed-right::before {
  display: none;
}
</style>
