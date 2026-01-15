let dataRows = [];

// โหลดข้อมูลจาก localStorage
function loadData() {
  const saved = localStorage.getItem("workoutData");
  if (saved) {
    dataRows = JSON.parse(saved);
  }
  renderTable();
}

// ----------------แสดงข้อมูลในตาราง---------------- //
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  dataRows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td><input type="text" class="form-control text-center" value="${row.name}" oninput="autoSave()"></td>
          <td><input type="text" class="form-control text-center" value="${row.set}" oninput="autoSave()"></td>
          <td><input type="text" class="form-control text-center" value="${row.rep}" oninput="autoSave()"></td>
          <td>${row.time}</td>
          <td><button class="btn-save" onclick="saveRow(${index}, this)"><strong>บันทึก</strong></button></td>
          <td><button class="btn-delete" onclick="deleteRow(${index})"><strong>ลบ</strong></button></td>
        `;
    tbody.appendChild(tr);
  });

  updateSummary();
}

// ให้กด Enter เพื่อบันทึกแถวได้เลย
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.target.classList.contains("form-control")) {
    e.preventDefault();

    const tr = e.target.closest("tr");
    if (!tr) return;

    const rows = Array.from(document.querySelectorAll("#tableBody tr"));
    const index = rows.indexOf(tr);

    if (index >= 0) {
      const saveBtn = tr.querySelector(".btn-save");
      if (saveBtn) saveRow(index, saveBtn);
    }
  }
});

// ----------------สรุปผลรวมแต่ละท่า---------------- //
function updateSummary() {
  const summary = {};

  dataRows.forEach((row) => {
    const key = row.name.trim().toLowerCase();

    if (!summary[key]) {
      summary[key] = {
        displayName: row.name.trim(),
        set: 0,
        rep: 0,
      };
    }

    summary[key].set += parseInt(row.set) || 0;
    summary[key].rep += parseInt(row.rep) || 0;
  });

  const summaryList = document.getElementById("summaryList");
  summaryList.innerHTML = "";

  Object.values(summary).forEach((item) => {
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `
            <span style="color: blue;">${item.displayName}</span> |
            <span>Set: ${item.set} Rep: ${item.rep}</span>
        `;
    summaryList.appendChild(div);
  });
}

// ----------------เพิ่มแถวใหม่---------------- //
function addRow() {
  const nameInput = document.getElementById("nameInput");
  const setInput = document.getElementById("setInput");
  const repInput = document.getElementById("repInput");

  const name = nameInput.value.trim();
  const set = parseInt(setInput.value);
  const rep = parseInt(repInput.value);

  if (!name || isNaN(set) || isNaN(rep)) {
    alert("⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง!");
    return;
  }

  const key = normalizeName(name);
  const time = new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const existingIndex = dataRows.findIndex(
    (row) => normalizeName(row.name) === key
  );

  if (existingIndex !== -1) {
    dataRows[existingIndex].set = parseInt(dataRows[existingIndex].set) + set;

    dataRows[existingIndex].rep = parseInt(dataRows[existingIndex].rep) + rep;

    showStatus("✅ เพิ่ม Set / Rep ให้ท่าเดิมแล้ว");
  } else {
    dataRows.push({ name, set, rep, time });
    showStatus("✅ เพิ่มท่าใหม่แล้ว");
  }

  saveData();
  renderTable();
  clearInputs();
}

// Enter แล้วเพิ่มลง
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#nameInput, #setInput, #repInput");

  inputs.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // กันไม่ให้ reload หน้า
        addRow(); // เรียกฟังก์ชันเพิ่มแถว
      }
    });
  });
});

// ----------------บันทึกข้อมูลในแถวที่แก้ไข---------------- //
function saveRow(index, btn) {
  const tr = btn.closest("tr");
  const inputs = tr.querySelectorAll("input");
  dataRows[index] = {
    name: inputs[0].value,
    set: inputs[1].value,
    rep: inputs[2].value,
    time: dataRows[index].time, // ถ้าเวลาปัจจุบัน .now
  };
  saveData();
  renderTable();
  showStatus("✅ บันทึกข้อมูลเรียบร้อย!");
}

let autoSaveTimer = null;

function autoSave() {
  clearTimeout(autoSaveTimer);

  autoSaveTimer = setTimeout(() => {
    saveAllRows();
    showStatus("💾 บันทึกอัตโนมัติแล้ว");
  }, 600); // หน่วง 0.6 วิ หลังหยุดพิมพ์
}

// ----------------ลบข้อมูล---------------- //
function deleteRow(index) {
  const confirmDelete = confirm("ต้องการลบข้อมูลนี้หรือไม่?");
  if (confirmDelete) {
    dataRows.splice(index, 1);
    renderTable();
    saveData();
    showStatus("🗑️ ลบข้อมูลแล้ว!");
  } else {
    showStatus("❎ ยกเลิกการลบ!");
  }
}

// ----------------บันทึกข้อมูลทุกแถว---------------- //
function saveAllRows(skipRender = false) {
  const rows = document.querySelectorAll("#tableBody tr");
  const merged = {};

  rows.forEach((tr) => {
    const inputs = tr.querySelectorAll("input");
    if (inputs.length !== 3) return;

    const rawName = inputs[0].value;
    const key = normalizeName(rawName);
    const set = parseInt(inputs[1].value) || 0;
    const rep = parseInt(inputs[2].value) || 0;

    if (!merged[key]) {
      merged[key] = {
        name: rawName.trim(),
        set: set,
        rep: rep,
        time: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } else {
      merged[key].set += set;
      merged[key].rep += rep;
    }
  });

  dataRows = Object.values(merged);

  saveData();
  if (!skipRender) renderTable();
  showStatus("✅ บันทึกข้อมูลทั้งหมดเรียบร้อย!");
}

// ----------------ล้างข้อมูลทั้งหมด---------------- //
function clearAllData() {
  if (confirm("ต้องการล้างข้อมูลทั้งหมดใช่ไหม?")) {
    dataRows = [];
    localStorage.removeItem("workoutData");
    renderTable();
    showStatus("🧹 ล้างข้อมูลแล้ว");
  }
}

// ----------------เซฟข้อมูลลง localStorage---------------- //
function saveData() {
  localStorage.setItem("workoutData", JSON.stringify(dataRows));
}

// ----------------เคลียร์ช่อง input---------------- //
function clearInputs() {
  document.getElementById("nameInput").value = "";
  document.getElementById("setInput").value = "";
  document.getElementById("repInput").value = "";
  document.getElementById("nameInput").focus();
}

// ----------------แสดงข้อความสถานะ---------------- //
function showStatus(msg) {
  const status = document.getElementById("status");
  status.textContent = msg;

  setTimeout(() => {
    status.textContent = "ข้อมูลจะถูกบันทึกอัตโนมัติ";
  }, 2000);
}

window.onload = loadData;

// ----------------D/M/Y Timer---------------- //
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formatted = now.toLocaleDateString("th-TH", options);
  document.getElementById("datetime").textContent = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ----------------ปุ่มสามขีด hamburger---------------- //
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
}

// ----------------ปุ่มกลับขึ้นบน ----------------//
const btn = document.getElementById("backToTop");
window.onscroll = () => {
  if (document.documentElement.scrollTop > 50) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};
btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

// Spinner loader
window.addEventListener("load", () => {
  const spinnerOverlay = document.getElementById("spinnerOverlay");
  setTimeout(() => {
    spinnerOverlay.style.display = "none";
  }, 400); // หมุน 1.5 วินาทีแล้วหาย
});

// กันข้อมูลหาย
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saveAllRows();
    saveData();
  }
});

window.addEventListener("beforeunload", () => {
  saveAllRows();
  saveData();
});

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
