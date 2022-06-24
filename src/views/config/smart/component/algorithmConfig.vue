<template>
  <div class="algorithmConfig">
    <el-form label-width="80px">
      <el-row :gutter="20">
        <el-col
          style="height: 75px"
          :span="8"
          :key="index"
          v-for="(item, index) in showAll"
        >
          <el-form-item
            size="small"
            :label-width="item.name.length > 4 ? '110px' : '80px'"
            :label="item.name"
          >
            <div
              :style="{
                width:
                  item.describe && item.describe.length > 2 ? '65%' : '80%',
              }"
              style="float: left"
            >
              <el-input
                v-if="item.type == 1"
                size="small"
                v-model="item.value"
              ></el-input>
              <el-slider
                v-else-if="item.type == 2"
                v-model="item.value"
                :min="item.min"
                :max="item.max"
              ></el-slider>
              <el-select v-else-if="item.type == 3" v-model="item.value">
                <el-option
                  v-for="(item2, index1) in item.options"
                  :key="index1"
                  :label="item2.label"
                  :value="item2.value"
                >
                </el-option>
              </el-select>
            </div>
            <div style="float: right" v-if="item.describe">
              {{ item.describe }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["configShow"],
  data() {
    return {
      //框选的类型0-10input--1 10-20slider--2 20-30select--3
      showAll: [], //要展示的所有内容
    };
  },
  watch: {
    configShow: {
      deep: true,
      handler(newValue, oldValue) {
        let { inputConfig, algInfo } = newValue;
        this.showAll = [];
        if (inputConfig && inputConfig.length > 0) {
          inputConfig.forEach((element) => {
            var { length } = element.type;
            var type = parseInt(element.type.slice(length - 2, length));
            var value;
            if (
              algInfo &&
              algInfo.Parameters &&
              algInfo.Parameters.length > 0
            ) {
              value = algInfo.Parameters.find(
                (item) => item.Key == element.type
              );
              if (value) {
                value = value.Value;
              }
            }
            if (type < 10) {
              this.showAll.push({
                type: 1,
                name: element.name,
                key: element.type,
                value:
                  value || value == 0 ? String(value) : String(element.default),
                describe: element.describe,
              });
            } else if (type < 20) {
              let arr= element.describe.split(":");
              this.showAll.push({
                type: 2,
                name: element.name,
                min:0,
                max:100,
                key: element.type,
                value:
                  value || value == 0 ? Number(value) : Number(element.default),
              });
            } else if (type < 30) {
              try {
                // var value = JSON.parse(element.value);
                this.showAll.push({
                  type: 3,
                  name: element.name,
                  key: element.type,
                  options: element.describe.split(";").map((item1) => {
                    return {
                      value: item1.split(":")[0],
                      label: item1.split(":")[1],
                    };
                  }),
                  value:
                    value || value == 0
                      ? String(value)
                      : String(element.defaultValue),
                });
              } catch (error) {
                console.log("select：添加失败" + error);
              }
            }
          });
        }
      },
    },
  },
  methods: {
    getData() {
      var arr = [];
      this.showAll.forEach((element) => {
        arr.push({
          Key: element.key,
          Value: element.value,
        });
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.algorithmConfig {
  width: 800px;
}
</style>