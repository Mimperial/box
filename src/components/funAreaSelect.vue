<template>
  <div class="FunAreaSelect">
    <div class="FunAreaSelect" :id="id"></div>
  </div>
</template>

<script>
import { markPlugin } from "objecteye";
import { changeImge } from "@/utils/utils";
export default {
  props: {
    id: {
      type: String,
      require: true,
    },
    circleRadius: {
      type: Number,
      default: 1,
    },
    circleBorderWidth: {
      type: Number,
      default: 1,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    areaColor: {
      type: String,
      default: "",
    },
    selectAreaColor: {
      type: String,
      default: "",
    },
    yanListData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mark: null,
      timer: null,
    };
  },
  mounted() {
    window.addEventListener("resize", this.resizeWidth);
    this.mark = new markPlugin(this.id, {
      modeType: "react",
      disabled: false,
      areaColor: this.areaColor,
      serviceData: this.listData,
      selectAreaColor: this.selectAreaColor,
      circleBorderWidth: this.circleBorderWidth,
      circleRadius: this.circleRadius,
    });
  },

  methods: {
    resizeWidth() {
      if (this.mark && this.yanListData && this.yanListData.length > 0) {
        this.mark.resize();
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.mark.setServiceData(
              changeImge(
                JSON.parse(JSON.stringify(this.yanListData)),
                this.mark.canvas.width,
                this.mark.canvas.height
              )
            );
            this.timer = null;
          }, 200);
        }
      }
    },
  },
  beforeDestroy() {
    this.mark && this.mark.destroy();
    window.removeEventListener("resize", this.resizeWidth);
  },
};
</script>

<style lang="scss" scoped>
.FunAreaSelect {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>