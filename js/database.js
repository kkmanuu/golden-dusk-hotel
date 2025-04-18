import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Save user data to the database
export async function saveUserData(uid, name, email) {
    const db = getDatabase();
    try {
        await set(ref(db, `users/${uid}`), {
            name,
            email,
            createdAt: new Date().toISOString()
        });
        console.log("User data saved successfully");
    } catch (error) {
        console.error("Error saving user data:", error);
        throw error;
    }
}

// Fetch user data from the database
export async function getUserData(uid) {
    const db = getDatabase();
    try {
        const snapshot = await get(ref(db, `users/${uid}`));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            throw new Error("User data not found");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

// Save booking data to the database
export async function saveBookingData(uid, bookingData) {
    const db = getDatabase();
    const bookingId = new Date().getTime().toString(); // Simple unique ID based on timestamp
    try {
        await set(ref(db, `bookings/${uid}/${bookingId}`), {
            ...bookingData,
            createdAt: new Date().toISOString()
        });
        console.log("Booking data saved successfully");
    } catch (error) {
        console.error("Error saving booking data:", error);
        throw error;
    }
}
