<template>
<div>
  <div class="top-search">
    <el-form ref="form" :model="form" :inline="true" class="formClass" label-width="80px">
     <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" type="datetime">
          </el-date-picker> </el-form-item
      >
        <el-form-item :label="$t('html.结束时间')">
          <el-date-picker v-model="form.endTime" type="datetime">
          </el-date-picker> </el-form-item
      >
        <el-form-item v-if="showChangeModel" :label="$t('html.告警类型')">
          <el-select
            multiple
            collapse-tags
            v-model="form.alarmType"
            :placeholder="$t('html.请选择告警类型')"
          >
            <el-option
              v-for="item in alarmOptions"
              :key="item.id"
              :label="item.name"
              :value="item.alarmNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('html.设备')">
          <el-select
            multiple
            v-model="form.cameraId"
            :placeholder="$t('html.请选择设备')"
          >
            <el-option
              v-for="item in camerList"
              :key="item.id"
              :label="item.name"
              :value="item.channelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="model"  label="性别">
          <el-select
            v-model="form.Gender"
            clearable
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in form.sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <div class="top-btn">
    <el-button @click="seach" type="primary">检索</el-button>
      <el-button
        @click="dialogVisibleDownload = true"
        type="primary"
        :disabled="downloadFlag"
        >{{ downloadFlag ? "压缩中" : "下载" }}
        </el-button>
      </div>
    </div>
    <el-dialog
      title="下载文件"
      :visible.sync="dialogVisibleDownload"
      width="30%"
    >
      <div class="content">
        <span class="title">下载类型：</span>
        <el-radio-group v-model="form.download">
          <el-radio label="picture">图片</el-radio>
          <el-radio label="video" v-if="isVideo">视频</el-radio>
          <el-radio label="all" v-if="isVideo">图片+视频</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisibleDownload = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="download"
          >确 定</el-button
        >
      </span>
    </el-dialog>
</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["alarmOptions", "camerList", "isVideo"],
  inject:{
    model:{default:''},
    showChangeModel:{default:''}
  },
  data() {
    return {
      show: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
        xl: 5,
      },
      form: {
        startTime: new Date(new Date() - 7 * 24 * 3600 * 1000), //new Date().toLocaleDateString()
        endTime: new Date(),
        alarmType: [],
        cameraId: [],
        download: "picture",
        Gender:'', // 性别
        sexList:[{label:'男',value:0},{label:'女',value:1}]
      },
      dialogVisibleDownload: false,
    };
  },
  computed: {
    ...mapGetters(["downloadFlag"]),
  },
  methods: {
    seach() {
      var data = JSON.parse(JSON.stringify(this.form));
      data.startTime = new Date(data.startTime).format("yyyy-MM-dd hh:mm:ss");
      data.endTime = new Date(data.endTime).format("yyyy-MM-dd hh:mm:ss");
      data.alarmType = data.alarmType.map((item) => "'" + item + "'").join(",");
      data.cameraId =
        data.cameraId.map((item) => "'" + item + "'").join(",") ||
        this.camerList.map((item) => "'" + item.channelId + "'").join(",");
      this.$emit("seach", data);
    },
    download() {
      var data = JSON.parse(JSON.stringify(this.form));
      data.startTime = new Date(data.startTime).format("yyyy-MM-dd hh:mm:ss");
      data.endTime = new Date(data.endTime).format("yyyy-MM-dd hh:mm:ss");
      data.alarmType = data.alarmType.map((item) => "'" + item + "'").join(",");
      data.cameraId =
        data.cameraId.map((item) => "'" + item + "'").join(",") ||
        this.camerList.map((item) => "'" + item.channelId + "'").join(",");
      this.$emit("download", data);
      this.dialogVisibleDownload = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding-top: 15px;
  padding-bottom: 15px;
}
/deep/ .el-dialog__body {
  border-top: 1px solid rgba($color: #000000, $alpha: 0.2);
}
.content {
  font-size: 14px;
  .title {
    margin: 0 15px;
  }
}
.top-search{
  display: flex;
  justify-content: space-between;
}
</style>