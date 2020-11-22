import React, { Component, createRef } from 'react';
import * as THREE from 'three';

class FirstTry extends Component {
  constructor(props) {
    super(props);

    // Canvas
    this.canvas = createRef();
    this.ctx = null;

    // SCENE
    // this.scene = new THREE.Scene();

    // CAMERA
    this.camera = null;

    // RENDERER
    this.width = 100;
    this.height = 100;
    this.renderer = null;

    // Mesh stuff
    this.cubes = [];

    // webcam
    this.video = createRef();

    // Pixel logic
    this.size = 8;
    this.nrOfCubesX = 0;
    this.nrOfCubesY = 0;

    this.colors = null;

    // Event listeners
    // window.addEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    // this.ctx = this.canvas.current.getContext('2d');

    this.setupCanvas();

    this.setupColors();
    this.setupScene();
    this.setupRenderer();

    this.setupWebCamera().then(() => {
      // We need to call these after
      // the web cam is setup so we
      // know the width and height
      // of the video feed
      this.reset();
      this.setupCamera();
      this.setupCubes();
      this.setupLights();
      this.draw();
    });
  }

  componentWillUnmount() {
    // window.cancelAnimationFrame(animationFrameId);
  }

  setupScene = () => {
    this.width = this.canvas.current.clientWidth;
    this.height = this.canvas.current.clientHeight;
    this.scene = new THREE.Scene();
  }

  setupCanvas = () => {
    this.ctx = this.canvas.current.getContext('2d');
  }

  handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setupWebCamera = () => {
    return new Promise((resolve, reject) => {
      const constraints = { audio: false, video: true };
      navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
          this.video.current.srcObject = mediaStream;
          this.video.current.onloadedmetadata = () => {
            this.video.current.play();
            resolve();
          };
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  reset = () => {
    this.width = this.canvas.current.width = this.video.current.videoWidth;
    this.height = this.canvas.current.height = this.video.current.videoHeight;
    this.nrOfCubesX = this.width / this.size;
    this.nrOfCubesY = this.height / this.size;
  }

  setupCamera = () => {
    const z = (1 / this.size) * 500;

    this.camera = new THREE.PerspectiveCamera(
      75, // fov — Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50. 10 is like a 2000mm lens | 140 is like a 20mm lense
      this.width / this.height, // aspect — Camera frustum aspect ratio. Default is 1 (square).
      0.1, // near — Camera frustum near plane. Default is 0.1. Valid range is greater than 0 and less than the current value of the far plane. There is also a z-position that can be set which is different from "near". Near is relative to z-position.
      1000, // far — Camera frustum far plane. Default is 2000. Must be greater than near.
    );
    this.camera.position.set(this.nrOfCubesX / 2, this.nrOfCubesY / 2, z);

    // const controls = new OrbitControls(this.camera);
    // controls.target.set(this.nrOfCubesX / 2, this.nrOfCubesY / 2, 0);
    // controls.update();
  }

  setupRenderer = () => {
    // Create a renderer with Antialiasing
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // canvas: this.canvas.current,
    });
    // Configure renderer clear color
    // this.renderer.setClearColor('#000000');

    // Configure renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  setupCubes = () => {
    // Materials need geometry, material and mesch
    const geometry = new THREE.BoxGeometry(
      1, // width
      1, // height
      1, // depth
      1, // OPTIONAL widthSegments. Number of segmented rectangular faces along the width of the sides. Default 1;
      1, // OPTIONAL heightSegments. Number of segmented rectangular faces along the height of the sides. Default 1;
      1, // OPTIONAL depthSegments. Number of segmented rectangular faces along the depth of the sides. Default 1;
    );
    const color = new THREE.Color('rgb(128, 128, 128)');

    for (let x = 0; x < this.nrOfCubesX; x += 1) {
      for (let y = 0; y < this.nrOfCubesY; y += 1) {
        const material = new THREE.MeshStandardMaterial({
          roughness: 0.5,
          color,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, 0);
        this.scene.add(cube);
        this.cubes.push(cube);
      }
    }
  }

  setupLights = () => {
    const ambientLight = new THREE.AmbientLight(0x777777);
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xbbbbbb);
    spotLight.position.set(0, this.nrOfCubesY, 100);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
  }

  setupColors = () => {
    this.colors = new Map();
    for (let i = 0; i < 256; i += 1) {
      const c = new THREE.Color(`rgb(${i}, ${i}, ${i})`);
      this.colors.set(i, c);
    }
  }

  getAverage = (pixels, x0, y0) => {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let x = x0; x < x0 + this.size; x += 1) {
      for (let y = y0; y < y0 + this.size; y += 1) {
        const index = (x + this.width * y) * 4;
        r += pixels[index];
        g += pixels[index + 1];
        b += pixels[index + 2];
      }
    }

    const val = (0.2126 * r + 0.7152 * g + 0.0722 * b) / (this.size * this.size);

    return isNaN(val) ? 1 : val;
  }

  pixelate = () => {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const pixels = imageData.data;

    this.cubes.forEach((cube, index) => {
      const { x, y } = cube.position;

      const col = this.getAverage(pixels, this.width - x * this.size, this.height - y * this.size);
      const c = Math.round(col);
      this.cubes[index].material.color = this.colors.get(c);
      const z = col / 10 + 0.01;
      this.cubes[index].scale.z = z;
      this.cubes[index].position.z = z / 2;

      this.cubes[index].rotation.x += 0.01;
      this.cubes[index].rotation.y += 0.01;
    });
  }

  draw = () => {
    this.ctx.drawImage(this.video.current, 0, 0, this.width, this.height);
    this.pixelate();
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.draw);
  }

  render() {
    return (
      <div>
        <video
          ref={this.video}
          className="d-none"
          style={{ display: 'none' }}
          playsInline
        />
        <canvas
          ref={this.canvas}
          style={{ width: '75%', height: '50vh', display: 'block' }}
        />
      </div>
    );
  }
}

FirstTry.defaultProps = {

};

FirstTry.propTypes = {

};

export default FirstTry;
