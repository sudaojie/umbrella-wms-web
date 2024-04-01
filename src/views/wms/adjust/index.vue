<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="盘点单号" prop="checkBillCode">
            <el-input
              v-model="queryParams.checkBillCode"
              placeholder="请输入盘点单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="调整状态" prop="adjustStatus">
            <el-select v-model="queryParams.adjustStatus" filterable placeholder="请选择调整状态" clearable>
              <el-option
                v-for="dict in dict.type.wms_chenck_adjust_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="盘点人" prop="checkBy">
            <el-input
              v-model="queryParams.checkBy"
              placeholder="请输入盘点人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="创建人" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder="请输入创建人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="创建时间">
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
          <!-- <el-form-item label="处理人" prop="updateBy">
            <el-input
              v-model="queryParams.updateBy"
              placeholder="请输入处理人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="处理时间">
            <el-date-picker
              v-model="daterangeUpdateTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item> -->
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
              type="success"
              plain
              icon="el-icon-printer"
              size="mini"
              :disabled="multiple"
              @click="printData"
              v-hasPermi="['wms:adjust:query']"
            >打印预览</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="adjustList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="盘点单号" align="center" prop="checkBillCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="调整状态" align="center" prop="adjustStatus" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_chenck_adjust_status" :value="scope.row.adjustStatus"/>
            </template>
          </el-table-column>
          <el-table-column label="账面数量" align="center" prop="curtainNum" minWidth="100" show-overflow-tooltip/>
          <el-table-column label="盘点数量" align="center" prop="checkNum" minWidth="100" show-overflow-tooltip/>
          <el-table-column label="盘盈数量" align="center" prop="profitNum" minWidth="100" show-overflow-tooltip/>
          <el-table-column label="盘亏数量" align="center" prop="lossNum" minWidth="100" show-overflow-tooltip/>
          <el-table-column label="开始盘点时间" align="center" prop="startTime" width="180">
            <!-- <template slot-scope="scope">
              <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="结束盘点时间" align="center" prop="endTime" width="180">
            <!-- <template slot-scope="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="盘点人" align="center" prop="checkBy" show-overflow-tooltip/>
          <!-- <el-table-column label="创建人" align="center" prop="createBy" show-overflow-tooltip/> -->
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <!-- <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template> -->
          </el-table-column>
          <!-- <el-table-column label="处理人" align="center" prop="updateBy" show-overflow-tooltip/>
          <el-table-column label="处理时间" align="center" prop="updateTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-hasPermi="['wms:adjust:query']"
              >详情</el-button>
              <el-button
                v-show="scope.row.adjustStatus=='0'"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['wms:adjust:edit']"
              >处理</el-button>
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

    <!-- 打印预览 -->
    <el-dialog title="打印预览" :visible.sync="printer.open" append-to-body>
      <div style="text-align: center;"><h2 style="font-weight: bold;">盘点调整单</h2></div>
      <div style="display: flex;margin: 20px 0 20px;">
        <div style="width: 33%;text-align: center;font-size: 15px;">盘点单号 {{ printer.data.checkBillCode }}</div>
        <div style="width: 33%;text-align: center;font-size: 15px;">制单人 {{ printer.data.createBy }}</div>
        <div style="width: 33%;text-align: center;font-size: 15px;">制单时间 {{ printer.data.createTime }}</div>
      </div>
      <div>
        <el-table v-loading="loading" :data="printer.data.checkDetailList" height="45vh" :row-class-name="rowDetailIndex">
        <el-table-column label="序号" align="center" prop="index" width="50" />
        <el-table-column label="库区编号" align="center" prop="areaCode" show-overflow-tooltip/>
        <el-table-column label="库位编号" align="center" prop="locationCode" show-overflow-tooltip/>
        <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
        <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
        <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
        <el-table-column label="账面数量" align="center" prop="curtainNum" show-overflow-tooltip/>
        <el-table-column label="盘点数量" align="center" prop="checkNum" show-overflow-tooltip/>
        <el-table-column label="盘盈数量" align="center" prop="profitNum" show-overflow-tooltip/>
        <el-table-column label="盘亏数量" align="center" prop="lossNum" show-overflow-tooltip/>
      </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="download">下 载</el-button>
        <el-button @click="printer.open=false;">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 库存盘点调整单-详情对话框 -->
    <el-dialog title="库存盘点调整单-详情" :visible.sync="viewModalOpen" @close="closeView" width="60%" append-to-body>
      <el-form :model="queryDetailParams" ref="queryDetailForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px;">
          <el-form-item label="盘点单号" prop="checkBillCode">
            <el-input
              :disabled="true"
              v-model="queryDetailParams.checkBillCode"
              placeholder="请输入盘点单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="库区编码" prop="areaCode">
            <el-input
              v-model="queryDetailParams.areaCode"
              placeholder="请输入库区编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="库位编号" prop="locationCode">
            <el-input
              v-model="queryDetailParams.locationCode"
              placeholder="请输入库位编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="托盘编号" prop="trayCode">
            <el-input
              v-model="queryDetailParams.trayCode"
              placeholder="请输入托盘编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="货物编码" prop="goodsCode">
            <el-input
              v-model="queryDetailParams.goodsCode"
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
      <el-table v-loading="loading" :data="checkDetailList" height="42vh" :row-class-name="rowDetailIndex">
        <el-table-column label="序号" align="center" prop="index" width="50" />
        <el-table-column label="盘点库区编号" align="center" prop="areaCode" show-overflow-tooltip/>
        <el-table-column label="盘点库位编号" align="center" prop="locationCode" show-overflow-tooltip/>
        <el-table-column label="盘点托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
        <el-table-column label="盘点货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
        <el-table-column label="账面数量" align="center" prop="curtainNum" show-overflow-tooltip/>
        <el-table-column label="盘点数量" align="center" prop="checkNum" show-overflow-tooltip/>
        <el-table-column label="盘盈数量" align="center" prop="profitNum" show-overflow-tooltip/>
        <el-table-column label="盘亏数量" align="center" prop="lossNum" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="100" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-view"
                      @click="handleGoodsView(scope.row)"
                      v-hasPermi="['wms:checkAdjustDetail:view']"
            >明细</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="queryDetailParams.total"
        :page.sync="queryDetailParams.pageNum"
        :limit.sync="queryDetailParams.pageSize"
        @pagination="getDetailList"
      />

    </el-dialog>
    <!-- 库存盘点调整单-详情货物对话框 -->
    <el-dialog title="货物信息" :visible.sync="viewGoodsOpen" width="55%" append-to-body>
      <el-table v-loading="loading" :data="checkAdjustGoodsList" height="40vh" :row-class-name="rowDetailIndex">
        <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip/>
          <el-table-column label="唯一码" align="center" prop="onlyCode" show-overflow-tooltip/>
          <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="计量单位" align="center" prop="measureUnit">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip/>
          <el-table-column label="库位编号" align="center" prop="locationCode" show-overflow-tooltip/>
          <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
          <el-table-column label="盘亏数量" align="center" prop="lossNum" show-overflow-tooltip/>
          <el-table-column label="盘盈数量" align="center" prop="profitNum" show-overflow-tooltip/>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { listAdjust, getAdjust, delAdjust, addAdjust, updateAdjust } from "@/api/wms/adjust";
import { listCheckAdjustDetail, getCheckAdjustDetail, delCheckAdjustDetail, addCheckAdjustDetail, updateCheckAdjustDetail } from "@/api/wms/checkAdjustDetail";
import { listCheckAdjustGoods, getCheckAdjustGoods, delCheckAdjustGoods, addCheckAdjustGoods, updateCheckAdjustGoods } from "@/api/wms/checkAdjustGoods";
export default {
  name: "Adjust",
  dicts: ['wms_chenck_adjust_status','wms_metering_unit'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 库存盘点调整单表格数据
      adjustList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 创建时间范围
      daterangeCreateTime: [],
      // 创建时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        checkBillCode: null,
        adjustStatus: null,
        checkBy: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      },
      queryDetailParams:{
        total:0,
        pageNum:1,
        pageSize:10
      },
      checkDetailList:[],//详情数据
      checkAdjustGoodsList:[],//详情货物数据
      //预览对象
      printer:{
        open:false,//是否显示模态框
        data:{
          checkBillCode:null,
          createBy:null,
          createTime:null,
          checkDetailList:[],//打印详情货物数据
        }//打印数据
      },
      viewForm:{},
      viewModalOpen:false,
      viewGoodsOpen:false,
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
    /** 查询库存盘点调整单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      listAdjust(this.queryParams).then(response => {
        this.adjustList = response.rows;
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
        checkBillCode: null,
        adjustStatus: null,
        curtainNum: null,
        checkNum: null,
        profitNum: null,
        lossNum: null,
        startTime: null,
        endTime: null,
        delFlag: null,
        checkBy: null,
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
      this.daterangeCreateTime = [];
      this.daterangeUpdateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //详情数据查询
    getDetailList(){
      listCheckAdjustDetail(this.queryDetailParams).then(res=>{
        this.checkDetailList = res.rows
        this.queryDetailParams.total = res.total
      })
    },
    /** 详情搜索按钮操作 */
    handleDetailQuery() {
      this.queryDetailParams.pageNum = 1;
      this.getDetailList();
    },
    /** 详情重置按钮操作 */
    resetDetailQuery() {
      this.queryDetailParams.areaCode='';
      this.queryDetailParams.locationCode='';
      this.queryDetailParams.trayCode='';
      this.queryDetailParams.goodsCode='';
      this.handleDetailQuery();
    },
    closeView(){
      this.queryDetailParams.pageNum = 1;
      this.queryDetailParams.pageSize = 10;
      this.queryDetailParams.areaCode='';
      this.queryDetailParams.locationCode='';
      this.queryDetailParams.trayCode='';
      this.queryDetailParams.goodsCode='';
      this.viewModalOpen=false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },

    /** 详情按钮操作 */
    handleView(row){
      this.queryDetailParams.checkBillCode=row.checkBillCode;
      this.getDetailList();
      this.viewModalOpen=true;
    },

    /** 处理按钮操作 */
    handleUpdate(row) {
      const id = row.id
      this.$modal.confirm('处理只生成对应的出入库单据,是否确认处理该记录？').then(function () {
        return updateAdjust({id:id});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },
    /** 调整单打印 */
    printData(){
      this.printer.open=true
      const id = this.ids[0]
      //数据查询
      getAdjust(id).then(response => {
        this.printer.data = response.data;
      });
    },
    /** 下载按钮 */
    download() {
      this.downloadPdf('wms/adjust/downloadPDF', {
        ...this.printer.data
      }, `盘点调整单.pdf`).then(res=>{
        this.printer.open=false
      })
    },
     /** 详情序号 */
     rowDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    //查看货物详情
    handleGoodsView(row){
      let param={checkAdjustDetail:row.id}
      listCheckAdjustGoods(param).then(res=>{
        this.viewGoodsOpen = true;
        this.checkAdjustGoodsList=res.rows
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
