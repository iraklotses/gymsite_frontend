const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("📌 Το dashboard.js φορτώθηκε!");

// ✅ Ελέγχει αν υπάρχει αποθηκευμένο user_id

const userId = localStorage.getItem("user_id");
console.log("🔍 Βρέθηκε user_id:", userId);

if (!userId) {
    console.error("❌ Δεν βρέθηκε user_id! Μεταφορά στην αρχική σελίδα...");
    window.location.href = "index.html"; // Σε γυρνάει πίσω στο login
}


// 🔥 Ζητάμε τα δεδομένα του χρήστη από το backend
fetch(`https://gymsite-six.vercel.app/profile?id=${userId}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("❌ Σφάλμα στο profile:", data.error);
            alert("❌ Πρόβλημα με τη φόρτωση των δεδομένων. Ξανακάνε login.");
            localStorage.removeItem("user_id"); // Καθαρίζει το λάθος user_id
            window.location.href = "index.html";
        } else {
            console.log("ℹ️ Δεδομένα χρήστη:", data);
            document.getElementById("email").innerText = data.email || "Άγνωστο email";
        }
    })
    .catch(err => console.error("❌ Σφάλμα στο fetch:", err));

