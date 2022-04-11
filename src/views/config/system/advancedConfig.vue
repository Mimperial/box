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
import Ftp from "./advancedConfig/ftp";
import PlatformConfig from "./advancedConfig/platformConfig";
import AuthorizationConfig from "./advancedConfig/authorizationConfig";
import CentralServices from "./advancedConfig/centralServices";
export default {
  components: {
    TopHeader,
    Ftp,
    PlatformConfig,
    AuthorizationConfig,
    CentralServices,
  },
  data() {
    return {
      list: [
        {
          name: "FTP",
          component: "Ftp",
        },
        {
          name: this.$t("js.msglone"),
          component: "PlatformConfig",
        },
        {
          name: this.$t("js.msgkone"),
          component: "AuthorizationConfig",
        },
        {
          name: this.$t("js.lmsgone"),
          component: "CentralServices",
        },
      ],
      selectComponent: {},
    };
  },
  created() {
    var roles = this.$store.getters.roles;
    if (roles != "admin") {
      this.list = this.list.filter((item) => roles.includes(item.component));
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
};
</script>

<style lang="scss" scoped>
.neibu {
  padding: 20px;
  @media screen and (max-width: 530px) {
    padding: 10px;
  }
}
</style>