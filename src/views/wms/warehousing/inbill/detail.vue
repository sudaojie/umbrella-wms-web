<template>
    <div class="app-container" style="background-color: #f0f2f5;">
        <!-- 新增、修改数据 -->
        <div v-show="type == 0" style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item v-show="(form.id ? true : false)" label="入库单号" prop="inBillCode">
                    <el-input disabled v-model="form.inBillCode" placeholder="自动生成" show-word-limit maxlength="255" />
                </el-form-item>
                <el-form-item label="入库类别" prop="inBillCategory">
                    <el-select disabled style="width: 100%;" v-model="form.inBillCategory"
                        filterable placeholder="请选择入库类别">
                        <el-option v-for="dict in dict.type.wms_in_stock_category" :key="dict.value" :label="dict.label"
                            :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="(form.id ? true : false)" label="批次" prop="charg">
                    <el-input disabled v-model="form.charg" placeholder="自动生成" show-word-limit maxlength="255" />
                </el-form-item>

                <el-form-item v-show="(form.id ? true : false)" label="重量(kg)" prop="weight">
                    <el-input disabled v-model="form.weight" placeholder="请输入重量(kg)" show-word-limit maxlength="24,3" />
                </el-form-item>
                <el-form-item v-show="(form.id ? true : false)" label="体积(m³)" prop="volume">
                    <el-input disabled v-model="form.volume" placeholder="请输入体积(m³)" show-word-limit maxlength="24,3" />
                </el-form-item>
                <el-form-item style="width: 100%;" label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入内容"
                        show-word-limit maxlength="200" />
                </el-form-item>
                <el-form-item style="width: 100%;float: unset;" label="" />
                <el-divider content-position="center">入库单详情信息</el-divider>
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="openSelectGoods">添加产品</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="handleDeleteInbillDetail">删除</el-button>
                    </el-col>
                </el-row>
                <el-table :row-key="getRow" :data="inbillDetailLists" :row-class-name="rowInbillDetailIndex"
                    @selection-change="handleInbillDetailSelectionChange" ref="inbillDetailLists">
                    <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
                    <el-table-column label="序号" align="center" prop="index" width="50" />
                    <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip/>
                    <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip/>
                    <el-table-column label="规格型号" align="center" prop="model" minWidth="150" show-overflow-tooltip/>
                    <el-table-column label="供应商" align="center" :key="Math.random()" prop="supplierCode" fixed="right" minWidth="150"
                        >
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.supplierCode"  filterable @change="$forceUpdate()"
                                placeholder="请选择供应商" clearable>
                                <el-option v-for="dict in supplierData" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="150">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
                        </template>
                    </el-table-column>
                    <el-table-column label="重量(kg)" align="center" prop="weight" minWidth="150">
                    </el-table-column>
                    <el-table-column label="体积(m³)" align="center" prop="volume" minWidth="150">
                    </el-table-column>
                    <el-table-column label="预报数量" align="center" fixed="right" prop="reportNum" minWidth="220">
                        <template slot-scope="scope">
                            <el-input-number :min="0" :max="5000" v-model="scope.row.reportNum" placeholder="请输入预报数量"
                                show-word-limit maxlength="24,3" />
                        </template>
                    </el-table-column>
                    <el-table-column label="入库数量" align="center" prop="inBillNum" minWidth="150">
                    </el-table-column>
                    <el-table-column label="质保期(月)" align="center" prop="warranty" minWidth="150">
                    </el-table-column>
                </el-table>
            </el-form>
            <pagination v-show="total > 0" :total="total"
                :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" layout="total, prev, pager, next"
                @pagination="getInbillDetailList" />
            <div slot="footer" style="text-align: center;margin-top: 10px;">
                <el-button icon="el-icon-save" type="primary" @click="submitForm">保 存</el-button>
                <el-button icon="el-icon-close" @click="cancel">关 闭</el-button>
            </div>
        </div>
        <!-- 入库单信息 -->
        <div v-show="type == 1" style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
            <el-form ref="form" :model="inbillDetail.form" :rules="rules" label-width="80px">
                <el-form-item style="width: 33.33%;" label="入库单号" prop="inBillCode">
                    <el-input disabled v-model="inbillDetail.form.inBillCode" placeholder="自动生成" show-word-limit
                        maxlength="255" />
                </el-form-item>
                <el-form-item style="width: 33.33%;" label="批次" prop="charg">
                    <el-input disabled v-model="inbillDetail.form.charg" placeholder="自动生成" show-word-limit
                        maxlength="255" />
                </el-form-item>
                <el-form-item style="width: 33.33%;" label="入库类别" prop="inBillCategory">
                    <el-select disabled style="width: 100%;" v-model="inbillDetail.form.inBillCategory" filterable
                        placeholder="请选择入库类别">
                        <el-option v-for="dict in dict.type.wms_in_stock_category" :key="dict.value" :label="dict.label"
                            :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 33.33%;" v-show="(inbillDetail.form.id ? true : false)" label="重量(kg)" prop="weight">
                    <el-input disabled v-model="inbillDetail.form.weight" placeholder="请输入重量(kg)" show-word-limit maxlength="24,3" />
                </el-form-item>
                <el-form-item style="width: 33.33%;" v-show="(inbillDetail.form.id ? true : false)" label="体积(m³)" prop="volume">
                    <el-input disabled v-model="inbillDetail.form.volume" placeholder="请输入体积(m³)" show-word-limit maxlength="24,3" />
                </el-form-item>
                <el-form-item style="width: 33.33%;height: 40px;" v-show="(inbillDetail.form.id ? true : false)" label=""></el-form-item>
                <el-form-item style="width: 100%;float: unset;" label="备注" prop="remark">
                    <el-input disabled v-model="inbillDetail.form.remark" type="textarea" :autosize="{ minRows: 3 }"
                        placeholder="请输入内容" show-word-limit maxlength="200" />
                </el-form-item>
                <el-divider content-position="center">入库明细</el-divider>

                <el-table :data="inbillDetail.inbillDetailList" :row-class-name="rowInbillDetailIndex" ref="inbillDetail">
                    <el-table-column label="序号" align="center" prop="index" width="50" />
                    <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="计量单位" align="center" prop="measureUnit" width="150">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
                        </template>
                    </el-table-column>
                    <el-table-column label="规格型号" align="center" prop="model" width="150">
                    </el-table-column>
                    <el-table-column label="预报数量" align="center" prop="reportNum" width="220">
                    </el-table-column>
                    <el-table-column label="入库数量" align="center" prop="inBillNum" width="150">
                    </el-table-column>
                    <el-table-column v-if="inbillDetail.form.inBillCategory!='3'" label="供应商" align="center" prop="supplierCode" minWidth="150">
                        <template slot-scope="scope">
                            <div v-for="item in supplierData" v-if="item.value == scope.row.supplierCode">{{ item.label }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="重量(kg)" align="center" prop="weight" width="150">
                    </el-table-column>
                    <el-table-column label="体积(m³)" align="center" prop="volume" width="150">
                    </el-table-column>
                    <el-table-column label="质保期(天)" align="center" prop="warranty" width="150">
                    </el-table-column>
                    <el-table-column label="产品唯一码" align="center" fixed="right" width="160px"
                        class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-view" @click="showInbillGoodsDetail(scope.row)"
                                v-hasPermi="['warehousing:inbill:view']">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <pagination v-show="inbillDetail.total > 0" :total="inbillDetail.total"
                :page.sync="inbillDetail.queryParams.pageNum" :limit.sync="inbillDetail.queryParams.pageSize"
                @pagination="getGoodsLocationList1" />
            <div slot="footer" style="text-align: center;margin-top: 10px;">
                <el-button icon="el-icon-close" @click="cancel">关 闭</el-button>
            </div>
        </div>
        <!-- 上架货位信息 -->
        <div v-if="type == 2" style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
            <el-form :model="showLocation.queryParams" ref="queryGoodsForm" size="small" :inline="true" label-width="0px">
                <el-form-item id="search" style="width: 20%;float: unset;" label="" prop="goodsCode">
                    <el-input v-model="showLocation.queryParams.goodsCode" placeholder="关键词" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item style="width: unset;float: unset;">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryLocation">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryLocation">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="showLocation.inbillDetailList" :row-class-name="rowInbillDetailIndex" ref="inbillDetail">
                <el-table-column label="序号" align="center" prop="index" width="50" />
                <el-table-column label="入库单号" align="center" prop="inBillCode" minWidth="150" show-overflow-tooltip />
                <el-table-column label="批次号" align="center" prop="charg" minWidth="100" show-overflow-tooltip />
                <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="100" show-overflow-tooltip />
                <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="100" show-overflow-tooltip />
                <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
                    </template>
                </el-table-column>
                <el-table-column label="规格型号" align="center" prop="model" minWidth="100" show-overflow-tooltip />
                <el-table-column v-show="showLocation.queryParams.inBillCode.indexOf('PYRK')==-1" label="供应商" align="center" prop="supplierCode" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-for="item in supplierData" v-if="item.value == scope.row.supplierCode">{{ item.label }}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="货位" align="center" prop="locationName" minWidth="100"/>
                        <el-table-column label="托盘号" align="center" prop="trayCode" minWidth="100"/> -->
                <el-table-column label="预报数量" align="center" prop="reportNum" minWidth="100" />
                <el-table-column label="上架数量" align="center" prop="inBillNum" minWidth="100" />
                <!-- <el-table-column label="上架时间" align="center" prop="trayCode" minWidth="100"/> -->
                <el-table-column label="货物唯一码" fixed="right" align="center" minWidth="100"
                    class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="showInbillGoodsDetail(scope.row)"
                            v-hasPermi="['warehousing:inbill:view']">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="selectGoods.total > 0" :total="selectGoods.total"
                :page.sync="selectGoods.queryParams.pageNum" :limit.sync="selectGoods.queryParams.pageSize"
                @pagination="getGoodsLocationList" />
            <div slot="footer" style="text-align: center;margin-top: 10px;">
                <el-button icon="el-icon-close" @click="cancel">关 闭</el-button>
            </div>
        </div>
        <!-- 产品数据-选择对话框 -->
        <el-dialog title="货物选择"  :visible.sync="selectGoods.open" width="50%" @close="selectGoodsDialogClose">
          <el-form :model="selectGoods.queryParams" @submit.native.prevent  ref="selectGoods.queryForm" size="small" :inline="true" v-if="showSearch" label-width="68px" style="padding-left: 10px;">
            <el-form-item label="" prop="rkHwxk">
              <el-input style="width: 260px;" v-model="selectGoods.queryParams.rkHwxk" placeholder="请输入货物编码/名称/规格模糊查询"
                        clearable
                        @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item style="width: unset;float: unset;">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGoods">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoods">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="background-color: white;adding: 10px;border-radius: 10px;">
          <template>
            <el-alert
              v-if="this.selectGoods.goodsList.length>0"
              :title="selectGoodsTitle"
              type="warning"
              show-icon
              :closable="false">
              <span class="clear-button" @click="onClearSelected()">清空</span>
            </el-alert>
            <el-alert
              v-else
              :title="selectGoodsTitle"
              type="warning"
              show-icon
              :closable="false">
            </el-alert>
          </template>
            <el-table v-loading="selectGoods.loading"
                      :data="selectGoods.goodsInfoList"
                      ref="multipleTable" height="350"
                      :row-key="getRowKey"
                      @selection-change="handleSelectionChangeGoods">
              <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
                <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip />
                <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
                <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip />
                <el-table-column label="重量(kg)" align="center" prop="weight" />
                <el-table-column label="体积(m³)" align="center" prop="volume" />
                <el-table-column label="计量单位" align="center" prop="measureUnit">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="selectGoods.total > 0" :total="selectGoods.total" :page.sync="selectGoods.queryParams.pageNum"
                        :limit.sync="selectGoods.queryParams.pageSize" @pagination="handleQueryGoods" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectedGoods">确 定</el-button>
                <el-button @click="selectGoods.open = false, selectGoods.queryParams.goodsCode = ''">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 货物唯一码查询 -->
        <el-dialog title="货物唯一码查询" :visible.sync="inbillGoodsDetail.open" width="65vw" append-to-body>
            <el-form :model="inbillGoodsDetail.queryParams" @submit.native.prevent  :rules="rules" label-width="0px" style="display: flex;">
                <el-form-item style="width: 30%;margin-right: 10px;float: none;" label="" prop="onlyCode">
                    <el-input v-model="inbillGoodsDetail.queryParams.onlyCode" placeholder="关键词" clearable
                        @keyup.enter.native="handleQueryInbillGoodsDetail" />
                </el-form-item>
                <el-form-item style="width: unset;float: unset;">
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="handleQueryInbillGoodsDetail">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryInbillGoodsDetail">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="inbillGoodsDetail.inbillDetailList" height="50vh" width="100%"
                :row-class-name="rowInbillDetailIndex" ref="inbillDetail">
                <el-table-column label="序号" align="center" prop="index" width="50" />
                <el-table-column label="货物唯一码" align="center" prop="onlyCode" minWidth="150" show-overflow-tooltip />
                <el-table-column label="机件码" align="center" prop="partsCode" minWidth="120" show-overflow-tooltip />
                <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="120" show-overflow-tooltip/>
                <el-table-column v-if="type==2" label="库位编码" align="center" prop="locationCode" minWidth="100" show-overflow-tooltip/>
                <el-table-column v-if="type==2" label="托盘编码" align="center" prop="trayCode" minWidth="100" show-overflow-tooltip/>
                <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="100" show-overflow-tooltip/>
                <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
                    </template>
                </el-table-column>
                <el-table-column label="规格型号" align="center" prop="model" minWidth="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="生产日期" align="center" prop="produceTime" minWidth="120">
                </el-table-column>
                <el-table-column label="质保期(天)" align="center" prop="warranty" minWidth="100">
                </el-table-column>
            </el-table>
            <pagination v-show="inbillGoodsDetail.total > 0" :total="inbillGoodsDetail.total"
                :page.sync="inbillGoodsDetail.queryParams.pageNum" :limit.sync="inbillGoodsDetail.queryParams.pageSize"
                @pagination="getInbillGoodsDetail" />
        </el-dialog>
</div>
</template>

<script>

import { getInbill, addInbill, updateInbill, getGoodsList, getInbillDetailList,getSupplierData, getInbillGoodsDetail, getInbillGoodsByLocation,removeDetail } from "@/api/wms/warehousing/inbill";
export default {
    name: "Inbill",
    dicts: ['wms_in_stock_category', 'wms_metering_unit'],
    data() {
        return {
            id:null,
            inBillCategory:null,
            queryParams: {
                pageNum: 0,
                pageSize: 50,
            },
            total: 0,
            //页面类型(0新增、修改；1展示入库明细，2展示上架信息)
            type: null,
            //供应商
            supplierData: [],
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 表单参数
            form: {
              inBillCategory:'2'
            },
            // 入库单信息表格数据
            inbillList: [],
            // 入库单详情信息表格数据
            inbillDetailLists: [],
            // 入库单详情信息表格已存在数据
            inbillDetailData: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,

            //查看入库详情
            inbillDetail: {
                open: false,
                form: {},
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                },
                total: 0,
                inbillDetailList: []
            },
            //查看上架货位详情
            showLocation: {
                open: false,
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                },
                total: 0,
                inbillDetailList: []
            },
            //查看货物唯一码
            inbillGoodsDetail: {
                open: false,
                queryParams: {
                    onlyCode: '',
                    pageNum: 1,
                    pageSize: 10,
                },
                total: 0,
                inbillDetailList: []
            },
            selectGoodsTitle:'未选中任何数据',
            // 显示搜索条件
            showSearch: true,
            //选择货物弹窗参数
            selectGoods: {
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    goodsCode: null,
                    rkHwxk: null,
                },
                goodsInfoList: [],
                // 是否显示弹出层
                open: false,
                loading: false,
                total: 0,
                goodsList: [],//选中的货物数据
            },
            deleteList:[],//删除的id数组
            // 表单校验
            rules: {
                // inBillCategory: [
                //     { required: true, message: "入库类别不能为空", trigger: "blur" }
                // ],
            }
        };
    },
    created() {
        this.showLocation.charg = this.$route.query.charg;
        let inBillCode = this.$route.query.inBillCode;
        let id = this.$route.query.id;
        this.id=id;
        this.type = this.$route.query.type;
        this.showLocation.queryParams.inBillCode = inBillCode;
        if (this.type == 2) {
            this.getGoodsLocationList()
        } else {
            if (id) {
                getInbill(id).then(response => {
                    if (this.type == 0) {
                        this.form = response.data;
                        this.inBillCategory = response.data.inBillCategory;
                        this.queryParams.inBillCode = response.data.inBillCode;
                        this.inbillDetailData = response.data.inbillDetailList
                        this.getInbillDetailList()
                    } else if (this.type == 1) {
                        this.inbillDetail.form = response.data;
                        this.inbillDetail.queryParams.inBillCode = response.data.inBillCode;
                        this.getGoodsLocationList1()
                    }
                });
            }
        }
        this.initData();
    },
    methods: {
      onClearSelected(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
        //下拉框数据初始化
        initData() {
            getSupplierData().then(res => {
                this.supplierData = res.data
            })
        },
        getRow(row){
            return row.id;
        },
        /** 查询入库单情况 */
        getInbillDetailList() {
            this.queryParams.ids = this.deleteList
            getInbillDetailList(this.queryParams).then(response => {
                this.inbillDetailLists = response.rows
                this.total = response.total
            })
        },
        /** 查询入库单情况 */
        getGoodsLocationList1() {
            getInbillGoodsByLocation(this.inbillDetail.queryParams).then(response => {
                this.inbillDetail.inbillDetailList = response.rows
                this.inbillDetail.total = response.total
            })
        },
        /** 查询上架货位情况 */
        getGoodsLocationList() {
            getInbillGoodsByLocation(this.showLocation.queryParams).then(response => {
                response.rows.forEach(item => {
                    item.charg = this.showLocation.charg
                })
                this.showLocation.inbillDetailList = response.rows
                this.showLocation.total = response.total
            })
        },

        /** 上架货物搜索按钮操作 */
        handleQueryLocation() {
            this.showLocation.queryParams.pageNum = 1;
            this.getGoodsLocationList();
        },
        /** 上架货物重置按钮操作 */
        resetQueryLocation() {
            this.showLocation.queryParams.pageNum = 1;
            this.showLocation.queryParams.goodsCode = ''
            this.getGoodsLocationList();
        },

        /** 货物唯一码搜索按钮操作 */
        handleQueryInbillGoodsDetail() {
            this.inbillGoodsDetail.queryParams.pageNum = 1;
            this.getInbillGoodsDetail();
        },
        /** 货物唯一码重置按钮操作 */
        resetQueryInbillGoodsDetail() {
            this.inbillGoodsDetail.queryParams.pageNum = 1;
            this.inbillGoodsDetail.queryParams.onlyCode = '';
            this.getInbillGoodsDetail();
        },
        getRowKey(row){
          return row.id
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        // 货物多选框选中数据
        handleSelectionChangeGoods(selection) {
          this.selectGoods.goodsList = selection.map(item => item);
          if(selection.length>0){
            this.selectGoodsTitle = '已选中 '+  selection.length +' 条记录(可跨页)'
          }else {
            this.selectGoodsTitle ='未选中任何数据'
          }
        },
        //选择货物后将数据添加到入库单详情中
        selectedGoods() {
            if (this.selectGoods.goodsList.length > 0) {
                this.selectGoods.goodsList.forEach(element => {
                    element.supplierCode = element.supplierId;
                    element.id = ''
                    let isHav = false;
                    this.inbillDetailData.forEach(item => {
                        if (item.goodsCode == element.goodsCode) {
                            isHav = true;
                        }
                    })
                    if(!isHav){
                        this.inbillDetailLists.forEach(item => {
                            if (item.goodsCode == element.goodsCode) {
                                isHav = true;
                            }
                        })
                    }
                    if (!isHav) {
                        this.inbillDetailLists.push(element);
                    }
                });
                this.selectGoods.open = false
                this.selectGoods.queryParams.goodsCode = '';
            } else {
                this.$modal.msgError("请选择数据");
            }
        },

        // 取消按钮
        cancel() {
            const obj = { path: "/wmsJob/inbill" };
            this.$tab.closeOpenPage(obj);
        },

        //打开货物选择框
        openSelectGoods() {
            //加载货物数据
            this.getSelectGoodsList();
            this.selectGoods.open = true
        },
        //查询货物信息
        getSelectGoodsList() {
            this.selectGoods.loading = true;
            getGoodsList(this.selectGoods.queryParams).then(res => {
                this.selectGoods.goodsInfoList = res.rows;
                this.selectGoods.total = res.total;
                this.selectGoods.loading = false;
            })
        },
      selectGoodsDialogClose(){
        this.selectGoods.queryParams = { pageNum: 1, pageSize: 10 };
        this.$refs.multipleTable.clearSelection();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        debugger;
        console.log("aaaaaaaa")
        this.selectGoods.queryParams.pageNum = 1;
        this.getSelectGoodsList();
      },

        /** 货物搜索按钮操作 */
        handleQueryGoods() {
            this.selectGoods.queryParams.pageNum = 1;
            this.getSelectGoodsList();
        },
        /** 货物重置按钮操作 */
        resetQueryGoods() {
            this.resetForm("queryGoodsForm");
            this.handleQueryGoods();
        },
        /** 提交按钮 */
        submitForm() {

            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (!this.form.inBillCategory) {
                            this.$modal.msgError("请维护抬头数据的入库类别");
                            return
                        }
                    for (const item in this.inbillDetailLists) {
                        if (!this.inbillDetailLists[item].supplierCode) {
                            this.$modal.msgError("请维护入库单详情信息行数据的供应商");
                            return
                        }
                    }
                    for (const item in this.inbillDetailLists) {
                        if (!this.inbillDetailLists[item].reportNum) {
                            this.$modal.msgError("请维护入库单详情信息行数据的预报数量");
                            return
                        }
                    }
                    this.inbillDetailLists.forEach(item => {
                        this.supplierData.forEach(element => {
                            if(item.supplierCode==element.value){
                                item.supplierName = element.label.split('-')[1]
                            }
                        })
                    })
                    if(this.inbillDetailLists.length==0){
                        this.$modal.msgError("入库单详情信息不可为空");
                        return;
                    }
                    this.form.inbillDetailList = this.inbillDetailLists;
                    if (this.form.id != null) {
                        this.form.ids = this.deleteList
                        this.deleteList=[]
                        updateInbill(this.form).then(response => {
                            this.form = response.data
                            this.inbillDetailLists = response.data.inbillDetailList
                            this.$modal.msgSuccess("修改成功");
                        });
                    } else {
                        addInbill(this.form).then(response => {
                            this.form = response.data
                            this.queryParams.inBillCode = response.data.inBillCode;
                            this.id=response.data.id;
                            this.inbillDetailLists = response.data.inbillDetailList
                            this.$modal.msgSuccess("新增成功");
                        });
                    }
                }
            });
        },

        /** 入库单详情信息序号 */
        rowInbillDetailIndex({ row, rowIndex }) {
            row.index = rowIndex + 1;
        },

        /** 入库单详情信息删除按钮操作 */
        handleDeleteInbillDetail() {
            if (this.checkedInbillDetail.length == 0) {
                this.$modal.msgError("请先选择要删除的入库单详情信息数据");
            } else {
                const inbillDetailList = this.inbillDetailLists;
                const checkedInbillDetail = this.checkedInbillDetail;
                this.inbillDetailLists = inbillDetailList.filter(function (item) {
                    return checkedInbillDetail.indexOf(item.index) == -1
                });
                let ids = []
                this.checkedDetail.forEach(item => {
                    if(item.id){
                        ids.push(item.id);
                        this.deleteList.push(item.id);
                    }
                })
                if(ids.length>0){
                    this.getInbillDetailList()
                }
            }
        },
        /** 复选框选中数据 */
        handleInbillDetailSelectionChange(selection) {
            this.checkedInbillDetail = selection.map(item => item.index)
            this.checkedDetail = selection.map(item => item)
        },

        /** 查看货物唯一码 */
        showInbillGoodsDetail(data) {
            this.inbillGoodsDetail.inbillDetailList = []
            this.inbillGoodsDetail.queryParams.onlyCode = ''
            this.inbillGoodsDetail.queryParams.inbillDetailId = data.id;
            this.inbillGoodsDetail.goodsCode = data.goodsCode;
            this.inbillGoodsDetail.goodsName = data.goodsName;
            this.inbillGoodsDetail.measureUnit = data.measureUnit;
            this.inbillGoodsDetail.model = data.model;
            this.inbillGoodsDetail.warranty = data.warranty;
            this.inbillGoodsDetail.queryParams.inbillDetailId = data.id;
            this.inbillGoodsDetail.open = true;
            this.getInbillGoodsDetail();
        },
        //获取唯一码数据
        getInbillGoodsDetail() {
            getInbillGoodsDetail(this.inbillGoodsDetail.queryParams).then(response => {
                response.rows.forEach(item => {
                    item.goodsCode = this.inbillGoodsDetail.goodsCode;
                    item.goodsName = this.inbillGoodsDetail.goodsName;
                    item.measureUnit = this.inbillGoodsDetail.measureUnit;
                    item.model = this.inbillGoodsDetail.model;
                    item.warranty = this.inbillGoodsDetail.warranty;
                })
                this.inbillGoodsDetail.inbillDetailList = response.rows
                this.inbillGoodsDetail.total = response.total
            })
        },
    }
};
</script>
<style scoped>
.el-form>>>.el-form-item {
    width: 33.33%;
    float: left;
}

.el-form>>>.el-form-item__content:last-child {
    position: unset;
}

.el-form>>>.el-form-item__content {
    line-height: 40px;
}

#search>>>.el-form-item__content {
    width: 100%;
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


::v-deep .el-alert--warning.is-light{
  margin-top: 10px;
}
::v-deep .el-alert__content{
  display: flex;
  align-items: center;
}
::v-deep .el-alert .el-alert__description{
  margin: 0;
}

.clear-button{
  color: #1890ff;
  margin-left: 10px;
  cursor: pointer;
}
</style>
