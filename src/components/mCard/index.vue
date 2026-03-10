<template>
  <div class="m-card" :style="calcWidthHeightStyle">
    <div class="m-card-hd">
      <div class="m-card-hd-title">{{ title }}</div>
      <div class="m-card-hd-dot">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
      </div>
    </div>
    <div class="m-card-bd" :style="calcWidthHeightStyle">
      <div class="m-card-bd-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, getCurrentInstance, onMounted } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 398,
  },
  height: {
    type: Number,
    default: 100,
  },
  title: {
    type: String,
    default: "标题",
  },
});

const calcWidthHeightStyle = computed(() => {
  return `width:${props.width}px;height:${props.height}px;`;
});

</script>
<style lang="scss">
.m-card {
  position: relative;
  pointer-events: all;
  &-hd {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 2;
    background: url('~@/assets/images/card-titlebg.png') no-repeat;
    background-size:100% 100%;
    width:383px;
    height: 42px;
    
    &-title {
      position: absolute;
      left: 32px;
      color: #fff;
      font-size: 18px;
      letter-spacing: 1.6px;
      height: 36px;
      line-height: 36px;
      font-family: "Alibaba PuHuiTi";
      font-weight: bold;
      background: -webkit-linear-gradient(rgb(234 247 255), rgb(121 191 249));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    &-dot{
      position: absolute;
      left: 330px;
      top: 18px;
      display: flex;
      .dot{
        width: 4px;
        height: 4px;
        background: #04EEF0;
        margin-right: 10px;
        box-shadow: 0 0 20px #04EEF0;
      }
      .dot1{
        animation: dotAnima 1s infinite;
      }
      .dot2{
        animation: dotAnima 1s 0.3s infinite;
      }
      .dot3{
        animation: dotAnima 1s 0.6s infinite;
      }
    }
   
  }
  &-bd {
    position: absolute;
    left: 0;
    top: 0;

    z-index: 1;

    
    &-content {
      position: absolute;
      left: 0;
      top: 50px;
      right: 0;
      bottom: 0;
      pointer-events: all;
      overflow: hidden;
    }
  }
}
@keyframes dotAnima {
  0%{
    opacity: 1;
  }
  50%{
    opacity: 0.5;
  }
  100%{
    opacity: 1;
  }
}
</style>
