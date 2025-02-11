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
async function loadProfile() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        window.location.href = "login.html"; // Αν δεν υπάρχει token, επιστροφή στο login
        return;
    }
    
console.log("📡 Fetching profile from:", `${API_URL}/profile`);

    try {
        const response = await fetch(`${API_URL}/profile`, {
        method: "GET",  // ✅ Διόρθωση από POST σε GET
        headers: { "Authorization": localStorage.getItem("token") }
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("emailDisplay").innerText = `Email: ${result.email}`;
        } else {
            document.getElementById("emailDisplay").innerText = "❌ Σφάλμα φόρτωσης!";
        }
    } catch (error) {
        console.error("Σφάλμα:", error);
        document.getElementById("emailDisplay").innerText = "❌ Σφάλμα σύνδεσης!";
    }
}


// 🟢 Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔥 Καλούμε το loadProfile() όταν φορτώσει η σελίδα του dashboard
if (window.location.pathname.includes("dashboard.html")) {
    window.onload = loadProfile;
}
