<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="上架单号" prop="listingCode">
            <el-input
              v-model="queryParams.listingCode"
              placeholder="请输入上架单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="上架时间">
            <el-date-picker
              v-model="daterangeListingTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
          <el-table-column label="上架单号" align="center" prop="listingCode" show-overflow-tooltip>
            <template slot-scope="scope" >
              <a  @click="showDetailView(scope.row)" style="color:blue;" >{{ scope.row.listingCode }}</a>
            </template>
          </el-table-column>
          <el-table-column label="上架时间" align="center" prop="listingTime">
          </el-table-column>
          <el-table-column label="制单人" align="center" prop="createBy" show-overflow-tooltip/>
          <el-table-column label="制单时间" align="center" prop="createTime">
          </el-table-column>
          
        </el-table>

        <pagination
          
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>
    <!-- 无单上架-详情数据列表 -->
    <el-dialog title="无单上架明细" :visible.sync="showDetail.open" append-to-body>
      <el-form :model="showDetail.queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="上架库位" prop="locationCode">
            <el-input
              v-model="showDetail.queryParams.locationCode"
              placeholder="请输入上架库位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              v-model="showDetail.queryParams.goodsName"
              placeholder="请输入货物名称"
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
          
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDetailQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDetailQuery">重置</el-button>
          </el-form-item>
      </el-form>
      <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <el-table v-loading="loading" :data="showDetail.dataList" height="32vh">
          <el-table-column label="库位编号" align="center" prop="locationCode" show-overflow-tooltip/>
          <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
          <el-table-column label="机件号" align="center" prop="mpCode" show-overflow-tooltip/>
          <!-- <el-table-column label="货物唯一码" align="center" prop="onlyCode" show-overflow-tooltip/> -->
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
          :limit.sync="showDetail.queryParams.pageSize"
          @pagination="getDetailList"
        />
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { listListingnolist, getDetailList } from "@/api/wms/nolist/listingnolist";
import { getToken } from "@/utils/auth";
export default {
  name: "Nolist",
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
      // 无单上架表格数据
      nolistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 上架时间范围
      daterangeListingTime: [],
      // 制单时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        listingCode: null,
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
        listingTime: null,
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
    };
  },
  created() {
    this.getList();
    this.setTableGeight();
    window.addEventListener('resize',this.setTableGeight);
  },
  methods: {
    /** 查询无单上架列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeListingTime && '' != this.daterangeListingTime) {
        this.queryParams.params["beginListingTime"] = this.daterangeListingTime[0];
        this.queryParams.params["endListingTime"] = this.daterangeListingTime[1];
      }
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listListingnolist(this.queryParams).then(response => {
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
        listingCode: null,
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
        listingTime: null,
        listingStatus: null,
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
      this.daterangeListingTime = [];
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 获取详情数据 */
    getDetailList(){
      getDetailList(this.showDetail.queryParams).then(res => {
        this.showDetail.dataList = res.rows
        this.showDetail.total = res.total
      })
    },
    
    /** 详情按钮操作 */
    showDetailView(data){
      this.showDetail.open=true;
      this.showDetail.queryParams.listingCode = data.listingCode
      this.getDetailList();
    },
    /** 搜索按钮操作 */
    handleDetailQuery() {
      this.showDetail.queryParams.pageNum = 1;
      this.getDetailList();
    },
    /** 重置按钮操作 */
    resetDetailQuery() {
      let listingCode = this.showDetail.queryParams.listingCode
      this.showDetail.queryParams = {
        pageSize:10,
        listingCode:listingCode
      }
      this.showDetail.dataList = [];
      this.handleDetailQuery();
    },   
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
