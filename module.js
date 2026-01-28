
        import * as THREE from 'three';
        import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        let scene, camera, renderer, controls, sofaMesh;
        const loader = new GLTFLoader();

        const swatchState = { sofaExpanded: false, ottomanExpanded: false };

        window.toggleMenu = function() {
            document.getElementById('mobile-menu').classList.toggle('menu-hidden');
        }

        const fabrics = [
            { name: "Cognac", color: "#5D4037" },
            { name: "Rust", color: "#B3542D" },
            { name: "Ruby", color: "#8E2424" },
            { name: "Obsidian", color: "#1A1A1A" },
            { name: "Heather", color: "#7E767D" },
            { name: "Steel", color: "#5B82A1" },
            { name: "Sand", color: "#C2B280" }
        ];

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);

            const container = document.getElementById('canvas-container');
            camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(4, 2, 5);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 2.8));
            const sun = new THREE.DirectionalLight(0xffffff, 1);
            sun.position.set(5, 10, 5);
            scene.add(sun);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            renderAllSwatches();
            
            const syncFunc = (e) => {
                document.getElementById('modelSelect').value = e.target.value;
                document.getElementById('modelSelectMobile').value = e.target.value;
                updateModel();
            };
            document.getElementById('modelSelect').addEventListener('change', syncFunc);
            document.getElementById('modelSelectMobile').addEventListener('change', syncFunc);

            updateModel();
            animate();
            setTimeout(() => document.getElementById('loader').style.display = 'none', 1000);
        }

        function updateModel() {
            const file = document.getElementById('modelSelect').value;
            loader.load(`./${file}`, (gltf) => {
                if (sofaMesh) scene.remove(sofaMesh);
                sofaMesh = gltf.scene;
                const box = new THREE.Box3().setFromObject(sofaMesh);
                const center = box.getCenter(new THREE.Vector3());
                sofaMesh.position.sub(center);
                scene.add(sofaMesh);
                applyColor(fabrics[0].color, null);
            });
        }

        function renderAllSwatches() {
            const mobileContainer = document.getElementById('mobileSwatches');
            mobileContainer.innerHTML = '';
            fabrics.forEach((f, i) => {
                const mobBtn = document.createElement('button');
                mobBtn.className = `w-14 h-14 rounded-full border-2 border-transparent transition-all shrink-0 ${i === 0 ? 'mobile-swatch-active' : ''}`;
                mobBtn.style.backgroundColor = f.color;
                mobBtn.onclick = () => {
                    document.querySelectorAll('#mobileSwatches button').forEach(b => b.classList.remove('mobile-swatch-active'));
                    mobBtn.classList.add('mobile-swatch-active');
                    applyColor(f.color, null);
                };
                mobileContainer.appendChild(mobBtn);
            });
            renderDesktopGroup('desktopSofaSwatches', false);
            renderDesktopGroup('desktopOttomanSwatches', true);
        }

        function renderDesktopGroup(containerId, isOttoman) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            const labelId = isOttoman ? 'ottomanLabel' : 'sofaLabel';
            const currentName = document.getElementById(labelId).innerText.trim();
            const isExpanded = isOttoman ? swatchState.ottomanExpanded : swatchState.sofaExpanded;
            const limit = isExpanded ? fabrics.length : 4;
            
            fabrics.slice(0, limit).forEach((f) => {
                const btn = document.createElement('button');
                const isActive = currentName === f.name; 
                btn.className = `w-10 h-10 rounded-sm border border-transparent ${isActive ? 'swatch-active' : ''}`;
                btn.style.backgroundColor = f.color;
                btn.onclick = () => {
                    const sel = isOttoman ? '#desktopOttomanSwatches button' : '#desktopSofaSwatches button';
                    document.querySelectorAll(sel).forEach(b => b.classList.remove('swatch-active'));
                    btn.classList.add('swatch-active');
                    document.getElementById(labelId).innerText = f.name;
                    applyColor(f.color, isOttoman);
                };
                container.appendChild(btn);
            });

            if (!isExpanded && fabrics.length > 4) {
                const plusBtn = document.createElement('button');
                plusBtn.className = 'w-10 h-10 rounded-sm border border-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-400 cursor-pointer bg-white';
                plusBtn.innerText = `+${fabrics.length - 4}`;
                plusBtn.onclick = () => {
                    if (isOttoman) swatchState.ottomanExpanded = true; else swatchState.sofaExpanded = true;
                    renderDesktopGroup(containerId, isOttoman);
                };
                container.appendChild(plusBtn);
            }
        }

        function applyColor(hex, isOttomanOnly) {
            if (!sofaMesh) return;
            sofaMesh.traverse(child => {
                if (child.isMesh && !child.name.toLowerCase().includes('leg')) {
                    const isOtt = child.name.toLowerCase().includes('ottoman');
                    if (isOttomanOnly === null || (isOttomanOnly && isOtt) || (!isOttomanOnly && !isOtt)) {
                        child.material.color.set(hex);
                    }
                }
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            const container = document.getElementById('canvas-container');
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        init();
