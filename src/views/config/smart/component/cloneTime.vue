<template>
  <div class="cloneTime">
    <div class="title">
      <span>复制到</span
      ><el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
    </div>
    <div class="otherCheckBox">
      <el-checkbox-group
        v-model="checkedCities"
        @change="handleCheckedCitiesChange"
      >
        <el-checkbox
          :disabled="item.value == selectData"
          v-for="item in cities"
          :label="item.value"
          :key="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <div class="btnCloneTime">
      <el-button size="mini" @click="submit" type="primary">确定</el-button>
      <el-button size="mini" @click="cancel" type="info">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectData: {
      type: Number,
      default: -1,
    },
  },
  watch: {
    selectData(newValue, oldValue) {
      if (newValue != -1) {
        this.init();
        this.checkedCities = [newValue];
      } else {
        this.init(false);
        this.checkedCities = [];
      }
    },
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      checkedCities: [],
      cities: [
        {
          label: "星期一",
          value: 0,
        },
        {
          label: "星期二",
          value: 1,
        },
        {
          label: "星期三",
          value: 2,
        },
        {
          label: "星期四",
          value: 3,
        },
        {
          label: "星期五",
          value: 4,
        },
        {
          label: "星期六",
          value: 5,
        },
        {
          label: "星期日",
          value: 6,
        },
      ],
    };
  },
  methods: {
    init(isIndeterminate = true) {
      this.checkAll = false;
      this.isIndeterminate = isIndeterminate;
    },
    handleCheckAllChange(val) {
      this.checkedCities = val
        ? this.cities.map((item) => item.value)
        : [this.selectData];
      //   this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    cancel() {
      this.$emit("cancel", true);
    },
    submit() {
      this.$emit("submit", {
        root: this.selectData,
        cloneData: this.checkedCities.filter((item) => item != this.selectData),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cloneTime {
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;
  width: 280px;
  padding: 10px;
  box-sizing: border-box;
  text-align: left;
  z-index: 101;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }
  .otherCheckBox {
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .btnCloneTime {
    text-align: right;
    margin-top: 10px;
  }
  /deep/ .el-checkbox {
    margin-right: 20px;
    &:nth-child(n + 3) {
      margin-top: 10px;
    }
  }
}
</style>