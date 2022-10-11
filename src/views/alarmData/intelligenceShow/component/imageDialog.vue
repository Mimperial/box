<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogValue"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="1000px"
    >
      <div
        class="dialogImage"
        :class="[topAlarmType == '411' ? 'dialogImage411' : '']"
      >
        <el-image
          :src="imageData.alarmUrl"
          @load="successLoad"
          style="width: 960px; height: 540px"
          :fit="topAlarmType == '411' ? 'fill' : 'contain'"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <FunAreaSelect
          v-if="show"
          :id="imageData.id + 'dialog'"
          :circleRadius="1"
          :circleBorderWidth="1"
          :listData="listData"
          :disabled="true"
          areaColor="rgba(40, 177, 217, 0)"
          selectAreaColor="rgba(40, 177, 217, 0)"
        ></FunAreaSelect>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FunAreaSelect from "@/components/funAreaSelect.vue";
import { changeImge } from "@/utils/utils";
export default {
  props: {
    title: {
      type: String,
      default: "默认",
    },
    value: {
      type: Boolean,
      require: true,
    },
    imageData: {
      type: [Object, String],
      default: () => ({}),
    },
    topAlarmType: {
      type: String,
      default: "400",
    },
  },
  components: {
    FunAreaSelect,
  },
  watch: {
    value(newValue) {
      this.dialogValue = newValue;
    },
  },
  data() {
    return {
      dialogValue: this.value,
      show: false,
    };
  },
  computed: {
    listData() {
      if (this.imageData.yuan) {
        if (this.topAlarmType == "411") {
          let imgObj = new Image();
          imgObj.src = this.imageData.alarmUrl;
          let data = "";
          imgObj.onload = function () {
            data = changeImge(
              this.imageData.yuan,
              240,
              480,
              imgObj.width,
              imgObj.height
            );
          };
          return data;
        } else {
          return changeImge(this.imageData.yuan, 960, 540);
        }
      }
    },
  },
  methods: {
    closeDialog() {
      //关闭弹框
      this.$emit("input", false);
      this.dialogValue = false;
      this.show = false;
    },
    successLoad() {
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogImage {
  position: relative;
}

.dialogImage411 {
  position: relative;
  height: 500px;
  & > div:nth-child(1) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 240px !important;
    height: 480px !important;
  }
  & > div:nth-child(2) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 240px !important;
    height: 480px !important;
    z-index: 99;
  }
}

/deep/ .el-dialog {
  box-shadow: none;
}
</style>