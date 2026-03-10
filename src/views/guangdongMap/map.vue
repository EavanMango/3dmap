<template>
  <div class="map">
    <canvas id="canvasMap"></canvas>
  </div>
</template>
<script setup>
import { onMounted, shallowRef, onBeforeUnmount } from "vue";
import { World } from "./map.js";
import emitter from "@/utils/emitter";
import barData from "./map/barData.js";
function sortByValue(data) {
  data.sort((a, b) => b.value - a.value);
  return data;
}
const canvasMap = shallowRef(null);
onMounted(() => {
  emitter.$on("loadMap", loadMap);
  emitter.$on("mapPlayComplete", handleMapPlayComplete);
  emitter.$on("createBar", createBar);
  emitter.$on("destroyBar", destroyBar);
  emitter.$on("createPoint", createPoint);
  emitter.$on("destroyPoint", destroyPoint);
  emitter.$on("createSituation", createSituation);
  emitter.$on("destroySituation", destroySituation);
  emitter.$on("createPath", createPath);
  emitter.$on("destroyPath", destroyPath);
  emitter.$on("createHeatmap", createHeatmap);
  emitter.$on("destroyHeatmap", destroyHeatmap);
});
onBeforeUnmount(() => {
  canvasMap.value && canvasMap.value.destroy();
  emitter.$off("loadMap", loadMap);
  emitter.$off("createBar", createBar);
  emitter.$off("destroyBar", destroyBar);
  emitter.$off("createPoint", createPoint);
  emitter.$off("destroyPoint", destroyPoint);
  emitter.$off("createSituation", createSituation);
  emitter.$off("destroySituation", destroySituation);
  emitter.$off("createPath", createPath);
  emitter.$off("destroyPath", destroyPath);
  emitter.$off("destroyHeatmap", destroyHeatmap);
});
function loadMap(assets) {
  canvasMap.value = new World(document.getElementById("canvasMap"), assets, {
    // 中心坐标
    geoProjectionCenter: [113.280637, 23.125178],
    // 缩放比例
    geoProjectionScale: 120,
    // 飞线中心
    flyLineCenter: [113.544372, 23.329249],
    // 地图拉伸高度
    depth: 0.5,
    // 开启debug
    debug: false,
  });
  canvasMap.value.time.pause();
}
async function play() {
  if (canvasMap.value) {
    canvasMap.value.time.resume();
    canvasMap.value.animateTl.timeScale(1); // 设置播放速度正常
    canvasMap.value.animateTl.play();
  }
}
function handleMapPlayComplete() {
  // 请求柱状图数据，
  let data = sortByValue(barData).filter((item, index) => index < 7); // randomVal(barData, 7)
  // 创建柱状图
  canvasMap.value.createBar(data);
  // 创建飞线
  canvasMap.value.createFlyLine({ centroid: [113.544372, 23.329249] }, data);
  // 描边
  // canvasMap.value.initPost();
  canvasMap.value.mapLine.lineGroup.traverse((obj) => {
    if (obj.isMesh) {
      canvasMap.value.outlineEffect &&
        canvasMap.value.outlineEffect.selection.add(obj);
    }
  });
}
// 创建柱状图
function createBar(data) {
  canvasMap.value && canvasMap.value.createBar(data);
}
// 销毁柱状图
function destroyBar() {
  canvasMap.value && canvasMap.value.clearBar();
}
// 创建点位
function createPoint(data) {
  canvasMap.value && canvasMap.value.createPoint(data);
}
// 销毁点位
function destroyPoint() {
  canvasMap.value && canvasMap.value.destroyPoint();
}
// 创建态势点位
function createSituation(data) {
  canvasMap.value && canvasMap.value.createSituation(data);
}
// 销毁态势点位
function destroySituation() {
  canvasMap.value && canvasMap.value.destroySituation();
}
// 创建路径
function createPath(data) {
  canvasMap.value && canvasMap.value.createPath(data);
}

// 销毁路径
function destroyPath() {
  canvasMap.value && canvasMap.value.destroyPath();
}
// 创建热力图
function createHeatmap() {
  canvasMap.value && canvasMap.value.createHeatmap();
}
// 销毁热力图
function destroyHeatmap() {
  canvasMap.value && canvasMap.value.destroyHeatmap();
}
defineExpose({
  loadMap,
  play,
  canvasMap,
});
</script>

<style lang="scss">
.map {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  .info-point {
    background: rgba(0, 0, 0, 0.5);
    color: #a3dcde;
    font-size: 14px;
    width: 170px;
    height: 106px;
    padding: 16px 12px 0;
    margin-bottom: 30px;
    will-change: transform;
    &-wrap {
      &:after,
      &:before {
        display: block;
        content: "";
        position: absolute;
        top: 0;
        width: 15px;
        height: 15px;
        border-top: 1px solid #4b87a6;
      }
      &:before {
        left: 0;
        border-left: 1px solid #4b87a6;
      }
      &:after {
        right: 0;
        border-right: 1px solid #4b87a6;
      }
      &-inner {
        &:after,
        &:before {
          display: block;
          content: "";
          position: absolute;
          bottom: 0;
          width: 15px;
          height: 15px;
          border-bottom: 1px solid #4b87a6;
        }
        &:before {
          left: 0;
          border-left: 1px solid #4b87a6;
        }
        &:after {
          right: 0;
          border-right: 1px solid #4b87a6;
        }
      }
    }
    &-line {
      position: absolute;
      top: 7px;
      right: 12px;
      display: flex;
      .line {
        width: 5px;
        height: 2px;
        margin-right: 5px;
        background: #17e5c3;
      }
    }
    &-content {
      .content-item {
        display: flex;
        height: 28px;
        line-height: 28px;
        background: rgba(35, 47, 58, 0.6);
        margin-bottom: 5px;
        .label {
          width: 60px;
          padding-left: 10px;
        }
        .value {
          color: #ffffff;
        }
      }
    }
  }

  .province-label {
    will-change: transform;
    .name {
      font-size: 12px;
      color: #bfe0f7;
      transform-origin: center;
      transform: scale(0.7);
      text-shadow: 2px 2px 0px rgb(0, 29, 93);
    }
  }
  .bar-label {
    &-wrap {
      display: flex;
      position: relative;
      align-items: center;
      opacity: 0;
      transform: translateY(200%);
      &.cyan {
        .bar-label-number {
          background: rgba(14, 131, 204, 0.7);
        }
      }
    }
    &-icon {
      // position: absolute;
      // left: 0;
      // top: -20px;
      width: 30px;
      height: 30px;
      // margin-left: -20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-number {
      // position: absolute;

      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 16px;
      padding: 0 5px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1;
      border: 1px solid #fff;
      background: rgba(14, 131, 204, 0.7);

      .unit {
        font-size: 12px;
        padding-left: 5px;
        color: #fff;
      }
    }
  }

  /* 动态点 */
  .map-label-point {
    cursor: pointer;
    &-style {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      transform: translateY(-50%);
      height: 85px;
      //  background: red;

      &-name {
        font-size: 10px;
        color: #fff;
        text-align: center;
        // width: 89px;
        padding: 0 10px;
        height: 23px;
        line-height: 23px;
        background: url("~@/assets/texture/icon-gaojing-namebg.png") no-repeat;
        background-size: 100% 100%;
      }
      &-icon {
        width: 30px;
        height: 34px;
        background: url("~@/assets/texture/icon-gaojing.png") no-repeat;
        background-size: contain;
        position: relative;
        top: 5px;
        // display: none;
      }
      &-icon-arrow {
        width: 28px;
        height: 22px;
        background: url("~@/assets/texture/icon-gaojing-arrow.png") no-repeat;
        background-size: contain;
      }
      &.red {
        .map-label-point-style-name {
          background: url("~@/assets/texture/icon-gaojing-namebg-red.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .map-label-point-style-icon {
          background: url("~@/assets/texture/icon-gaojing-red.png") no-repeat;
          background-size: contain;
        }
        .map-label-point-style-icon-arrow {
          background: url("~@/assets/texture/icon-gaojing-arrow-red.png")
            no-repeat;
          background-size: contain;
        }
      }
    }
  }
  // 路径点位弹窗
  .path-point-label {
    z-index: 999 !important;
    &-icon {
      width: 50px;
      height: 60px;
      pointer-events: all;
      &-start {
        background: url("~@/assets/texture/icon-qidian.png") no-repeat;
        background-size: cover;
      }
      &-end {
        background: url("~@/assets/texture/icon-zhongdian.png") no-repeat;
        background-size: cover;
      }
    }
    &-wrap {
      position: relative;
      width: 50px;
      height: 60px;
      margin-bottom: 30px;
    }
    &-info {
      pointer-events: none;
      position: absolute;
      left: 50%;
      bottom: 60px;
      margin-left: -132px;
      width: 264px;
      height: 275px;
      box-sizing: border-box;
      padding: 0px 15px 10px;
      border-top: 3px solid #1392df;
      background: #004773 url("~@/assets/images/huoche.png") 200px 200px
        no-repeat;
      box-shadow: 0 2px 10px #004773;
      background-size: 20% 20%;
      transform-origin: center bottom;
      transform: scale(0);
      opacity: 0;
      transition: all 0.3s;
      &.show {
        opacity: 1;
        transform: scale(0.6);
      }
    }
    .name {
      font-size: 16px;
      color: #63c0ff;
      line-height: 40px;
    }
    .thumb {
      width: 234px;
      height: 80px;
      border: 4px solid #63c0ff;
      background: #63c0ff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      padding-top: 10px;
    }

    .info-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      line-height: 24px;
      color: #63c0ff;
      &:before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #04eef0;
        margin-right: 10px;
        box-shadow: 0 0 20px #04eef0;
      }
    }
  }
}
</style>
