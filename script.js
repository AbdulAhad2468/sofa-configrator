  function handleViewAtHomeDesktop() {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) { startAR(); }
      else { alert("The 'View at Home' AR feature is available on mobile devices."); }
  }
        function startAR() {
            const currentModel = document.getElementById('modelSelectMobile').value;
            const modelUrl = `${window.location.origin}/${currentModel}`;
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            if (isIOS) {
                window.location.href = modelUrl.replace('.glb', '.usdz');
            } else {
                const encodedUrl = encodeURIComponent(modelUrl);
                const fallbackUrl = encodeURIComponent(window.location.href);
                window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodedUrl}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallbackUrl};end;`;
            }
        }