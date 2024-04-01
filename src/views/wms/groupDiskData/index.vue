<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
               style="padding-left: 10px;">
        <el-form-item label="托盘编号" prop="trayCode">
          <el-input
            v-model="queryParams.trayCode"
            placeholder="请输入托盘编号"
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

      <el-table v-loading="loading" :data="infoList" :height="tableHeight">
        <el-table-column label="托盘编号" align="center" prop="trayCode" show-overflow-tooltip/>
        <el-table-column label="货物类型" align="center" prop="goodsType" show-overflow-tooltip/>
        <el-table-column label="货物实际数量" align="center" prop="actualNum" show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="color: blue; font-size: 15px"
                  @click="openDrawerData(scope.row.trayCode, scope.row.goodsType)">{{scope.row.actualNum}}</a>
          </template>
        </el-table-column>
        <el-table-column label="组盘时间" align="center" prop="groupDiskTime" show-overflow-tooltip/>
      </el-table>

      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <el-drawer :title="goodsTitle" :visible.sync="openDrawer" append-to-body size="50%">
      <el-card>
        <el-form :model="queryGoodsParams" ref="queryGoodsForm" size="small" :inline="true" label-width="68px"
                 style="padding-left: 10px;">
          <el-form-item label="入库单号" prop="inBillCode">
            <el-input
              v-model="queryGoodsParams.inBillCode"
              placeholder="请输入入库单号"
              clearable
              @keyup.enter.native="handleGoodsQuery"
            />
          </el-form-item>
          <el-form-item label="机件号" prop="partsCode">
            <el-input
              v-model="queryGoodsParams.partsCode"
              placeholder="请输入机件号"
              clearable
              @keyup.enter.native="handleGoodsQuery"
            />
          </el-form-item>
          <el-form-item label="货物名称" prop="goodsName">
            <el-input
              v-model="queryGoodsParams.goodsName"
              placeholder="请输入货物名称"
              clearable
              @keyup.enter.native="handleGoodsQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleGoodsQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetGoodsQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-table v-loading="goodsLoading" :data="goodsList" :height="tableHeight">
          <el-table-column label="入库单号" align="center" prop="inBillCode" show-overflow-tooltip/>
          <el-table-column label="唯一码" align="center" prop="onlyCode" show-overflow-tooltip/>
          <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip/>
          <el-table-column label="托盘编码" align="center" prop="trayCode" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip/>
          <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip/>
          <el-table-column label="供应商名称" align="center" prop="supplierName" show-overflow-tooltip/>
        </el-table>
      </el-card>
      <pagination
        :total="goodsTotal"
        :page.sync="queryGoodsParams.pageNum"
        :limit.sync="queryGoodsParams.pageSize"
        @pagination="getGoodsListByTrayCode('', '')"
      />
    </el-drawer>

    <!-- wms已组盘数据信息-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="托盘编号">{{ viewForm.trayCode }}</el-descriptions-item>
        <el-descriptions-item label="货物类型">{{ viewForm.goodsType }}</el-descriptions-item>
        <el-descriptions-item label="货物实际数量">{{ viewForm.actualNum }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
  import { getGroupDiskData, getGoodsInfoOnGroupTray } from '@/api/wms/groupDiskData'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Info',
    data() {
      return {
        openDrawer: false,
        goodsTitle: '',
        // 遮罩层
        loading: true,
        // 弹窗遮罩层
        goodsLoading: true,
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
        // 总条数
        goodsTotal: 0,
        // wms已组盘数据信息表格数据
        infoList: [],
        goodsList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          trayCode: null,
          goodsType: null,
          actualNum: null
        },
        queryGoodsParams: {
          pageNum: 1,
          pageSize: 10,
          inBillCode: null,
          partsCode: null,
          goodsName: null,
          trayCode: null
        },
        fileData: [],//选择的文件
        // 导入参数
        upload: {
          // 是否显示弹出层（导入）
          open: false,
          // 弹出层标题（导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: 'Bearer ' + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/system/info/importData'
        },
        viewForm: {},
        viewModalOpen: false,
        // 表单参数
        form: {},
        //表格高度
        tableHeight: 0,
        // 表单校验
        rules: {
          trayCode: [
            { required: true, message: '托盘编号不能为空', trigger: 'blur' }
          ],
          actualNum: [
            { required: true, message: '货物实际数量不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
      this.setTableGeight()
      window.addEventListener('resize', this.setTableGeight)
    },
    methods: {
      openDrawerData(trayCode, goodsType) {
        this.resetForm('queryGoodsForm')
        this.getGoodsListByTrayCode(trayCode, goodsType)
      },
      getGoodsListByTrayCode(trayCode, goodsType) {
        if (goodsType) {
          this.goodsTitle = goodsType + '明细'
        }
        if (trayCode) {
          this.queryGoodsParams.trayCode = trayCode
        }
        this.openDrawer = true
        getGoodsInfoOnGroupTray(this.queryGoodsParams).then(response => {
          this.goodsList = response.rows
          this.goodsTotal = response.total
          this.goodsLoading = false
        }).catch(() => {
          this.openDrawer = false
        })
      },
      /** 查询wms已组盘数据信息列表 */
      getList() {
        this.loading = true
        getGroupDiskData(this.queryParams).then(response => {
          this.infoList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      //表格动态高度
      setTableGeight() {
        this.$nextTick(() => {
          const height = window.innerHeight
          this.tableHeight = (height - this.$refs.top.offsetHeight - 240)

        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          trayCode: null,
          goodsType: null,
          actualNum: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 搜索货物按钮操作 */
      handleGoodsQuery() {
        this.queryGoodsParams.pageNum = 1
        this.getGoodsListByTrayCode('', '')
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 重置货物按钮操作 */
      resetGoodsQuery() {
        this.resetForm('queryGoodsForm')
        this.handleGoodsQuery()
      }
    }
  }
</script>
<style scoped>
  .el-form >>> .el-input-number__decrease {
    display: none;
  }

  .el-form >>> .el-input-number__increase {
    display: none;
  }

  .el-input-number >>> .el-input__inner {
    padding-left: 15px !important;
    padding-right: 15px;
    text-align: left;
  }

  .el-table >>> .el-table__fixed::before, .el-table >>> .el-table__fixed-right::before {
    display: none;
  }
</style>
