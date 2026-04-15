import fs from 'fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { JSDOM } from 'jsdom';
import * as THREE from 'three';

const dom = new JSDOM();
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;

const data = fs.readFileSync('public/head02.glb');
const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

const loader = new GLTFLoader();
loader.parse(arrayBuffer, '', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.computeBoundingBox();
      console.log(child.name, child.geometry.attributes.position.count, child.geometry.boundingBox);
    }
  });
});
