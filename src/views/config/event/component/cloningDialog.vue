<template>
  <div>
    <el-dialog
      :title="title"
      :before-close="closeDialog"
      :visible.sync="dialogValue"
    >
      <div
        class="cloning"
        v-loading="loading"
        :element-loading-text="loadingText"
      >
        <div class="cloningText">
          克隆通道：<span class="soureData">{{ cloningData.name }}</span>
        </div>
        <div class="cloningText">请选择被克隆通道</div>
        <ul class="otherCaream">
          <el-checkbox-group v-model="selectIds">
            <li class="nameShow">通道名称</li>
            <li v-for="item in otherCamera" :key="item.id">
              <div class="checkBox">
                <el-checkbox :label="item.id"> {{ " " }}</el-checkbox>
              </div>
              <div class="name">
                {{ item.name }}
              </div>
            </li>
          </el-checkbox-group>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t("html.qkx") }}</el-button>
        <el-button :disabled="loading" type="primary" @click="sureClick">{{
          $t("html.qkd")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      require: true,
    },
    title: {
      type: String,
      default: "默认",
    },
    cloningData: {
      type: Object,
      default: () => ({}),
    },
    otherCamera: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    value(newValue) {
      this.dialogValue = newValue;
    },
  },
  data() {
    return {
      dialogValue: this.value,
      loading: false,
      loadingText: "开始克隆",
      selectIds: [], //选中要克隆的ids
      closeFlag: false, //控制是否允许关闭
    };
  },
  methods: {
    sureClick() {
      var algInfos = this.cloningData.algInfos;
      this.$emit("sure", {
        loading: this.showLoading.bind(this),
        close: this.closeDialog.bind(this),
        loadingText: this.setloadingText.bind(this),
        algInfos,
        length: this.selectIds.length,
        ids: this.selectIds,
        setCloseFlag: this.setCloseFlag.bind(this),
      });
    },
    setloadingText(text) {
      this.loadingText = text;
    },
    showLoading() {
      this.loading = true;
    },
    setCloseFlag(data) {
      this.closeFlag = data;
    },
    closeDialog() {
      if (this.closeFlag) {
        this.$message({
          message: "正在克隆请耐心等待..",
          type: "warning",
        });
        return;
      } else {
        this.selectIds = [];
      }
      this.$emit("input", false);
      this.dialogValue = false;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.cloning {
  text-align: center;
  .cloningText {
    font-size: 14px;
    line-height: 40px;
    .soureData {
      color: #409eff;
    }
  }
  .otherCaream {
    width: 283px;
    margin: 0 auto;
    border: 1px solid #f2f2f2;
    margin-top: 15px;
    li {
      position: relative;
      display: inline-block;
      width: 100%;
      list-style: none;
      line-height: 53px;
      &:first-child {
        background-color: #f2f2f2;
      }
      .checkBox {
        position: absolute;
        display: inline-block;
        left: 0px;
        top: 50%;
        transform: translate(0, -50%);
        width: 100%;
        /deep/ .el-checkbox {
          width: 100%;
          text-align: left;
          box-sizing: border-box;
          padding-left: 20px;
        }
      }
      .name {
        display: inline-block;
        font-size: 14px;
      }
      &.nameShow {
        font-size: 14px;
      }
    }
  }
}
</style>