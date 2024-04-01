<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="下架单号" prop="offshelfCode">
            <el-input
              v-model="queryParams.offshelfCode"
              placeholder="请输入下架单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="货物唯一码" prop="onlyCode">
            <el-input
              v-model="queryParams.onlyCode"
              placeholder="请输入货物唯一码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="机件号" prop="mpCode">
            <el-input
              v-model="queryParams.mpCode"
              placeholder="请输入机件号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="货物编码" prop="goodsCode">
            <el-input
              v-model="queryParams.goodsCode"
              placeholder="请输入货物编码"
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
          <el-form-item label="规格型号" prop="model">
            <el-input
              v-model="queryParams.model"
              placeholder="请输入规格型号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计量单位" prop="measureUnit">
            <el-input
              v-model="queryParams.measureUnit"
              placeholder="请输入计量单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="批次" prop="charg">
            <el-input
              v-model="queryParams.charg"
              placeholder="请输入批次"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="库位编号" prop="locationCode">
            <el-input
              v-model="queryParams.locationCode"
              placeholder="请输入库位编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="库位名称" prop="locationName">
            <el-input
              v-model="queryParams.locationName"
              placeholder="请输入库位名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="托盘编号" prop="trayCode">
            <el-input
              v-model="queryParams.trayCode"
              placeholder="请输入托盘编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="下架时间">
            <el-date-picker
              v-model="daterangeOffshelfTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="制单人" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder="请输入制单人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="制单时间">
            <el-date-picker
              v-model="daterangeCreateTime"
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
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="nolistList" :height="tableHeight" >
          <el-table-column label="下架单号" align="center" prop="offshelfCode" show-overflow-tooltip>
            <template slot-scope="scope">
              <a @click="showDetailView(scope.row)" style="color: blue;">{{ scope.row.offshelfCode }}</a>
            </template> 
          </el-table-column>
          <el-table-column label="下架时间" align="center" prop="offshelfTime" width="180">
          </el-table-column>
          <el-table-column label="制单人" align="center" prop="createBy" show-overflow-tooltip/>
          <el-table-column label="制单时间" align="center" prop="createTime" width="180">
          </el-table-column>
        </el-table>

        <pagination
          
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>

    <!-- 无单下架-详情对话框 -->
    <el-dialog title="无单下架明细" :visible.sync="showDetail.open" append-to-body>
      <el-form :model="showDetail.queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="库位编号" prop="locationCode">
          <el-input
            v-model="showDetail.queryParams.locationCode"
            placeholder="请输入库位编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="托盘编号" prop="trayCode">
          <el-input
            v-model="showDetail.queryParams.trayCode"
            placeholder="请输入托盘编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="机件号" prop="mpCode">
          <el-input
            v-model="showDetail.queryParams.mpCode"
            placeholder="请输入机件号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物编码" prop="goodsCode">
          <el-input
            v-model="showDetail.queryParams.goodsCode"
            placeholder="请输入货物编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDetailQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetDetailQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="showDetail.dataList" height="34vh">
        <el-table-column label="库位编号" align="center" prop="locationCode" show-overflow-tooltip/>
        <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
          <!-- <el-table-column label="货物唯一码" align="center" prop="onlyCode" show-overflow-tooltip/> -->
          <el-table-column label="机件号" align="center" prop="mpCode" show-overflow-tooltip/>
          <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="计量单位" align="center" prop="measureUnit" show-overflow-tooltip>
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template> 
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip/>
          <!-- <el-table-column label="批次" align="center" prop="charg" show-overflow-tooltip/>
          <el-table-column label="库位名称" align="center" prop="locationName" show-overflow-tooltip/> -->
        </el-table>

        <pagination
          v-show="showDetail.total>0"
          :total="showDetail.total"
          :page.sync="showDetail.queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getDetailList"
        />
    </el-dialog>
    
  </div>
</template>

<script>
import { listOffshelfnolist, getOffshelfnolist, delOffshelfnolist, addOffshelfnolist, updateOffshelfnolist,listDetail } from "@/api/wms/nolist/offshelfnolist";
import { getToken } from "@/utils/auth";
export default {
  name: "Offshelfnolist",
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
      // 无单下架表格数据
      nolistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 下架时间范围
      daterangeOffshelfTime: [],
      // 制单时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        offshelfCode: null,
        onlyCode: null,
        mpCode: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        charg: null,
        locationCode: null,
        locationName: null,
        trayCode: null,
        offshelfTime: null,
        createBy: null,
        createTime: null,
      },
      showDetail:{
        open:false,
        total:0,
        queryParams: {
            pageNum: 1,
            pageSize: 10,
        },
        dataList:[]
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
    /** 查询无单下架列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeOffshelfTime && '' != this.daterangeOffshelfTime) {
        this.queryParams.params["beginOffshelfTime"] = this.daterangeOffshelfTime[0];
        this.queryParams.params["endOffshelfTime"] = this.daterangeOffshelfTime[1];
      }
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listOffshelfnolist(this.queryParams).then(response => {
        this.nolistList = response.rows;
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
        offshelfCode: null,
        onlyCode: null,
        mpCode: null,
        goodsCode: null,
        goodsName: null,
        model: null,
        measureUnit: null,
        charg: null,
        locationCode: null,
        locationName: null,
        trayCode: null,
        offshelfTime: null,
        offshelfStatus: null,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeOffshelfTime = [];
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 详情按钮操作 */
    showDetailView(data){
      this.showDetail.open = true
      this.showDetail.queryParams.offshelfCode = data.offshelfCode
      this.getDetailList();
    },
    /** 搜索按钮操作 */
    handleDetailQuery() {
      this.queryParams.pageNum = 1;
      this.showDetail.dataList=[]
      this.getDetailList();
    },
    /** 重置按钮操作 */
    resetDetailQuery() {
      let code = this.showDetail.queryParams.offshelfCode
      this.showDetail.queryParams={
        pageSize:10,offshelfCode:code
      }
      this.handleDetailQuery();
    },
    /** 获取详情数据 */
    getDetailList(){
      listDetail(this.showDetail.queryParams).then(res => {
        this.showDetail.dataList = res.rows
        this.showDetail.total = res.total
      })
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
