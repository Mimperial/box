<template>
  <div>
    <el-dialog
      :title="`${title}人员库`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      @open="dialogOpen"
    >
      <div>
        <el-row :gutter="10">
          <el-col style="text-align: right; line-height: 40px" :span="6"
            >人员库名称 :
          </el-col>
          <el-col :span="12"
            ><el-input
              maxlength="20"
              v-model="bankName"
              placeholder="最多20个字符"
            ></el-input
          ></el-col>
        </el-row>
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
          @click="setGroup"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addFaceGroup, editFaceGroup } from "@/api/article.js";
export default {
  props: {
    title: {
      default: "新建",
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
      dialogVisible: false,
      bankName: "",
    };
  },
  watch: {
    bankDialogShow() {
      this.dialogVisible = true;
    },
  },
  methods: {
    dialogOpen() {
      if (this.title == "修改") {
        this.bankName = this.editData.GroupName;
      } else {
        this.bankName = "";
      }
    },
    async handleClose() {
      this.dialogVisible = false;
    },
    async setGroup() {
      if (this.bankName) {
        const ruleRes =
          this.title == "修改"
            ? await editFaceGroup({
                GroupId: this.editData.GroupId,
                GroupName: this.bankName,
              })
            : await addFaceGroup({ GroupName: this.bankName });
        if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg);
        this.bankName = "";
        this.dialogVisible = false;
        this.$emit("setGroup", true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>