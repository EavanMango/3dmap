import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
import { uuid } from "../utils"
export class Label2d {
  constructor({ scene, camera, time, sizes, canvas }) {
    this.scene = scene
    this.camera = camera
    this.time = time
    this.sizes = sizes
    this.canvas = canvas
    this.parent = null
    let { width, height } = this.sizes
    let css2dRender = new CSS2DRenderer()
    this.css2dRender = css2dRender
    css2dRender.setSize(width, height)
    css2dRender.domElement.style.position = "absolute"
    css2dRender.domElement.style.left = "0px"
    css2dRender.domElement.style.top = "0px"
    css2dRender.domElement.style.pointerEvents = "none"
    css2dRender.domElement.className = "label3d-" + uuid()
    this.canvas.parentNode.appendChild(css2dRender.domElement)
    this.time.on("tick", () => {
      this.update()
    })
    this.sizes.on("resize", () => {
      this.resize()
    })
  }
  create(content = "", className = "") {
    let tag = document.createElement("div")
    tag.innerHTML = content
    tag.className = className
    tag.style.visibility = "hidden"
    tag.style.position = "absolute"
    if (!className) {
      tag.style.padding = "10px"
      tag.style.color = "#fff"
      tag.style.fontSize = "12px"
      tag.style.textAlign = "center"
      tag.style.background = "rgba(0,0,0,0.6)"
      tag.style.borderRadius = "4px"
    }
    let label = null
    label = new CSS2DObject(tag)
    label.init = (content, position) => {
      label.element.innerHTML = content
      label.element.style.visibility = "visible"
      label.position.copy(position)
    }
    label.hide = () => {
      label.element.style.visibility = "hidden"
    }
    label.scaleHide = () => {
      label.element.classList.add("scale-hidden")
    }
    label.show = () => {
      label.element.style.visibility = "visible"
      label.element.classList.remove("scale-hidden")
    }
    label.setParent = (parent) => {
      this.parent = parent
      parent.add(label)
    }
    label.remove = () => {
      this.parent.remove(label)
    }
    return label
  }
  setLabelStyle(label, pointerEvents = "none") {
    label.element.style.pointerEvents = pointerEvents
  }
  // 设置层级
  setRenderLevel(zIndex) {
    this.css2dRender.domElement.style.zIndex = zIndex
  }
  update() {
    this.css2dRender.render(this.scene, this.camera.instance)
  }
  destroy() {
    if (this.css2dRender) {
      let domElement = this.css2dRender.domElement
      domElement.parentNode.removeChild(domElement)
    }
  }
  resize() {
    let { width, height } = this.sizes
    this.css2dRender.setSize(width, height)
  }
}
