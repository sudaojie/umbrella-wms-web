<template>
  <div class="app-container" style="background-color: #f0f2f5;">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;" >
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="96px" style="padding-left: 10px;">
        <el-form-item label="货物分类编码" prop="goodsCode">
          <el-input
            v-model="queryParams.goodsCode"
            placeholder="请输入货物分类编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物分类名称" prop="goodsName">
          <el-input
            v-model="queryParams.goodsName"
            placeholder="请输入货物分类名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="货物类别" prop="goodsCategoryId">

          <el-select style="width: 100%;" v-model="queryParams.goodsCategoryId"  placeholder="请选择货物类别" filterable clearable>
            <el-option
              v-for="item in goodsCategoryData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="启用状态" prop="enableStatus">
          <el-select v-model="queryParams.enableStatus" filterable placeholder="请选择启用状态" clearable>
            <el-option
              v-for="dict in dict.type.wms_enable_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
            v-hasPermi="['basics:goodsinfo:add']"
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
            v-hasPermi="['basics:goodsinfo:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['basics:goodsinfo:export']"
          >全部导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="goodsinfoList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="编号" align="center" prop="id" /> -->
        <el-table-column label="货物类别" minWidth="200" align="center" prop="goodsCategoryId" show-overflow-tooltip/>
        <el-table-column label="货物分类编码" width="180" align="center" prop="goodsCode" show-overflow-tooltip/>
        <el-table-column label="货物分类名称" width="180" align="center" prop="goodsName" show-overflow-tooltip/>
        <el-table-column label="货物分类简称" width="180" align="center" prop="goodsSimpleName" show-overflow-tooltip/>
        <el-table-column label="规格型号" width="150" align="center" prop="model" show-overflow-tooltip/>
        <!-- <el-table-column label="所属仓库" width="150" align="center" prop="warehouseId" show-overflow-tooltip/>
        <el-table-column label="所属库区" width="150" align="center" prop="areaId" show-overflow-tooltip/> -->
        <el-table-column label="计量单位" width="100" align="center" prop="measureUnit">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_metering_unit" :value="scope.row.measureUnit"/>
          </template>
        </el-table-column>
        <el-table-column label="包装方式" align="center" prop="packing" show-overflow-tooltip/>
        <el-table-column label="长(cm)" align="center" prop="length" />
        <el-table-column label="宽(cm)" align="center" prop="width" />
        <el-table-column label="高(cm)" align="center" prop="height" />
        <el-table-column label="体积(m³)" align="center" prop="volume" >
          <template slot-scope="scope">
            <span>{{ scope.row.volume?(scope.row.volume+'').substr(0,(scope.row.volume+'').indexOf('.')+3):0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="堆放数量(个)" minWidth="180" align="center" prop="num" />
        <el-table-column label="重量(kg)" align="center" prop="weight" />
        <!-- <el-table-column label="最高库存" align="center" prop="inventoryCountMax" />
        <el-table-column label="最低库存" align="center" prop="inventoryCountMin" />
        <el-table-column label="质保期" align="center" prop="warranty" /> -->
        <el-table-column label="启用状态" width="100" fixed="right" align="center" prop="enableStatus">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enableStatus"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" minWidth="180" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['basics:goodsinfo:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['basics:goodsinfo:remove']"
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

    <!-- 添加或修改货物信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="货物分类编码" prop="goodsCode">
          <el-input :disabled="form.id?true:false" v-model="form.goodsCode" placeholder="请输入货物分类编码" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="货物分类名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入货物分类名称" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="货物分类简称" prop="goodsSimpleName">
          <el-input v-model="form.goodsSimpleName" placeholder="请输入货物分类简称" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入规格型号" show-word-limit maxlength="20"/>
        </el-form-item>

        <!-- <el-form-item label="所属仓库" prop="warehouseId">
          <el-select style="width: 100%;" filterable v-model="form.warehouseId" @change="$forceUpdate(),getAreaByWarehouse(form)" @blur="getAreaByWarehouse(form)" placeholder="请选择所属仓库"  clearable>
            <el-option
              v-for="item in warehouseData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属库区" prop="areaId">
          <el-select style="width: 100%;" filterable v-model="form.areaId" placeholder="请选择所属库区"  clearable>
            <el-option
              v-for="item in areaData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="货物类别" prop="goodsCategoryId">
          <el-select style="width: 99%;" v-model="form.goodsCategoryId"  placeholder="请选择货物类别" filterable clearable>
            <el-option
              v-for="item in goodsCategoryData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计量单位" prop="measureUnit">
          <el-select style="width: 99%;" v-model="form.measureUnit" filterable placeholder="请选择计量单位">
            <el-option
              v-for="dict in dict.type.wms_metering_unit"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包装方式" prop="packing">
          <el-input v-model="form.packing" placeholder="请输入包装方式" show-word-limit maxlength="20"/>
        </el-form-item>
        <!-- <el-form-item label="货物条码" prop="goodsBarcode">
          <el-input v-model="form.goodsBarcode" placeholder="请输入货物条码" show-word-limit maxlength="20"/>
        </el-form-item> -->

        <el-form-item label="长(cm)" prop="length">
          <el-input-number style="width: 100%;" :min="0" :max="9999" v-model="form.length" placeholder="请输入长(cm)" @blur="countArea(form)" show-word-limit maxlength="5"/>
        </el-form-item>
        <el-form-item label="宽(cm)" prop="width">
          <el-input-number style="width: 100%;" :min="0" :max="9999" v-model="form.width" placeholder="请输入宽(cm)" @blur="countArea(form)" show-word-limit maxlength="5"/>
        </el-form-item>
        <el-form-item label="高(cm)" prop="height">
          <el-input-number style="width: 100%;" :min="0" :max="9999" v-model="form.height" placeholder="请输入高(cm)" @blur="countArea(form)" show-word-limit maxlength="5"/>
        </el-form-item>
        <el-form-item label="体积(m³)" prop="volume">
          <el-input-number style="width: 100%;" :min="0" :max="9999" disabled v-model="form.volume" placeholder="请输入体积" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="堆放数量(个)" prop="num">
          <el-input-number style="width: 100%;" :min="0" :max="9999" v-model="form.num" placeholder="请输入堆放数量" show-word-limit maxlength="20"/>
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input-number style="width: 100%;" :min="0" :max="9999" v-model="form.weight" placeholder="请输入重量(kg)" show-word-limit maxlength="255"/>
        </el-form-item>
        <el-form-item label="最高库存" prop="inventoryCountMax">
          <el-input-number style="width: 100%;" :min="0" :max="999999" v-model="form.inventoryCountMax" placeholder="请输入最高库存" show-word-limit maxlength="11"/>
        </el-form-item>
        <el-form-item label="最低库存" prop="inventoryCountMin">
          <el-input-number style="width: 100%;" :min="0" :max="999999" v-model="form.inventoryCountMin" placeholder="请输入最低库存" show-word-limit maxlength="11"/>
        </el-form-item>
        <el-form-item label="质保期(月)" prop="warranty">
          <el-input-number style="width: 100%;" :min="0" :max="99999" v-model="form.warranty" placeholder="请输入质保期" show-word-limit maxlength="11"/>
        </el-form-item>

        <el-form-item style="width: 100%;" label="备注" prop="remark">
          <el-input v-model="form.remark"
                    type="textarea"
                    :autosize="{minRows:3}"
                    placeholder="请输入内容"
                    show-word-limit
                    maxlength="200" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 货物信息-导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-select style="width: 100%;margin-bottom: 10px;" v-model="upload.goodsCategoryId"  placeholder="请选择货物类别" filterable clearable>
        <el-option
          v-for="item in goodsCategoryData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport+ '&supplierId=' + upload.supplierId+ '&goodsCategoryId=' + upload.goodsCategoryId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :on-change="uploadFile"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGoodsinfo, getGoodsinfo, delGoodsinfo, addGoodsinfo, updateGoodsinfo,checkData,getGoodscategoryData,getSupplierData,getWarehouseData,getAreaData } from "@/api/wms/basics/goodsinfo";
import { getToken } from "@/utils/auth";
export default {
  name: "Goodsinfo",
  dicts: ['wms_metering_unit', 'wms_enable_status'],
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
      // 货物信息表格数据
      goodsinfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsCode: null,
        goodsName: null,
        goodsSimpleName: null,
        model: null,
        goodsCategoryId: null,
        measureUnit: null,
        packing: null,
        goodsBarcode: null,
        supplierId: null,
        length: null,
        width: null,
        height: null,
        volume: null,
        weight: null,
        inventoryCountMax: null,
        inventoryCountMin: null,
        warranty: null,
        enableStatus: null,
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
        url: process.env.VUE_APP_BASE_API + "/basics/goodsinfo/importData",
        goodsCategoryId:'',
        supplierId:''
      },
      goodsCategoryData:[],//货物类别数据集合
      warehouseData:[],//所属仓库
      areaData:[],//所属库区
      supplierData:[],
      viewForm:{},
      viewModalOpen:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsCode: [
          { required: true, message: "货物编码不能为空", trigger: "blur" }
        ],
        goodsName: [
          { required: true, message: "货物名称不能为空", trigger: "blur" }
        ],
        goodsSimpleName: [
          { required: true, message: "货物简称不能为空", trigger: "blur" }
        ],
        model: [
          { required: true, message: "规格型号不能为空", trigger: "blur" }
        ],
        goodsCategoryId: [
          { required: true, message: "货物类别不能为空", trigger: "blur" }
        ],
        measureUnit: [
            { required: true, message: "计量单位不能为空", trigger: "change" }
        ],
        num: [
            { required: true, message: "堆放数量不能为空", trigger: "blur" }
        ],

        length: [
            { required: true, message: "长不能为空", trigger: "blur" }
        ],
        width: [
            { required: true, message: "宽不能为空", trigger: "blur" }
        ],
        height: [
            { required: true, message: "高不能为空", trigger: "blur" }
        ],
        volume: [
          { required: true, message: "体积不能为空", trigger: "blur" }
        ],
        weight: [
          { required: true, message: "重量不能为空", trigger: "blur" }
        ],
        areaId: [
          { required: true, message: "所属库区不能为空", trigger: "blur" }
        ],
        warehouseId: [
          { required: true, message: "所属仓库不能为空", trigger: "blur" }
        ],
        inventoryCountMax: [
            { required: true, message: "最高库存不能为空", trigger: "blur" }
        ],
        inventoryCountMin: [
            { required: true, message: "最低库存不能为空", trigger: "blur" }
        ],
        warranty: [
            { required: true, message: "质保期不能为空", trigger: "blur" }
        ],
        enableStatus: [
          { required: true, message: "启用状态不能为空", trigger: "change" }
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
    //初始化选择框
    initData(){
      getGoodscategoryData().then(res => {
        this.goodsCategoryData = res.data
      })
      // getWarehouseData().then(res => {
      //   this.warehouseData=res.data
      // })
    },
    //根据所选仓库加载库区数据
    getAreaByWarehouse(data){
      data.areaId='';
      getAreaData({warehouseId:data.warehouseId,areaType:0,id:(data.id?data.id:1)}).then(res => {
        this.areaData=res.data
      })
    },
    //表格动态高度
    setTableGeight(){
      this.$nextTick(( ) => {
        const height = window.innerHeight
        this.tableHeight = (height - this.$refs.top.offsetHeight - 240 );

      })
    },
    /** 查询货物信息列表 */
    getList() {
      this.loading = true;
      listGoodsinfo(this.queryParams).then(response => {
        this.goodsinfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //计算体积
    countArea(data){
      if(data.length&&data.width&&data.height){
        data.volume=parseFloat((data.length*data.width*data.height)/1000000).toFixed(2);
      }
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
        goodsCode: null,
        goodsName: null,
        goodsSimpleName: null,
        model: null,
        goodsCategoryId: null,
        measureUnit: null,
        packing: null,
        goodsBarcode: null,
        supplierId: null,
        length: null,
        width: null,
        height: null,
        volume: null,
        weight: null,
        inventoryCountMax: null,
        inventoryCountMin: null,
        warranty: null,
        enableStatus: null,
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
      this.title = "添加货物分类信息";
    },
    /** 详情按钮操作 */
    handleView(row){
      const id = row.id;
      getGoodsinfo(id).then(response => {
        this.viewForm = response.data;
        this.viewModalOpen = true;
        this.title = "货物分类信息-详情";
      });
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.enableStatus === "0" ? "启用" : "禁用";
      this.$modal.confirm('确认要' + text  + row.goodsName + '货物吗？').then(function() {
        return updateGoodsinfo({id:row.id,enableStatus:row.enableStatus});
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.enableStatus = row.enableStatus === "0" ? "1" : "0";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGoodsinfo(id).then(response => {
        this.form = response.data;
        // getAreaData({warehouseId:this.form.warehouseId,areaType:0,id:(this.form.id?this.form.id:1)}).then(res => {
        //   this.areaData=res.data
        // })
        this.open = true;
        this.title = "修改货物信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          checkData(this.form).then(res => {
            if(res.code==200){
              if (this.form.id != null) {
                updateGoodsinfo(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                addGoodsinfo(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }
            }
          })
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该记录？').then(function() {
        return delGoodsinfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basics/goodsinfo/export', {
        ...this.queryParams
      }, `goodsinfo_${new Date().getTime()}.xlsx`)
    },
  }
};
</script>
<style scoped>
.el-dialog__wrapper>>>.el-form-item{
  width: 50%;
  float: left;
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
