<template>
  <div>
    <TopHeader @change="changeTable" :list="list"></TopHeader>
    <div class="neibu">
      <component :is="selectComponent.component"></component>
    </div>
  </div>
</template>

<script>
import TopHeader from "@/components/topHeader.vue";
import UesrManger from "./components/uesrManger";
import AlgorithmConfig from "./components/algorithmConfig";
import Log from "./components/log";
import SSH from "./components/ssh";
import Engine from "./components/engine";
import Ruleset from "./components/ruleset"
export default {
  data() {
    return {
      list: [
        {
          name: this.$t("js.mmsgone"),
          component: "UesrManger",
        },
        {
          name: this.$t("js.mlsgone"),
          component: "AlgorithmConfig",
        },
        {
          name: this.$t("js.引擎配置"),
          component: "Engine",
        },
        {
          name: this.$t("js.mksgone"),
          component: "SSH",
        },
        {
          name: this.$t("js.mjsgone"),
          component: "Log",
        },
        {
          name: this.$t("js.ruleset"),
          component: "Ruleset",
        },
      ],
      selectComponent: {},
    };
  },
  created(){
    var roles = this.$store.getters.roles
    if(roles != "admin"){
      this.list = this.list.filter(item=>roles.includes(item.component));
      if(this.list.length>0){
        this.selectComponent.component = this.list[0].component
      }
    }
  },
  mounted() {
    this.selectComponent = this.list[0];
  },
  methods: {
    changeTable(data) {
      this.selectComponent = data;
    },
  },
  components: { Engine, AlgorithmConfig, Log, SSH, UesrManger, TopHeader },
};
</script>

<style scoped>
.neibu {
  height: 100%;
}
</style>
<style>
.el-tabs--border-card {
  border: none;
  box-shadow: none;
}
</style>