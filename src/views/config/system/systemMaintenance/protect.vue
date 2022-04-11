<template>
  <div class="waibu">
    <div class="list">
      <div @click="reboot" class="defaltz btn">{{ $t("html.cq") }}</div>
      <div class="wenzi">{{ $t("html.cxqdsb") }}</div>
    </div>
    <div class="list">
      <div @click="recovery('0')" class="defaltz btn">
        {{ $t("html.jdhf") }}
      </div>
      <div class="wenzi">{{ $t("html.jdhfsbcs") }}</div>
    </div>
    <div class="list" v-if="roles == 'admin'">
      <div @click="recovery('1')" class="defaltz btn">
        {{ $t("html.wqhf") }}
      </div>
      <div class="wenzi">{{ $t("html.wqhfsbcsdccsz") }}</div>
    </div>
    <div class="list">
      <div class="defaltz">{{ $t("html.xtsj") }}</div>
      <div class="wenzi">
        <el-input size="small" v-model="input"></el-input>
        <div class="defaltz btnli" @click="selectClick">
          {{ $t("html.xz") }}
          <input
            type="file"
            @change="getFile"
            accept=".tar.gz"
            name="file0"
            ref="filElem"
            style="display: none"
          />
        </div>
        <div @click="upgrade" class="defaltz btnli up">{{ $t("html.sj") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { rebootApi, recoveryApi, upgradeApi, uploadApi } from "@/api/article";
export default {
  data() {
    return {
      input: "",
    };
  },
  computed: {
    roles() {
      return this.$store.state.user.roles;
    },
  },
  mounted() {
    console.log();
  },
  methods: {
    reboot() {
      this.$confirm(this.$t("js.nmsgone"), this.$t("js.msgonex"), {
        confirmButtonText: this.$t("js.msgonez"),
        cancelButtonText: this.$t("js.msgoneq"),
        type: "warning",
      })
        .then(() => {
          rebootApi({}).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: this.$t("js.bmsgone"),
              });
            }
          });
        })
        .catch(() => {});
    },
    recovery(type) {
      var message = "";
      if (type === "0") {
        message = this.$t("js.vmsgone");
      } else {
        message = this.$t("js.cmsgone");
      }
      this.$confirm(message, this.$t("js.msgonex"), {
        confirmButtonText: this.$t("js.msgonez"),
        cancelButtonText: this.$t("js.msgoneq"),
        type: "warning",
      })
        .then(() => {
          recoveryApi({
            type: type,
          }).then((res) => {
            console.log(res);
            if (JSON.parse(res.data).Code == 0) {
              this.$message({
                type: "success",
                message:
                  type == "0" ? this.$t("js.xmsgone") : this.$t("js.zmsgone"),
              });
            }
          });
        })
        .catch(() => {});
    },
    upgrade() {
      if (this.input) {
        this.$confirm(this.$t("js.qmsgone"), this.$t("js.msgonex"), {
          confirmButtonText: this.$t("js.msgonez"),
          cancelButtonText: this.$t("js.msgoneq"),
          type: "warning",
        })
          .then(() => {
            upgradeApi({
              // url: this.input,
            }).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: this.$t("js.wmsgone"),
                });
              } else {
                this.$message({
                  type: "error",
                  message: this.$t("js.emsgone"),
                });
              }
            });
          })
          .catch(() => {});
      } else {
        this.$message.error(this.$t("js.rmsgone"));
      }
    },
    selectClick() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    getFile() {
      var Sname = this.$refs.filElem.files[0].name.split(".");
      if (Sname.length < 3 && Sname.pop() != "gz" && Sname.pop() != "tar") {
        this.$message({
          type: "warning",
          message: this.$t("js.tmsgone"),
        });
        return;
      }
      uploadApi({
        file: this.$refs.filElem.files[0],
      }).then((res) => {
        this.input = this.$refs.filElem.files[0].name;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.waibu {
  padding-left: 40px;
}
.list {
  display: flex;
  align-items: center;
  width: 100%;
  .defaltz {
    width: 95px;
    height: 32px;
    font-size: 13px;
    line-height: 32px;
    text-align: center;
    color: #000;
    cursor: pointer;
    border-radius: 5px;
    &.btn {
      text-align: center;
      border: 1px solid #010b56;
      color: #010b56;
      user-select: none;
      &:hover {
        background-color: rgba($color: #010b56, $alpha: 0.1);
      }
    }
  }
  .wenzi {
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 53px;
    .btnli {
      margin: 0 5px;
      background: white;
      color: #409eff;
      border: 1px solid #409eff;
      box-sizing: border-box;
      &.up {
        color: white;
        background: #409eff;
        border: none;
      }
      &:hover {
        color: #409eff;
        background-color: #ecf5ff;
      }
    }
  }
}
</style>