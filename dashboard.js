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

async function checkAvailability() {
    const programId = document.getElementById("program").value;
    const date = document.getElementById("date").value;
    const timeSlot = document.getElementById("time").value;

    if (!programId || !date || !timeSlot) {
        alert("Συμπληρώστε όλα τα πεδία!");
        return;
    }

    const response = await fetch("https://gymsite-six.vercel.app/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program_id: programId, date, time_slot: timeSlot }),
    });

    const data = await response.json();

    if (data.available) {
        document.getElementById("availabilityResult").textContent = `Διαθέσιμες θέσεις: ${data.availableSlots}`;
        document.getElementById("bookButton").style.display = "block";
    } else {
        document.getElementById("availabilityResult").textContent = "Δεν υπάρχουν διαθέσιμες θέσεις!";
        document.getElementById("bookButton").style.display = "none";
    }
}

async function bookSlot() {
    const programId = document.getElementById("program").value;
    const date = document.getElementById("date").value;
    const timeSlot = document.getElementById("time").value;

    const response = await fetch("https://gymsite-six.vercel.app/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, program_id: programId, date, time_slot: timeSlot }),
    });

    const data = await response.json();

    if (data.success) {
        alert("Κράτηση Επιτυχής!");
        loadReservations();
    } else {
        alert("Αποτυχία κράτησης: " + data.error);
    }
}

async function loadReservations() {
    const response = await fetch(`https://gymsite-six.vercel.app/reservations/${userId}`);
    const reservations = await response.json();

    const list = document.getElementById("reservationsList");
    list.innerHTML = "";

    reservations.forEach(res => {
        const li = document.createElement("li");
        li.textContent = `${res.program_name} - ${res.date} - ${res.time_slot}`;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadReservations);
