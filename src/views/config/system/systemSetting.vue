<template>
  <div>
    <!-- <TopHeader @change="changeTable" :list="list"></TopHeader> -->
    <div class="neibu">
      <component :is="selectComponent.component"></component>
    </div>
  </div>
</template>

<script>
import TopHeader from "@/components/topHeader.vue";
import BaseInfo from "./systemSetting/baseInfo";
// import TimeConfig from "./systemSetting/timeConfig";
// import SiteInfo from "./systemSetting/siteInfo";
// import CentralServices from "./systemSetting/centralServices";

export default {
  // components: { TopHeader, BaseInfo,TimeConfig,SiteInfo,CentralServices },
  components: { TopHeader, BaseInfo },
  data() {
    return {
      list: [
        {
          name: this.$t("js.hmsgone"),
          component: "BaseInfo",
        },
        // {
        //   name: this.$t('js.jmsgone'),
        //   component: "TimeConfig",
        // },
        // {
        //   name: this.$t('js.kmsgone'),
        //   component: "SiteInfo",
        // },
        // {
        //   name: this.$t('js.lmsgone'),
        //   component: "CentralServices",
        // }
      ],
      selectComponent: {},
    };
  },
  created() {
    // var roles = this.$store.getters.roles;
    // if (roles != "admin") {
    //   this.list = this.list.filter((item) => roles.includes(item.component));
    //   if (this.list.length > 0) {
    //     this.selectComponent.component = this.list[0].component;
    //   }
    // }
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
  // padding: 25px 40px 0;
  background-color: #efeff4;
  @media screen and (max-width: 530px) {
    padding: 10px;
  }
}
</style>