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

// ✅ Φόρτωση προφίλ χρήστη
async function loadUserProfile() {
    try {
        console.log(`📡 Κάνω fetch από: ${API_URL}/profile?id=${userId}`);
        const response = fetch(`${API_URL}/profile?id=${userId}`);
        const data = response.json();
//fetch(`${API_URL}/users/${id}`, ????????? //
        console.log("ℹ️ Δεδομένα χρήστη:", data);

        if (data.error) {
            console.error("❌ Σφάλμα στο profile:", data.error);
            alert("❌ Πρόβλημα με τη φόρτωση των δεδομένων. Ξανακάνε login.");
            localStorage.removeItem("user_id"); // Καθαρίζει το λάθος user_id
            window.location.href = "index.html";
        } else {
            const emailDisplay = document.getElementById("emailDisplay");
            
            // ✅ Έλεγχος αν υπάρχει το στοιχείο πριν το χρησιμοποιήσουμε
            if (emailDisplay) {
                emailDisplay.innerText = `Email: ${data.email}`;
            } else {
                console.error("❌ Το στοιχείο emailDisplay δεν βρέθηκε στη σελίδα!");
            }

            localStorage.setItem("userEmail", data.email); // Αποθήκευση email
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

// ✅ Ανάκτηση email χρήστη από το localStorage
const userEmail = localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "index.html";
} else {
    const emailDisplay = document.getElementById("emailDisplay");
    if (emailDisplay) {
        emailDisplay.innerText = `Email: ${userEmail}`;
    }
}
