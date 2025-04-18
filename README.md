# golden-dusk-hotel

A modern hotel booking website with real-time features, payment integration, and admin dashboard.

## Features

- User authentication
- Room booking system
- Payment integration with Stripe
- Email notifications
- Admin dashboard with reports
- Responsive design
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account
- Stripe account
- Gmail account (for email notifications)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/golden-dusk-hotel.git
cd golden-dusk-hotel
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
EMAIL_USER=your-kipngenoemmanuel479@gmail.com
EMAIL_PASS=your-app-specific-Toto123@
STRIPE_SECRET_KEY=you-stripe-secret-key
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
sunset-hotel/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── src/
│   ├── routes/
│   ├── controllers/
│   └── models/
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Development

- Use `npm run dev` for development with auto-reload
- Use `npm start` for production
- The server runs on port 3000 by default

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
