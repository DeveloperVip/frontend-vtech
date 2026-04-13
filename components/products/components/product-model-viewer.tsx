'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Loader2, Maximize2, RotateCw } from 'lucide-react';

interface ProductModelViewerProps {
  modelUrl: string;
  poster?: string;
  textureUrl?: string;
  autoRotate?: boolean;
}

const ProductModelViewer: React.FC<ProductModelViewerProps> = ({
  modelUrl,
  poster,
  textureUrl,
  autoRotate = true
}) => {
  console.log("🚀 ~ ProductModelViewer ~ modelUrl:", modelUrl)
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current || !modelUrl) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemisphereLight);

    // Loader
    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // ĐÚNG - dùng vector subtraction để centering
        model.position.sub(center);

        // Scale model to fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.set(scale, scale, scale);

        // Điều chỉnh camera theo kích thước thực tế của model
        camera.position.set(0, maxDim * 0.5, maxDim * 2.2);
        controls.target.set(0, 0, 0);
        controls.update();

        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;

            // Optional texture overwrite
            if (textureUrl) {
              const textureLoader = new THREE.TextureLoader();
              textureLoader.load(textureUrl, (tex) => {
                tex.flipY = false;
                const material = (node as THREE.Mesh).material as THREE.MeshStandardMaterial;
                material.map = tex;
                material.needsUpdate = true;
              });
            }
          }
        });

        scene.add(model);
        setLoading(false);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error('An error happened while loading the model:', err);
        setError('Không thể tải mô hình 3D.');
        setLoading(false);
      }
    );

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl, textureUrl, autoRotate]);

  return (
    <div className="relative w-full h-full aspect-square md:aspect-[4/3] bg-zinc-50 rounded-2xl overflow-hidden group">
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          {poster && !error && (
            <img
              src={poster}
              alt="Loading..."
              className="absolute inset-0 w-full h-full object-contain opacity-40 blur-sm"
            />
          )}
          <Loader2 className="w-10 h-10 text-[#2b59ff] animate-spin mb-4" />
          <div className="text-sm font-bold text-gray-700">Đang tải mô hình 3D... {progress}%</div>
          <div className="mt-2 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2b59ff] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Maximize2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Oops! Có lỗi xảy ra</h3>
          <p className="text-gray-500 text-sm max-w-[240px]">{error}</p>
        </div>
      )}

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className={`w-full h-full transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Interaction Controls Hint */}
      {!loading && !error && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 p-2.5 rounded-full shadow-lg text-[#2b59ff] hover:bg-[#2b59ff] hover:text-white transition-all transform hover:scale-110 active:scale-95">
            {/* <RotateCw size={18} /> */}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 pointer-events-none">
          <Maximize2 size={12} />
          Xoay và phóng to để xem chi tiết
        </div>
      )}
    </div>
  );
};

export default ProductModelViewer;
