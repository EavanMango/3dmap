import {
  Object3D,
  MeshBasicMaterial,
  DoubleSide,
  PlaneGeometry,
  BufferGeometry,
  Texture,
  Points,
  PointsMaterial,
  Float32BufferAttribute,
  Mesh,
} from "three";
import h337 from "@rengr/heatmap.js";
import { emptyObject, minBy, maxBy } from "@/mini3d";
export class HeatMap extends Object3D {
  constructor(self,config) {
    super();
    this.self = self
    this.config = Object.assign(
      {
        data: [],// 点数据[[x,y],[x,y]]
        width: 10, // 地图的宽度
        height: 10,// 地图的高度
        // z轴坐标
        z: 1,
        renderOrder: 22,
        //是否显示点
        showDot: false,
        // 热力图点半径
        radius:70,
        // 点材质
        pointsMaterial: new PointsMaterial({ size: 0.2, color: 0xffffff }),
      },
      config
    );
    this.init();
  }
  init() {
    // 缩放值
    const scale = 100;
    const w = this.config.width * scale;
    const h = this.config.height * scale;
    // 粒子位置
    const positions = [];
    // 数据
    const segments = this.config.data.map((item) => {
      // 将点位数据,进行geoProjection转换
      let [x, y] = this.self.geoProjection(item.coordinates);
      // 将转换得坐标添加到粒子数组中
      positions.push(x, -y, this.config.z);

      return {
        value: item.value,
        x: Math.floor(x * scale + w / 2),
        y: Math.floor(-y * scale + h / 2),
      };
    });
    
    // 最大最小值
    let maxvalue = maxBy(segments, (o) => o.value).value;
    let minvalue = minBy(segments, (o) => o.value).value;
    // 根据positions 生成点云,主要用来比较点与热力图坐标是否正确
    if (this.config.showDot) {
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(positions, 3)
      );
      let points = new Points(geometry, this.config.pointsMaterial);
      points.rotateX(-Math.PI / 2);
      this.add(points);
    }

    let div = document.createElement("div");
    // 创建热力图
    var heatmap = h337.create({
      container: div,
      radius: this.config.radius,
      width: w,
      height: h,
      alpha: true,
    });
    // 设置点位数据
    heatmap.setData({
      max: maxvalue,
      min: minvalue,
      data: segments,
    });
    // 创建热力图面板
    let heatMapGeo = new PlaneGeometry(w,h);
    // 获取纹理
    let texture = new Texture(heatmap._renderer.canvas);
   
    
    var material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      fog: false,
      wireframe: false,
    });
    // 纹理更新
    material.map.needsUpdate = true;
    let heatMapPlane = new Mesh(heatMapGeo, material);
    heatMapPlane.renderOrder = this.config.renderOrder;
    //平面缩放到以前的值
    heatMapPlane.scale.set(1 / scale, 1 / scale, 1);
    heatMapPlane.position.set(0, this.config.z, 0);
    heatMapPlane.rotation.x = Math.PI / 2;
    this.add(heatMapPlane);
   
    
  }

  destroy() {
    // 销毁
    emptyObject(this);
  }
}
