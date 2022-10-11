<template>
  <el-header>
    <div class="imageAside">
      <!-- <img v-show="show == 'true'" :src="imgSrc" alt="" /> -->
      <h1 style="color:#fff">移动安防安保智能分析应用平台</h1>
    </div>
    <!-- <div class="qiehuan">
    <language></language>
    </div> -->
    <!-- 这里调试的时候可以打开进行中英文切换 -->
    <el-menu
      :default-active="
        $route.matched.length < 2 ? $route.fullPath : $route.matched[1].path
      "
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#010B56"
      text-color="#4EF2FE"
      active-text-color="#FFFFFF"
    >
      <el-menu-item
        v-for="(item, index) in headerList[0].children"
        :key="index"
        :index="headerList[0].path + '/' + item.path"
        @click.native="
          toRun(
            headerList[0].path + '/' + item.path,
            item.path == 'bigScreen' || 'pocDemonstration',
            item.path
          )
        "
      >
        {{ language(item.meta.title) }}
      </el-menu-item>
    </el-menu>
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        {{ $t('html.退出') }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="goback">{{
          $t('html.退出登录')
        }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <fullScreen></fullScreen> -->
  </el-header>
</template>

<script>
// import fullScreen from "./fullScreen";  //这里暂时没用因为之前设计图是全屏但是没有什么实际的作用所以改成了退出登录
import language from '@/components/language.vue'
import { mapGetters } from 'vuex'
import icon from '@/assets/icon'
export default {
  components: { language },
  data() {
    return {
      imgSrc: icon.headerIcon,
      bigScreenUrl: window.location.href.split('#')[0],
      show: process.env.VUE_APP_LOGO,
    }
  },
  computed: {
    ...mapGetters(['permission_routes']),
    headerList() {
      return this.permission_routes.filter((item) => {
        return item.children ? item : false
      })
    },
    language() {
      return (val) => {
        return this.$t('html.' + val)
      }
    },
  },
  mounted() {
    // console.log(this.$route)
  },
  methods: {
    toRun(val, isPanduan, path) {
      if (isPanduan != true) {
        this.$router.push(val)
      } else {
        window.open(this.bigScreenUrl + '#' + '/' + path)
      }
    },
    toFirst() {},
    handleSelect(key, keyPath) {
      if (key != this.nowkey) {
        this.nowkey = key
        this.headerList[0].children.forEach((element) => {
          if (key.includes(element.path)) {
            this.$emit('change', key)
          }
        })
      }
    },
    goback() {
      this.$store.dispatch('LogOut').then((res) => {
        this.$router.push('/')
        // setTimeout(()=>{
        //   window.location.reload();
        // },50)
      })
    },
  },
}
</script>

<style scoped>
.qiehuan {
  position: absolute;
  width: 130px;
  left: 200px;
  top: 5px;
}
</style>
<style>
a {
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: block;
  /* padding:0 50px; */
}
.el-dropdown {
  color: white !important;
}
.el-header {
  width: 100%;
  position: relative;
}
.el-header .imageAside {
  position: absolute;
  left: 0;
  top: 7px;
}
.el-header .imageHeader img {
  width: 25px;
  cursor: pointer;
}
.el-header .el-menu-demo.el-menu--horizontal.el-menu {
  padding-right: 64px;
}
@media screen and (max-width: 700px) {
  .el-header .el-menu-demo.el-menu--horizontal.el-menu {
    padding-right: 20px;
  }
}
.el-header .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.1) !important;
  position: relative;
}
.el-header .el-menu-demo.el-menu--horizontal.el-menu .el-menu-item.is-active {
  border: none;
}
.el-header .el-menu-item.is-active::before {
  content: '';
  height: 4px;
  width: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
