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
        const response = await fetch(`${API_URL}/profile?id=${userId}`);
        const data = await response.json();

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

// ✅ Φόρτωση ημερών προγράμματος
async function loadDays() {
    const programId = programSelect.value;
    try {
        const response = await fetch(`${API_URL}/program_days?programId=${programId}`);
        const days = await response.json();

        console.log("🔍 Απάντηση API:", days);

        if (!Array.isArray(days)) {
            throw new Error("Η απάντηση δεν είναι array!");
        }

        daySelect.innerHTML = days.map(d => `<option value="${d.day_of_week}">${d.day_of_week}</option>`).join("");
        loadTimes();
    } catch (error) {
        console.error("Σφάλμα φόρτωσης ημερών:", error);
    }
}

// ✅ Φόρτωση ωρών προγράμματος
async function loadTimes() {
    const programId = programSelect.value;
    const day = daySelect.value;
    try {
        const response = await fetch(`${API_URL}/program_times?programId=${programId}&day=${day}`);
        const times = await response.json();

        console.log("🔍 Απάντηση API:", times);

        if (!Array.isArray(times)) {
            throw new Error("Η απάντηση δεν είναι array!");
        }

        timeSelect.innerHTML = times.map(t => `<option value="${t.time}">${t.time}</option>`).join("");
    } catch (error) {
        console.error("Σφάλμα φόρτωσης ωρών:", error);
    }
}
