let userData = null;

function login() {
  const server = document.getElementById("server").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ server, username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user_info) {
        localStorage.setItem("iptv", JSON.stringify({ server, username, password }));
        window.location.href = "dashboard.html";
      } else {
        alert("Identifiants incorrects");
      }
    });
}

window.onload = function () {
  if (window.location.pathname.includes("dashboard.html")) {
    loadChannels();
  }
};

function loadChannels() {
  const saved = JSON.parse(localStorage.getItem("iptv"));
  const { server, username, password } = saved;

  fetch(`${server}/player_api.php?username=${username}&password=${password}&action=get_live_streams`)
    .then(res => res.json())
    .then(streams => {
      const list = document.getElementById("channels");
      list.innerHTML = "";

      streams.forEach(stream => {
        const li = document.createElement("li");
        li.textContent = stream.name;
        li.onclick = () => playStream(server, username, password, stream.stream_id);
        list.appendChild(li);
      });
    });
}

function playStream(server, username, password, id) {
  const video = document.getElementById("video");
  const url = `${server}/live/${username}/${password}/${id}.m3u8`;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}
