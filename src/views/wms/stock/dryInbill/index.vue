<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px" style="padding-left: 10px;">
          <el-form-item label="晾晒入库单号" prop="dryInbillCode">
            <el-input
              v-model="queryParams.dryInbillCode"
              placeholder="请输入晾晒入库单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="晾晒入库状态" prop="dryInbillStatus">
            <el-select v-model="queryParams.dryInbillStatus" filterable placeholder="请选择晾晒入库状态" clearable>
              <el-option
                v-for="dict in dict.type.dry_inbill_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="daterangeDryInbillTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
              v-hasPermi="['stock:dryInbill:add']"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="dryInbillList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="晾晒入库单号" align="center" prop="dryInbillCode" show-overflow-tooltip>
            <template slot-scope="scope">
              <a v-if="scope.row.dryInbillStatus!=0" style="color: blue;" @click="showDetail(scope.row)">{{ scope.row.dryInbillCode }}</a>
              <div v-if="scope.row.dryInbillStatus==0">{{ scope.row.dryInbillCode }}</div>
            </template>
          </el-table-column>
          <el-table-column label="晾晒入库状态" align="center" prop="dryInbillStatus">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.dry_inbill_status" :value="scope.row.dryInbillStatus"/>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" prop="createBy" show-overflow-tooltip/>
          <el-table-column label="入库时间" align="center" prop="dryInbillTime" width="180">
          </el-table-column>
          <el-table-column  label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
            <template  slot-scope="scope">
              <el-button v-if="scope.row.dryInbillStatus!=0"
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="showDetail(scope.row)"
                v-hasPermi="['stock:dryInbill:query']"
              >详情</el-button>
              <el-button v-if="scope.row.dryInbillStatus==0"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['stock:dryInbill:edit']"
              >修改</el-button>
              <el-button v-if="scope.row.dryInbillStatus==0"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['stock:dryInbill:remove']"
              >删除</el-button>
              <el-button v-if="scope.row.dryInbillStatus==0"
                size="mini"
                type="text"
                @click="startTask(scope.row)"
                v-hasPermi="['wms:move:edit']"
              ><svg-icon icon-class="play" />
              开始</el-button>
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
    <!-- 添加或修改晾晒入库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-col v-show="form.id" :span="12">
            <el-form-item label="晾晒入库单号" prop="dryInbillCode">
              <el-input readonly v-model="form.dryInbillCode" placeholder="请输入晾晒入库单号" show-word-limit maxlength="32"/>
            </el-form-item>
        </el-col>
        <el-col v-show="!form.id" :span="12">
          <el-form-item label="晾晒出库单号" prop="dryOutbillCode">
            <el-select style="width: 100%;" v-model="form.dryOutbillCode" filterable @change="setDetail" placeholder="请选择晾晒出库单号" clearable>
              <el-option
                v-for="dict in dryOutbillList"
                :key="dict.dryOutbillCode"
                :label="dict.dryOutbillCode"
                :value="dict.dryOutbillCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备 注" prop="remark">
              <el-input :readonly="form.dryInbillStatus!=null&&form.dryInbillStatus!=0" v-model="form.remark" type="textarea" :autosize="{maxRows:2,minRows:2}" placeholder="请输入备注" show-word-limit maxlength="200"/>
            </el-form-item>
        </el-col>
        <el-col :span="24" style="float:none;"><el-form-item/></el-col>
        <el-divider content-position="center">晾晒入库单货物信息</el-divider>
        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="resetQuerySelect();selectData.open=true;">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWmsDryInbillGoods">删除</el-button>
          </el-col>
        </el-row> -->
        <el-table :data="wmsDryInbillGoodsList" :row-class-name="rowWmsDryInbillGoodsIndex" height="32vh"  ref="wmsDryInbillGoods">
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="批次号" align="center" prop="charg" minWidth="150"/>
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="150"/>
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150"/>
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="150"/>
          <el-table-column label="托盘编号" align="center" prop="trayCode" minWidth="100"/>
        </el-table>
        <pagination
          v-show="detailGoods.total>0"
          :total="detailGoods.total"
          :page.sync="detailGoods.queryParams.pageNum"
          :limit.sync="detailGoods.queryParams.pageSize"
          @pagination="getDeatilList"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listDryInbill, getDryInbill, delDryInbill, addDryInbill, updateDryInbill,getDeatilList,deleteDetail,getSelectedList,startTask,getDryOutbillList } from "@/api/wms/stock/dryInbill";
import { getToken } from "@/utils/auth";
export default {
  name: "DryInbill",
  dicts: ['dry_inbill_status','wms_metering_unit'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsDryInbillGoods: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 晾晒入库单表格数据
      dryInbillList: [],
      // 晾晒出入库单货物表格数据
      wmsDryInbillGoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 时间范围
      daterangeDryInbillTime: [],
      // 时间范围
      daterangeDryOutbillTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dryInbillCode: null,
        dryInbillStatus: null,
        dryInbillTime: null,
      },
      //入库详情
      detailGoods:{
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dryInbillCode: null,
        },
        total:0
      },
      //获取可选择数据
      selectData:{
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dryOutbillCode: null,
        },
        open:false,
        total:0,
        dataList:[],
        selectedList:[]
      },
      //待创建晾晒入库单的出库单数据
      dryOutbillList:[],
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      //表格高度
      tableHeight:0,
      // 表单校验
      rules: {
        // dryInbillCode: [
        //     { required: true, message: "晾晒入库单号不能为空", trigger: "blur" }
        // ],

      }
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    /** 查询晾晒入库单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDryInbillTime && '' != this.daterangeDryInbillTime) {
        this.queryParams.params["beginDryInbillTime"] = this.daterangeDryInbillTime[0];
        this.queryParams.params["endDryInbillTime"] = this.daterangeDryInbillTime[1];
      }
      listDryInbill(this.queryParams).then(response => {
        this.dryInbillList = response.rows;
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
        dryInbillCode: null,
        dryInbillStatus: null,
        dryInbillTime: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.wmsDryInbillGoodsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeDryInbillTime = [];
      this.daterangeDryOutbillTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 多选框选中数据
    handleSelectionChangeData(selection) {
      this.selectData.selectedList = selection.map(item => item)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.detailGoods.total = 0;
      this.title = "添加晾晒入库单";
      this.getDryOutbillList()
    },
    //获取出库单数据
    getDryOutbillList(){
      getDryOutbillList().then(res=>{
        this.dryOutbillList = res.data;
      })
    },
    //详情数据加入
    setDetail(){
      this.dryOutbillList.forEach(element=>{
        if(this.form.dryOutbillCode==element.dryOutbillCode){
          element.wmsDryOutbillGoodsList.forEach(item=>{
            item.id = ''
          })
          this.wmsDryInbillGoodsList = element.wmsDryOutbillGoodsList
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      this.wmsDryInbillGoodsList = []
      getDryInbill(id).then(response => {
        this.form = response.data;
        this.detailGoods.queryParams.dryInbillCode = this.form.dryInbillCode
        this.getDeatilList();
        this.open = true;
        this.title = "修改晾晒入库单";
      });
    },
    /** 出库详情按钮操作 */
    showDetail(row) {
      this.reset();
      const id = row.id || this.ids
      this.wmsDryInbillGoodsList = []
      getDryInbill(id).then(response => {
        this.form = response.data;
        this.detailGoods.queryParams.dryInbillCode = this.form.dryInbillCode
        this.getDeatilList();
        this.open = true;
        this.title = "晾晒入库单详情";
      });
    },
    /** 查询详情数据 */
    getDeatilList(){
      getDeatilList(this.detailGoods.queryParams).then(res =>{
        this.wmsDryInbillGoodsList = res.rows
        this.detailGoods.total = res.total
      })
    },
    /** 查询已出库数据 */
    getSelectedList(){
      this.selectData.queryParams.dryOutbillStatus = 2
      this.selectData.queryParams.lockStatus = 0
      getSelectedList(this.selectData.queryParams).then(res=>{
        this.wmsDryInbillGoodsList = res.data
      })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.wmsDryInbillGoodsList.length==0){
            this.$modal.msgError("请先维护入库单货物信息");
            return ;
          }
          this.form.wmsDryInbillGoodsList = this.wmsDryInbillGoodsList;
          if (this.form.id != null) {
            updateDryInbill(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDryInbill(this.form).then(response => {
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
        return delDryInbill(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 晾晒出入库单货物序号 */
    rowWmsDryInbillGoodsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 晾晒出入库单货物添加按钮操作 */
    handleAddWmsDryInbillGoods() {
      if(this.selectData.selectedList.length==0){
        this.$modal.msgError("请选择数据");
      }
      this.selectData.selectedList.forEach(element=>{
        let isHav = false;
        this.wmsDryInbillGoodsList.forEach(item=>{
          if(element.partsCode==item.partsCode){
            isHav = true;
          }
        })
        if(!isHav){
          element.id=''
          this.wmsDryInbillGoodsList.push(element);
        }
        this.selectData.open=false
      })
    },
    /** 晾晒出入库单货物删除按钮操作 */
    handleDeleteWmsDryInbillGoods() {
      if (this.checkedWmsDryInbillGoods.length == 0) {
        this.$modal.msgError("请先选择要删除的晾晒出入库单货物数据");
      } else {
        const wmsDryInbillGoodsList = this.wmsDryInbillGoodsList;
        const checkedWmsDryInbillGoods = this.checkedWmsDryInbillGoods;
        this.wmsDryInbillGoodsList = wmsDryInbillGoodsList.filter(function(item) {
          return checkedWmsDryInbillGoods.indexOf(item.index) == -1
        });
        let ids = []
        this.selectedInbillGoods.forEach(element => {
          if(element.id){
            ids.push(element.id);
          }
        });
        if(ids.length>0){
          deleteDetail(ids).then(res=>{
            this.getDeatilList();
          })
        }
      }
    },
    /** 复选框选中数据 */
    handleWmsDryInbillGoodsSelectionChange(selection) {
      this.checkedWmsDryInbillGoods = selection.map(item => item.index)
      this.selectedInbillGoods = selection.map(item => item)
    },
    /** 开始执行任务 */
    startTask(data){
      let _this = this;
      this.$modal.confirm('是否确认开始晾晒入库任务？').then(function () {
        startTask(data).then(res=>{
          _this.$modal.msgSuccess("操作成功");
          _this.getList()
        })
      }).then(() => {

      }).catch(() => {

      });
    }
  }
};
</script>
<style scoped>
  .el-form>>>.el-form-item__content:last-child {
    position: unset;
  }
  .el-form>>>.el-form-item__error{
    position: unset;
  }
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
