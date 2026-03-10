import { Resource } from "@/mini3d";
import { FileLoader } from "three";
// 地图
import bg from "@/assets/texture/map/bg.jpg";
import side from "@/assets/texture/map/side.png";
import face from "@/assets/texture/map/face.png";
import quan1 from "@/assets/texture/map/quan1.png";
import quan2 from "@/assets/texture/map/quan2.png";
import quan3 from "@/assets/texture/map/quan3.png";
import quan4 from "@/assets/texture/map/quan4.png";
import diffuse from "@/assets/texture/map/diffuse.png";
import particle from "@/assets/texture/particle.png";
import mapFlyline from "@/assets/texture/flyline10.png";

import pathLine from "@/assets/texture/pathLine4.png";
import pathLine3 from "@/assets/texture/pathLine2.png";
import pathLine2 from "@/assets/texture/pathLine.png";

import arrow from "@/assets/texture/arrow.png";
import point from "@/assets/texture/point1.png";
import flyLineFocus from "@/assets/texture/guangquan01.png";
import iconQidian from "@/assets/texture/icon-qidian.png";
import iconZhongdian from "@/assets/texture/icon-zhongdian.png";
// 焦点贴图
import focusArrowsTexture from "@/assets/texture/focus/focus_arrows.png";
import focusBarTexture from "@/assets/texture/focus/focus_bar.png";
import focusBgTexture from "@/assets/texture/focus/focus_bg.png";
import focusMidQuanTexture from "@/assets/texture/focus/focus_mid_quan.png";
import focusMoveBgTexture from "@/assets/texture/focus/focus_move_bg.png";
export class Assets {
  constructor() {
    this.init();
  }
  init() {
    this.instance = new Resource();
    // 添加Fileloader
    this.instance.addLoader(FileLoader, "FileLoader");

    // 资源加载
    let base_url = import.meta.env.BASE_URL;
    let assets = [
      { type: "Texture", name: "bg", path: bg },
      { type: "Texture", name: "face", path: face },
      { type: "Texture", name: "side", path: side },
      { type: "Texture", name: "quan1", path: quan1 },
      { type: "Texture", name: "quan2", path: quan2 },
      { type: "Texture", name: "quan3", path: quan3 },
      { type: "Texture", name: "quan4", path: quan4 },
      { type: "Texture", name: "diffuse", path: diffuse },
      { type: "Texture", name: "particle", path: particle },
      { type: "Texture", name: "mapFlyline", path: mapFlyline },
      //
      { type: "Texture", name: "iconQidian", path: iconQidian },
      { type: "Texture", name: "iconZhongdian", path: iconZhongdian },
      { type: "Texture", name: "flyline", path: pathLine },
      { type: "Texture", name: "pathLine", path: pathLine },
      { type: "Texture", name: "pathLine2", path: pathLine2 },
      { type: "Texture", name: "pathLine3", path: pathLine3 },

      {
        type: "File",
        name: "mapJson",
        path: base_url + "assets/json/guangdong.json",
      },
      {
        type: "File",
        name: "mapStroke",
        path: base_url + "assets/json/guangdong-stroke.json",
      },
      {
        type: "File",
        name: "hotmapData",
        path: base_url + "assets/json/hotPoint.geojson",
      },
      { type: "Texture", name: "flyLineFocus", path: flyLineFocus },

      { type: "Texture", name: "arrow", path: arrow },
      { type: "Texture", name: "point", path: point },

      // focus
      { type: "Texture", name: "focusArrows", path: focusArrowsTexture },
      { type: "Texture", name: "focusBar", path: focusBarTexture },
      { type: "Texture", name: "focusBg", path: focusBgTexture },
      { type: "Texture", name: "focusMidQuan", path: focusMidQuanTexture },
      { type: "Texture", name: "focusMoveBg", path: focusMoveBgTexture },
    ];
    // 资源加载
    this.instance.loadAll(assets);
  }
}
