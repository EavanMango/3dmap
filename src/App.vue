<template>
  <div class="root-app">
    <router-view></router-view>
    <!-- <div class="watermark"><div class="watermark-content"></div></div> -->
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, watch } from "vue";

function stopDebug() {
  if (import.meta.env.PROD) {
    document.oncontextmenu = function () {
      event.returnValue = false;
    };
    //禁用开发者工具F12
    document.onkeydown =
      document.onkeyup =
      document.onkeypress =
        function (event) {
          let e = event || window.event || arguments.callee.caller.arguments[0];
          if (e && e.keyCode == 123) {
            e.returnValue = false;
            return false;
          }
        };

    //debug调试时跳转页面
    var element = new Image();
    Object.defineProperty(element, "id", {
      get: function () {
        window.location.href = "https://www.baidu.com";
      },
    });
    console.log(element);
    setInterval(function () {
      check();
    }, 2000);
    var check = function () {
      function doCheck(a) {
        if (("" + a / a)["length"] !== 1 || a % 20 === 0) {
          (function () {})["constructor"]("debugger")();
        } else {
          (function () {})["constructor"]("debugger")();
        }
        doCheck(++a);
      }
      try {
        doCheck(0);
      } catch (err) {}
    };
    check();
  }
}

onMounted(() => {
  stopDebug();
});
</script>
<style lang="scss">
.root-app {
  width: 100%;
  height: 100%;
}
.watermark {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  z-index: 99;
  pointer-events: none;
  opacity: 0.05;
  &-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 400%;
    height: 400%;
    background: url("~@/assets/szxs_logo.png");
    background-size: 4%;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(-30deg);
  }
}
</style>
