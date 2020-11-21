import {
  useEffect,
  useRef,
} from 'react';

// https://stackoverflow.com/a/56767883/3550318
export const useMountEffect = (fun) => useEffect(fun, []);

// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
export const useCanvas = (draw) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return canvasRef
}
