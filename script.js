const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("Το script.js φορτώθηκε!");

// 📌 LOGIN FUNCTION
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                    mode: "cors"
                });

                const result = await response.json();
                console.log("Απάντηση από server:", result);

                if (response.ok) {
                    localStorage.setItem("token", result.token);
                    alert("✅ Επιτυχής σύνδεση!");
                    window.location.href = "dashboard.html";
                } else {
                    alert("❌ Λάθος στοιχεία!");
                }
            } catch (error) {
                console.error("Σφάλμα στο fetch:", error);
                alert("⚠️ Πρόβλημα σύνδεσης στον server!");
            }
        });
    }

    // 📌 DASHBOARD FUNCTION (ΠΡΟΦΙΛ ΧΡΗΣΤΗ)
    if (window.location.pathname.includes("dashboard.html")) {
        loadUserProfile();
    }
});

// 📌 PROFILE FUNCTION (Dashboard)
async function loadUserProfile() {
    console.log("🔄 Φόρτωση προφίλ...");

    const token = localStorage.getItem("token");
    if (!token) {
        alert("⚠️ Δεν είστε συνδεδεμένος!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            mode: "cors"
        });

        const userData = await response.json();

        if (response.ok) {
            console.log("✅ Ελήφθη το προφίλ:", userData);
            document.getElementById("userEmail").innerText = userData.email;
        } else {
            console.error("❌ Σφάλμα στο profile:", userData);
            alert("⚠️ Σφάλμα στη φόρτωση προφίλ!");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Σφάλμα κατά τη φόρτωση του προφίλ:", error);
        alert("⚠️ Πρόβλημα επικοινωνίας με τον server!");
        window.location.href = "login.html";
    }
}

// 📌 LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("token");
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "login.html";
}
