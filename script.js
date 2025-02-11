const API_URL = "https://gymsite-six.vercel.app"; // ✅ Backend URL

// 🟢 Login function
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById("message").innerText = "✅ Επιτυχής σύνδεση!";
        localStorage.setItem("token", result.token);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerText = "❌ Λάθος στοιχεία!";
    }
});

// 🟢 Load profile function
// Φόρτωση προφίλ στη σελίδα Dashboard
async function loadProfile() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Δεν υπάρχει αποθηκευμένο token!");
        window.location.href = "login.html"; // Επιστροφή στο login αν δεν υπάρχει token
        return;
    }

    console.log("📡 Fetching profile from:", `${API_URL}/profile`);
    
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": token }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        console.log("✅ Προφίλ χρήστη:", userData);
        
        document.getElementById("user-email").innerText = userData.email;
    } catch (error) {
        console.error("❌ Σφάλμα κατά τη φόρτωση προφίλ:", error);
        document.getElementById("user-email").innerText = "Σφάλμα φόρτωσης!";
    }
}

// Όταν φορτώνει το dashboard, καλούμε τη συνάρτηση
document.addEventListener("DOMContentLoaded", loadProfile);


// 🟢 Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔥 Καλούμε το loadProfile() όταν φορτώσει η σελίδα του dashboard
if (window.location.pathname.includes("dashboard.html")) {
    window.onload = loadProfile;
}
