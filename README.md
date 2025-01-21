# Alphathreads - AI Image Generation

A Next.js application for generating and managing AI-generated images with Firebase authentication and storage.

## Features

- Google Authentication
- AI Image Generation
- Image Storage in Firebase
- Personal Image Gallery
- Responsive Design

## Tech Stack

- Next.js 14
- Firebase (Authentication & Storage)
- Tailwind CSS
- TypeScript

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Add the environment variables in Vercel
4. Deploy!

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with the required environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## License

MIT