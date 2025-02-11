const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

// Παίρνουμε το token από το localStorage
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html"; // Αν δεν υπάρχει token, γύρνα στο login
}

async function fetchProfile() {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("username").innerText = data.full_name;
            document.getElementById("email").innerText = data.email;
        } else {
            console.error("Σφάλμα:", data.error);
            window.location.href = "index.html"; // Αν υπάρχει σφάλμα, επιστρέφει στο login
        }
    } catch (err) {
        console.error("Σφάλμα στον server:", err);
    }
}

// Φόρτωσε τα δεδομένα του χρήστη
fetchProfile();

// Logout button
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // Διαγραφή token
    window.location.href = "index.html"; // Επιστροφή στο login
});
