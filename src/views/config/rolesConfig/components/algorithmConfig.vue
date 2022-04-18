<template>
  <div style="padding: 10px">
    <el-row :gutter="20">
      <el-col :offset="22" :span="2">
        <el-button type="primary" size="small" @click="add">{{
          $t("html.tjsf")
        }}</el-button>
      </el-col>
      <el-table class="maxheight" height="760px" :data="algorithmTable">
        <el-table-column
          property="name"
          :label="$t('html.mz')"
          width="150"
        ></el-table-column>
        <el-table-column property="path" :label="$t('html.tp')">
          <template slot-scope="scope">
            <img :src="scope.row.path" alt="" />
          </template>
        </el-table-column>
        <el-table-column property="path" :label="$t('html.qy')">
          <template slot-scope="scope">
            {{
              !scope.row.Canuse && scope.row.Canuse != "0"
                ? $t("html.zw")
                : scope.row.Canuse == "0"
                ? $t("html.gb")
                : $t("html.qy")
            }}
          </template>
        </el-table-column>
        <el-table-column property="Utools" :label="$t('html.gj')">
          <template slot-scope="scope">
            {{
              scope.row.Utools
                ? options
                    .filter((item) => scope.row.Utools.includes(item.value))
                    .map((item) => item.label)
                    .join("-")
                : "暂无"
            }}
          </template>
        </el-table-column>
        <el-table-column
          property="alarmNumber"
          :label="$t('html.gjbh')"
        ></el-table-column>
        <el-table-column property="address" :label="$t('html.pzk')">
          <template slot-scope="scope">
            <div
              v-show="item.name"
              v-for="(item, index) in scope.row.inputConfig"
              :key="index"
            >
              {{ item.name }}：{{ item.type }} :{{ item.describe }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" property="address" :label="$t('html.cz')">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="change(scope.row)">{{
              $t("html.xg")
            }}</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteData(scope.row)"
              >{{ $t("html.scdel") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog
      width="30%"
      :title="title"
      :visible.sync="innerVisible"
      append-to-body
      :before-close="beforClose"
    >
      <el-row>
        <el-form
          :model="algorithmForm"
          :label-width="labelWidth"
          ref="ruleForm"
          :rules="rules"
        >
          <el-col :span="24">
            <el-form-item :label="$t('html.sfmc')" prop="name">
              <el-input
                v-model="algorithmForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('html.tpbase64')" prop="path">
              <!-- <el-input
                v-model="algorithmForm.path"
                autocomplete="off"
              ></el-input> -->
              <el-upload
                action="#"
                :limit="1"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="changeFile"
                :file-list="fileList"
                :on-exceed="onExceed"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="scope">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="algorithmForm.path"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(scope)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('html.gjbh')" prop="alarmNumber">
              <el-input
                v-model="algorithmForm.alarmNumber"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警启用" prop="Canuse">
              <el-switch
                v-model="algorithmForm.Canuse"
                active-value="1"
                inactive-value="0"
                :active-text="$t('html.kq')"
                :inactive-text="$t('html.gb')"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="语音地址" prop="MusicAddr">
              <el-input
                v-model="algorithmForm.MusicAddr"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 50px">
            <el-form-item label="语音启用" prop="MusicStatus">
              <el-switch
                v-model="algorithmForm.MusicStatus"
                active-value="1"
                inactive-value="0"
                :active-text="$t('html.kq')"
                :inactive-text="$t('html.gb')"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 50px">
            <el-form-item :label="$t('html.gj')" prop="Utools">
              <el-select
                v-model="algorithmForm.Utools"
                multiple
                style="width: 100%"
                :placeholder="$t('html.qxz')"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="24" style="height: 50px">-->
<!--            <el-form-item :label="$t('html.bjjg')">-->
<!--              <el-switch-->
<!--                  v-model="algorithmForm.alarmInterval"-->
<!--                  active-value="1"-->
<!--                  inactive-value="0"-->
<!--                  :active-text="$t('html.kq')"-->
<!--                  :inactive-text="$t('html.gb')">-->
<!--              </el-switch>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="24" style="height: 50px">-->
<!--            <el-form-item :label="$t('html.mbkdx')">-->
<!--              <el-switch-->
<!--                  v-model="algorithmForm.targetSize"-->
<!--                  active-value="1"-->
<!--                  inactive-value="0"-->
<!--                  :active-text="$t('html.kq')"-->
<!--                  :inactive-text="$t('html.gb')">-->
<!--              </el-switch>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="24" style="height: 50px">-->
<!--            <el-form-item :label="$t('html.yzkq')">-->
<!--              <el-switch-->
<!--                  v-model="algorithmForm.isThresholdvalue"-->
<!--                  active-value="1"-->
<!--                  inactive-value="0"-->
<!--                  :active-text="$t('html.kq')"-->
<!--                  :inactive-text="$t('html.gb')">-->
<!--              </el-switch>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col
            :span="24"
            v-for="(item, index) in algorithmForm.inputConfig"
            :key="index"
            style="padding-top: 10px"
          >
            <el-col :span="10" style="height: 45px">
              <el-form-item :label="$t('html.mz')" label-width="80px">
                <el-input v-model="item.name" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 45px">
              <el-form-item :label="$t('html.dz')" label-width="100px">
                <el-input v-model="item.type" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="height: 50px">
              <el-form-item :label="$t('html.mr')" label-width="80px">
                <el-input v-model="item.default" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 50px">
              <el-form-item :label="$t('html.ms')" label-width="100px">
                <el-input v-model="item.describe" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <i
                @click="algorithmForm.inputConfig.splice(index, 1)"
                class="el-icon-delete"
                style="
                  font-size: 18px;
                  margin: 8px 0 0 10px;
                  cursor: pointer;
                  color: #f56c6c;
                "
              ></i>
            </el-col>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addConfig()">{{
          $t("html.tjpz")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="changeData('ruleForm')"
          >{{ title }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAlgorithmListApi,
  addAlgorithmApi,
  setAlgorithmListApi,
  deleteAlgorithmApi,
} from "@/api/article.js";
import { v4 as uuidv4 } from "uuid";
export default {
  computed: {
    labelWidth() {
      var labelWidth = "100px";
      if (this.$i18n.locale == "en") {
        labelWidth = "160px";
      }
      return labelWidth;
    },
  },
  data() {
    return {
      fileList: [],
      innerVisible: false,
      algorithmTable: [],
      options: [
        {
          value: "3",
          label: this.$t("js.mysgone"),
        },
        {
          value: "4",
          label: this.$t("js.musgone"),
        },
        {
          value: "5",
          label: this.$t("js.misgone"),
        },
      ],
      algorithmForm: {
        name: "",
        path: "",
        alarmNumber: "",
        Canuse: "0", //用于管控算法开启
        MusicAddr:"",//用于控制语音报警地址
        MusicStatus:"0",//用于控制语音报警地址开启或者关闭
        Utools: [], //工具  矩形、框选、绊线  可用/不可用
        inputConfig: [],
        // alarmInterval: '', // 报警间隔
        // targetSize: '', // 目标框大小
        // isThresholdvalue: '' // 阈值开启
      },
      rules: {
        name: [
          { required: true, message: this.$t("js.mosgone"), trigger: "blur" },
        ],
        path: [
          { required: true, message: this.$t("js.mpsgone"), trigger: "blur" },
        ],
        alarmNumber: [
          { required: true, message: this.$t("js.msgzone"), trigger: "blur" },
        ],
      },
      title: this.$t("js.msgxone"),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    changeFile(file, fileList) {
      this.fileList = fileList;
      this.blobToDataURL(file.raw, (base64Url) => {
        this.algorithmForm.path = base64Url;
      });
    },
    onExceed() {
      this.$message.error("最多只能传一张图片，请删除后在上传");
    },
    handleRemove(file) {
      this.fileList = [];
      this.algorithmForm.path = "";
    },
    blobToDataURL(blob, cb) {
      let reader = new FileReader();
      reader.onload = function (evt) {
        let base64 = evt.target.result;
        cb(base64);
      };
      reader.readAsDataURL(blob);
    },
    addConfig() {
      if (
        this.algorithmForm.inputConfig &&
        this.algorithmForm.inputConfig.length >= 4
      ) {
        this.$message.error(this.$t("js.msgcone"));
        return;
      }
      if (!this.algorithmForm.inputConfig) {
        this.$set(this.algorithmForm, "inputConfig", []);
      }
      this.algorithmForm.inputConfig.push({
        name: "",
        type: "",
        describe: "",
        default: "",
      });
    },
    getData() {
      getAlgorithmListApi({}).then((res) => {
        if (res.code == 0) {
          var obj = res.data ? JSON.parse(res.data) : [];
          console.log(obj);
          for (let i = 0; i < obj.length; i++) {
            if (obj[i].inputConfig && obj[i].inputConfig != '""') {
              obj[i].inputConfig = JSON.parse(obj[i].inputConfig);
            } else {
              obj[i].inputConfig = [];
            }
          }
          this.algorithmTable = obj.reverse();
        }
      });
    },
    add() {
      this.algorithmForm = {
        name: "",
        path: "",
        Canuse: "0", //用于管控算法开启
        Utools: [], //工具  矩形、框选、绊线  可用/不可用
      };
      this.innerVisible = true;
      this.title = this.$t("js.msgxone");
    },
    change(data) {
      this.title = this.$t("js.msgvone");
      this.innerVisible = true;
      var obj = JSON.parse(JSON.stringify(data));
      this.fileList.push({ name: obj.name, url: obj.path });
      obj.Utools = obj.Utools && obj.Utools.split(",");
      this.algorithmForm = obj;
    },
    changeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == this.$t("js.msgxone")) {
            //添加
            var inputConfig = this.algorithmForm.inputConfig
              ? this.algorithmForm.inputConfig.filter(
                  (item) => item.name && item.type
                )
              : "";
            var obj = JSON.parse(JSON.stringify(this.algorithmForm));
            obj.Utools = obj.Utools ? obj.Utools.join(",") : "";
            var sendData = Object.assign(obj, {
              inputConfig: inputConfig.map((item) => {
                if (!item.id) {
                  item.id = uuidv4();
                }
                return item;
              }),
            });
            addAlgorithmApi(sendData).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("js.mdsgone"),
                });
                this.getData();
                this.innerVisible = false;
                this.algorithmForm = {
                  name: "",
                  path: "",
                  Canuse: "0", //用于管控算法开启
                  Utools: [], //工具  矩形、框选、绊线  可用/不可用
                };
                this.fileList = [];
              }
            });
          } else if (this.title == this.$t("js.msgvone")) {
            //修改
            var inputConfig = this.algorithmForm.inputConfig
              ? this.algorithmForm.inputConfig.filter(
                  (item) => item.name && item.type
                )
              : "";
            var obj = JSON.parse(JSON.stringify(this.algorithmForm));
            obj.Utools = obj.Utools.join(",");
            setAlgorithmListApi(
              Object.assign(obj, {
                inputConfig: inputConfig.map((item) => {
                  if (!item.id) {
                    item.id = uuidv4();
                  }
                  return item;
                }),
              })
            ).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("js.gmsgone"),
                });
                this.getData();
                this.innerVisible = false;
                this.fileList = [];
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    deleteData(data) {
      this.$confirm(this.$t("js.msgbone"), this.$t("js.msgonex"), {
        confirmButtonText: this.$t("js.msgonez"),
        cancelButtonText: this.$t("js.msgoneq"),
        type: "warning",
      })
        .then(() => {
          deleteAlgorithmApi({
            id: data.id,
          }).then((res) => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: this.$t("js.mqsgone"),
              });
            }
          });
        })
        .catch(() => {});
    },
    beforClose() {
      this.fileList = [];
      if (this.algorithmForm.inputConfig) {
        this.algorithmForm.inputConfig = this.algorithmForm.inputConfig.filter(
          (item) => item.name
        );
      }
      this.innerVisible = false;
    },
  },
};
</script>

<style>
.all {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
// .maxheight {
//   max-height: 760px;
//   overflow: hidden;
//   overflow-y: auto;
//   &::-webkit-scrollbar {
//     width: 5px;
//     height: 1px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 10px;
//     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     background: #535353;
//   }
// }
</style>

