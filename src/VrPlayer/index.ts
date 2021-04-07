import {
  PerspectiveCamera,
  Scene,
  TextureLoader,
  MeshBasicMaterial,
  SphereBufferGeometry,
  Mesh,
  WebGLRenderer,
  Matrix3,
  Vector3,
  Raycaster,
  Vector2,
  // BoxGeometry,
  // AxesHelper,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import gsap from 'gsap';
import './style.less';

function parseToDOM(str: string) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.childNodes;
}

const cssPrefix = 'vrp';

export type Label = {
  x: number;
  y: number;
  z: number;
  text?: string;
  extraData?: object;
  domRef?: HTMLDivElement;
  render?: (text: string, extraData: object) => HTMLDivElement;
};

export type SceneSetting = {
  img: string;
  labels?: Label[];
};

export default class VrPlayer {
  domContainer;
  material;
  lables: Label[];

  constructor(domContainer: HTMLDivElement) {
    this.domContainer = domContainer;
    const domStr = `<div class="${cssPrefix}"><div class="${cssPrefix}-canvas"></div><div class="${cssPrefix}-labels"></div></div>`;
    domContainer.innerHTML = domStr;

    this.lables = [];
    const scene = new Scene();
    // scene.add(new AxesHelper(50));

    const camera = new PerspectiveCamera(
      45,
      domContainer.clientWidth / domContainer.clientHeight,
      0.1,
      1000,
    );

    // camera.position.set(86, -1.83, -2.26);
    // camera.lookAt(0, 0, 0);
    camera.position.set(40, 0, 0);

    const material = new MeshBasicMaterial();
    this.material = material;

    const geometry = new SphereBufferGeometry(100, 180, 180);
    geometry.scale(-1, 1, 1);

    const ball = new Mesh(geometry, material);
    scene.add(ball);

    const renderer = new WebGLRenderer();

    const domCanvas = renderer.domElement;
    renderer.setSize(domContainer.clientWidth, domContainer.clientHeight);
    domContainer.querySelector(`.${cssPrefix}-canvas`)!.appendChild(domCanvas);

    domCanvas.addEventListener('dblclick', e => {
      const raycaster = new Raycaster();
      const mouse = new Vector2();
      mouse.x = (e.layerX / domCanvas.width) * 2 - 1;
      mouse.y = -(e.layerY / domCanvas.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      let point;
      for (let i = 0, len = intersects.length; i < len; i++) {
        if (intersects[i].object.uuid === ball.uuid) {
          point = intersects[i].point;
          break;
        }
      }
      console.log(point);
    });

    // gsap.to(camera, {
    //   delay: 0,
    //   duration: 2,
    //   fov: 45,
    //   onUpdate() {
    //     camera.updateProjectionMatrix();
    //   },
    //   ease: 'ease',
    // });

    const control = new OrbitControls(camera, domCanvas);
    // control.maxDistance = 90;
    control.minDistance = 10;
    // control.autoRotate = true;
    // control.rotateSpeed *= -0.7;
    control.enablePan = false;
    control.update();

    const tempV = new Vector3();
    const cameraToPoint = new Vector3();
    const cameraPosition = new Vector3();
    const normalMatrix = new Matrix3();

    const animate = () => {
      // console.log(camera.position);
      requestAnimationFrame(animate);

      const minVisibleDot = 0.2;
      normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
      camera.getWorldPosition(cameraPosition);

      this.lables.forEach(label => {
        const position = new Vector3(label.x, label.y, label.z);

        tempV.copy(position);
        tempV.applyMatrix3(normalMatrix);
        cameraToPoint.copy(position);
        cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();
        const dot = tempV.dot(cameraToPoint);
        if (dot < minVisibleDot) {
          label.domRef.style.display = 'none';
        } else {
          label.domRef.style.display = '';
          tempV.copy(position);
          tempV.project(camera);
          const x = (tempV.x * 0.5 + 0.5) * domCanvas.clientWidth;
          const y = (tempV.y * -0.5 + 0.5) * domCanvas.clientHeight;
          label.domRef.style.transform = `translate(${x}px,${y}px)`;
          label.domRef.style.zIndex = ((-tempV.z * 0.5 + 0.5) * 100000) | 0;
        }

        // console.log(label);
        label.domRef;
      });
      control.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  setScene(setting: SceneSetting) {
    this.material.map = new TextureLoader().load(setting.img);
    this.material.needsUpdate = true;
    this.lables = setting.labels || [];
    const domLables = this.domContainer.querySelector(`.${cssPrefix}-labels`);
    domLables!.innerHTML = '';
    this.lables.forEach(label => {
      let domRef;
      if (label.render) {
        domRef = label.render(label.text || '', label.extraData || {});
      } else {
        domRef = parseToDOM(
          `<div class="${cssPrefix}-label ${cssPrefix}-label--style1"><div class="${cssPrefix}-label__text">${label.text}</div><div class="${cssPrefix}-label__dot"></div></div>`,
        )[0];
      }
      label.domRef = domRef;
      domLables?.appendChild(domRef);
    });
  }
}
