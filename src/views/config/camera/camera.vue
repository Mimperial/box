<template>
  <div class="waikuang">
    <el-row>
      <el-col :span="17">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="通道名称">
            <el-input
              v-model="formInline.user"
              placeholder="通道名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(1)">查询</el-button>
            <el-button type="primary" @click="onSubmit">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="5" :span="2">
        <el-button size="" type="primary" @click="addDialogFlag = true"
          >添加通道</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            header-align="center"
            align="center"
            prop="name"
            label="通道名称"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="ip"
            label="通道地址"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="port"
            label="端口"
          >
          </el-table-column>
          <el-table-column header-align="center" prop="url" label="RTSP流地址">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="status"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.status == 1 ? "在线" : "离线" }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" width="100" label="备注">
            <template slot-scope="scope">
              <el-tooltip
                class="remarkItem"
                effect="dark"
                :content="scope.row.remark"
                placement="top"
              >
                <div class="remark">{{ scope.row.remark }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.status == 0"
                @click="lookItem(scope.row)"
                type="text"
                >查看</el-button
              >
              <el-button type="text" @click="editClick(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table></el-col
      >
      <el-col :span="24">
        <div style="text-align: center; margin-top: 20px">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage"
            layout="prev, pager, next"
            :total="page.total"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <ChangeCamera
      :disabled="true"
      title="编辑通道"
      :defaultData="editDefault"
      v-model="editDialogFlag"
      @sureClick="editCamera"
    ></ChangeCamera>
    <ChangeCamera
      title="添加通道"
      v-model="addDialogFlag"
      @sureClick="addCamera"
    ></ChangeCamera>
    <LookCemera
      v-if="lookDialogFlag"
      :title="lookCameraData.name"
      v-model="lookDialogFlag"
      :cameraData="lookCameraData"
    ></LookCemera>
  </div>
</template>

<script>
import {
  addCameraApi,
  editCameraApi,
  delCameraApi,
  getCameraApi,
} from "@/api/article";
import ChangeCamera from "./changeCamera.vue";
import LookCemera from "./lookCemera.vue";
export default {
  components: { ChangeCamera, LookCemera },
  data() {
    return {
      tableData: [],
      addDialogFlag: false,
      editDialogFlag: false,
      editDefault: {},
      lookDialogFlag: false,
      lookCameraData: {},
      totalData: [],
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
      formInline: {
        user: "",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    onSubmit(val) {
      if (this.formInline.user && val === 1) {
        let arr = this.totalData.filter((item) => {
          if (item.name.indexOf(this.formInline.user) > -1) {
            return item;
          }
        });
        this.page.total = arr.length || 0;
        this.page.currentPage = 1;
        this.tableData = arr;
      } else {
        this.formInline.user = "";
        this.getData();
      }
    },
    lookItem(data) {
      this.lookDialogFlag = true;
      this.lookCameraData = data;
    },
    handleDelete(data) {
      this.$confirm(this.$t("js.msgonie"), this.$t("js.msgonex"), {
        confirmButtonText: this.$t("js.msgonez"),
        cancelButtonText: this.$t("js.msgoneq"),
        type: "warning",
      })
        .then(() => {
          delCameraApi({
            id: data.id,
            channelId: data.channelId,
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
        .catch((err) => {
          this.$message({
            type: "info",
            message: this.$t("js.msgonoe"),
          });
        });
    },
    editCamera({ formDate, loading, close, addType }) {
      let {
        id,
        name,
        ip,
        port,
        url,
        remark,
        deviceType,
        userName,
        pwd,
        channelId,
      } = formDate;
      loading();
      editCameraApi({
        id,
        name,
        ip,
        port,
        url,
        remark,
        deviceType,
        userName,
        pwd,
        channelId,
      })
        .then((res) => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: this.$t("js.gmsgone"),
            });
          }
          close();
        })
        .catch((err) => {
          close();
        });
    },
    editClick(data) {
      this.editDefault = JSON.parse(JSON.stringify(data));
      this.editDialogFlag = true;
    },
    addCamera({ formDate, loading, close, addType, resetFields }) {
      let {
        name,
        deviceIp: ip,
        devicePort: port,
        remark = "",
        deviceType,
        userName,
        pwd,
        url,
      } = formDate;
      if (addType == "2") {
        url = this.joinUrl(formDate, deviceType);
      }
      loading();
      addCameraApi({
        name,
        ip,
        port,
        url,
        remark,
        deviceType,
        userName,
        pwd,
      })
        .then((res) => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: this.$t("js.msgonwe"),
            });
            resetFields();
          }
          close();
        })
        .catch((err) => {
          close();
        });
    },
    joinUrl(form, deviceType) {
      let { deviceIp: ip, devicePort: port, userName, pwd } = form;
      if (deviceType == this.$t("js.msgonve")) {
        return `rtsp://${userName}:${pwd}@${ip}:${port}/h264/ch1/main/av_stream`;
      } else if (deviceType == this.$t("js.msgonbe")) {
        return `rtsp://${userName}:${pwd}@${ip}:${port}/cam/realmonitor?channel=1&subtype=0`;
      }
    },
    handleCurrentChange(val) {
      let { page } = this;
      let data = this.totalData.slice(
        (page.currentPage - 1) * page.pageSize,
        page.pageSize + (page.currentPage - 1) * page.pageSize
      );
      this.tableData = data;
    },
    getData() {
      getCameraApi({}).then((res) => {
        if (res.code == 0) {
          var data = JSON.parse(res.data);
          this.page.total = data.length || 0;
          data.forEach((element) => {
            var str,
              ip = "-",
              port = "-";
            if (element.url) {
              var [str, ip = "-", port = "-"] =
                element.url.match(
                  /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\:(\d{1,4})/
                ) || [];
            }
            if (element.devicePort) {
              element.port = element.devicePort;
            } else {
              element.port = port;
            }
            element.ip = ip;
          });
          this.totalData = data;
          this.handleCurrentChange(this.page.currentPage);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tooltip__popper {
  max-width: 200px;
}
.waikuang {
  box-sizing: border-box;
  padding: 20px 30px 0;
  height: calc(100vh - 120px);
  overflow: auto;
  .remark {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>