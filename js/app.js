// Enregistrement du Service Worker pour le mode offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// Indicateur hors ligne
function updateOfflineHint() {
  const hint = document.getElementById("offline-hint");
  if (hint) hint.hidden = navigator.onLine;
}

window.addEventListener("online", updateOfflineHint);
window.addEventListener("offline", updateOfflineHint);
updateOfflineHint();
