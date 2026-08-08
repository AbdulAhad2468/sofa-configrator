  function handleViewAtHomeDesktop() {
      startAR();
  }
        function startAR() {
            const currentModel = document.getElementById('modelSelect').value;
            const modelUrl = `${window.location.origin}/${currentModel}`;
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            if (isIOS) {
                window.location.href = modelUrl.replace('.glb', '.usdz');
            } else {
                const encodedUrl = encodeURIComponent(modelUrl);
                window.location.href = `https://arvr.google.com/scene-viewer/1.0?file=${encodedUrl}&mode=ar_preferred`;
            }
        }