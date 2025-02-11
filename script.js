const API_URL = "https://gymsite-backend.vercel.app"; // Backend URL

document.getElementById("loginForm").addEventListener("submit", async function(e) {
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

        if (response.ok) {
            document.getElementById("message").innerText = "✅ Επιτυχής σύνδεση!";
            localStorage.setItem("token", result.token); // Αν έχεις JWT token, αποθήκευσε το
            window.location.href = "dashboard.html"; // ή "admin.html" αν είναι admin
        } else {
            document.getElementById("message").innerText = "❌ Λάθος στοιχεία!";
        }
    } catch (err) {
        console.error("Σφάλμα:", err);
        document.getElementById("message").innerText = "❌ Σφάλμα στον server!";
    }
});
