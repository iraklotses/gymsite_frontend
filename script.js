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
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                console.log("Απάντηση από server:", result);

                if (result.success) {
                    // ✅ Αποθηκεύουμε το user_id και το role
                    localStorage.setItem("user_id", result.user.id);
                    localStorage.setItem("user_role", result.user.role);

                    alert("✅ Επιτυχής σύνδεση!");

                    if (result.user.role === "admin") {
                        window.location.href = "dashboard.html";
                    } else {
                        alert("⚠️ Δεν έχετε πρόσβαση στο διαχειριστικό!");
                    }
                } else {
                    alert("❌ Λάθος στοιχεία!");
                }
            } catch (error) {
                console.error("Σφάλμα στο fetch:", error);
                alert("⚠️ Πρόβλημα σύνδεσης στον server!");
            }
        });
    }

    // 📌 DASHBOARD ACCESS CONTROL
    if (window.location.pathname.includes("dashboard.html")) {
        checkAdminAccess();
    }
});

// 📌 FUNCTION για έλεγχο διαχειριστή
function checkAdminAccess() {
    const role = localStorage.getItem("user_role");

    if (role !== "admin") {
        alert("❌ Δεν έχετε πρόσβαση στο dashboard!");
        window.location.href = "index.html";
    }
}

    // 🔄 Φόρτωση Υπηρεσιών και Ανακοινώσεων
    loadServices();
    loadAnnouncements();
});

// 📌 PROFILE FUNCTION (Dashboard)
async function loadUserProfile() {
    console.log("🔄 Φόρτωση προφίλ...");

    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("⚠️ Δεν είστε συνδεδεμένος!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/profile?id=${userId}`);

        const userData = await response.json();

        if (response.ok) {
            console.log("✅ Ελήφθη το προφίλ:", userData);
            document.getElementById("emailDisplay").innerText = userData.email;
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
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "login.html";
}

// 📌 Φόρτωση Υπηρεσιών με debugging
async function loadServices() {
    try {
        console.log("🔄 Ζητάμε υπηρεσίες από:", `${API_URL}/services`);
        const response = await fetch(`${API_URL}/services`);
        console.log("📩 Απάντηση από server:", response);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const services = await response.json();
        console.log("✅ Ληφθείσες υπηρεσίες:", services);

        const servicesList = document.getElementById("servicesList");
        servicesList.innerHTML = "";

        if (services.length === 0) {
            servicesList.innerHTML = "<li>Δεν υπάρχουν διαθέσιμες υπηρεσίες.</li>";
            return;
        }

        services.forEach(service => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${service.name}</strong> <br>
                            ID: ${service.id} <br>
                            Περιγραφή: ${service.description} <br>
                            Τιμή: €${service.price}`;
            servicesList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Σφάλμα κατά τη φόρτωση των υπηρεσιών:", error);
        document.getElementById("servicesList").innerHTML = "<li>⚠️ Αποτυχία φόρτωσης!</li>";
    }
}

// 📌 Φόρτωση Ανακοινώσεων
async function loadAnnouncements() {
    try {
        const response = await fetch(`${API_URL}/announcements`);
        const announcements = await response.json();

        const announcementsList = document.getElementById("announcementsList");
        announcementsList.innerHTML = "";

        if (announcements.length === 0) {
            announcementsList.innerHTML = "<li>Δεν υπάρχουν ανακοινώσεις.</li>";
            return;
        }

        announcements.forEach(announcement => {
            const li = document.createElement("li");
            li.textContent = `${announcement.title} - ${announcement.date}`;
            announcementsList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Σφάλμα κατά τη φόρτωση των ανακοινώσεων:", error);
        document.getElementById("announcementsList").innerHTML = "<li>⚠️ Αποτυχία φόρτωσης!</li>";
    }
}
