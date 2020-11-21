import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMountEffect } from '$common/hooks';

// 2d and web cam stuff
let ctx;
let w;
let h;
let size = 8;
let video;

// three.js stuff
let colors;
let scene;
let camera;
let renderer;
let cubes;
let nrOfCubesX;
let nrOfCubesY;

const Webcam = () => {
  const canvas = useRef(null);

  // --------------------- ===
  //  SETUP
  // ---------------------
  useMountEffect(() => {
    const setupCanvas = () => {
      ctx = canvas.getContext('2d');
    };

    // Trying to be clever and keep all grayscale colors
    // in a lookup table. Will we avoid some GCs?
    const setupColors = () => {
      colors = new Map();
      for (let i = 0; i < 256; i += 1) {
        const c = new THREE.Color(`rgb(${i}, ${i}, ${i})`);
        colors.set(i, c);
      }
    };

    const setupScene = () => {
      scene = new THREE.Scene();
    };

    const setupRenderer = () => {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(
        window.innerWidth,
        window.innerHeight,
      );
      document.body.appendChild(renderer.domElement);
    };
    const setupWebCamera = () => {
      const constraints = { audio: false, video: true };
      navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
          video = document.querySelector("video");
          video.srcObject = mediaStream;
          video.onloadedmetadata = () => {
            video.play();
          };
        });
    }

    setupWebCamera();
  });


  return (
    <div>
      <canvas
        ref={canvas}
        style={{ width: '75%', height: '50vh', display: 'block' }}
      />
    </div>
  );
};

Webcam.defaultProps = {

};

Webcam.propTypes = {

};

export default Webcam;
