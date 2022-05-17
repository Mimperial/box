<template>
  <div class="people">
    <div class="people-left">
      <div
        style="padding: 30px 10px 10px 30px; box-sizing: border-box"
        class="left-top"
      >
        <BaseIcon title="选择通道"></BaseIcon>
      </div>
      <div class="left-content">
        <div class="search-box">
          <el-input
            placeholder="请输入库名称"
            suffix-icon="el-icon-search"
            v-model="input1"
            style="width: 80%; margin: 0 4%"
            @change="getFaceGroups"
          >
          </el-input>
          <i
            @click="getBankDialog('新建')"
            style="font-size: 20px; font-weight: 900; cursor: pointer"
            class="el-icon-plus"
          ></i>
        </div>

        <div class="content-list">
          <div
            v-for="item in faceGroups"
            :key="item.GroupId"
            class="content-list-itemBox"
            :style="{
              backgroundColor:
                groupActive == item.GroupId ? '#010b56' : '#aaaaaa',
            }"
            @click="faceGroupsChange(item.GroupId)"
          >
            <i class="el-icon-user"></i>
            <span class="text">{{ item.GroupName }}</span>
            <i
              v-show="groupActive == item.GroupId"
              style="margin-right: 20px"
              class="el-icon-edit"
              @click="getBankDialog('修改', item)"
            ></i>
            <i
              @click="deleteFaceGroup(item.GroupId)"
              v-show="groupActive == item.GroupId"
              class="el-icon-delete"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="people-right">
      <div class="right-top">
        <div
          style="padding: 30px 10px 10px 30px; box-sizing: border-box"
          class="right-top-title"
        >
          <BaseIcon title="库内人员"></BaseIcon>
        </div>
        <div class="right-btn">
          <el-row :gutter="10">
            <el-col :span="16">
              <div>
                <el-button @click="getForm('添加')">新增</el-button>
                <el-button>删除</el-button>
                <el-button @click="importShow = !importShow">导入</el-button>
                <el-button>导出</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-input
                  placeholder="请输入库名称"
                  suffix-icon="el-icon-search"
                  v-model="input1"
                  style="width: 80%; margin: 0 4%"
                >
                </el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="right-centent">
        <div class="right-list">
          <div
            @click="getForm('编辑')"
            v-for="item in 18"
            :key="item"
            class="right-list-item"
          >
            <img src="../../../assets/img/ren.png" alt="" />
            <div class="img-title">
              <el-row :gutter="10">
                <el-col :span="12">王翠花</el-col>
                <el-col style="text-align: right" :span="12">女</el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="right-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="[18, 32]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 人员库 -->
    <peopleBankDialog
      :title="bankDialogTitle"
      :bankDialogShow="bankDialogShow"
      :editData="editData"
      @setGroup="getFaceGroups"
    ></peopleBankDialog>
    <!-- 人员 -->
    <peopleFormDialog
      :title="formTitle"
      :bankDialogShow="formShow"
      :editData="formData"
    >
    </peopleFormDialog>
    <!-- 导入 -->
    <peopleImportDialog :bankDialogShow="importShow"> </peopleImportDialog>
  </div>
</template>

<script>
import BaseIcon from "@/components/baseIcon.vue";
import peopleBankDialog from "./component/peopleBankDialog.vue";
import peopleFormDialog from "./component/peopleFormDialog.vue";
import peopleImportDialog from "./component/peopleImportDialog.vue";
import {
  getFaceGroups,
  deleteFaceGroup,
  getFacePersons,
} from "@/api/article.js";

export default {
  components: {
    BaseIcon,
    peopleBankDialog,
    peopleFormDialog,
    peopleImportDialog,
  },
  data() {
    return {
      groupActive: null,
      input1: "",

      page: {
        total: 0,
        size: 18,
        current: 1,
      },
      bankDialogTitle: "新建",
      bankDialogShow: false,
      editData: {},
      formTitle: "添加",
      formShow: false,
      formData: {},
      importShow: false,
      faceGroups: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    async faceGroupsChange(val) {
      const ruleRes = await getFacePersons({ GroupId: val });
      console.log("faceGroupsChange", ruleRes);
      if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg);
      this.groupActive = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getBankDialog(val, item = {}) {
      this.bankDialogTitle = val;
      this.bankDialogShow = !this.bankDialogShow;
      if (val == "修改") {
        this.editData = item;
      }
    },
    getForm(val) {
      this.formTitle = val;
      this.formShow = !this.formShow;
    },
    init() {
      this.getFaceGroups();
    },
    async getFaceGroups(val) {
      console.log("val", val);
      // GroupName
      const ruleRes = await getFaceGroups({ GroupName: val ? val : "" });
      if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg);
      this.faceGroups = ruleRes.data.row;
      if (this.groupActive == null) {
        this.faceGroupsChange(this.faceGroups[0]["GroupId"]);
      }
    },

    async deleteFaceGroup(GroupId) {
      const ruleRes = await deleteFaceGroup({ GroupId });
      this.groupActive = null;
      this.getFaceGroups();
    },
  },
};
</script>

<style lang="scss" scoped>
.people {
  //   min-width: 1660px;
  //   min-height: 820px;
  height: 100%;
  // max-height: 870px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: #efeff4;
  // padding: 20px;
  overflow: hidden;
}

.people-left {
  background-color: white;
  width: 375px;
  height: 100%;
  float: left;
  //   padding: 15px 25px;
  box-sizing: border-box;

  .left-top {
    width: 100%;
    // height: 45px;
    // box-sizing: border-box; 18 -25
    padding: 15px 25px 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #bdbdbd;
  }

  .left-content {
    width: 100%;
    height: 100%;
    margin-top: 15px;

    .search-box {
      .el-input--suffix {
        border: 1px solid #09135b;
      }
    }

    .content-list {
      width: 100%;
      margin-top: 30px;
      .content-list-itemBox {
        width: 100%;
        height: 45px;
        // background-color: #010b56;
        background-color: #aaaaaa;
        color: #fff;
        padding: 10px 20px;
        box-sizing: border-box;
        cursor: pointer;

        .text {
          display: inline-block;
          margin-left: 20px;
          width: 70%;
        }
      }
    }
  }
}

.people-right {
  background-color: white;
  float: right;
  height: 100%;
  width: calc(100% - 385px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 15px 0 15px;

  .right-centent {
    width: 100%;
    height: 100%;
    margin-top: 10px;

    .right-list {
      width: 100%;
      height: 81%;
      overflow: auto;
      //   display: flex;
      //   flex-wrap: wrap;

      .right-list-item {
        width: 15%;
        height: 200px;
        float: left;
        position: relative;

        margin: {
          bottom: 10px;
          right: 10px;
        }

        > img {
          width: 100%;
          height: 100%;
        }

        .img-title {
          background-color: #8e92ad;
          height: 35px;
          position: absolute;
          width: 100%;
          bottom: 0;
          line-height: 35px;
          color: #fff;
          padding: 0 15px;
          font-size: 14px;
          box-sizing: border-box;
        }
      }
    }

    .right-page {
      text-align: center;
    }
  }
}
</style>