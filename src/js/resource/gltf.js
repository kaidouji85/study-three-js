// @flow

import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import type {ResourceRoot} from "./resource-root";

/** glTFリソースID */
export type GlTFId = string;

/** glTFリソース設定 */
export type GlTFConfig = {
  /** ID */
  id: GlTFId,
  /** glTFファイルのパス */
  path: string,
};

/** glTFリソース */
export type GlTFResource = {
  /** ID */
  id: GlTFId,
  /** glTFモデル */
  object: typeof THREE.Scene
};

/** IDリスト */
export const GLTF_IDS = {
  SHOPPING_STREET: 'SHOPPING_STREET',
};

/** 設定集 */
export const GLTF_CONFIGS: GlTFConfig[] = [
  {
    id: GLTF_IDS.SHOPPING_STREET,
    path: 'model/shopping-street.glb'
  }
];

/**
 * glTFファイルを読み込む
 *
 * @param resourceRoot リソースルート
 * @param config 設定
 * @return glTFリソース
 */
export function loadGlTF(resourceRoot: ResourceRoot, config: GlTFConfig): Promise<GlTFResource> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const fullPath = `${resourceRoot.get()}/${config.path}`;
    const onLoad = (object) => resolve({
      id: config.id,
      object: object.scene
    });
    const onProgress = () => {}; //NOP
    const onFail = err => reject(err);
    loader.load(fullPath, onLoad, onProgress, onFail);
  });
}

/**
 * 全てのglTFリソースを読み込む
 *
 * @param resourceRoot リソースルート
 * @return 読み込みPromiseの配列
 */
export function loadingAllGTLFModels(resourceRoot: ResourceRoot): Array<Promise<GlTFResource>> {
  return GLTF_CONFIGS.map(v => loadGlTF(resourceRoot, v));
}

/**
 * GLTFリソースを解放する
 * 
 * @param target 解放対象
 */
export function disposeGltfModel(target: GlTFResource): void {
  target.object.traverse(v => {
    if (v instanceof THREE.Mesh) {
      v.geometry.dispose();
      v.material.dispose();
      if (v.material.map instanceof THREE.Texture) {
        v.material.map.dispose();
      }
    }
  });
}