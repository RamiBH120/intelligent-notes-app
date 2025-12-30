## Auto Draftly
Auto Draftly is a cutting-edge application designed to help users create, organize, and manage their notes efficiently using advanced AI technology. The app leverages natural language processing to enhance note-taking, making it easier for users to capture ideas, set reminders, and retrieve information quickly.

### Features
- **AI-Powered Note Taking**: Automatically summarizes and categorizes notes for better organization.
- **Generative Note Assistance**: Get suggestions and enhancements for your notes using AI.
- **Customizable Templates**: Use AI-generated templates to structure your notes effectively.
- **Smart Search**: Quickly find notes using keywords or phrases with AI-enhanced search capabilities.
- **Cross-Platform Syncing**: Access your notes from any device with real-time synchronization.

### Getting Started
To get started with the Auto Draftly, follow these steps:
1. Clone the repository: `git clone https://github.com/RamiBH120/intelligent-notes-app.git`
2. Navigate to the project directory: `cd intelligent-notes-app`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm run dev` or `yarn dev`
5. Open your browser and go to `http://localhost:3000` to access the app.

### Technologies Used
- Next.js for the frontend interface.
- Prisma ORM for database interactions.
- Supabase + PostgreSQL for database management.
- Gemini API for AI functionalities.

## Environment Variables
Create a `.env` file in the root of the project and add the following environment variables:
```
DATABASE_URL=your_database_url
NEXT_PUBLIC_URL=http://localhost:3000/
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Contributing
We welcome contributions from the community! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

