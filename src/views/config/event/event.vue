<template>
  <div class="event">
    <div class="eventLeft">
      <div class="selectChannel">
        <div style="padding: 15px 0 0 30px; box-sizing: border-box">
          <BaseIcon title="选择通道"></BaseIcon>
        </div>
        <div class="content">
          <el-table
            @row-click="clickSelectChannel"
            size="small"
            height="236"
            :data="selectChannels"
            style="width: 100%"
          >
            <el-table-column align="center" label="" width="50">
              <template slot-scope="scope">
                <el-radio v-model="selectCamerId" :label="scope.row.id">{{
                  ""
                }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="通道名称" width="110">
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="克隆算法设置"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="cloningHighlight(scope.row.algInfos)"
                  @click="cloning(scope.row)"
                  type="text"
                  size="small"
                >
                  克隆
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="algorithmSet">
        <div style="padding: 15px 0 0 30px; box-sizing: border-box">
          <BaseIcon title="算法设置"></BaseIcon>
        </div>
        <div class="selectArithmetic">
          <el-select v-model="currentRuleId" placeholder="请选择" style="margin-left: 20px;width: 254px" @change="handleSelect">
            <el-option
                v-for="item in ruleList"
                :key="item.RuleId"
                :label="item.RuleName"
                :value="item.RuleId">
            </el-option>
          </el-select>
        </div>
        <div class="content">
          <el-checkbox-group v-model="selectAlgorithmIds">
            <div v-for="item in algorithmList" :key="item.id" :class="{algorithmKuang: true,select: clickAlgorithmId === item.id,}" @click="clickAlgorithm(item)">
              <div class="checkBox">
                <el-checkbox @change="startOrClose(item)" :label="item.alarmNumber">{{ "" }}</el-checkbox>
              </div>
              <div class="algorithmIcon">
                <img :src="item.path" />
              </div>
              <div class="title">{{ item.name }}</div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="eventRight">
      <EventRight
        ref="EventRight"
        :cameraData="selectCamera"
        :algorithmData="selectAlgorithm"
        @save="save"
      ></EventRight>
    </div>
    <!-- 克隆弹窗 -->
    <CloningDialog
      title="克隆算法配置"
      v-model="cloningDialogVisible"
      :cloningData="cloningData"
      :otherCamera="otherCamera"
      @sure="cloningSure"
    ></CloningDialog>
  </div>
</template>

<script>
import {getAlgorithmApi, getAlgorithmListApi, getCameraApi, getRule, setAlgorithmApi, editCameraApi} from "@/api/article";
import BaseIcon from "@/components/baseIcon.vue";
import EventRight from "./component/eventRight.vue";
import CloningDialog from "./component/cloningDialog.vue";

export default {
  components: {
    BaseIcon,
    EventRight,
    CloningDialog,
  },
  data() {
    return {
      currentRuleId: '',  // 规则id
      selectChannels: [], //所有的"选择通道"
      selectCamerId: "",
      algorithmList: [],
      clickAlgorithmId: "",
      selectAlgorithmIds: [], //选中的算法ids
      algorithmDataCacle: {}, //缓存报警数据对于切换算法设置报错上次的数据 AlgCode:object
      cloningDialogVisible: false, //控制克隆弹框内容
      cloningData: {}, //克隆数据的原始data
      ruleList: [], // 规则列表
    };
  },
  async created() {
    await this.getCamera();
    this.getAlgorithmList();
    this.getRuleList();
  },
  computed: {
    otherCamera() {
      //非选中的相机
      return this.selectChannels.filter((item) => item.id !== this.selectCamerId);
    },
    selectCamera() {
      var cameraData = this.selectChannels.find(
        (item) => item.id === this.selectCamerId
      );
      if (cameraData && cameraData.algInfos && cameraData.algInfos.length > 0) {
        cameraData.algInfos.forEach((element) => {
          this.algorithmDataCacle[element.AlgCode] = element;
        });
      }
      return cameraData;
    },
    selectAlgorithm() {
      var algorithmData = this.algorithmList.find(
        (item) => item.id === this.clickAlgorithmId
      );
      return algorithmData;
    },
  },
  methods: {
    async cloningSure(data) {
      let { loading, close, loadingText, algInfos, length, ids, setCloseFlag } =
        data;
      if (!ids || ids.length == 0) {
        this.$message({
          message: "请勾选需要克隆的相机！",
          type: "warning",
        });
        return;
      }
      loading();
      setCloseFlag(true); //克隆中禁止关闭
      try {
        for (let i = 0; i < length; i++) {
          loadingText("正在克隆：" + i + "/" + length);
          await setAlgorithmApi({
            id: ids[i],
            AlgInfos: JSON.stringify(algInfos),
          });
        }
        loadingText("请稍等...");
        setTimeout(() => {
          this.getCamera(false);
          setCloseFlag(false);
          close();
          this.$message({
            message: "克隆完成！",
            type: "success",
          });
        }, 500);
      } catch (error) {
        setCloseFlag(false);
        close();
        this.$message.error("克隆失败,请检查接口！");
      }
    },
    cloning(data) {
      this.cloningData = data;
      this.cloningDialogVisible = true;
    },
    clickAlgorithm(item) {
      //点击切换算法设置
      if (this.clickAlgorithmId != item.id) {
        this.clickAlgorithmId = item.id;
        var data = this.$refs.EventRight.getInfo();
        /**
         * 取出的是上一个的数据
         */
        this.setAlgorithmDataCacle(data);
      }
    },
    /**
     * 开启或者关闭算法
     */
    startOrClose(item) {
      let { alarmNumber } = item;
      if (this.algorithmDataCacle[alarmNumber]) {
        this.setAlgorithmDataCacleAlarmNumber(alarmNumber);
      }
    },
    setAlgorithmDataCacle(data) {
      let { areas, times, alarmNumber, Parameters } = data;

      if (!this.algorithmDataCacle[alarmNumber]) {
        this.algorithmDataCacle[alarmNumber] = {
          AlgCode: alarmNumber,
          Are: areas,
          Time: times,
          Parameters: Parameters,
        };
        this.setAlgorithmDataCacleAlarmNumber(alarmNumber);
      } else {
        this.algorithmDataCacle[alarmNumber]["Are"] = areas;
        this.algorithmDataCacle[alarmNumber]["Time"] = times;
        this.setAlgorithmDataCacleAlarmNumber(alarmNumber);
        this.algorithmDataCacle[alarmNumber]["Parameters"] = Parameters;
      }
    },
    setAlgorithmDataCacleAlarmNumber(alarmNumber) {
      this.algorithmDataCacle[alarmNumber]["Switch"] =
        this.selectAlgorithmIds.includes(alarmNumber) ? 1 : 0;
    },
    clearCacleData() {
      //清除上次缓存的信息 切换算法设置报错上次的数据
      this.algorithmDataCacle = {};
    },
    async save({ data, setLoading }) {
      this.setAlgorithmDataCacle(data);
      // 给通道设置规则
      await editCameraApi({id: this.selectCamerId, RuleId: this.currentRuleId});
      var AlgInfos = [];
      if (this.algorithmList && this.algorithmList.length > 0 ) {
        // 在算法数组中过滤掉当前规则里不存在的算法
        this.selectAlgorithmIds =  this.selectAlgorithmIds.filter((item) => this.algorithmList.some((ele) => ele.alarmNumber === item))
      }

      this.selectAlgorithmIds.forEach((item) => {


        const element = JSON.parse(
            JSON.stringify(this.algorithmDataCacle[item])
        );
        if (element.Parameters && element.Parameters.length > 0) {
          element.Parameters.forEach((item) => {
            item.Value = String(item.Value);
          });
        }
        AlgInfos.push(element);
      })

      // for (const key in this.algorithmDataCacle) {
      //   console.log(key)
      //
      //   const element = JSON.parse(
      //     JSON.stringify(this.algorithmDataCacle[key])
      //   );
      //   if (element.Parameters && element.Parameters.length > 0) {
      //     element.Parameters.forEach((item) => {
      //       item.Value = String(item.Value);
      //     });
      //   }
      //   AlgInfos.push(element);
      // }
      setLoading(true);
      setAlgorithmApi({
        id: this.selectCamera.id,
        AlgInfos: JSON.stringify(AlgInfos),
      })
        .then((res) => {
          if (res.code == 0) {
            this.clearCacleData();
            this.getCamera(false);
            this.$message({
              type: "success",
              message: this.$t("js.msgonxe"),
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    },
    async clickSelectChannel(row) {
      const { id, RuleId } = row
      // 切换相机
      if (this.selectCamerId !== id) {
        this.selectCamerId = id;
        this.getAlgorithm();
        this.clearCacleData();
      }
      // 获取通道下的规则
      const ruleRes = await getRule({RuleId: RuleId})
      if(ruleRes.code !== 0 ) return this.$message.error(ruleRes.msg)
      let data = JSON.parse(ruleRes.data)
      this.currentRuleId = data[0].RuleId
      await this.handleSelect(this.currentRuleId)
    },
    getAlgorithm() {
      getAlgorithmApi({ id: this.selectCamerId }).then((res) => {
        //根据id获取配置的算法
        try {
          var data = JSON.parse(res.data);
          this.selectAlgorithmIds = data
            .filter((item) => item.AlgCode && item.Switch == 1)
            .map((item) => item.AlgCode);
        } catch (error) {
          this.selectAlgorithmIds = [];
          console.log("暂时没有进行配置的算法");
        }
      });
    },
    getAlgorithmList() {
      //获取所有
      getAlgorithmListApi({}).then((res) => {
        try {
          var data = JSON.parse(res.data);
          this.algorithmList = data;
          this.clickAlgorithmId = data[0].id;
        } catch (error) {
          console.log(error, "解析错误请检查getAlgorithmListApi接口");
        }
      });
    },
    getCamera(setSelectCamerId = true) {
      getCameraApi({})
        .then((res) => {
          if (res.code == 0) {
            var data = JSON.parse(res.data);
            console.log(data, "data")
            if (data && data.length > 0) {
              if (setSelectCamerId) {
                //设置初始化相机选择
                this.selectCamerId = data[0].id;
                this.currentRuleId = data[0].RuleId;
              }
              this.selectChannels = data.map((item) => {
                //这里进行测报警信息数据转换成json格式
                try {
                  item.algInfos = JSON.parse(item.algInfos);
                } catch (error) {
                  console.log("解析失败，可能没有报警边框设置！");
                }
                return item;
              });
              this.getAlgorithm(); //获取当前相机的算法
              // this.handleSelect(this.currentRuleId)
            }
          }
        })
        .catch((err) => {});
    },
    cloningHighlight(data) {
      //判断克隆字是否高亮显示
      var flag = false;
      if (data && data.length > 0) {
        flag = data.some((item) => item.Time && item.Are);
      }
      return !flag;
    },
    // 获取规则列表
    async getRuleList() {
      const result = await getRule({})
      const {code, msg, data} = result
      let newData = JSON.parse(data)
      if(code !== 0){
        return this.$message.error(msg)
      }
      this.ruleList = newData.reverse()
      if (!this.currentRuleId) {
        this.currentRuleId = newData[0].RuleId;
      }
      await this.handleSelect(this.currentRuleId);
    },
    // 选择规则
    async handleSelect(currentId){
      try {
        const result = await getAlgorithmListApi({})
        this.algorithmList = JSON.parse(result.data);
      } catch (err) {
        console.log(err.error, "解析错误请检查getAlgorithmListApi接口");
      }
      let currentItem = this.ruleList.find((item) => item.RuleId === currentId)
      if (!currentItem &&  this.ruleList &&  this.ruleList.length > 0) {
        currentItem = this.ruleList[0];
        currentItem = this.ruleList[0];
      }
      // 在算法数组中过滤掉当前规则里不存在的算法
      this.algorithmList =  this.algorithmList.filter((item) => currentItem?.AlgList?.some((ele) => ele === item.alarmNumber))
    }
  },
};
</script>

<style>
</style>
<style lang="scss" scoped>
/deep/ .is-scrolling-none::-webkit-scrollbar {
  width: 5px;
}
/deep/ .is-scrolling-none::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
/deep/ .is-scrolling-none::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.event {
  min-width: 1660px;
  min-height: 820px;
  height: 100%;
  // max-height: 870px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: #efeff4;
  // padding: 20px;
  .eventLeft {
    width: 375px;
    height: 100%;
    float: left;
    .selectChannel {
      width: 100%;
      // box-sizing: border-box; 18 -25
      padding: 15px 25px;
      box-sizing: border-box;
      background-color: white;
    }
    .algorithmSet {
      width: 100%;
      height: calc(100% - 311px);
      overflow: hidden;
      // box-sizing: border-box;
      box-sizing: border-box;
      padding: 15px 25px 14px;
      background-color: white;
      margin-top: 10px;
      .content {
        height: calc(100% - 91px);
        margin-top: 10px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 5px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
        .algorithmKuang {
          position: relative;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          width: 116px;
          height: 77px;
          border: 1px solid #d7d7d7;
          box-sizing: border-box;
          font-size: 13px;
          margin-top: 15px;
          margin-left: 20px;
          background-color: rgba(239, 239, 244, 0.2);
          .checkBox {
            position: absolute;
            right: 0px;
            top: 2px;
          }
          &.select {
            border: 1px solid #409eff;
            background-color: rgba($color: #409eff, $alpha: 0.1);
          }
          .algorithmIcon {
            width: 25px;
            height: 25px;
            margin: 0 auto;
            padding-top: 15px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .title {
            text-align: center;
            margin-top: 10px;
          }
          &:nth-child(1) {
            margin-top: 0px;
          }
          &:nth-child(2) {
            margin-top: 0px;
          }
        }
      }
    }
  }
  .eventRight {
    background-color: white;
    float: right;
    height: 100%;
    width: calc(100% - 385px);
    box-sizing: border-box;
    overflow: hidden;
    padding: 10px 150px 0 15px;
  }
}
</style>