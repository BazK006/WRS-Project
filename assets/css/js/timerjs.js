 let timer;
        let totalSeconds = 0;
        let isRunning = false;

        const display = document.getElementById("display");
        const startBtn = document.getElementById("startBtn");
        const pauseBtn = document.getElementById("pauseBtn");
        const resetBtn = document.getElementById("resetBtn");
        const alarmSound = document.getElementById("alarmSound");
        const alarmModal = document.getElementById("alarmModal");
        const stopAlarmBtn = document.getElementById("stopAlarmBtn");

        startBtn.addEventListener("click", () => {
            // trick ให้มือถืออนุญาตเล่นเสียง
            alarmSound.play().then(() => {
                alarmSound.pause();
                alarmSound.currentTime = 0;
            }).catch(() => {
                console.log("⚠️ Still waiting for user interaction...");
            });

            if (!isRunning) {
                // Start Timer
                const hours = parseInt(document.getElementById("hours").value) || 0;
                const minutes = parseInt(document.getElementById("minutes").value) || 0;
                const seconds = parseInt(document.getElementById("seconds").value) || 0;

                if (totalSeconds === 0)
                    totalSeconds = hours * 3600 + minutes * 60 + seconds;

                if (totalSeconds > 0) {
                    isRunning = true;
                    startBtn.textContent = "Stop";             // เปลี่ยนข้อความ
                    startBtn.classList.remove("start");
                    startBtn.classList.add("stop");           // เปลี่ยนสี

                    timer = setInterval(updateTimer, 1000);
                }

            } else {
                // Stop timer
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = "Start";              // เปลี่ยนข้อความกลับ
                startBtn.classList.remove("stop");
                startBtn.classList.add("start");           // เปลี่ยนสีกลับ
            }
        });

        // ปุ่มรีเซ็ต
        resetBtn.addEventListener("click", () => {
            clearInterval(timer);
            isRunning = false;
            totalSeconds = 0;
            display.textContent = "00:00:00";
            document.getElementById("hours").value = "";
            document.getElementById("minutes").value = "";
            document.getElementById("seconds").value = "";
            alarmSound.pause();
            alarmSound.currentTime = 0;
            alarmSound.loop = false;
            alarmModal.classList.add("d-none");

            startBtn.textContent = "Start";
            startBtn.classList.remove("stop");
            startBtn.classList.add("start");
        });

        // ฟังก์ชันอัปเดตเวลา
        function updateTimer() {
            if (totalSeconds > 0) {
                totalSeconds--;
                const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                const secs = String(totalSeconds % 60).padStart(2, '0');
                display.textContent = `${hrs}:${mins}:${secs}`;
            } else {
                clearInterval(timer);
                isRunning = false;
                display.textContent = "00:00:00";

                alarmSound.volume = 0.5;

                // ดังต่อเนื่องจนกว่าจะกด "หยุดเสียง"
                alarmSound.currentTime = 0;
                alarmSound.loop = true;
                alarmSound.play();
                alarmModal.classList.remove("d-none");

                // ให้สั่นซ้ำ ๆ ถ้ามี
                if ("vibrate" in navigator) {
                    navigator.vibrate([500, 200, 500, 200, 500, 200, 500]);
                }
            }
        }

        // ปุ่มหยุดเสียง + ปิด popup
        stopAlarmBtn.addEventListener("click", () => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            alarmSound.loop = false;
            alarmModal.classList.add("d-none");
        });

        // ปุ่มสามขีด hamburger //
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

        function setPreset(min) {
            document.getElementById("hours").value = "";
            document.getElementById("minutes").value = min;
            document.getElementById("seconds").value = "";
        }