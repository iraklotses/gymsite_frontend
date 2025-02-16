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

    // ✅ Φόρτωση προγραμμάτων
    async function loadPrograms() {
        try {
            const response = await fetch(`${API_URL}/programs`);
            const programs = await response.json();
            programSelect.innerHTML = programs
                .map(p => `<option value="${p.id}">${p.name}</option>`)
                .join("");
            loadDays(); // Φόρτωση ημερών μετά την επιλογή προγράμματος
        } catch (error) {
            console.error("Σφάλμα φόρτωσης προγραμμάτων:", error);
        }
    }

    // ✅ Φόρτωση ημερών
    async function loadDays() {
        const programId = programSelect.value;
        try {
            const response = await fetch(`${API_URL}/program_days?programId=${programId}`);
            const days = await response.json();
            daySelect.innerHTML = days.map(d => `<option value="${d.day_of_week}">${d.day_of_week}</option>`).join("");
            loadTimes();
        } catch (error) {
            console.error("Σφάλμα φόρτωσης ημερών:", error);
        }
    }

    // ✅ Φόρτωση ωρών
    async function loadTimes() {
        const programId = programSelect.value;
        const day = daySelect.value;
        try {
            const response = await fetch(`${API_URL}/program_times?programId=${programId}&day=${day}`);
            const times = await response.json();
            timeSelect.innerHTML = times.map(t => `<option value="${t.time}">${t.time}</option>`).join("");
        } catch (error) {
            console.error("Σφάλμα φόρτωσης ωρών:", error);
        }
    }

    // ✅ Έλεγχος διαθεσιμότητας
    async function checkAvailability() {
        const programId = programSelect.value;
        const day = daySelect.value;
        const time = timeSelect.value;

        try {
            const response = await fetch(`${API_URL}/check_availability?programId=${programId}&day=${day}&time=${time}`);
            const data = await response.json();

            const availabilityResult = document.getElementById("availabilityResult");
            if (!availabilityResult) return;

            if (data.available) {
                availabilityResult.innerHTML = `Διαθέσιμες θέσεις: ${data.capacity}
                    <button onclick="bookProgram()">Κράτηση</button>`;
            } else {
                availabilityResult.innerText = "Δεν υπάρχουν διαθέσιμες θέσεις!";
            }
        } catch (error) {
            console.error("Σφάλμα ελέγχου διαθεσιμότητας:", error);
        }
    }

    // ✅ Κράτηση προγράμματος
    async function bookProgram() {
        const programId = programSelect.value;
        const day = daySelect.value;
        const time = timeSelect.value;

        try {
            const response = await fetch(`${API_URL}/book_program`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, programId, day, time })
            });

            const result = await response.json();
            if (result.success) {
                alert("Η κράτηση ολοκληρώθηκε!");
                loadMyBookings();
            } else {
                alert("Αποτυχία κράτησης.");
            }
        } catch (error) {
            console.error("Σφάλμα κράτησης:", error);
        }
    }

    // ✅ Φόρτωση κρατήσεων χρήστη
    async function loadMyBookings() {
        try {
            const response = await fetch(`${API_URL}/my_bookings?email=${userEmail}`);
            const bookings = await response.json();
            myBookings.innerHTML = bookings
                .map(b => `<p>${b.program_name} - ${b.date} - ${b.time}</p>`)
                .join("");
        } catch (error) {
            console.error("Σφάλμα φόρτωσης κρατήσεων:", error);
        }
    }

    // Φόρτωση προγραμμάτων και κρατήσεων κατά την εκκίνηση
    await loadPrograms();
    await loadMyBookings();

    // Events για αλλαγή επιλογών
    programSelect.addEventListener("change", loadDays);
    daySelect.addEventListener("change", loadTimes);
});

