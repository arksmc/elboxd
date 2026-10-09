# VOUCH

**The word on Elbi's food.**

VOUCH is a community-driven eatery review platform built to help students discover places to eat around the University of the Philippines Los Baños (UPLB).

Instead of simply asking *"Where should I eat?"*, VOUCH explores a different question: **"Why should I eat here?"**

By bringing together student ratings, personal reviews, and recommendations, VOUCH helps people discover new eateries and learn from other people's dining experiences.

**Live site:** https://vouch-elbi.vercel.app

## Features

* **Eatery discovery** — Browse eateries around Elbi, with individual listings for different branches.
* **Ratings and reviews** — Share dining experiences through half-star ratings and text reviews.
* **Search and filtering** — Find eateries by name, area, category, and food tags.
* **Community activity** — Explore recent reviews and see what other users have been trying.
* **User profiles** — Choose a nickname, display your favorite eateries through a personal Top 4, and build a record of your reviews.
* **Review interactions** — Like reviews and discover opinions from other students.
* **Eatery suggestions** — Suggest places that have not yet been added to the platform.
* **Reporting and moderation** — Report inappropriate reviews to help maintain the quality of community content.

Browsing and reading reviews are available without an account. Google sign-in is required for account-based features.

## Tech Stack

* **Frontend:** React
* **Backend and database:** Supabase
* **Database:** PostgreSQL
* **Authentication:** Supabase Auth with Google OAuth
* **Hosting:** Vercel

## Getting Started

### Prerequisites

* Node.js and npm
* A Supabase project
* Google OAuth credentials configured through Supabase Auth

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd <your-project-folder>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure the environment variables expected by the application.

   For example, if your application uses Vite and Supabase:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
   ```

   Use the exact variable names expected by your source code. Never commit private keys, service-role keys, OAuth client secrets, or other credentials.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL provided by Vite in your terminal.

### Database Setup

VOUCH uses Supabase for authentication, database storage, and access control.

To run your own instance, configure the required database tables, relationships, constraints, views, triggers, and Row Level Security (RLS) policies. Configure Google OAuth and the appropriate administrator permissions as well.

The database setup must match the application's expected schema and security policies.

## Project Goals

VOUCH was built around three ideas:

* **Discovery:** Help students find eateries they might not have considered before.
* **Community:** Give students a place to share honest experiences and recommendations.
* **Practicality:** Make ratings and reviews useful when deciding where to eat.

The goal is not to replace personal recommendations, but to make those experiences easier to discover in one place.

## Project Status

VOUCH is a live, student-built project that continues to evolve based on user feedback and observed usage.

Features, eatery listings, and information may change as the project develops.

## Privacy and Moderation

VOUCH uses account authentication to associate reviews and account-based activity with individual users. Public profiles and reviews use user-selected nicknames rather than exposing Google account identities.

Users can report reviews, and administrative moderation tools help manage inappropriate content.

## Disclaimer

VOUCH is an independent student project and is not affiliated with, endorsed by, or officially connected to the University of the Philippines Los Baños or any listed eatery.

Eatery listings, ratings, and reviews are provided for informational purposes. Reviews represent the opinions and experiences of individual users.

## License

No license has been specified yet. All rights reserved by default unless a license is added to the repository.
