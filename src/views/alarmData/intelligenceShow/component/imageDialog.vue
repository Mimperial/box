<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogValue"
      :before-close="closeDialog"
      width="1000px"
    >
      <div class="dialogImage">
        <el-image
          :src="imageData.alarmUrl"
          @load="successLoad"
          style="width: 960px; height: 540px"
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
      type: Object,
      default: () => ({}),
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
      return changeImge(this.imageData.yuan, 960, 540);
    },
  },
  methods: {
    closeDialog() {
      //关闭弹框
      this.$emit("input", false);
      this.dialogValue = false;
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
/deep/ .el-dialog {
  box-shadow: none;
}
</style>