<template>
    <div class="app-container" style="background-color: #f0f2f5;">
        <!-- 盘库单信息 -->
        <div v-show="type == 1" style="background-color: white;padding: 10px;border-radius: 10px;">
            <el-form ref="form" :model="this.checkDetail.queryParams" :rules="rules" label-width="80px">
                <el-form-item style="width: 25%;" label="盘点单号" prop="checkBillCode">
                    <el-input disabled="disabled" v-model="this.checkDetail.queryParams.checkBillCode" placeholder="请输入盘点单号"
                        clearable />
                </el-form-item>
              <el-form-item style="width: 20%;" label="库区编号" prop="areaCode">
                <el-select v-model="queryParams.areaCode" filterable placeholder="请选择库位" clearable>
                  <el-option label="CCQ01" value="CCQ01" />
                  <el-option label="CCQ02" value="CCQ02" />
                  <el-option label="CCQ03" value="CCQ03" />
                </el-select>
              </el-form-item>

                <el-form-item style="width: 25%;" label="库位编号" prop="locationCode">
                    <el-select v-model="queryParams.locationCode" filterable placeholder="请选择库位" clearable>
                        <el-option v-for="dict in this.checkDetail.locationList" :key="dict.locationCode"
                            :label="dict.locationCode" :value="dict.locationCode" />
                    </el-select>
                </el-form-item>
                <el-form-item style="width: unset;float: unset;">
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="handleDetailQueryGoods">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetDetailQuery">重置</el-button>
                    <el-button icon="el-icon-printer" size="mini" @click="printPdf">打印盘点单</el-button>
                </el-form-item>
            </el-form>
            <el-divider content-position="center">入库明细</el-divider>

            <el-table :data="checkbillGoodsList"
                ref="wmsWarehouseCheckDetail" height="calc(100vh - 345px)">
                <el-table-column type="selection" width="50" align="center" />
                <!-- <el-table-column label="盘点单号" align="center" prop="checkBillCode" /> -->
                <el-table-column label="库区编号" align="center" prop="areaCode" />
                <el-table-column label="库位编号" align="center" prop="locationCode" />
                <el-table-column label="托盘编号" align="center" prop="trayCode" />
                <!-- <el-table-column label="货物编码" align="center" prop="goodsCode" />
                <el-table-column label="货物名称" align="center" prop="goodsName" /> -->
                <el-table-column label="账面数量" align="center" prop="curtainNum" />
                <el-table-column label="盘点数量" align="center" prop="checkNum" />
                <el-table-column label="盘盈数量" align="center" prop="profitNum" />
                <el-table-column label="盘亏数量" align="center" prop="lossNum" />
                <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text"
                            icon="el-icon-edit" @click="openSelectGoods(scope.row)"
                            v-hasPermi="['stock:check:edit']">明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getDetailList" />
            <div slot="footer" style="text-align: center;margin-top: 10px;">
                <el-button icon="el-icon-close" @click="cancel">关 闭</el-button>
            </div>
        </div>

        <!-- 盘点单打印数据 -->
        <el-dialog title="" :visible.sync="print.open" width="70%" append-to-body>
            <div><h2 style="font-weight: bold;text-align: center;">盘点单</h2></div>
            <div style="display: flex;text-align: center;margin-bottom: 10px;">
                <div style="width: 33.33%;font-size: 15px;">盘点单号  {{ form.checkBillCode }}</div>
                <div style="width: 33.33%;font-size: 15px;">制单人 {{ form.createBy }}</div>
                <div style="width: 33.33%;font-size: 15px;">制单时间  {{ form.createTime }}</div>
            </div>
            <el-table :data="print.detailList" >
                <el-table-column label="序号" align="center" prop="index" width="50">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="库区编号" align="center" prop="areaCode" />
                <el-table-column label="库位编号" align="center" prop="locationCode" />
                <el-table-column label="托盘编号" align="center" prop="trayCode" />
                <el-table-column label="账面数量" align="center" prop="curtainNum" />
                <el-table-column label="盘点数量" align="center" prop="checkNum" />
                <el-table-column label="盘盈数量" align="center" prop="profitNum" />
                <el-table-column label="盘亏数量" align="center" prop="lossNum" />
            </el-table>
            <div slot="footer" style="text-align: center;margin-top: 10px;">
                <el-button icon="el-icon-printer" @click="printSure">下载PDF</el-button>
                <el-button icon="el-icon-close" @click="print.open=false;">关 闭</el-button>
            </div>
        </el-dialog>
        <!-- 产品数据-选择对话框 -->
        <el-dialog title="货物信息" :visible.sync="selectGoods.open" width="70%" append-to-body>
            <el-form :model="selectGoods.queryParams" ref="queryGoodsForm" size="small" :inline="true" label-width="100px">
                <el-form-item style="width: 25%;" label="机件号" prop="partsCode">
                    <el-input v-model="selectGoods.queryParams.partsCode" placeholder="请输入盘点单号" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item style="width: unset;float: unset;">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGoods">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoods">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="selectGoods.loading" :data="selectGoods.goodsInfoList" height="350">
                <el-table-column label="货物编码" align="center" prop="goodsCode" show-overflow-tooltip />
                <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
                <el-table-column label="机件号" align="center" prop="partsCode" />
                <el-table-column label="货物唯一码" align="center" prop="onlyCode" />
                <el-table-column label="计量单位" align="center" prop="measureUnit">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
                    </template>
                </el-table-column>
                <el-table-column label="产品规格" align="center" prop="model" />
                <el-table-column label="库位编号" align="center" prop="locationCode" />
                <el-table-column label="托盘编号" align="center" prop="trayCode" />
                <!-- <el-table-column label="盘盈数量" align="center" prop="profitNum" />
                <el-table-column label="盘亏数量" align="center" prop="lossNum" /> -->
            </el-table>
            <pagination v-show="selectGoods.total > 0" :total="selectGoods.total"
                :page.sync="selectGoods.queryParams.pageNum" :limit.sync="selectGoods.queryParams.pageSize"
                @pagination="getSelectGoodsList" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectGoods.open = false, selectGoods.queryParams.goodsCode = ''">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import { getCheckDetailData, getCheckGoodsList, getCheckDetailInfo,getPrintData } from "@/api/wms/check";
export default {
    name: "Inbill",
    dicts: ['wms_check_status', 'wms_check_method', 'wms_metering_unit', 'wms_check_type'],
    data() {
        return {
            id: null,
            form:{},
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                locationCode: null,
                areaCode: null,
                checkBillCode: null,
                partsCode: null,
            },
            total: 0,
            //页面类型(0.库位 1.货物类型)
            type: null,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            print:{
                open:false,
                detailList:[]
            },
            // 库存盘点详情表格数据
            checkbillGoodsList: [],
            // 盘点类型
            checkMethod: "",
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            //查看盘库详情
            checkDetail: {
                open: false,
                form: {},
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    checkBillCode: null,
                    locationCode: null,
                    checkType: null,
                },
                total: 0,
                locationList: [],
            },

            //选择货物弹窗参数
            selectGoods: {
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    goodsCode: null,
                    checkBillCode: null,
                    partsCode: null,
                },
                goodsInfoList: [],
                // 是否显示弹出层
                open: false,
                loading: false,
                total: 0,
                goodsList: [],//选中的货物数据
            },
            // 表单校验
            rules: {}
        };
    },
    created() {
        this.id = this.$route.query.id;
        this.type = this.$route.query.type;
        this.checkDetail.queryParams.checkType = this.type;
        this.initData();
    },
    methods: {
        //下拉框数据初始化
        initData() {
            getCheckDetailData(this.id).then(res => {
                this.checkDetail.queryParams.checkBillCode = res.data.checkBillCode;
                this.checkDetail.locationList = res.data.locationList;
                this.queryParams.checkBillCode = res.data.checkBillCode;
                this.getDetailList();
            })
        },

        //详情搜索
        handleDetailQueryGoods() {
            this.queryParams.pageNum = 1;
            this.queryParams.checkBillCode = this.checkDetail.queryParams.checkBillCode;
            this.getDetailList()
        },
        getDetailList(){
            getCheckDetailInfo(this.queryParams).then(res => {
                this.checkbillGoodsList = res.rows;
                this.total = res.total
            })
        },
        // 取消按钮
        cancel() {
            const obj = { path: "/kngl/check" };
            this.$tab.closeOpenPage(obj);
        },
        /** 详情重置按钮操作 */
        resetDetailQuery() {
            this.queryParams.locationCode = null;
            this.queryParams.areaCode = null;
            this.handleDetailQueryGoods();
        },

        //打开货物选择框
        openSelectGoods(row) {
            this.selectGoods.open = true
            this.selectGoods.queryParams.checkDetail = row.id;
            //加载货物数据
            this.getSelectGoodsList();
        },
        //查询货物信息
        getSelectGoodsList() {
            this.selectGoods.loading = true;
            getCheckGoodsList(this.selectGoods.queryParams).then(res => {
                this.selectGoods.goodsInfoList = res.rows;
                this.selectGoods.total = res.total;
                this.selectGoods.loading = false;
            })
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
        //生成打印数据
        printPdf(){
            getPrintData(this.id).then(res=>{
                this.print.open = true;
                this.form = res.data
                this.print.detailList = res.data.wmsWarehouseCheckDetailList
            })
        },
        //确定打印数据
        printSure(){
            this.downloadPdf('/check/printData', {
                ...this.form
            }, `盘点单.pdf`).then(res=>{
                this.print.open=false
            })
        }
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
