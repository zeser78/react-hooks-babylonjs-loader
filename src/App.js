import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from "react";
import './App.css'
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

const App = () => {

   const [numberRing, setRingNumber] = useState(0);

  const prevCountRef = useRef();
  // const [prevCount, setPrevCount ] = useState(prevCountRef.current)

  useEffect(() => {
    prevCountRef.current = numberRing;

  },[numberRing])

  const changeModel = (e) => {
    e.preventDefault()
console.log( e.target.value)
setRingNumber(e.target.value)
  }
  
  let prevCount = prevCountRef.current
  console.log(prevCount)

  //

let selectModel = numberRing

    const loadPromise = (root, file, scene) => {
        return new Promise((res, rej) => {
          BABYLON.SceneLoader.LoadAssetContainer(root, file, scene, function (container) {
          //   console.log(container.meshes)
  
            let root = new BABYLON.TransformNode()
  
            container.meshes.map((m) => {
              // console.log(m.name)
  
              if (!m.parent) {
                m.parent = root
              }
            })
            root.scaling = new BABYLON.Vector3(50,50,50)
            res(container)
          })
        })
      }

      var main = async (scene) => {
        // Different objects to cycle through
     console.log(scene.meshes)
     
    //  let scenes = data
         var scenes = [
            {
              id: 0,
                root: "./assets/rings/",
                file: "ring-3stone.glb"
            },
            {
              id:1,
                root: "./assets/rings/",
                file: "ring-crown-v1.glb"
            },
            {
              id: 2,
                root: "./assets/rings/",
                file: "ring-3stone.glb"
            },
            {
              id:3,
                root: "./assets/rings/",
                file: "ring-crown-v1.glb"
            },
            {
              id:4,
                root: "./assets/rings/",
                file: "ring-shader-nov10-original.glb"
            },
          ]
        // Load all scenes one by one and display the first one
        var assetContainers = []
        var currentSceneIndex = numberRing
        for (var i = 0; i < scenes.length; i++) {
            console.log(scenes.length )
  
            var assets = await loadPromise(scenes[i].root, scenes[i].file, scene)
   
            assetContainers.push(assets)
        }
     
        if (prevCount == undefined ) {
          prevCount = 0
      
        }
       
        assetContainers[prevCount].removeAllFromScene()
        assetContainers[currentSceneIndex].addAllToScene()
 
   }

const createScene =  (scene, renderCanvas) => {
        let camera = new BABYLON.ArcRotateCamera(
          "Camera",
          -Math.PI / 2,
          Math.PI / 2,
          4,
          new BABYLON.Vector3(0,0,0),
          scene
        );
    
        camera.lowerRadiusLimit = 4;
        camera.upperRadiusLimit = 6;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(renderCanvas, true);
        // Light
        let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 100, 0), scene);
        
        BABYLON.SceneLoader.ShowLoadingScreen = false
        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene

        return scene;
    
    };
   
  const canvasRef = useRef(null);
  useEffect(() => {
    const renderCanvas = canvasRef.current;
    const engine = new BABYLON.Engine(renderCanvas);
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color3(255/255, 240/255, 246/ 255)
     
  let sceneToRender = createScene(scene, renderCanvas)
    main(scene)

    scene.createDefaultLight()

    engine.runRenderLoop(() => {
      sceneToRender.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });

  });

  return (
    <>
       <div className="container-menu">
        <button value="0" onClick={changeModel}>0</button>
        <button value="1" onClick={changeModel}>1</button>
        <button value="2" onClick={changeModel}>2</button>
        <button value="3" onClick={changeModel}>3</button>
        <button value="4" onClick={changeModel}>4</button>
     
      </div>
     <div id="containerCanvas" style={{position: `absolute`, top: 0 , zIndex: 5 }}>
     <canvas id="renderCanvas" ref={canvasRef} />
     </div>
    </>
  );
};

export default App;
