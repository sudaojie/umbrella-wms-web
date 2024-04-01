<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
                    margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
        style="padding-left: 10px;">
        <el-form-item label="出库单号" prop="outBillCode">
          <el-input v-model="queryParams.outBillCode" placeholder="请输入出库单号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="出库状态" prop="outBillStatus">
          <el-select v-model="queryParams.outBillStatus" filterable placeholder="请选择出库状态" clearable>
            <el-option v-for="dict in dict.type.wms_outbill_status" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间">
          <el-date-picker v-model="daterangeOutBillTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="出库类别" prop="outBillCategory">
          <el-select v-model="queryParams.outBillCategory" filterable placeholder="请选择出库类别" clearable>
            <el-option v-for="dict in dict.type.wms_outbill_type" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="制单时间">
          <el-date-picker v-model="daterangeCreateTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
            v-hasPermi="['outbound:outbill:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-printer" size="mini" :disabled="single" @click="handlePrint"
            v-hasPermi="['warehousing:inbill:printer']">打印出库单</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="outbillList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="出库单号" align="center" prop="outBillCode" minWidth="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <a v-show="scope.row.outBillStatus != 1 && scope.row.outBillStatus != 4" @click="getDetail(scope.row)" style="color:blue;">{{ scope.row.outBillCode }}</a>
            <div v-show="scope.row.outBillStatus == 1 || scope.row.outBillStatus == 4">{{ scope.row.outBillCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="出库类别" align="center" prop="outBillCategory" minWidth="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_outbill_type" :value="scope.row.outBillCategory" />
          </template>
        </el-table-column>
        <el-table-column label="出库状态" align="center" prop="outBillStatus" minWidth="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_outbill_status" :value="scope.row.outBillStatus" />
          </template>
        </el-table-column>
        <el-table-column label="运货车牌号" align="center" prop="freightVehicleNo" minWidth="120" show-overflow-tooltip />
        <el-table-column label="收货地址" align="center" prop="receiveAddress" minWidth="150" show-overflow-tooltip />
        <el-table-column label="出库时间" align="center" prop="outBillTime" width="150">
          <!-- <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.outBillTime, '{y}-{m}-{d}') }}</span>
                          </template> -->
        </el-table-column>
        <el-table-column label="制单时间" align="center" prop="createTime" width="150">

        </el-table-column>

        <el-table-column label="操作" align="center" width="150" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-show="scope.row.outBillStatus == 1" icon="el-icon-edit"
              @click="handleUpdate(scope.row)" v-hasPermi="['outbound:outbill:edit']">修改</el-button>
            <el-button size="mini" type="text" v-show="scope.row.outBillStatus == 1" icon="el-icon-delete"
              @click="updateStatus({ id: scope.row.id, outBillStatus: 4,outBillCode:scope.row.outBillCode })"
              v-hasPermi="['outbound:outbill:edit']">作废</el-button>
            <el-button size="mini" type="text" icon="el-icon-view"
              v-show="scope.row.outBillStatus != 1" @click="showDetail(scope.row)"
              v-hasPermi="['warehousing:outbill:list']">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- 打印出库单对话框 -->
    <el-dialog :visible.sync="open3" append-to-body width="60%">
      <div style="text-align:center; font-size: 30px;height: 100px;">
        <div class="print-title">出库单</div>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-col :span="7" >
          <el-form-item label="出库单号" prop="outBillCode">{{ form.outBillCode }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="出库类别">
            {{ form.outBillCategory }}
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="制单人" prop="createBy">{{ form.createBy }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制单时间" prop="createTime">{{ form.createTime }}
          </el-form-item>
        </el-col>

        <el-form-item style="width: 100%;float: unset;" label="" />
        <el-col :span="24"><el-form-item></el-form-item></el-col>
        <el-divider content-position="center">出库单货物信息</el-divider>
        <el-table :data="outbillGoodsList" :row-class-name="rowOutbillGoodsIndex" height="35vh"
           ref="outbillGoods">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
          </el-table-column>
          <el-table-column label="出库数量" align="center" prop="outBillNum" minWidth="100">
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printData">下 载</el-button>
        <el-button @click="open3=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改出库单信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" @before-close="cancel" append-to-body width="75%">
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-col :span="12" v-show="form.outBillCode ? true : false">
          <el-form-item label="出库单号" prop="outBillCode">
            <el-input disabled v-model="form.outBillCode" placeholder="请输入出库单号" show-word-limit maxlength="255" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="出库类别" prop="outBillCategory">
            <el-select disabled style="width: 100%;" v-model="form.outBillCategory" filterable placeholder="请选择出库类别">
              <el-option v-for="dict in dict.type.wms_outbill_type" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运货车牌号" prop="freightVehicleNo">
            <el-select style="width: 100%;" v-model="form.freightVehicleNo" filterable placeholder="请选择运货车辆">
              <el-option v-for="dict in vehicleList" :key="dict.value" :label="dict.label"
                :value="dict.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货地址" prop="receiveAddress">
            <el-select style="width: 100%;" v-model="form.receiveAddress" filterable placeholder="请选择收货地址">
              <el-option v-for="dict in addressList" :key="dict.value" :label="dict.label"
                :value="dict.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容" show-word-limit
              maxlength="200" />
          </el-form-item>
        </el-col>
        <el-form-item style="width: 100%;float: unset;" label="" />
        <el-divider content-position="center">出库单货物信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddOutbillGoods">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteOutbillGoods">删除</el-button>
          </el-col>
        </el-row>
        <el-table :row-key="getRow" :data="outbillGoodsList" :row-class-name="rowOutbillGoodsIndex" height="30vh"
          @selection-change="handleOutbillGoodsSelectionChange" ref="outbillGoods">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="库位编码" align="center" prop="locationCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="货物唯一码" align="center" prop="onlyCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="托盘号" align="center" prop="trayCode" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="出库数量" align="center" prop="outBillNum" minWidth="100">
          </el-table-column>
        </el-table>
        <pagination v-show="detailGoods.total > 0" :total="detailGoods.total" :page.sync="detailGoods.queryParams.pageNum"
          :limit.sync="detailGoods.queryParams.pageSize" @pagination="getDetailGoodsList2" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 出库单号点击查看出库单信息对话框 -->
    <el-dialog title="出库单信息" :visible.sync="open1" append-to-body width="75%">
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-col :span="12" v-show="form.outBillCode ? true : false">
          <el-form-item label="出库单号" prop="outBillCode">
            <el-input disabled v-model="form.outBillCode" placeholder="请输入出库单号" show-word-limit maxlength="255" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item  label="出库类别" prop="outBillCategory">
            <el-select disabled style="width: 100%;" v-model="form.outBillCategory" filterable placeholder="请选择出库类别">
              <el-option v-for="dict in dict.type.wms_outbill_type" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="form.outBillCategory!='4'" :span="12">
          <el-form-item  label="运货车牌号" prop="freightVehicleNo">
            <el-select disabled style="width: 100%;" v-model="form.freightVehicleNo" filterable placeholder="请选择运货车辆">
              <el-option v-for="dict in vehicleList" :key="dict.value" :label="dict.label"
                :value="dict.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="form.outBillCategory!='4'" :span="12">
          <el-form-item  label="收货地址" prop="receiveAddress">
            <el-select disabled style="width: 100%;" v-model="form.receiveAddress" filterable placeholder="请选择收货地址">
              <el-option v-for="dict in addressList" :key="dict.value" :label="dict.label"
                :value="dict.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item disabled label="备注" prop="remark">
            <el-input disabled v-model="form.remark" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容" show-word-limit
              maxlength="200" />
          </el-form-item>
        </el-col>
        <el-form-item style="width: 100%;float: unset;" label="" />
        <el-divider content-position="center">出库单货物信息</el-divider>
        <el-table :data="outbillGoodsList" :row-class-name="rowOutbillGoodsIndex" height="33vh"
           ref="outbillGoods">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="库位编码" align="center" prop="locationCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="唯一码" align="center" prop="onlyCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="出库数量" align="center" prop="outBillNum" minWidth="100">
          </el-table-column>
        </el-table>
        <pagination v-show="detailGoods.total > 0" :total="detailGoods.total" :page.sync="detailGoods.queryParams.pageNum"
          :limit.sync="detailGoods.queryParams.pageSize" @pagination="getDetailGoodsList2" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open1=false;">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 入库货物信息选择列表 -->
    <el-dialog title="货物选择" :visible.sync="selectGoods.open" @close="selectGoodsDialogClose" append-to-body width="65%">
      <el-form :model="selectGoods.queryParams"  @submit.native.prevent   ref="selectGoods.queryForm" size="small" :inline="true"
        v-show="showSearch" label-width="68px" style="padding-left: 10px;">
        <el-form-item label="货位编码" prop="locationCode">
          <el-input v-model="selectGoods.queryParams.locationCode" placeholder="请输入货位编码" clearable  @keyup.enter.native="getSelectGoodsList" />
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsName">
          <el-input v-model="selectGoods.queryParams.goodsName" placeholder="请输入货物名称" clearable  @keyup.enter.native="getSelectGoodsList" />
        </el-form-item>
        <el-form-item label="机件号" prop="partsCode">
          <el-input v-model="selectGoods.queryParams.partsCode" placeholder="请输入机件号" clearable @keyup.enter.native="getSelectGoodsList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getSelectGoodsList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetSelectQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
        <template>
          <el-alert
            v-if="this.selectGoods.selectGoodsList.length>0"
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
        <el-table v-loading="loading"
                  :data="selectGoods.goodsInfoList"
                  ref="multipleTable"
                  :row-key="getRowKey"
                  @selection-change="handleSelectionChangeGoods">
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
          <!-- <el-table-column label="批次" align="center" prop="charg" /> -->
          <el-table-column label="货位号" align="center" prop="locationCode" show-overflow-tooltip />
          <el-table-column label="唯一码" align="center" prop="onlyCode" show-overflow-tooltip />
          <el-table-column label="机件号" align="center" prop="partsCode" show-overflow-tooltip />
          <!-- <el-table-column label="货物编码" align="center" prop="goodsCode" /> -->
          <el-table-column label="托盘编号" align="center" prop="trayCode" />
          <el-table-column label="货物名称" align="center" prop="goodsName" show-overflow-tooltip />
          <el-table-column label="规格型号" align="center" prop="model" show-overflow-tooltip />
          <el-table-column label="计量单位" align="center" prop="measureUnit">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="库位名称" align="center" prop="locationName" />
                <el-table-column label="货物数量" align="center" prop="goodsNum" /> -->
        </el-table>
        <pagination v-show="selectGoods.total > 0" :total="selectGoods.total" :page.sync="selectGoods.queryParams.pageNum"
          :limit.sync="selectGoods.queryParams.pageSize" @pagination="getSelectGoodsList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormGoods">确 定</el-button>
        <el-button @click="selectGoods.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看出库单详情对话框 -->
    <el-dialog title="出库单详情" :visible.sync="detail.open" append-to-body width="75%">
      <el-form ref="form" :model="detail.form" label-width="98px">
        <el-col :span="12">
          <el-form-item label="出库单号" prop="outBillCode">{{ detail.form.outBillCode }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出库类别" prop="outBillCategory">
            <dict-tag :options="dict.type.wms_outbill_type" :value="detail.form.outBillCategory" />
          </el-form-item>
        </el-col>
        <el-form-item style="width: 100%;float: unset;" label="" />
        <el-divider content-position="center">出库单货物信息</el-divider>
        <el-form :model="detail.queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px" style="padding-left: 10px;">
          <el-form-item label="" prop="goodsCode">
            <el-input v-model="detail.queryParams.goodsCode" placeholder="关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getDetailGoodsList">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDetailQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="detail.outbillGoodsList" :row-class-name="rowOutbillGoodsIndex" height="38vh" ref="outbillGoods">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="批次号" align="center" prop="charg" minWidth="150" show-overflow-tooltip />
          <el-table-column label="库位编码" align="center" prop="locationCode" minWidth="120" show-overflow-tooltip/>
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip />
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip />
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="100" show-overflow-tooltip />
          <!-- <el-table-column label="货位编码" align="center" prop="locationCode" minWidth="100" show-overflow-tooltip /> -->
          <el-table-column label="托盘编码" align="center" prop="trayCode" minWidth="100" show-overflow-tooltip />
          <el-table-column label="出库数量" align="center" prop="outBillNum" minWidth="100" />
          <el-table-column label="拣货数量" align="center" prop="num" minWidth="100" />
          <!-- <el-table-column label="拣货完成时间" align="center" prop="outBillTime" minWidth="150" /> -->
          <el-table-column label="货物唯一码" align="center" width="100" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-view"  @click="showGoodsDetail(scope.row)"
                v-hasPermi="['warehousing:outbill:list']">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="detail.total > 0" :total="detail.total" :page.sync="detail.queryParams.pageNum"
          :limit.sync="detail.queryParams.pageSize" @pagination="getDetailGoodsList" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detail.open = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看出库单详情唯一码对话框 -->
    <el-dialog title="唯一码详情" :visible.sync="detail1.open" append-to-body width="65%">
        <el-form :model="detail1.queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px" style="padding-left: 10px;">
          <el-form-item label="" prop="goodsName">
            <el-input v-model="detail1.queryParams.goodsName" placeholder="关键词" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getDetailGoodsList1">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDetailQuery1">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="detail1.outbillGoodsList" :row-class-name="rowOutbillGoodsIndex" height="38vh" ref="outbillGoods">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="唯一码" align="center" prop="onlyCode" minWidth="100" show-overflow-tooltip />
          <el-table-column label="机件号" align="center" prop="partsCode" minWidth="100" show-overflow-tooltip />
          <el-table-column label="货物编码" align="center" prop="goodsCode" minWidth="150" show-overflow-tooltip />
          <el-table-column label="货物名称" align="center" prop="goodsName" minWidth="150" show-overflow-tooltip />
          <el-table-column label="计量单位" align="center" prop="measureUnit" minWidth="100">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit" />
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="model" minWidth="100" show-overflow-tooltip />
        </el-table>
        <pagination v-show="detail1.total > 0" :total="detail1.total" :page.sync="detail1.queryParams.pageNum"
          :limit.sync="detail1.queryParams.pageSize" @pagination="getDetailGoodsList1" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="detail1.open = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  geCanOutGoodsList,
  listOutbill,
  getOutbill,
  addOutbill,
  updateOutbill,
  getAddressList,
  getPrintData,
  getVehicleList,
  getGoodsList,
  getDetailGoodsList,
  getDetailGoodsList1,
  getDetailGoodsList2,
  getDetailGoodsList3,
  removeDetail,
  delOutbill
} from '@/api/wms/outbound/outbill'
import { delTransfer } from '@/api/wms/basics/transfer'
export default {
  name: "Outbill",
  dicts: ['wms_outbill_type', 'wms_outbill_status', 'wms_metering_unit'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedOutbillGoods: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 出库单信息表格数据
      outbillList: [],
      // 出库单货物表格数据
      outbillGoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否行项目点击后显示弹出层
      open1: false,
      // 是否打印窗口显示弹出层
      open3: false,
      // 出库时间范围
      daterangeOutBillTime: [],
      // 制单时间范围
      daterangeCreateTime: [],
      // 地址选择
      addressList: [],
      // 车辆选择
      vehicleList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outBillCode: null,
        outBillStatus: null,
        outBillTime: null,
        outBillCategory: null,
        freightVehicleNo: null,
        receiveAddress: null,
        issuingUnit: null,
        shippingType: null,
        receivingUnit: null,
        issuingBasis: null,
        address: null,
        outBillNo: null,
        createTime: null,
      },
      selectGoodsTitle:'未选中任何数据',
      //选择货物弹窗参数
      selectGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
          lockStatus: 0
        },
        goodsInfoList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
        selectGoodsList: [],//选中的货物数据
      },
      //查看唯一码弹详情窗参数
      detail1: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
        },
        outbillGoodsList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
      },
      //查看唯一码弹详情窗参数
      detailGoods: {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          outBillCode: null,
        },
        total: 0,
      },
      //查看详情弹窗参数
      detail: {
        form: {

        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsCode: null,
        },
        outbillGoodsList: [],
        // 是否显示弹出层
        open: false,
        loading: false,
        total: 0,
      },
      deleteList : [],//选择的删除数据id
      viewForm: {},
      viewModalOpen: false,
      // 表单参数
      form: {
        outBillCategory:'1'
      },
      // 表单校验
      rules: {

        outBillCategory: [
          { required: true, message: "出库类别不能为空", trigger: "change" }
        ],
        freightVehicleNo: [
          { required: true, message: "运货车牌号不能为空", trigger: "blur" }
        ],
        receiveAddress: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
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
    //页面初始化
    initData() {
      getAddressList().then(response => {
        this.addressList = response.data;
      })
      getVehicleList().then(response => {
        this.vehicleList = response.data;
      })
    },
    getRow(row){
        return row.id;
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );
      })
    },
    /** 查询出库单信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeOutBillTime && '' != this.daterangeOutBillTime) {
        this.queryParams.params["beginOutBillTime"] = this.daterangeOutBillTime[0];
        this.queryParams.params["endOutBillTime"] = this.daterangeOutBillTime[1];
      }
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listOutbill(this.queryParams).then(response => {
        this.outbillList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.deleteList=[]
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        outBillCategory:'1'
      };
      this.outbillGoodsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeOutBillTime = [];
      this.daterangeCreateTime = [];
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
      this.title = "添加出库单信息";
    },
    // 查看详情
    showDetail(data) {
      this.detail.form = data;
      this.detail.queryParams = { pageNum: 1, pageSize: 10, goodsCode: null, outBillCode: data.outBillCode }
      this.detail.outbillGoodsList = []
      this.getDetailGoodsList();
      this.detail.open = true
    },
    // 查看唯一码详情
    showGoodsDetail(data) {
      this.detail1.queryParams = { pageNum: 1, pageSize: 10, goodsCode: data.goodsCode, outBillCode: data.outBillCode }
      this.detail1.outbillGoodsList = []
      this.getDetailGoodsList1();
      this.detail1.open = true
    },
    //重置查询详情
    resetDetailQuery() {
      this.detail.queryParams.goodsCode = null
      this.detail.outbillGoodsList = []
      this.getDetailGoodsList();
    },
    //查询详情数据
    getDetailGoodsList() {
      getDetailGoodsList(this.detail.queryParams).then(res => {
        this.detail.outbillGoodsList = res.rows
        this.detail.total = res.total
      })
    },
    //行项目点击查询详情数据
    getDetailGoodsList2() {
      this.detailGoods.queryParams.ids = this.deleteList
      getDetailGoodsList2(this.detailGoods.queryParams).then(res => {
        this.outbillGoodsList = res.rows
        this.detailGoods.total = res.total
      })
    },
    //重置唯一码查询详情
    resetDetailQuery1() {
      this.detail1.queryParams.goodsName = null
      this.detail1.outbillGoodsList = []
      this.getDetailGoodsList1();
    },
    //查询详情数据
    getDetailGoodsList1() {
      getDetailGoodsList1(this.detail1.queryParams).then(res => {
        this.detail1.outbillGoodsList = res.rows
        this.detail1.total = res.total
      })
    },
    /** 打印入库单按钮操作 */
    handlePrint() {
      this.reset();
      const id = this.ids[0]
      getPrintData(id).then(response => {
        this.form = response.data;
        this.form.url = process.env.VUE_APP_BASE_API + this.form.url;
        this.outbillGoodsList = response.data.outbillGoodsList
        this.open3 = true;
      });
    },
    selectGoodsDialogClose(){
      this.selectGoods.queryParams = { pageNum: 1, pageSize: 10 };
      this.$refs.multipleTable.clearSelection();
    },
    onClearSelected(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //打印数据
    printData(){
      this.downloadPdf('outbound/outbill/printData', {
        ...this.form
      }, `出库单信息${new Date().getTime()}.pdf`)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOutbill(id).then(response => {
        this.form = response.data;
        this.detailGoods.queryParams={pageNum:1,pageSize:10}
        this.detailGoods.queryParams.outBillCode = this.form.outBillCode
        this.getDetailGoodsList2();
        this.open = true;
        this.title = "修改出库单信息";
      });
    },
    /** 出库单号按钮操作 */
    getDetail(row) {
      this.reset();
      const id = row.id || this.ids
      getOutbill(id).then(response => {
        this.form = response.data;
        this.detailGoods.queryParams={pageNum:1,pageSize:10}
        this.detailGoods.queryParams.outBillCode = this.form.outBillCode
        this.getDetailGoodsList2();
        this.open1 = true;
      });
    },
    //作废
    updateStatus(data) {
      this.$modal.confirm('是否确认作废该记录？').then(function () {
        return updateOutbill(data);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("操作成功");
      }).catch(() => { });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.outbillGoodsList.length==0){
            this.$modal.msgError("请先维护出库单详情数据");
            return;
          }
          this.form.outbillGoodsList = this.outbillGoodsList;
          if (this.form.id != null) {
            this.form.ids = this.deleteList
            this.deleteList = []
            updateOutbill(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOutbill(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 出库单货物序号 */
    rowOutbillGoodsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 出库单货物添加按钮操作 */
    handleAddOutbillGoods() {
      //加载货物数据
      this.getSelectGoodsList();
      this.selectGoods.open = true
    },
    //加载货物数据列表
    getSelectGoodsList() {
      this.selectGoods.loading = true;
      this.selectGoods.queryParams.ids = this.deleteList;
      geCanOutGoodsList(this.selectGoods.queryParams).then(response => {
        this.selectGoods.goodsInfoList = response.rows;
        this.selectGoods.total = response.total;
        this.selectGoods.loading = false;
      })
    },
    getRowKey(row){
      return row.id
    },
    // 多选框选中数据
    handleSelectionChangeGoods(selection) {
      this.selectGoods.selectGoodsList = selection.map(item => item);
      if(selection.length>0){
        this.selectGoodsTitle = '已选中 '+  selection.length +' 条记录(可跨页)'
      }else {
        this.selectGoodsTitle ='未选中任何数据'
      }
    },
    //确认选择货物
    submitFormGoods() {
      if (this.selectGoods.selectGoodsList.length == 0) {
        this.$modal.msgError("请选择添加的货物数据");
        return;
      }
      this.selectGoods.open = false;
      this.selectGoods.selectGoodsList.forEach(element => {
        element.outBillNum = 1;
        element.id = null;
        let isHav = false;
        this.outbillGoodsList.forEach(item => {
          if (item.onlyCode == element.onlyCode) {
            isHav = true;
          }
        })
        if (!isHav) {
          this.outbillGoodsList.push(element)
        }
      });
      this.$refs.multipleTable.clearSelection();
    },
    //重置查询货物列表
    resetSelectQuery() {
      this.selectGoods.queryParams = { pageNum: 1, pageSize: 10 }
      this.getSelectGoodsList();
    },
    /** 出库单货物删除按钮操作 */
    handleDeleteOutbillGoods() {
      if (this.checkedOutbillGoods.length == 0) {
        this.$modal.msgError("请先选择要删除的出库单货物数据");
      } else {
        const outbillGoodsList = this.outbillGoodsList;
        const checkedOutbillGoods = this.checkedOutbillGoods;
        this.outbillGoodsList = outbillGoodsList.filter(function (item) {
          return checkedOutbillGoods.indexOf(item.index) == -1
        });
        let ids = []
        this.checkedOutbillGoodsList.forEach(item => {
          if(item.id){
            ids.push(item.id)
            this.deleteList.push(item.id);
          }
        })
        if(ids.length>0){
          this.getDetailGoodsList2();
        }
      }
    },
    /** 复选框选中数据 */
    handleOutbillGoodsSelectionChange(selection) {
      this.checkedOutbillGoods = selection.map(item => item.index)
      this.checkedOutbillGoodsList = selection.map(item => item)
    },

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
.demo-image .block {
  padding: 10px 0;
  text-align: center;
  border: solid 1px;
  display: inline-block;
  width: 32%;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 5px;
  margin-bottom: 10px;
}

.demo-image .block:last-child {
  margin-right: none;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-bottom: 5px;
  height: 32px;
}

.demo-image .code {
  font-size: 16px;
  font-weight: bolder;
  margin-bottom: 5px;
  height: 40px;
}
.print-box {
  display: flex;
  justify-content: flex-end;
  margin-top: -50px;
}

.print-title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
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
