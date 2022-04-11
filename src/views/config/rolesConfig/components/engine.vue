<template>
  <div>
    <el-dialog
      :title="$t('html.编辑')"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <el-dialog
        width="40%"
        :title="title"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
          <el-form-item prop="type" :label="$t('html.dz')">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('html.名称')">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="value" :label="$t('html.值')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              $t("html.提交")
            }}</el-button>
            <el-button @click="innerVisible = false">{{
              $t("js.msgoneq")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-row>
        <el-col :span="24">
          <el-button @click="addConfig" type="success" size="small">{{
            $t("js.msgxone")
          }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-radio
            v-model="radioKey"
            v-for="(item, index) in configData.value"
            :key="index"
            :label="item.key"
            >{{ item.key }}</el-radio
          >
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="getTable" style="width: 100%">
          <el-table-column prop="type" :label="$t('html.dz')">
          </el-table-column>
          <el-table-column prop="name" :label="$t('html.名称')">
          </el-table-column>
          <el-table-column prop="value" :label="$t('html.值')">
          </el-table-column>
          <el-table-column :label="$t('html.cz')">
            <template slot-scope="scope">
              <el-button
                @click="editData(scope.$index, scope.row)"
                size="small"
                >{{ $t("html.xg") }}</el-button
              >
              <el-button
                @click="deleteData(scope.$index)"
                type="danger"
                size="small"
                >{{ $t("html.scdel") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("html.qkx")
        }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{
          $t("html.qkd")
        }}</el-button>
      </span>
    </el-dialog>

    <el-table :data="dataArr" style="width: 100%">
      <el-table-column prop="type" :label="$t('html.dz')"> </el-table-column>
      <el-table-column prop="name" :label="$t('html.名称')"> </el-table-column>
      <el-table-column :label="$t('html.cz')">
        <template slot-scope="scope">
          <el-button @click="setConfig(scope.row)" size="small">{{
            $t("html.设置")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getEngineGetApi, getEngineUpdateApi } from "@/api/article.js";
export default {
  computed: {
    getTable() {
      var data =
        this.configData.value &&
        this.configData.value.find((item) => item.key == this.radioKey);
      return data ? data.data : [];
    },
  },
  data() {
    return {
      form: {
        type: "",
        name: "",
        value: "",
      },
      rules: {
        type: [
          { required: true, message: this.$t("js.mosgone"), trigger: "blur" },
        ],
        name: [
          {
            required: true,
            message: this.$t("js.请输入地址"),
            trigger: "blur",
          },
        ],
        value: [
          { required: true, message: this.$t("js.请输入值"), trigger: "blur" },
        ],
      },
      configData: {},
      editIndex: -1,
      radioKey: 0,
      dialogVisible: false,
      innerVisible: false,
      dataArr: [],
      title: this.$t("js.msgxone"),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getEngineGetApi()
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              res.data = JSON.parse(res.data);
              res.data = res.data.filter((item) => {
                var num = parseInt(item.type.substring(item.type.length - 2));
                return num >= 10;
              });
            } else {
              res.data = [];
            }
            this.dataArr = res.data.map((item) => {
              var num = parseInt(item.type.substring(item.type.length - 2));
              if (num >= 10 && num < 20) {
                //滑块
                var [min, max] = item.describe
                  .split(":")
                  .map((item) => parseInt(item)); //获取最大值和最小值
                if (!item.value) {
                  item.value = [];
                  for (let i = min; i <= max; i++) {
                    item.value.push({
                      key: i,
                      data: [],
                    });
                  }
                } else {
                  var arrNum = [];
                  for (let i = min; i <= max; i++) {
                    arrNum.push(i);
                  }
                  item.value = JSON.parse(item.value)
                  item.value = item.value.filter((item1) =>
                    arrNum.some((item2) => item2 == item1.key)
                  );
                  if (item.value.length != arrNum.length) {
                    //判断是否和之前的相同要是有变化要进行同步  过滤完长度要是不相等就说明是不同的
                    arrNum.forEach((element) => {
                      if (!item.value.find((item1) => item1.key == element)) {
                        item.value.push({
                          key: element,
                          data: [],
                        });
                      }
                    });
                  }
                }
              } else if (num >= 20 && num < 30) {
                var optionArr = item.describe.split(";");
                if (!item.value) {
                  item.value = [];
                  optionArr.forEach((element) => {
                    item.value.push({
                      key: element,
                      data: [],
                    });
                  });
                } else {
                  item.value = JSON.parse(item.value)
                  item.value = item.value.filter((item1) =>
                    optionArr.some((item2) => item2 == item1.key)
                  );
                  if (item.value.length != optionArr.length) {
                    //判断是否和之前的相同要是有变化要进行同步  过滤完长度要是不相等就说明是不同的
                    optionArr.forEach((element) => {
                      if (!item.value.find((item) => item.key == element)) {
                        item.value.push({
                          key: element,
                          data: [],
                        });
                      }
                    });
                  }
                }
              }
              return item;
            });
          }
        })
        .catch((err) => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == this.$t("js.msgxone")) {
            var engineData = JSON.parse(JSON.stringify(this.configData.value));
            engineData.map((item) => {
              if (item.key == this.radioKey) {
                item.data.push(JSON.parse(JSON.stringify(this.form)));
              }
            });
            this.updataData(engineData, this.$t("js.mdsgone"), () => {
              this.$refs[formName].resetFields();
            });
          } else {
            var engineData = JSON.parse(JSON.stringify(this.configData.value));
            engineData.map((item) => {
              if (item.key == this.radioKey) {
                item.data[this.editIndex] = JSON.parse(
                  JSON.stringify(this.form)
                );
              }
            });
            this.updataData(engineData, this.$t("js.masgone"), () => {
              this.$refs[formName].resetFields();
            });
          }
        } else {
          return false;
        }
      });
    },
    deleteData(index) {
      var engineData = JSON.parse(JSON.stringify(this.configData.value));
      engineData.map((item) => {
        if (item.key == this.radioKey) {
          item.data.splice(index, 1);
        }
      });
      this.updataData(engineData, this.$t("js.mqsgone"));
    },
    editData(index, data) {
      this.title = this.$t("js.msgvone");
      this.editIndex = index;
      this.form = JSON.parse(JSON.stringify(data));
      this.innerVisible = true;
    },
    addConfig() {
      this.title = this.$t("js.msgxone");
      this.innerVisible = true;
    },
    setConfig(data) {
      this.configData = data;
      this.radioKey = data.value[0].key;
      this.dialogVisible = true;
    },
    updataData(engineData, str, callback) {
      getEngineUpdateApi({
        id: this.configData.id,
        engineData: JSON.stringify(engineData),
      }).then((res) => {
        if (res.code == 0) {
          this.configData.value = engineData;
          this.$message({
            message: str,
            type: "success",
          });
          if (callback) {
            callback();
          }
          this.innerVisible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>