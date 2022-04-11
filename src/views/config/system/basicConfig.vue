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
import Tcp0 from "./basicConfig/tcp0";
import Tcp1 from "./basicConfig/tcp1";
export default {
  components: { TopHeader, Tcp0, Tcp1 },
  data() {
    return {
      list: [
        {
          name: this.$t("js.msgnone"),
          component: "Tcp0",
        },
        {
          name: this.$t("js.msgmone"),
          component: "Tcp1",
        },
      ],
      selectComponent: {},
    };
  },
  created(){
    var roles = this.$store.getters.roles
    if(roles != "admin"){
      this.list = this.list.filter(item=>roles.includes(item.component))
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
  padding: 10px 30px;
  @media screen and (max-width: 530px) {
    padding: 10px;
  }
}
</style>