import * as THREE from "three";
import {SPRITE_RENDER_ORDER} from "./render-order";

/** パラメータ */
type Params = {
  canvasWidth: number,
  canvasHeight: number,
  meshWidth: number,
  meshHeight: number,
};

/** キャンバスメッシュおよび関連オブジェクトを集めたクラス */
export class CanvasMesh {
  /** メッシュ */
  mesh: THREE.Mesh;
  /** 描画を行うキャンバス */
  canvas: HTMLCanvasElement;

  constructor(params: Params) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = params.canvasWidth;
    this.canvas.height = params.canvasHeight;

    const texture = new THREE.Texture(this.canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    material.transparent = true;
    const planeGeometry = new THREE.PlaneGeometry(params.meshWidth, params.meshHeight);

    this.mesh = new THREE.Mesh(planeGeometry, material);
    this.mesh.renderOrder = SPRITE_RENDER_ORDER;
  }

  /** デストラクタ */
  destructor(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh.material.map.dispose();
  }

  /**
   * キャンバステクスチャに描画するヘルパー関数
   *
   * @param drawFunc 描画関数
   */
  draw(drawFunc: (context: CanvasRenderingContext2D) => void): void {
    // テクスチャとして使われているキャンバスを更新する場合、
    // 毎回 mesh.material.map.needsUpdate = true とセットする必要がある
    //
    // 詳細
    // https://stackoverflow.com/a/18474767/7808745
    this.mesh.material.map.needsUpdate = true;

    const context = this.canvas.getContext('2d');
    drawFunc(context);
  }

  /** 透明度を設定する */
  setOpacity(opacity: number): void {
    this.mesh.material.opacity = opacity;
  }

  /** シーンに追加するオブジェクトを取得する */
  getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}