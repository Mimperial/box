<template>
  <div>
    <el-dialog
      :title="`${title}人员`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      @open="dialogOpen"
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
            <el-select v-model="ruleForm.Gender" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="工号" prop="PersonId">
            <el-input
              :disabled="personIdDisabled"
              v-model="ruleForm.PersonId"
            ></el-input>
          </el-form-item>

          <el-form-item label="上传照片">
            <el-upload
              class="avatar-uploader"
              action="#"
              :limit="1"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
import { addFacePerson, editFacePerson } from "@/api/article.js";
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
    GroupId: {
      type: String,
    },
    httpUrl: {},
  },
  data() {
    return {
      iconBase64: "",
      dialogVisible: false,
      personIdDisabled: false,
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
        Image: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
    };
  },
  watch: {
    bankDialogShow() {
      this.dialogVisible = true;
    },
  },
  methods: {
    dialogOpen() {
      if (this.title == "编辑") {
        // this.ruleForm = this.editData;
        // this.ruleForm.Image = this.httpUrl + this.editData.Url;
        this.personIdDisabled = true;
        this.ruleForm = {
          PersonName: this.editData.PersonName,
          Gender: this.editData.Gender,
          PersonId: this.editData.PersonId,
          Image: this.editData.Image,
          Enable: this.editData.Enable,
          GroupId: this.editData.GroupId,
        };
        this.imageUrl = this.httpUrl + this.editData.Url;
      } else {
        this.personIdDisabled = false;
        this.ruleForm = {
          PersonName: "",
          Gender: "",
          PersonId: "",
          Image: "",
          Enable: "1",
        };
        this.imageUrl = "";
      }
      this.$refs["ruleForm"].resetFields();
    },
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
          this.imageUrl = reader.result;
          this.ruleForm.Image = reader.result.split(",")[1];
          // console.log('reader.result',reader.result.split(','));
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      } else {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return false;
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
    },
    submitForm() {
      console.log("ruleForm", this.ruleForm);
      if (!this.ruleForm.Image && !this.imageUrl)
        return this.$message.error("请上传图片");
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          let ruleRes = null;
          if (this.title == "编辑") {
            ruleRes = await editFacePerson(this.ruleForm);
          } else {
            this.ruleForm.GroupId = this.GroupId;
            ruleRes = await addFacePerson(this.ruleForm);
          }
          if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg);
          console.log("addFacePerson", ruleRes);
          this.$emit("faceGroupsChange", this.GroupId);
          this.handleClose();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      console.log("resetForm-------------");
      this.$refs["ruleForm"].resetFields();
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
  width: 174px;
  height: 174px;
  display: block;
}
</style>