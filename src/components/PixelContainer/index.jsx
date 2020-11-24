import React, { Component, createRef } from 'react';
import * as THREE from 'three';

class PixelContainer extends Component {
  constructor(props) {
    super(props);

    // Canvas
    this.canvas = createRef();
    this.ctx = null;
    this.rendererCanvas = createRef();

    // SCENE
    this.scene = new THREE.Scene();

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
    this.steps = 8; // get every x number of pixels
    this.gradients = 0; // 0 means calculate dynamically | >0 means round numbers to set gradient colors
    this.nrOfCubesX = 0;
    this.nrOfCubesY = 0;

    this.colors = null;

    // Event listeners
    // window.addEventListener('resize', this.handleResize);

    this.state = {
      running: true,
    };
  }

  componentDidMount() {
    this.setupCanvas();
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

  // --------------------- ===
  //  SETUP
  // ---------------------

  setupCanvas = () => {
    this.ctx = this.canvas.current.getContext('2d');
  }

  setupRenderer = () => {
    // Create a renderer with Antialiasing
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.rendererCanvas.current,
    });

    // Configure renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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

    this.nrOfCubesX = Math.floor(this.width / this.steps);
    this.nrOfCubesY = Math.floor(this.height / this.steps);
  }

  setupCamera = () => {
    const z = (1 / this.steps) * 500;

    this.camera = new THREE.PerspectiveCamera(
      75, // fov — Default is 50. 10 is like a 2000mm lens | 140 is like a 20mm lense
      window.innerWidth / window.innerHeight, // aspect — Camera frustum aspect ratio. Default is 1 (square).
      0.1, // near — Near is relative to z-position.
      1000, // far — Must be greater than near.
    );
    this.camera.position.set(this.nrOfCubesX / 2, this.nrOfCubesY / 2, z);

    // const controls = new OrbitControls(this.camera);
    // controls.target.set(this.nrOfCubesX / 2, this.nrOfCubesY / 2, 0);
    // controls.update();
  }

  setupCubes = () => {
    // Materials need geometry, material and mesch
    const geometry = new THREE.BoxGeometry(
      1, // width
      1, // height
      1, // depth
    );
    const color = new THREE.Color('rgb(128, 128, 128)');

    for (let y = 0; y < this.nrOfCubesY; y += 1) {
      for (let x = 0; x < this.nrOfCubesX; x += 1) {
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

  // --------------------- ===
  //  DRAW
  // ---------------------
  // https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786
  rgbToHsl = (ir, ig, ib) => {
    const r = ir / 255;
    const g = ig / 255;
    const b = ib / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h;
    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = ((b - r) / d) + 2;
    else if (max === b) h = ((r - g) / d) + 4;

    const l = (min + max) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

    return [h * 60, s, l];
  }

  pixelate = () => {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const pixels = imageData.data;

    this.cubes.forEach((cube, index) => {
      const { x, y } = cube.position;

      const pixelRIndex = (4 * this.steps * x) + (4 * this.width * (y * this.steps));

      const cubeHsl = this.rgbToHsl(pixels[pixelRIndex], pixels[pixelRIndex + 1], pixels[pixelRIndex + 2]);

      // const col = this.getAverage(pixels, this.width - x * this.steps, this.height - y * this.steps);
      // const c = Math.round(col);
      // this.cubes[index].material.color = this.colors.get(c);
      // const z = col / 10 + 0.01;
      // this.cubes[index].scale.z = z;
      // this.cubes[index].position.z = z / 2;

      this.cubes[index].material.color = new THREE.Color(`hsl(0, 0%, ${Math.round(cubeHsl[2] * 100)}%)`);

      // this.cubes[index].rotation.x += 0.01;
      // this.cubes[index].rotation.y += 0.01;
    });
  }

  draw = () => {
    this.ctx.drawImage(this.video.current, 0, 0, this.width, this.height);
    this.pixelate();
    this.renderer.render(this.scene, this.camera);

    if (this.state.running) {
      requestAnimationFrame(this.draw);
    }
  }

  // --------------------- ===
  //  HANDLERS
  // ---------------------

  handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    return (
      <div>
        <video
          ref={this.video}
          className="d-none"
          // style={{ display: 'none' }}
          playsInline
        />
        <canvas
          ref={this.canvas}
        />
        <canvas
          ref={this.rendererCanvas}
          style={{ display: 'block', transform: 'scale(-1)' }}
        />
        <button
          type="button"
          onClick={() => this.setState((prevState) => ({ running: !prevState.running }), this.draw)}
        >
          {this.state.running ? 'Pause' : 'Start'}
        </button>
      </div>
    );
  }
}

PixelContainer.defaultProps = {

};

PixelContainer.propTypes = {

};

export default PixelContainer;
