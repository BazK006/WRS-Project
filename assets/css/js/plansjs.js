  document.addEventListener("DOMContentLoaded", () => {
            const dayColumns = document.querySelectorAll(".day-column");
            const saveBtn = document.querySelector(".btn-save");

            // โหลดข้อมูลจาก localStorage
            const saved = JSON.parse(localStorage.getItem("weeklyActivities")) || {};

            dayColumns.forEach((column) => {
                const day = column.querySelector(".day-header").textContent;
                const activityContainer = column.querySelector(".activities");
                const addBtn = column.querySelector(".btn-add");

                // ถ้ามีข้อมูลเก่า → แสดงออกมา
                if (saved[day]) {
                    saved[day].forEach((text) => {
                        createActivity(activityContainer, text);
                    });
                }

                // ปุ่มเพิ่มกิจกรรม
                addBtn.addEventListener("click", () => {
                    const text = prompt(`เพิ่มกิจกรรมสำหรับวัน${day}:`);
                    if (text && text.trim() !== "") {
                        createActivity(activityContainer, text);
                        saveData();
                    }
                });
            });

            // ปุ่มบันทึก
            saveBtn.addEventListener("click", () => {
                saveData();
                showToast("✅ บันทึกเรียบร้อย!", "linear-gradient(135deg, #00e676, #00b248)");

                saveBtn.innerHTML = "✅ บันทึกแล้ว!";
                saveBtn.style.background = "linear-gradient(135deg, #00e676, #00b248)";
                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> บันทึกตาราง';
                    saveBtn.style.background = "linear-gradient(135deg, #00c853, #007a33)";
                }, 2000);
            });

            // ปุ่มรีเซ็ตทั้งหมด
            const resetBtn = document.querySelector(".btn-reset");

            resetBtn.addEventListener("click", () => {
                const confirmReset = confirm("⚠️ ต้องการรีเซ็ตข้อมูลทั้งหมดหรือไม่?");
                if (confirmReset) {
                    localStorage.removeItem("weeklyActivities");
                    document.querySelectorAll(".activities").forEach((container) => {
                        container.innerHTML = "";
                    });

                    showToast("รีเซ็ตเรียบร้อย!", "linear-gradient(135deg, #ffb300, #ff6f00)");

                    resetBtn.innerHTML = "✅ รีเซ็ตเรียบร้อย!";
                    resetBtn.style.background = "linear-gradient(135deg, #ffca28, #ff8f00)";
                    setTimeout(() => {
                        resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i> รีเซ็ตทั้งหมด';
                        resetBtn.style.background = "linear-gradient(135deg, #ffb300, #ff6f00)";
                    }, 2000);
                }
            });

            // ฟังก์ชัน Toast เด้งลงจากด้านบน
            function showToast(message, color) {
                const toast = document.getElementById("toast");
                toast.textContent = message;
                toast.style.background = color;
                toast.classList.add("toast-show");

                // ซ่อนภายใน 2.5 วินาที
                setTimeout(() => {
                    toast.classList.remove("toast-show");
                }, 2500);
            }


            // ฟังก์ชันสร้างกิจกรรมใหม่
            function createActivity(container, text) {
                const item = document.createElement("div");
                item.className = "activity-item";
                item.innerHTML = `
      <span>${text}</span>
      <button class="btn btn-sm btn-outline-danger rounded-circle"><i class="fas fa-trash"></i></button>
    `;

                // ลบกิจกรรม
                item.querySelector("button").addEventListener("click", () => {
                    item.remove();
                    saveData();
                });

                container.appendChild(item);
            }

            // ฟังก์ชันบันทึกลง localStorage
            function saveData() {
                const data = {};
                dayColumns.forEach((column) => {
                    const day = column.querySelector(".day-header").textContent;
                    const items = [...column.querySelectorAll(".activity-item span")].map(
                        (el) => el.textContent
                    );
                    data[day] = items;
                });
                localStorage.setItem("weeklyActivities", JSON.stringify(data));
            }
        });

        // ----------------ปุ่มสามขีด hamburger---------------- //
        function toggleSidebar() {
            document.getElementById("sidebar").classList.toggle("active");
            document.getElementById("overlay").classList.toggle("active");
            document.querySelector(".hamburger").classList.toggle("active");
        }

        // Spinner loader
        window.addEventListener("load", () => {
            const spinnerOverlay = document.getElementById("spinnerOverlay");
            setTimeout(() => {
                spinnerOverlay.style.display = "none";
            }, 400); // หมุน 1.5 วินาทีแล้วหาย
        });