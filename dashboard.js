const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("📌 Το dashboard.js φορτώθηκε!");

// ✅ Ελέγχει αν υπάρχει αποθηκευμένο token
const token = localStorage.getItem("token");
if (!token) {
    console.warn("🚨 Δεν βρέθηκε token! Μεταφορά στην αρχική σελίδα...");
    window.location.href = "index.html";
} else {
    console.log("✅ Βρέθηκε token:", token);
}

// 🔥 Ζητάμε τα δεδομένα του χρήστη από το backend
fetch("https://gymsite-six.vercel.app/profile", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`, // 🔐 Σωστή αυθεντικοποίηση
        "Content-Type": "application/json"
    }
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        console.error("❌ Σφάλμα στο profile:", data.error);
        alert("❌ Πρόβλημα με τη φόρτωση των δεδομένων. Ξανακάνε login.");
        localStorage.removeItem("token"); // Καθαρίζει το λάθος token
        window.location.href = "index.html";
    } else {
        console.log("ℹ️ Δεδομένα χρήστη:", data);
        document.getElementById("email").innerText = data.email || "Άγνωστο email";
    }
})
.catch(err => console.error("❌ Σφάλμα στο fetch:", err));
