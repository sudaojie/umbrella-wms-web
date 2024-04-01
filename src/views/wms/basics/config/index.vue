<template>
<div class="app-container">
    <div style="background-color: white; border-radius: 10px" ref="top">
        <el-form v-if="false" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="padding-left: 10px">
            <el-form-item label="参数键名" prop="wmsConfigKey">
                <el-input v-model="queryParams.wmsConfigKey" placeholder="请输入参数键名" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="参数名称" prop="wmsConfigName">
                <el-input v-model="queryParams.wmsConfigName" placeholder="请输入参数名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="max-content">
        <div class="top-select">
            <el-form :model="topForm" ref="form" label-width="80px" :inline="true" size="small">
                <el-row v-for="(item, i) in topList" :key="i">
                    <el-col :span="3">
                        <el-form-item>
                            <!-- <el-input v-model="topForm.text"></el-input> -->
                            <div>{{item.deviceName}}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="是否开启">
                            <el-switch v-model="item.enableStatus" active-value="0" inactive-value="1" @change="enableSwtich">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="bottom-form" v-if="isShowConfig">
            <el-form :model="bottomForm" ref="form" :inline="true" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="策略">
                            <el-radio-group v-model="strategyRadio">
                                <el-radio label="0">平均分配</el-radio>
                                <el-radio label="1">集中堆放</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="strategyRadio==1">
                    <el-col :span="12">
                        <el-form-item label="排列顺序(拖拽排序)">
                                <div class="list-sort flex">
                                    <li @dragenter="dragenter($event, index)" @dragover="dragover($event, index)" @dragstart="dragstart(index)" draggable v-for="(item, index) in list" :key="item.label" class="list-item">
                                        {{item}}
                                    </li>
                                </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="save-box">
            <el-button type="primary" v-hasPermi="['basics:config:edit']" @click="saveForm">保存</el-button>
        </div>
    </div>
</div>
</template>

<script>
import {
    listConfig,
    getConfig,
    delConfig,
    addConfig,
    updateConfig,
    configData,
    configStrategy,
    configOrderBy,
    configStrategySave
} from "@/api/wms/basics/config";
import {
    getToken
} from "@/utils/auth";
export default {
    name: "Config",
    dicts: ["sys_yes_no"],
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
            // wms参数配置表格数据
            configList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                wmsConfigKey: null,
                wmsConfigName: null,
                wmsConfigValue: null,
                enableStatus: null,
            },
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
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/basics/config/importData",
            },
            viewForm: {},
            viewModalOpen: false,
            // 表单参数
            form: {},
            //表格高度
            tableHeight: 0,
            // 表单校验
            rules: {
                wmsConfigKey: [{
                    required: true,
                    message: "参数键名不能为空",
                    trigger: "blur",
                }, ],
                wmsConfigName: [{
                    required: true,
                    message: "参数名称不能为空",
                    trigger: "blur",
                }, ],
                wmsConfigValue: [{
                    required: true,
                    message: "参数键值不能为空",
                    trigger: "blur",
                }, ],
            },

            topForm: {},
            topList: [],

            bottomForm: {

            },

            list: [{
                    label: 'A'
                },
                {
                    label: 'B'
                },
                {
                    label: 'C'
                },
            ],
            dragIndex: '',
            enterIndex: '',
            isShowConfig: false,
            strategyRadio: 0,
        };
    },
    created() {
        // this.getList();
        this.getConfigList();
        this.getConfigStrategy();
        this.getConfigOrderBy();

        this.setTableGeight();
        window.addEventListener("resize", this.setTableGeight);
    },
    methods: {
        getConfigList() {
            configData().then(res => {
                let isShowConfig = false;
                for(let item of res.rows){
                  if(item.enableStatus === '0'){
                    isShowConfig = true;
                    break;
                  }
                }
                this.isShowConfig = isShowConfig;
                this.topList = res.rows;
            })
        },

        // 获取策略
        getConfigStrategy() {
            configStrategy().then(res => {
                this.strategyRadio = res.rows[0].tactics;
                this.bottomForm = res.rows[0];
                this.list = this.bottomForm.arrTacticsContent;
            })
        },

        getConfigOrderBy() {
            configOrderBy().then(res => {
            })
        },

        // 保存内容
        saveForm() {
            let arr = [];
            this.topList.forEach(item => {
                let obj = {
                    id: item.id,
                    enableStatus: item.enableStatus,
                    deviceArea:item.deviceArea
                }
                arr.push(obj);
            })

            let paramsArr = [{
                tactics: this.strategyRadio,
                id: this.bottomForm.id,
                arrTacticsContent: []
            }]

            if (this.strategyRadio == 1) {
                this.list.forEach(item => {
                    paramsArr[0].arrTacticsContent.push(item);
                })
            }

            // 更新策略
            configStrategySave({agvDevices:arr,wmsTacticsConfigList:paramsArr}).then(res => {
              this.getConfigList();
              this.getConfigStrategy();
              this.$modal.msgSuccess(res.msg);
            })
        },

        dragstart(index) {
            this.dragIndex = index;
        },
        // 源对象开始进入目标对象范围内触发
        dragenter(e, index) {
            e.preventDefault();
            // 避免源对象触发自身的dragenter事件
            if (this.dragIndex !== index) {
                const source = this.list[this.dragIndex];
                this.list.splice(this.dragIndex, 1);
                this.list.splice(index, 0, source);
                // 排序变化后目标对象的索引变成源对象的索引
                this.dragIndex = index;
            }
        },
        // 源对象在目标对象范围内移动时触发
        dragover(e, index) {
            e.preventDefault();
        },

        /** 查询wms参数配置列表 */
        getList() {
            this.loading = true;
            listConfig(this.queryParams).then((response) => {
                this.configList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //表格动态高度
        setTableGeight() {
            this.$nextTick(() => {
                const height = window.innerHeight;
                this.tableHeight = height - this.$refs.top.offsetHeight - 240;
            });
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
                wmsConfigKey: null,
                wmsConfigName: null,
                wmsConfigValue: null,
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
        // 状态修改
        handleStatusChange(row) {
            let text = row.enableStatus === "0" ? "启用" : "禁用";
            this.$modal
                .confirm("确认要修改状态码？")
                .then(function () {
                    return updateConfig({
                        id: row.id,
                        enableStatus: row.enableStatus,
                    });
                })
                .then(() => {
                    this.$modal.msgSuccess(text + "成功");
                })
                .catch(function () {
                    row.enableStatus = row.enableStatus === "0" ? "1" : "0";
                });
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
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加wms参数配置";
        },
        /** 详情按钮操作 */
        handleView(row) {
            const id = row.id;
            getConfig(id).then((response) => {
                this.viewForm = response.data;
                this.viewModalOpen = true;
                this.title = "wms参数配置-详情";
            });
        },
        // 更多操作触发
        handleCommand(command, row) {
            switch (command) {
                case "handleResetPwd":
                    this.handleResetPwd(row);
                    break;
                default:
                    break;
            }
        },
        /** 示例：重置密码按钮操作 */
        handleResetPwd(row) {
            //todo 按需求修改
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getConfig(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改wms参数配置";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateConfig(this.form).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addConfig(this.form).then((response) => {
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
            const wmsConfigIds = row.id || this.ids;
            this.$modal
                .confirm("是否确认删除该记录？")
                .then(function () {
                    return delConfig(wmsConfigIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        enableSwtich(e){
          let isShowConfig = false;
          for(let item of this.topList){
            if(item.enableStatus === '0'){
              isShowConfig = true;
              break;
            }
          }
          this.isShowConfig = isShowConfig;
        }
    },
};
</script>

<style lang="scss" scoped>
.el-form>>>.el-input-number__decrease {
    /*display: none;*/
}

.el-form>>>.el-input-number__increase {
    display: none;
}

.el-input-number>>>.el-input__inner {
    padding-left: 15px !important;
    padding-right: 15px;
    text-align: left;
}

.top-select,
.bottom-form {
    width: 100%;
    background-color: #f0f2f5;
    padding: 15px;
    border-radius: 10px;
}

.bottom-form {
    margin-top: 20px;
}

.list-sort {
    display: flex;
    list-style: none;

    .list-item {
        cursor: move;
        width: 100px;
        background: #2C68FF;
        border-radius: 4px;
        color: #FFF;
        margin-bottom: 6px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 15px;
    }
}

.max-content {
    background-color: #fff;
    margin-top: 10px;
    padding: 30px;
    border-radius: 10px;

    .save-box {
        text-align: center;
        margin-top: 20px;
    }
}
.el-table >>>.el-table__fixed::before,.el-table >>>.el-table__fixed-right::before{
    display: none;
}
</style>
