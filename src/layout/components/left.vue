<template>
  <el-aside
    v-show="listInfo.length > 0"
    :width="!isCollapse ? '220px' : '56px'"
  >
    <!-- <div class="imageAside" :style="isCollapse ? 'opacity:0;' : 'opacity:1;'">
      <img :src="imgSrc" alt="" />
    </div> -->
    <el-menu
      :default-active="$route.fullPath"
      :default-openeds="openeds"
      background-color="#010b56"
      text-color="#25B2DB"
      active-text-color="#FFFFFF"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      @open="handleOpen"
      v-if="showMenu"
    >
      <div v-for="(item, index) in listInfo" :key="index">
        <el-submenu :index="item.path" v-if="item.children">
          <template slot="title"
            ><i
              :class="item.meta.icon ? item.meta.icon : 'el-icon-message'"
            ></i>
            <span :style="isCollapse ? 'opacity:0;' : 'opacity:1;'">{{
              language(item.meta.title)
            }}</span></template
          >
          <el-menu-item
            :index="$route.matched[1].path + '/' + item.path + '/' + item1.path"
            v-for="(item1, index1) in item.children"
            :key="index1"
            ><i
              :class="item1.meta.icon ? item1.meta.icon : 'el-icon-message'"
            ></i
            >{{ language(item1.meta.title) }}</el-menu-item
          >
        </el-submenu>
        <el-menu-item :index="$route.matched[1].path + '/' + item.path" @click="toPath(item.path)" v-else>
          <i :class="item.meta.icon ? item.meta.icon : 'el-icon-message'"></i>
          <span slot="title">{{ language(item.meta.title) }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      imgSrc: require("@/assets/img/login.png"),
      listInfo: [],
      isCollapse: false,
      openeds: ["system", "smart", "intelligenceShow"],
      showMenu:false
    };
  },
  computed: {
    ...mapGetters(["permission_routes"]),
    routerList() {
      return this.permission_routes.filter((item) => {
        return item.children ? item : false;
      })[0];
    },
    language() {
      return (val) => {
        return this.$t("html." + val);
      };
    },
  },
  mounted() {
    this.listGet(this.$route);
    this.leftShow();
  },
  methods: {
    toPath(path){
    if(path === 'pocDemonstration'){
        window.open(process.env.VUE_APP_POC)
    }

    },
    handleOpen(index) {
      // console.log("handleOpen", index);
    },
    leftShow() {
      var clientWidth =
        document.body.clientWidth || document.documentElement.clientWidth;
      if (clientWidth && clientWidth < 700) {
        this.isCollapse = true;
      }
    },
    listGet(val) {
      this.routerList.children.forEach((element) => {
        if (val.matched[1] && element.name == val.matched[1].name) {
          if (element.children) {
            this.listInfo = element.children;
          } else {
            this.listInfo = [];
          }
        }
      });
        this.$nextTick(()=>{
            this.showMenu = true
        })
    },
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.listGet(val);
        this.showMenu = false
      },
      deep: true,
    },
  },
};
</script>

<style>
.el-aside {
  overflow-x: hidden !important;
}
.el-aside .imageAside {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
}
.el-header {
  background: #010b56;
}
.el-main {
  background-color: #efeff4;
}
.el-aside li.el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.1) !important;
  position: relative;
}
.el-aside li.el-menu-item.is-active::before {
  content: "";
  position: absolute;
  height: 56px;
  width: 4px;
  left: 0;
  background-color: white;
}
.el-aside .el-submenu.is-opened .el-submenu__title {
  color: #ffffff !important;
}
.el-aside .is-opened .el-submenu__title i {
  color: #ffffff !important;
}
.el-aside .is-active > i {
  color: #ffffff !important;
}
.el-aside i {
  color: #25b2db !important;
}
</style>