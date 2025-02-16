const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("📌 Το dashboard.js φορτώθηκε!");

// ✅ Ελέγχει αν υπάρχει αποθηκευμένο user_id
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
        }
    } catch (err) {
        console.error("❌ Σφάλμα στο fetch:", err);
        alert("⚠️ Πρόβλημα επικοινωνίας με τον server!");
        window.location.href = "index.html";
    }
}

// 📌 LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("user_id");
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async function () {
    const emailDisplay = document.getElementById("emailDisplay");
    const programSelect = document.getElementById("programSelect");
    const daySelect = document.getElementById("daySelect");
    const timeSelect = document.getElementById("timeSelect");
    const myBookings = document.getElementById("myBookings");

    // Ανάκτηση email χρήστη από το session
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
        window.location.href = "index.html"; // Redirect αν δεν είναι συνδεδεμένος
    }
    emailDisplay.innerText = userEmail;


    // ✅ Φόρτωση ημερών
    async function loadDays() {
        const programId = programSelect.value;
        try {
            const response = await fetch(`/program_days?programId=${programId}`);
            const days = await response.json();
            daySelect.innerHTML = days.map(d => `<option value="${d.day_of_week}">${d.day_of_week}</option>`).join("");
            loadTimes(); // Φόρτωση ωρών μόλις επιλεγεί ημέρα
        } catch (error) {
            console.error("Σφάλμα φόρτωσης ημερών:", error);
        }
    }

    // ✅ Φόρτωση ωρών
    async function loadTimes() {
        const programId = programSelect.value;
        const day = daySelect.value;
        try {
            const response = await fetch(`/program_times?programId=${programId}&day=${day}`);
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
            const response = await fetch(`/check_availability?programId=${programId}&day=${day}&time=${time}`);
            const data = await response.json();

            if (data.available) {
                document.getElementById("availabilityResult").innerText = `Διαθέσιμες θέσεις: ${data.capacity}`;
                document.getElementById("availabilityResult").innerHTML += `<button onclick="bookProgram()">Κράτηση</button>`;
            } else {
                document.getElementById("availabilityResult").innerText = "Δεν υπάρχουν διαθέσιμες θέσεις!";
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
            const response = await fetch("/book_program", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, programId, day, time })
            });

            const result = await response.json();
            if (result.success) {
                alert("Η κράτηση ολοκληρώθηκε!");
                loadMyBookings(); // Ανανεώνει τις κρατήσεις του χρήστη
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
            const response = await fetch(`/my_bookings?email=${userEmail}`);
            const bookings = await response.json();
            myBookings.innerHTML = bookings.map(b => `<p>${b.program_name} - ${b.date} - ${b.time}</p>`).join("");
        } catch (error) {
            console.error("Σφάλμα φόρτωσης κρατήσεων:", error);
        }
    }

    // ✅ Αποσύνδεση
    function logout() {
        sessionStorage.clear();
        window.location.href = "index.html";
    }

    // Φόρτωση προγραμμάτων κατά την εκκίνηση
    await loadPrograms();
    await loadMyBookings();

    // Events για αλλαγή επιλογών
    programSelect.addEventListener("change", loadDays);
    daySelect.addEventListener("change", loadTimes);
});
