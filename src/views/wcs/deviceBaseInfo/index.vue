<template>
  <div class="app-container">
    <div style="background-color: white;border-radius: 10px;" ref="top">
      <div style="font-size: 14px;font-weight: 600;padding: 5px 5px 5px 10px;border-bottom: 1px solid rgb(226, 226, 226);
      margin-bottom: 15px;background: #f9f9f9;border-radius: 10px 10px 0px 0px;color: #00000091;">
        <i class="el-icon-search" style="padding-right: 5px;"></i>查询条件
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px"
               style="padding-left: 10px;">
        <el-form-item label="设备编号" prop="deviceNo">
          <el-input
            v-model="queryParams.deviceNo"
            placeholder="请输入设备编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="地址码" prop="deviceAddress">
          <el-input
            v-model="queryParams.deviceAddress"
            placeholder="请输入地址码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备IP" prop="deviceIp">
          <el-input
            v-model="queryParams.deviceIp"
            placeholder="请输入设备IP"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备区域" prop="deviceArea">
          <el-select v-model="queryParams.deviceArea" filterable placeholder="请输入设备区域" clearable>
            <el-option
              v-for="dict in dict.type.wms_area_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="queryParams.deviceType" filterable placeholder="请输入设备类型" clearable>
            <el-option
              v-for="dict in dict.type.device_type"
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
            v-hasPermi="['wcs:deviceBaseInfo:add']"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['wcs:deviceBaseInfo:remove']"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-eye"
            size="mini"
            @click="targetGateWayRealtion"
          >维护网关采集器和设备关系
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-eye"
            size="mini"
            @click="targetRealtion"
          >维护新风和温湿度传感器关系
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-eye"
            size="mini"
            @click="targetMeterRealtion"
          >维护电表和设备关系
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['wcs:deviceBaseInfo:export']"
          >导出
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="infoList" :height="tableHeight" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="设备编号" align="center" prop="deviceNo" show-overflow-tooltip/>
        <el-table-column label="设备名称" align="center" prop="deviceName" show-overflow-tooltip/>
        <el-table-column label="设备区域" align="center" prop="deviceArea" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wms_area_type" :value="scope.row.deviceArea"/>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" align="center" prop="deviceType" show-overflow-tooltip>
          <template slot-scope="scope">
            <dict-tag :options="dict.type.device_type" :value="scope.row.deviceType"/>
          </template>
        </el-table-column>
        <el-table-column label="地址码" align="center" prop="deviceAddress" show-overflow-tooltip/>
        <el-table-column label="设备IP" align="center" prop="deviceIp" show-overflow-tooltip/>
        <el-table-column label="设备端口" align="center" prop="devicePort" show-overflow-tooltip/>
        <el-table-column label="启用状态" align="center" prop="enableStatus">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enableStatus"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['wcs:deviceBaseInfo:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['wcs:deviceBaseInfo:remove']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 添加或修改WCS设备基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="24">
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input v-model="form.deviceNo" placeholder="请输入设备编号" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="form.deviceName" placeholder="请输入设备名称" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="form.deviceType" @change="editDeviceTypeChange" filterable placeholder="请输入设备类型"
                       clearable style="width: 260px !important;">
              <el-option
                v-for="dict in dict.type.device_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备区域" prop="deviceArea">
            <el-select v-model="form.deviceArea" filterable placeholder="请输入设备区域" clearable>
              <el-option
                v-for="dict in dict.type.wms_area_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isShowDeviceIpAndPort">
          <el-form-item label="地址码" prop="deviceAddress">
            <el-input v-model="form.deviceAddress" placeholder="请输入地址码" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="isShowDeviceIpAndPort">
          <el-form-item label="设备IP" prop="deviceIp">
            <el-input v-model="form.deviceIp" placeholder="请输入设备IP" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2" v-if="isShowDeviceIpAndPort">
          <el-form-item label="设备端口" prop="devicePort">
            <el-input-number v-model="form.devicePort" placeholder="请输入设备端口" style="width: 223px !important"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="isStackerFlag">
          <el-form-item label="运行状态" prop="runningStatus">
            <el-select v-model="form.runningStatus" filterable placeholder="请输入运行状态"  clearable style="width: 260px !important;">
              <el-option
                v-for="dict in dict.type.wms_running_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="isShowChannelId">
          <el-form-item label="通道号" prop="channelId">
            <el-input v-model="form.channelId" placeholder="请输入通道号" show-word-limit maxlength="50"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="isShowCoilAddressFlag">
          <el-form-item label="线圈地址" prop="coilAddress">
            <el-input v-model="form.coilAddress" placeholder="请输入线圈地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备规格" prop="deviceSize">
            <el-input v-model="form.deviceSize" placeholder="请输入设备规格" show-word-limit maxlength="100"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备厂家" prop="deviceProducer">
            <el-input v-model="form.deviceProducer" placeholder="请输入设备厂家" show-word-limit maxlength="100"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"
                      type="textarea"
                      :autosize="{minRows:3}"
                      placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- WCS设备基本信息-详情对话框 -->
    <el-dialog :title="title" :visible.sync="viewModalOpen" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备编号">{{ viewForm.deviceNo }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ viewForm.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="设备区域">{{ viewForm.deviceArea }}</el-descriptions-item>
        <el-descriptions-item label="地址码">{{ viewForm.deviceAddress }}</el-descriptions-item>
        <el-descriptions-item label="设备IP">{{ viewForm.deviceIp }}</el-descriptions-item>
        <el-descriptions-item label="通道号">{{ viewForm.channelId }}</el-descriptions-item>
        <el-descriptions-item label="线圈地址">{{ viewForm.coilAddress }}</el-descriptions-item>
        <el-descriptions-item label="设备端口">{{ viewForm.devicePort }}</el-descriptions-item>
        <el-descriptions-item label="设备规格">{{ viewForm.deviceSize }}</el-descriptions-item>
        <el-descriptions-item label="设备厂家">{{ viewForm.deviceProducer }}</el-descriptions-item>
        <el-descriptions-item label="启用状态">
          <el-switch
            v-model="viewForm.enableStatus"
            active-value="0"
            inactive-value="1"
            disabled
          ></el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ viewForm.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- WCS设备基本信息-导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
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
            <el-checkbox v-model="upload.updateSupport"/>
            是否更新已经存在的数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
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
  import {listInfo, getInfo, delInfo, addInfo, updateInfo} from '@/api/wcs/deviceBaseInfo'
  import enums from '@/enums'
  import {getToken} from '@/utils/auth'

  export default {
    name: 'wcsDeviceBaseInfo',
    dicts: ['wms_area_type', 'device_type','wms_running_status'],
    data() {
      return {
        //堆垛机
        isStackerFlag :false,
        //线圈地址
        isShowCoilAddressFlag: false,
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
        // WCS设备基本信息表格数据
        infoList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          deviceNo: null,
          deviceName: null,
          deviceArea: null,
          deviceIp: null,
          devicePort: null,
          deviceSize: null,
          deviceProducer: null,
          enableStatus: null,
          coilAddress: null
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
          headers: {Authorization: 'Bearer ' + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/wcs/deviceBaseInfo/importData'
        },
        viewForm: {},
        viewModalOpen: false,
        // 表单参数
        form: {},
        isShowDeviceIpAndPort: false,
        isShowChannelId: false,
        //表格高度
        tableHeight: 0,
        // 表单校验
        rules: {
          deviceNo: [
            {required: true, message: '设备编号不能为空', trigger: 'blur'}
          ],
          deviceName: [
            {required: true, message: '设备名称不能为空', trigger: 'blur'}
          ],
          deviceType: [
            {required: true, message: '设备类型不能为空', trigger: 'blur'}
          ],
          deviceArea: [
            {required: true, message: '设备区域不能为空', trigger: 'blur'}
          ],
          deviceIp: [
            {required: true, message: '设备IP不能为空', trigger: 'blur'}
          ],
          channelId: [
            {required: true, message: '通道号不能为空', trigger: 'blur'}
          ],
          devicePort: [
            {required: true, message: '设备端口不能为空', trigger: 'blur'}
          ],
          deviceAddress: [
            {required: true, message: '地址码不能为空', trigger: 'blur'}
          ],
          coilAddress: [
            { required: true, message: '请输入四位数', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (/^[0-9]{4}$/.test(value) && value >= '0000' && value <= '9999') {
                  callback();
                } else {
                  callback(new Error('请输入介于 0000 和 9999 之间的四位数'));
                }
              },
              trigger: 'blur',
            },
          ],
          runningStatus: [
            {required: true, message: '设备类型不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getList()
      this.setTableGeight()
      window.addEventListener('resize', this.setTableGeight)
    },
    methods: {
      targetRealtion() {
        this.$tab.openPage('新风-温湿度传感器关系维护', '/wcs/wcsFreshAirThtbRealtion')
      },
      targetGateWayRealtion() {
        this.$tab.openPage('网关-设备关系维护', '/wcs/wcsGateWayRealtion')
      },
      targetMeterRealtion() {
        this.$tab.openPage('电表-设备关系维护', '/wcs/wcsMeterRealtion')
      },
      /** 查询WCS设备基本信息列表 */
      getList() {
        this.loading = true
        listInfo(this.queryParams).then(response => {
          this.infoList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      handleStatusChange(row) {
        let text = row.enableStatus === '0' ? '启用' : '禁用'
        this.$modal.confirm('确认要' + text + row.deviceNo + '-' + row.deviceName + '设备吗？').then(function () {
          return updateInfo({id: row.id, enableStatus: row.enableStatus, deviceIp:row.deviceIp, devicePort:row.devicePort})
        }).then(() => {
          this.$modal.msgSuccess(text + '成功')
        }).catch(function () {
          row.enableStatus = row.enableStatus === '0' ? '1' : '0'
        })
      },
      //表格动态高度
      setTableGeight() {
        this.$nextTick(() => {
          const height = window.innerHeight
          this.tableHeight = (height - 240)
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
          id: null,
          deviceNo: null,
          deviceName: null,
          deviceArea: null,
          deviceIp: null,
          devicePort: null,
          channelId: null,
          deviceSize: null,
          deviceProducer: null,
          enableStatus: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加设备基本信息'
      },
      /** 详情按钮操作 */
      handleView(row) {
        const id = row.id
        getInfo(id).then(response => {
          this.viewForm = response.data
          this.viewModalOpen = true
          this.title = '设备基本信息-详情'
        })
      },
      editDeviceTypeChange(params) {
        this.isShowChannelId = params === enums.wcsDeviceType.camera
        if (!this.isShowChannelId) {
          this.form.channelId = ''
        }
        if (params === enums.wcsDeviceType.agv || params === enums.wcsDeviceType.stacker || params === enums.wcsDeviceType.netCollection || params === enums.wcsDeviceType.camera) {
          this.isShowDeviceIpAndPort = true
          this.form.deviceAddress = null
        } else {
          this.isShowDeviceIpAndPort = false
          this.form.deviceIp = null
          this.form.devicePort = null
          this.isShowChannelId = false
        }
        if(params === enums.wcsDeviceType.stacker ){
          this.isStackerFlag = true;
        }else{
          this.isStackerFlag = false;
        }
        if (params === enums.wcsDeviceType.freshAir || params === enums.wcsDeviceType.light || params === enums.wcsDeviceType.dehumidifier) {
          this.isShowCoilAddressFlag = true
        } else {
          this.isShowCoilAddressFlag = false
          this.form.coilAddress = ''
        }
      },
      // 更多操作触发
      handleCommand(command, row) {
        switch (command) {
          case 'handleResetPwd':
            this.handleResetPwd(row)
            break
          default:
            break
        }
      },
      /** 示例：重置密码按钮操作 */
      handleResetPwd(row) {
        //todo 按需求修改
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getInfo(id).then(response => {
          this.form = response.data
          if (this.form.deviceType === enums.wcsDeviceType.agv || this.form.deviceType === enums.wcsDeviceType.stacker || this.form.deviceType === enums.wcsDeviceType.netCollection
            || this.form.deviceType === enums.wcsDeviceType.camera) {
            this.isShowDeviceIpAndPort = true
            this.form.deviceAddress = null
            this.isShowChannelId = this.form.deviceType === enums.wcsDeviceType.camera;
          } else {
            this.isShowDeviceIpAndPort = false
            this.form.deviceIp = null
            this.form.devicePort = null
            this.isShowChannelId = false
          }
          if(this.form.deviceType === enums.wcsDeviceType.stacker ){
            this.isStackerFlag = true;
          }else{
            this.isStackerFlag = false;
          }
          if (this.form.deviceType === enums.wcsDeviceType.freshAir || this.form.deviceType === enums.wcsDeviceType.light || this.form.deviceType === enums.wcsDeviceType.dehumidifier) {
            this.isShowCoilAddressFlag = true
          } else {
            this.isShowCoilAddressFlag = false
            this.form.coilAddress = ''
          }
          this.open = true
          this.title = '修改设备基本信息'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateInfo(this.form).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addInfo(this.form).then(response => {
                this.$modal.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$modal.confirm('是否确认删除该记录？').then(function () {
          return delInfo(ids)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('wcs/deviceBaseInfo/export', {
          ...this.queryParams
        }, `设备基本信息.xlsx`)
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = '模板数据导入'
        this.upload.open = true
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('wcs/deviceBaseInfo/importTemplate', {}, `设备基本信息导入模板.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', {dangerouslyUseHTMLString: true})
        this.getList()
      },
      //选择文件
      uploadFile(file, fileList) {
        this.fileData = fileList
      },
      // 提交上传文件
      submitFileForm() {
        if (this.fileData.length < 1) {
          this.$modal.msgWarning('必须要上传文件，请检查！')
          return
        }
        this.$refs.upload.submit()
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
