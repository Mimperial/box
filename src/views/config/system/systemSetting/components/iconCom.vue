<template>
  <div :class="{ waikuang: true, blue: blue }">
    <div class="kuang">
      <div class="imagePicture">
        <img :src="srcImg" alt="" srcset="" />
      </div>
      <div class="info">
        <span class="title">{{ title }}</span>
        <span :class="{ number: true, blue: blue }">{{ info }}</span>
        <span class="unit">{{ smallInfo }}</span>
      </div>
      <div style="height: 190px">
        <img :src="smallBut" alt="" srcset="" style="margin-top: 20px; width: 24px;height: auto;  display: block;" @click="btuClick()" />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ["title", "info", "smallInfo", "srcImg", "blue", "smallBut", "smallButClick"],

  methods: {
     btuClick() {
       this.smallButClick();
    }
  }
};

</script>

<style lang="scss" scoped>
.waikuang {
  position: relative;
  width: 462px;
  height: 194px;
  // float: left;
  background-image: linear-gradient(to right, #9c3535, #d06767);
  border-radius: 10px;
  &.blue {
    background-image: linear-gradient(to right, #182689, #5160cd);
  }
  & + .waikuang {
    margin-left: 42px;
  }
}
.kuang {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.96);
  width: 458px;
  height: 190px;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //padding: 0 60px;
  padding: 0px 30px 0px 60px;

  .imagePicture {
    width: 120px;
    img {
      display: block;
      width: 100%;
    }
  }
  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
    .number {
      font-size: 36px;
      font-weight: 600;
      color: #b74f4f;
      line-height: 50px;
      margin: 0 5px 0 18px;
      &.blue {
        color: #2d3ba2;
      }
    }
    .unit {
      font-size: 21px;
      font-weight: 500;
      color: #000000;
      line-height: 29px;
    }
    .smallBut {
      margin-top: 20px;
      margin-left: 20px;
      width: 30px;
    }
  }

}
</style>