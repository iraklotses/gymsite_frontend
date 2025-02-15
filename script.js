const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("Το script.js φορτώθηκε!");

// 📌 LOGIN FUNCTION
document.addEventListener("DOMContentLoaded", () => {
    const userLoginForm = document.getElementById("userLoginForm");
    const adminLoginForm = document.getElementById("adminLoginForm");

    if (userLoginForm) {
        userLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("userEmail").value;
            const password = document.getElementById("userPassword").value;

            await handleLogin(email, password, "user");
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("adminEmail").value;
            const password = document.getElementById("adminPassword").value;

            await handleLogin(email, password, "admin");
        });
    }
});

// 📌 Handle Login Function
async function handleLogin(email, password, expectedRole) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log("Απάντηση από server:", result);

        if (result.success) {
            if (result.user.role === expectedRole) {
                localStorage.setItem("user_id", result.user.id);
                localStorage.setItem("user_role", result.user.role);

                alert("✅ Επιτυχής σύνδεση!");
                
                if (expectedRole === "user") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "admin.html";
                }
            } else {
                alert("❌ Δεν έχετε πρόσβαση σε αυτό το τμήμα!");
            }
        } else {
            alert("❌ Λάθος στοιχεία!");
        }
    } catch (error) {
        console.error("Σφάλμα στο fetch:", error);
        alert("⚠️ Πρόβλημα σύνδεσης στον server!");
    }
}

    // 🔄 Φόρτωση Υπηρεσιών και Ανακοινώσεων
    loadServices();
    loadAnnouncements();

document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Αποτρέπει το default submit

    const formData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("https://gymsite-six.vercel.app/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Επιτυχής εγγραφή! Περιμένετε έγκριση από τον διαχειριστή.");
            document.getElementById("registerForm").reset(); // Καθαρίζει τη φόρμα
        } else {
            alert("Σφάλμα: " + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Πρόβλημα σύνδεσης με τον server.");
    }
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
        console.log("🔄 Ζητάμε ανακοινώσεις από:", `${API_URL}/announcements`);
        const response = await fetch(`${API_URL}/announcements`);
        console.log("📩 Απάντηση από server:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const announcements = await response.json();
        console.log("✅ Ανακοινώσεις που λήφθηκαν:", announcements);

        const announcementsList = document.getElementById("announcementsList");
        announcementsList.innerHTML = "";

        if (announcements.length === 0) {
            console.log("⚠️ Δεν υπάρχουν ανακοινώσεις!");
            announcementsList.innerHTML = "<li>Δεν υπάρχουν ανακοινώσεις.</li>";
            return;
        }

      announcements.forEach(announcement => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${announcement.title}</strong> <br>
                    ID: ${announcement.id} <br>
                    Ημερομηνία: ${announcement.created_at} <br>
                    Περιγραφή: ${announcement.content}`;
    announcementsList.appendChild(li);
});


    } catch (error) {
        console.error("❌ Σφάλμα κατά τη φόρτωση των ανακοινώσεων:", error);
        document.getElementById("announcementsList").innerHTML = "<li>⚠️ Αποτυχία φόρτωσης!</li>";
    }
}

