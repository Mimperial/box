<template>
  <div>
    <!-- <div @click="change" class="language">中文/English</div> -->
  </div>
</template>

<script>
import { setLanguage, getLanguage } from "@/utils/saveLanguage";
export default {
  methods: {
    change() {
      if (this.$i18n.locale == "en") {
        setLanguage("zh");
      } else {
        setLanguage("en");
      }
      window.location.reload()
      this.$i18n.locale = getLanguage();
    },
  },
};
</script>

<style lang="scss" scoped>
.language {
  color: #fff;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;
}
</style>