<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogValue"
      :before-close="closeDialog"
      width="1000px"
    >
      <div class="dialogVideo">
        <div class="videoShow">
          <video
            v-if="imageData.alarmVideo"
            class="videoShow"
            controls
            autoplay
            muted
            :src="imageData.alarmVideo"
          ></video>
          <div v-else class="defalutShow">暂无视频</div>
        </div>
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
.dialogVideo {
  position: relative;
  .videoShow {
    position: relative;
    width: 960px;
    height: 540px;
    background-color: black;
    .defalutShow {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: white;
    }
  }
}
/deep/ .el-dialog {
  box-shadow: none;
}
</style>