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

// 📌 LOGOUT FUNCTION
function logout() {
    localStorage.clear();
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "index.html";
}

    // Ανάκτηση email χρήστη από το localStorage
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        window.location.href = "index.html";
        return; // Σταματάει την εκτέλεση του script
    }

    if (emailDisplay) {
        emailDisplay.innerText = `Email: ${userEmail}`;
    }
    
)}

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

