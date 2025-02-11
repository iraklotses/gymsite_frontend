const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("Το script.js φορτώθηκε!");

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("loginForm")) {
        setupLogin();
    }

    if (document.getElementById("dashboardContent")) {
        loadProfile();
    }

    if (document.getElementById("logoutButton")) {
        setupLogout();
    }
});

// 🔹 Συνάρτηση για το Login
function setupLogin() {
    document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://gymsite-six.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById("message").innerText = "✅ Επιτυχής σύνδεση!";
        localStorage.setItem("user_id", result.user_id); // 🔹 Αποθήκευση του user_id
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerText = "❌ Λάθος στοιχεία!";
    }
});

}

// 🔹 Συνάρτηση για το Προφίλ (Dashboard)
function loadProfile() {
    const token = localStorage.getItem("token");
    console.log("📌 Token που βρέθηκε:", token);

    if (!token) {
        console.warn("⚠️ Δεν υπάρχει token. Επιστροφή στο login.");
        window.location.href = "login.html";
        return;
    }

    fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        console.log("📌 Απάντηση από API:", response);
        return response.json();
    })
    .then(data => {
        console.log("📌 Δεδομένα που επιστράφηκαν:", data);

        if (data.error) {
            console.error("❌ Σφάλμα API:", data.error);
            alert("Σφάλμα φόρτωσης προφίλ!");
            window.location.href = "login.html";
        } else {
            document.getElementById("userEmail").innerText = data.email;
        }
    })
    .catch(error => console.error("❌ Σφάλμα:", error));
}


// 🔹 Συνάρτηση για το Logout
function setupLogout() {
    document.getElementById("logoutButton").addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}
