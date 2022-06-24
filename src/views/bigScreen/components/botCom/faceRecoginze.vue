<template>
  <div class="box-recoginze">
      <div class="reco-gol">
          <div class="little-text">抓拍</div>
          <img class="reco-img" src="@/assets/img/ren.png" alt="">
          <div class="reco-bottom">
               <div>
              姓名:小飞肉
          </div>
          <div>
              2022-06-23 15:39:09
          </div>
          </div>
         
      </div>
      <div class="reco-gol reco-right">
          <div class="little-text">底库</div>

           <img class="reco-img" src="@/assets/img/ren.png" alt="">
           <div class="reco-bottom">
                <div>
              识别度:90
          </div>
          <div>
              相机名称:1
          </div>
           </div>
      </div>
      <div class="vs-img">
          <img :src="vs" alt="">
      </div>
  </div>
</template>

<script>
export default {
data(){
    return {
        vs:require('@/assets/img/vs.svg')
    }
}
}
</script>

<style lang="scss">
.box-recoginze{
    width: 3.6rem;
    height: 1.9rem;
    border: 1px solid rgba(21, 62, 118, 1);;
    background-color: rgba(25, 35, 94, 1);
    margin-left: 0.3rem;
    display: flex;
    font-size:0.14rem;
    padding: 0.06rem;
    box-sizing: border-box;
    color: #fff;
    position: relative;
    &:first-of-type{
        margin-left: 0;
    }
      &:last-of-type{
        margin-right: 0.3rem;
    }
    .reco-gol{
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        position: relative;
        // align-items: center;
        .little-text{
            font-size: 0.1rem;
            position: absolute;
            top: 0;
            left: 0.24rem;
        }
        .reco-bottom{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
    .reco-right{
        margin-left: 0.07rem;
    }
    .reco-img{
       width: 80%; 
       height: 80%;
    }
    .vs-img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
</style>