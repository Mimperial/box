<template>
  <div class="neibu">
    <el-row :gutter="20"
      ><el-col :offset="22" :span="2">
        <el-button type="primary" size="small" @click="dialogAddVisible = true"
          >{{$t('html.tjyh')}}</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="createTime" :label="$t('html.cjsj')" align="center">
          </el-table-column>
          <el-table-column prop="userName" :label="$t('html.yhm')" align="center">
          </el-table-column>
          <el-table-column prop="id" :label="$t('html.qxsz')" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="changeUse(scope.row)"
                >{{$t('html.xgqx')}}</el-button
              >
              <el-button
                type="danger"
                @click="deleteUser(scope.row)"
                size="small"
                >{{$t('html.scdel')}}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="$t('html.qxgl')" 
      :close-on-click-modal="false"
    
     :visible.sync="dialogFormVisible">
      <el-tree
        :data="data"
        show-checkbox
        node-key="path"
        ref="tree"
        default-expand-all
        highlight-current
        :props="defaultProps"
        @check="currentChange"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span
            >{{ node.label.title
            }}<el-tag style="margin-left: 20px" effect="plain" size="mini">{{
              $t('html.cd')
            }}</el-tag>
          </span>
        </span>
      </el-tree>
    </el-dialog>
    <el-dialog :title="$t('html.yhtj')" 
      :close-on-click-modal="false"
    :visible.sync="dialogAddVisible">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <el-form-item :label="$t('html.sryhm')"  prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('html.mm')" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('html.qrmm')" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-tree
        :data="data"
        show-checkbox
        node-key="path"
        ref="tree"
        highlight-current
        @check="currentChangeAdd"
        :props="defaultProps"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span
            >{{ node.label.title
            }}<el-tag style="margin-left: 20px" effect="plain" size="mini">{{
              $t('html.cd')
            }}</el-tag>
          </span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">{{$t('html.qkx')}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >{{$t('html.qkd')}}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  userAllApi,
  userAddApi,
  userUpdateApi,
  userDeleteApi,
} from "@/api/article.js";
import { asyncRouters } from "@/router";
import md5 from "md5";
export default {
  computed: {
    labelWidth() {
      var labelWidth = "100px";
      if(this.$i18n.locale == 'en'){
        labelWidth = "150px"
      }
      return labelWidth;
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('js.msgonei')));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('js.msgoneo')));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(this.$t('js.msgonep')));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        name: "",
      },
      addCheckedArr: null,
      rules: {
        pass: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, message: this.$t('js.mhsgone') ,trigger: ["change","blur"] }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ required: true, message: this.$t('js.msgeone'), trigger: "blur" }],
      },
      tableData: [],
      data: JSON.parse(JSON.stringify(asyncRouters[0].children)),
      selectArr: [],
      rolerFrom: {}, //当前角色
      defaultProps: {
        children: "children",
        label: "meta",
      },
      dialogFormVisible: false,
      dialogAddVisible: false,
      loading: false,
    };
  },
  created() {
    var objData = JSON.parse(JSON.stringify(asyncRouters[0].children));
    this.data = this.changeNewData(objData);
    console.log("🤡 ~~ this.changeNewData(objData)", this.changeNewData(objData))
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      userAllApi({}).then((res) => {
        if (res.code == 0) {
          this.tableData = JSON.parse(res.data).reverse();
        }
        this.loading = false;
      });
    },
    changeNewData(data) {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.children) {
          element.children = this.changeNewData(element.children)
        } else {
          if (element.meta.buttonRoles) {
            element.children = [];
            for (let j = 0; j < element.meta.buttonRoles.length; j++) {
              var dataone = element.meta.buttonRoles[j];
              var obj = {
                name: dataone.roles,
                path: dataone.roles,
                meta: {
                  roles: dataone.roles,
                  title: dataone.name,
                },
              };
              element.children.push(obj)
            }
          }
        }
      }
      return data;
    },
    currentChangeAdd(e, w) {
      var changeJson = this.getSelectCon(w.checkedNodes);
      this.addCheckedArr = changeJson;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.addCheckedArr) {
            this.$message.error(this.$t('js.mfsgone'));
            return;
          }
          userAddApi({
            userName: this.ruleForm.name,
            pwd: md5(this.ruleForm.pass),
            rolerList: JSON.stringify(this.addCheckedArr),
          }).then((res) => {
            if (res.code == 0) {
              this.getData();
              this.ruleForm = {
                pass: "",
                checkPass: "",
                name: "",
              };
              (this.addCheckedArr = null), (this.dialogAddVisible = false);
              this.$message({
                type: "success",
                message: this.$t('js.mdsgone'),
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    changeUse(val) {
      this.dialogFormVisible = true;
      let { id, userName, pwd } = val;
      this.rolerFrom = { id, userName, pwd };
      userAllApi({ id, userName }).then((res) => {
        if (res.code == 0) {
          this.selectArr = [];
          var obj = JSON.parse(res.data)[0];
          if (obj.rolerList == "admin") {
            this.$refs.tree.setCheckedNodes(this.data);
          } else {
            this.selectFlag(JSON.parse(obj.rolerList));
            this.$refs.tree.setCheckedKeys(this.selectArr);
          }
        }
      });
    },
    selectFlag(data, list) {
      var routers = list ? list : this.data;
      routers.forEach((element) => {
        if (data.includes(element.meta.roles)) {
          this.selectArr.push(element.path);
        }
        if (element.children) {
          this.selectFlag(data, element.children);
        }
      });
    },
    getSelectCon(checkedKeys) {
      var arr = [];
      checkedKeys.forEach((element) => {
        if (element.meta && (element.meta.roles == 0 || element.meta.roles)) {
          arr.push(element.meta.roles);
        }
      });
      return arr;
    },
    currentChange(e, w) {
      var changeJson = this.getSelectCon(w.checkedNodes);
      userUpdateApi(
        Object.assign(this.rolerFrom, { rolerList: JSON.stringify(changeJson) })
      ).then((res) => {
        if (res.code == 0) {
          this.getData();
          this.$message({
            type: "success",
            message: this.$t('js.masgone'),
          });
        }
      });
    },
    deleteUser(val) {
      this.$confirm(this.$t('js.mssgone'), this.$t('js.msgonex'), {
        confirmButtonText: this.$t('js.msgonez'),
        cancelButtonText: this.$t('js.msgoneq'),
        type: "warning",
      })
        .then(() => {
          userDeleteApi({ id: val.id }).then((res) => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: this.$t('js.mqsgone'),
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.neibu {
  height: 100%;
  padding: 10px;
}
</style>
