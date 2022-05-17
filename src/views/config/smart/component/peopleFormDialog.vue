<template>
  <div>
    <el-dialog
      :title="`${title}人员`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="PersonName">
            <el-input v-model="ruleForm.PersonName"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="Gender">
            <el-select v-model="ruleForm.Gender" placeholder="请选择活动区域">
              <el-option label="男" value="man"></el-option>
              <el-option label="女" value="girl"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工号" prop="PersonId">
            <el-input v-model="ruleForm.PersonId"></el-input>
          </el-form-item>

          <el-form-item label="上传照片">
            <el-upload
              class="avatar-uploader"
              action="#"
              :limit="1"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="ruleForm.Image" :src="ruleForm.Image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>174*174，大小2M以内</span>
          </el-form-item>

          <el-form-item label="状态" prop="Enable">
            <el-radio-group v-model="ruleForm.Enable">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >确定</el-button
            >
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item> -->
        </el-form>
      </div>
      <div style="text-align: center" slot="footer" class="dialog-footer">
        <el-button
          style="border: 1px solid #010b56"
          @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button
          style="background-color: #010b56"
          type="primary"
          @click="submitForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: "添加",
      type: String,
    },
    bankDialogShow: {
      default: false,
      type: Boolean,
    },
    editData: {
      default: {},
    },
  },
  data() {
    return {
      iconBase64: "",
      dialogVisible: false,
      bankName: "",
      imageUrl: "",
      ruleForm: {
        PersonName: "",
        Gender: "",
        PersonId: "",
        Image: "",
        Enable: "1",
      },
      rules: {
        PersonName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
        ],
        Gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        PersonId: [
          { required: true, message: "请输入工号", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        Enable: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  watch: {
    bankDialogShow() {
      this.dialogVisible = true;
    },
    title() {
      if (this.title == "编辑") {
        // this.bankName = editData.name;
      } else {
        this.bankName = "";
      }
    },
  },
  methods: {
    handleAvatarChange(res, file) {
      console.log("res, file", res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isLt2M) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.ruleForm.Image = reader.result;
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      } else {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return false;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submitForm() {
      console.log("ruleForm", this.ruleForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["formName"].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
/deep/.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>