const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("📌 Το dashboard.js φορτώθηκε!");

// ✅ Έλεγχος αν υπάρχει αποθηκευμένο user_id
const userId = localStorage.getItem("user_id");
console.log("🔍 Βρέθηκε user_id:", userId);

if (!userId) {
    console.error("❌ Δεν βρέθηκε user_id! Μεταφορά στην αρχική σελίδα...");
    window.location.href = "index.html"; // Σε γυρνάει πίσω στο login
} else {
    loadUserProfile();
}

// 🔥 Ζητάμε τα δεδομένα του χρήστη από το backend
async function loadUserProfile() {
    const userId = localStorage.getItem("user_id"); // Βεβαιώσου ότι υπάρχει
    console.log("🔍 User ID που βρήκα από το localStorage:", userId);

    if (!userId) {
        console.error("❌ Δεν βρέθηκε user_id! Μεταφορά στο login...");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/profile?id=${userId}`);
        console.log(`📡 Response status: ${response.status}`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("ℹ️ Δεδομένα χρήστη:", data);

        if (data.error) {
            console.error("❌ Σφάλμα στο profile:", data.error);
            alert("❌ Πρόβλημα με τη φόρτωση των δεδομένων. Ξανακάνε login.");
            localStorage.removeItem("user_id");
            window.location.href = "index.html";
        } else {
            const emailDisplay = document.getElementById("emailDisplay");
            if (emailDisplay) {
                emailDisplay.innerText = `Email: ${data.email}`;
            } else {
                console.error("❌ Το στοιχείο emailDisplay δεν βρέθηκε στη σελίδα!");
            }
            localStorage.setItem("userEmail", data.email); // Αποθήκευση email στο localStorage
        }
    } catch (err) {
        console.error("❌ Σφάλμα στο fetch:", err);
        alert("⚠️ Πρόβλημα επικοινωνίας με τον server!");
        window.location.href = "index.html";
    }
}

// 📌 LOGOUT FUNCTION
function logout() {
    localStorage.clear();
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async function () {
    const emailDisplay = document.getElementById("emailDisplay");
    const programSelect = document.getElementById("programSelect");
    const daySelect = document.getElementById("daySelect");
    const timeSelect = document.getElementById("timeSelect");
    const myBookings = document.getElementById("myBookings");

    // Ανάκτηση email χρήστη από το localStorage
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        window.location.href = "index.html";
        return; // Σταματάει την εκτέλεση του script
    }

    if (emailDisplay) {
        emailDisplay.innerText = `Email: ${userEmail}`;
    }
}
   

