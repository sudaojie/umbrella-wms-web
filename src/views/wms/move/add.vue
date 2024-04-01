<template>
  <div class="app-container">
    <div style="background-color: white;margin-top: 10px;padding: 10px;border-radius: 10px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-row type="flex" justify="space-around">
          <el-col :span="6">
            <el-form-item label="移出库区" prop="outAreaCode">
              <el-input v-model="form.outAreaCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="移出库位" prop="outLocationCode">
              <el-input v-model="form.outLocationCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="移出托盘" prop="outTrayCode">
              <el-input v-model="form.outTrayCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="6">
            <el-form-item label="移入库区" prop="inAreaCode">
              <el-input v-model="form.inAreaCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="移入库位" prop="inLocationCode">
              <el-input v-model="form.inLocationCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="移入托盘" prop="inTrayCode">
              <el-input v-model="form.inTrayCode" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: center;margin-top: 10px;">
        <el-button icon="el-icon-save" type="primary" @click="saveAddMoveOrder">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "addMove",
  data() {
    return {
      form: {
        outAreaCode:'',
        outLocationCode:'',
        outTrayCode:'',
        inAreaCode:'',
        inLocationCode:'',
        inTrayCode:''
      },
      // 表单校验
      rules: {
        outAreaCode: [
            { required: true, message: "移出库区不能为空", trigger: "blur" }
        ],
        outLocationCode: [
          { required: true, message: "移出库位不能为空", trigger: "blur" }
        ],
        outTrayCode: [
          { required: true, message: "移出托盘不能为空", trigger: "blur" }
        ],
        inAreaCode: [
          { required: true, message: "移入库区不能为空", trigger: "blur" }
        ],
        inLocationCode: [
          { required: true, message: "移入库位不能为空", trigger: "blur" }
        ],
        inTrayCode: [
          { required: true, message: "移入托盘不能为空", trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    saveAddMoveOrder(){
      this.$refs["form"].validate(valid => {
        if (valid) {
        }
      });
    }
  }
};
</script>
<style scoped>
</style>
