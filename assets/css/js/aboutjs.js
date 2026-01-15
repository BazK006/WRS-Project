// ปุ่มกลับขึ้นบน
        const btn = document.getElementById('backToTop');
        window.onscroll = () => {
            if (document.documentElement.scrollTop > 200) {
                btn.style.display = "block";
            } else {
                btn.style.display = "none";
            }
        };
        btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

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