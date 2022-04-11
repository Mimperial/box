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
import TimeConfig from "./systemMaintenance/timeConfig";
import Protect from "./systemMaintenance/protect";
import UseManagement from "./systemMaintenance/useManagement.vue";
import EquipmentSerial from "./systemMaintenance/equipmentSerial.vue";
import SiteInfo from "./systemMaintenance/siteInfo.vue";
export default {
  components: {
    TopHeader,
    Protect,
    TimeConfig,
    UseManagement,
    EquipmentSerial,
    SiteInfo,
  },
  data() {
    return {
      selectComponent: {},
      list: [
        {
          name: this.$t("js.xtgl"),
          component: "Protect",
        },
        {
          name: this.$t("js.jmsgone"),
          component: "TimeConfig",
        },
        {
          name: "修改密码",
          component: "UseManagement",
        },
        {
          name: "设备编号",
          component: "EquipmentSerial",
        },
        {
          name: "站点信息",
          component: "SiteInfo",
        },
      ],
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
  padding: 20px 0;
  @media screen and (max-width: 530px) {
    padding: 10px 0;
  }
}
</style>

