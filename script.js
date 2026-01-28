  function handleViewAtHomeDesktop() { alert("The 'View at Home' AR feature is available on mobile devices."); }
        function startAR() {
            const currentModel = document.getElementById('modelSelectMobile').value;
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS) { window.location.href = `./models/${currentModel.replace('.glb', '.usdz')}`; } 
            else { window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${window.location.origin}/models/${currentModel}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`; }
        }