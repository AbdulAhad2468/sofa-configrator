  function handleViewAtHomeDesktop() {
      startAR();
  }
        function startAR() {
            const currentModel = document.getElementById('modelSelect').value;
            window.location.href = `ar.html?model=${encodeURIComponent(currentModel)}`;
        }