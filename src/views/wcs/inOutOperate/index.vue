<template>
    <div class="inout-box">
        <div class="inout-left">
            <div class="inout-left-box">
                <div class="title-name">上架</div>
                <el-form :model="ruleForm" :rules="rules" hide-required-asterisk="false" ref="ruleForm"
                    label-width="100px" class="demo-ruleForm">
                    <el-form-item label="托盘号" prop="tray">
                        <el-input v-model="ruleForm.tray"></el-input>
                    </el-form-item>
                    <el-form-item label="货位号" prop="location">
                        <el-input v-model="ruleForm.location"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">上架</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="inout-left-box">
                <div class="title-name">下架</div>
                <el-form :model="ruleForm" :rules="rules" hide-required-asterisk="false" ref="ruleFormDown"
                    label-width="100px" class="demo-ruleForm">
                    <el-form-item label="托盘号" prop="tray">
                        <el-input v-model="ruleForm.tray"></el-input>
                    </el-form-item>
                    <el-form-item label="货位号" prop="location">
                        <el-input v-model="ruleForm.location"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleFormDown')">下架</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="inout-left-box">
                <div class="title-name">上架</div>
                <el-form :model="ruleForm" :rules="rules" hide-required-asterisk="false" ref="ruleFormInOut"
                    label-width="100px" class="demo-ruleForm">
                    <el-form-item label="出入库号" prop="inOutNum">
                        <el-input v-model="ruleForm.inOutNum"></el-input>
                    </el-form-item>
                    <el-form-item label="出入库状态" prop="inOutState">
                        <el-input v-model="ruleForm.inOutState"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleFormInOut')">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="inout-right">
            <div class="table-box">
                <div class="title-name">出入库任务</div>
                <el-table :data="inOutTable" style="width: 100%" stripe :header-row-style="{height:'30px'}"
                    :row-style="{height:'30px'}">
                    <el-table-column label="" width="50">
                        <template slot-scope="{ row }">
                            <span v-if="row.status === 0" class="status-box free-bg"> </span>
                            <span v-else-if="row.status === 1" class="status-box nervous-bg">
                            </span>
                            <span v-else class="status-box full-bg">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="oddNum" label="单号">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="state" label="状态">
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-box">
                <div class="title-name">堆垛机状态</div>
                <el-table :data="stateTable" style="width: 100%" stripe :header-row-style="{height:'30px'}"
                    :row-style="{height:'30px'}">
                    <el-table-column label="" width="50">
                        <template slot-scope="{ row }">
                            <span v-if="row.status === 0" class="status-box free-bg"> </span>
                            <span v-else-if="row.status === 1" class="status-box nervous-bg">
                            </span>
                            <span v-else class="status-box full-bg">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" label="编号">
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="state" label="状态">
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-box">
                <div class="title-name">AGV状态</div>
                <el-table :data="agvTable" style="width: 100%" stripe :header-row-style="{height:'30px'}"
                    :row-style="{height:'30px'}">
                    <el-table-column label="" width="50">
                        <template slot-scope="{ row }">
                            <span v-if="row.status === 0" class="status-box free-bg"> </span>
                            <span v-else-if="row.status === 1" class="status-box nervous-bg">
                            </span>
                            <span v-else class="status-box full-bg">
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" label="编号">
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="state" label="状态">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    tray: '',
                    location: '',
                    downTray: '',
                    downLocation: '',
                    inOutNum: '',
                    inOutState: '',
                },
                rules: {
                    tray: [
                        { required: true, message: '请输入托盘号', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    location: [
                        { required: true, message: '请输入货位号', trigger: 'change' }
                    ],
                    downTray: [
                        { required: true, message: '请输入托盘号', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    downLocation: [
                        { required: true, message: '请输入货位号', trigger: 'change' }
                    ],
                    inOutNum: [
                        { required: true, message: '请输入托盘号', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    inOutState: [
                        { required: true, message: '请输入货位号', trigger: 'change' }
                    ],
                },
                inOutTable: [{
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 0
                }, {
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 0
                }, {
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 1
                }, {
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 0
                }, {
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 0
                }, {
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 0
                }, {
                    oddNum: '001',
                    type: '入库',
                    state: '进行中',
                    status: 0
                }],
                stateTable: [
                    {
                        number: '001',
                        name: '入库',
                        state: '进行中',
                        status: 0
                    }, {
                        number: '002',
                        name: '入库',
                        state: '空闲',
                        status: 1
                    },
                    , {
                        number: '002',
                        name: '入库',
                        state: '忙碌',
                        status: 2
                    },
                ],
                agvTable: [
                    {
                        number: '001',
                        name: '入库',
                        state: '进行中',
                        status: 0
                    }, {
                        number: '002',
                        name: '入库',
                        state: '空闲',
                        status: 1
                    },
                    , {
                        number: '002',
                        name: '入库',
                        state: '忙碌',
                        status: 2
                    },
                ]
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .table-box{
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 20px;
        margin-bottom:20px;
    }
    .inout-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .inout-left {
        width: 40%;
    }

    .inout-right {
        width: 58%;
    }

    .title-name {
        margin-bottom: 20px;
    }

    ::v-deep .el-table {
        background-color: transparent !important;
    }

    ::v-deep .el-table__header {
        width: 100%;
    }

    ::v-deep .el-table thead {
        background-color: #bfced8 !important;
    }

    ::v-deep .el-table thead .cell {
        /* color: #ABFFF7 !important; */
        font-weight: 600;
    }

    ::v-deep .el-table th {
        background-color: transparent !important;
        border-bottom: 0 !important;
        color: #fefefe !important;
    }

    ::v-deep .el-table tr {
        background-color: transparent !important;
    }

    ::v-deep .el-table--enable-row-transition .el-table__body td,
    ::v-deep .el-table .cell {
        background-color: transparent !important;
        color: #666 !important;
        font-weight: 400;
        border: none !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    ::v-deep .el-table .el-table__cell {
        padding: 0;
        text-align: center;
    }

    /* ::v-deep .el-table tr.el-table__row{
        background-color: #badbfc !important;
    } */
    ::v-deep .el-table tr.el-table__row--striped {
        background-color: #badbfc !important;
    }

    ::v-deep .el-table::before {
        height: 0;
    }
    .status-box{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        margin-right: 10px;
    }
    .free-bg {
        background: #9edf36;
    }

    .nervous-bg {
        background: #facd91;
    }

    .full-bg {
        background: #e86878;
    }
    
</style>