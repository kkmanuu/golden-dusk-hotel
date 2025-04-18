// Initialize Stripe with your publishable key
const stripe = Stripe('your_publishable_key');

// Create payment intent
async function createPaymentIntent(amount, currency = 'kes') {
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency
        }),
    });
    return response.json();
}

// Handle payment
async function handlePayment(amount, cardElement) {
    try {
        const { clientSecret } = await createPaymentIntent(amount);
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            throw error;
        }

        return paymentIntent;
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}

// Initialize card element
function initializeCardElement() {
    const card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    });

    card.mount('#card-element');
    return card;
}

// Format currency to KSH
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Calculate total price based on room type and number of nights
function calculateTotalPrice(roomType, nights) {
    const prices = {
        'Deluxe Room': 25000,
        'Suite': 35000,
        'Family Room': 30000
    };

    return prices[roomType] * nights;
}

// Update price display
function updatePriceDisplay() {
    const roomType = document.getElementById('roomType').value;
    const checkIn = new Date(document.getElementById('checkIn').value);
    const checkOut = new Date(document.getElementById('checkOut').value);

    if (roomType && checkIn && checkOut) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = calculateTotalPrice(roomType, nights);
        document.getElementById('totalPrice').textContent = formatCurrency(totalPrice);
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    const card = initializeCardElement();

    // Add event listeners for price updates
    document.getElementById('roomType').addEventListener('change', updatePriceDisplay);
    document.getElementById('checkIn').addEventListener('change', updatePriceDisplay);
    document.getElementById('checkOut').addEventListener('change', updatePriceDisplay);

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmission);
});

// Initialize date validation
function initializeDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;

    document.getElementById('checkIn').addEventListener('change', function () {
        document.getElementById('checkOut').min = this.value;
    });
}

// Handle booking submission
async function handleBookingSubmission(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('.btn');
    const submitBtnText = document.getElementById('submitBtnText');
    const submitSpinner = document.getElementById('submitSpinner');

    // Show loading state
    submitBtn.disabled = true;
    submitBtnText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';

    try {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            roomType: document.getElementById('roomType').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            guests: document.getElementById('guests').value,
            specialRequests: document.getElementById('specialRequests').value,
            totalPrice: document.getElementById('totalPrice').textContent
        };

        // Process payment
        const paymentResult = await handlePayment(formData.totalPrice, card);

        // Send booking confirmation email
        const emailResponse = await fetch('http://localhost:3000/api/send-booking-confirmation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!emailResponse.ok) {
            throw new Error('Failed to send confirmation email');
        }

        // Save booking to database
        const bookingResponse = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                paymentId: paymentResult.id,
                paymentStatus: paymentResult.status,
                createdAt: new Date()
            })
        });

        if (!bookingResponse.ok) {
            throw new Error('Failed to save booking');
        }

        alert('Booking confirmed! A confirmation email has been sent to your inbox.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to process booking. Please try again later.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtnText.style.display = 'inline-block';
        submitSpinner.style.display = 'none';
    }
}
