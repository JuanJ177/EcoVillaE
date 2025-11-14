const API = "http://localhost:5000";

async function fetchJSON(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.json();
}

async function loadUsuarios() {
  try {
    const users = await fetchJSON(API + "/usuarios");
    const sel = document.getElementById("usuarioSelect");
    sel.innerHTML = '<option value="">-- Seleccione --</option>';
    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = `${u.nombre || 'Usuario'} (ID ${u.id})`;
      sel.appendChild(opt);
    });
    document.getElementById("countUsers").textContent = users.length;
  } catch (e) {
    console.error(e);
    document.getElementById("usuarioSelect").innerHTML = '<option>Error</option>';
  }
}

let materialChart = null;
function renderChart(dataAgg) {
  const labels = Object.keys(dataAgg);
  const data = labels.map(l => dataAgg[l]);
  const ctx = document.getElementById("materialChart").getContext("2d");
  if (materialChart) {
    materialChart.data.labels = labels;
    materialChart.data.datasets[0].data = data;
    materialChart.update();
    return;
  }
  materialChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: ["#34D399","#059669","#10B981","#F59E0B","#60A5FA"] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}

async function loadRecientesAndChart() {
  try {
    const rec = await fetchJSON(API + "/reciclaje");
    const list = document.getElementById("listaRecientes");
    list.innerHTML = "";
    const agg = {};
    rec.slice(0, 50).forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.material} — ${r.cantidad} kg — Usuario ${r.usuarioid}`;
      list.appendChild(li);
      const key = (r.material || "Otros").toString().trim();
      agg[key] = (agg[key] || 0) + Number(r.cantidad || 0);
    });
    document.getElementById("countRec").textContent = rec.length;
    renderChart(agg);
  } catch (e) {
    console.error(e);
  }
}

async function loadRanking() {
  try {
    const rank = await fetchJSON(API + "/ranking");
    const ol = document.getElementById("listaRanking");
    ol.innerHTML = "";
    rank.slice(0, 10).forEach(u => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="flex justify-between"><span>${u.nombre || 'Usuario ' + u.usuarioid}</span><strong>${u.points} pts</strong></div>`;
      ol.appendChild(li);
    });
    const total = rank.reduce((s, x) => s + (Number(x.points) || 0), 0);
    document.getElementById("totalPoints").textContent = total;
  } catch (e) {
    console.error(e);
  }
}

// submit
document.getElementById("formReciclar").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const usuarioid = document.getElementById("usuarioSelect").value;
  const material = document.getElementById("material").value.trim();
  const cantidad = Number(document.getElementById("cantidad").value);
  if (!usuarioid || !material || !cantidad) {
    document.getElementById("mensaje").textContent = "Completa todos los campos";
    return;
  }
  try {
    const data = await fetchJSON(API + "/reciclaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioid: Number(usuarioid), material, cantidad })
    });
    document.getElementById("mensaje").textContent = `Registrado! Puntos: ${data.points}`;
    await Promise.all([loadRanking(), loadRecientesAndChart()]);
  } catch (e) {
    console.error(e);
    document.getElementById("mensaje").textContent = "Error al guardar";
  }
});

document.getElementById("limpiar").addEventListener("click", () => {
  document.getElementById("material").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("usuarioSelect").value = "";
});

// initial load
(async function init() {
  await Promise.all([loadUsuarios(), loadRanking(), loadRecientesAndChart()]);
})();
