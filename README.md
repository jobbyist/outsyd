# Event Management Platform

A modern, full-stack event management platform built with React, TypeScript, and Lovable Cloud. Create, discover, and manage events with an intuitive interface and powerful features.

## 🌟 Features

### Event Management
- **Create Events**: Easy-to-use form with image upload, date/time selection, and location integration
- **Edit Events**: Update your events anytime with full editing capabilities
- **Delete Events**: Remove events you've created with confirmation dialog
- **Event Discovery**: Browse all upcoming events in a beautiful card layout
- **Event Details**: Rich event pages with countdown timers, location maps, and registration

### User Authentication
- **Secure Sign Up/Login**: Email and password authentication with automatic email confirmation
- **User Profiles**: Automatic profile creation with display names
- **Protected Routes**: Secure admin and event management pages
- **Session Management**: Persistent authentication across sessions

### Location Integration
- **Google Maps Autocomplete**: Search and select locations with autocomplete suggestions
- **Interactive Maps**: Embedded Google Maps on event detail pages
- **Get Directions**: Direct links to Google Maps for navigation

### Image Management
- **Image Upload**: Drag-and-drop or click to upload event images
- **File Validation**: Automatic validation for file type (JPG, PNG, GIF, WebP) and size (max 5MB)
- **Secure Storage**: Images stored securely in cloud storage

### Admin Features
- **Admin Dashboard**: Manage all events from a centralized dashboard
- **Event Moderation**: View, edit, or delete any event
- **User Management**: Access to user profiles and event data

### SEO Optimized
- **Meta Tags**: Proper title, description, and keywords for each page
- **Semantic HTML**: Structured markup for better search engine visibility
- **Open Graph Tags**: Social media preview optimization
- **Responsive Design**: Mobile-first design that works on all devices
- **Event Schema**: JSON-LD structured data for Google Events rich results

## Event Listings Feature

The `/events` page provides a comprehensive listing of events loaded from a JSON data file.

### Features
- **Data-Driven**: Loads 116+ events from `data/extract-data-2025-12-22.json`
- **Smart Filters**: Filter events by country, province/region, and category
- **Client-Side Filtering**: Fast, responsive filtering without page reloads
- **SEO Optimized**: Each event includes Google Events Schema (JSON-LD) for rich search results
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

### Data File Structure

The event data is stored in `/data/extract-data-2025-12-22.json` with the following structure:

```json
{
  "events": [
    {
      "city": "Cape Town",
      "category": "Concert",
      "name": "Event Name",
      "date": "Sat 24 Jan 2025",
      "time": "18:00",
      "venue": "Venue Name",
      "description": "Event description",
      "city_citation": "https://source-url.com"
    }
  ]
}
```

### Updating Event Data

To update the event listings:

1. **Prepare New Data File**: Create or update the JSON file following the structure above
2. **Place in Data Directory**: Save the file in `/data/` directory
3. **Update Import**: If using a different filename, update the import in `/src/pages/Events.tsx`:
   ```typescript
   import eventData from '@/../data/your-new-file.json';
   ```
4. **Build and Deploy**: Run `npm run build` and deploy the updated application

### How the Code Works

The event listing feature consists of several components:

#### 1. Type Definitions (`src/types/eventListing.ts`)
Defines TypeScript interfaces for event data structure.

#### 2. Utility Functions (`src/lib/eventListingUtils.ts`)
- **enrichEventData()**: Adds country and province information based on city names
- **getUniqueValues()**: Extracts unique values for filter dropdowns
- **parseEventDate()**: Parses date strings into Date objects for sorting

#### 3. Event Schema Component (`src/components/EventSchema.tsx`)
Generates JSON-LD structured data for Google Events Schema, enabling:
- Rich snippets in search results
- Event details in Google Search
- Better SEO and discoverability

#### 4. Events Page (`src/pages/Events.tsx`)
Main page component that:
- Loads and enriches event data
- Provides filter UI (country, province, category)
- Renders event cards with all details
- Injects SEO metadata and structured data

#### 5. Routing (`src/App.tsx`)
The `/events` route is registered in the main App component.

### Maintenance Tips

- **Adding Events**: Simply update the JSON file with new events following the same structure
- **Filtering Logic**: All filters work client-side using React state and useMemo hooks
- **City-to-Province Mapping**: Update `CITY_TO_PROVINCE` in `eventListingUtils.ts` if adding new cities
- **SEO**: Event schemas are automatically generated from the data - no manual updates needed
- **Performance**: The page uses React memoization to ensure filters remain fast even with hundreds of events

## Project info

**URL**: https://lovable.dev/projects/f1ba0c74-af75-4389-a8ae-60baf80911b5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f1ba0c74-af75-4389-a8ae-60baf80911b5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Configuration

### Google Maps Places Autocomplete

This project uses Google Maps Places API for location autocomplete. To enable this feature:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API (New)** in the API Library
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key
6. Add it to your `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY="your-api-key-here"
   ```

**Optional but recommended:** Restrict your API key to only work with the Places API and your domain for security.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f1ba0c74-af75-4389-a8ae-60baf80911b5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
