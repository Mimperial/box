<template>
  <iframe
    style="width: 100%; height: 80vh"
    :src="sshUrl"
  ></iframe>
</template>

<script>
import { sshUrl } from "@/api/article.js";
export default {
  data() {
    return {sshUrl:sshUrl()};
  },
};
</script>
<style>
</style>

