# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e2579399-88e3-4127-bffb-dee8523e634d

## Google Maps API Integration

This project includes Google Maps integration for displaying device locations. To use this feature:

1. Get a Google Maps API key from the [Google Cloud Console](https://developers.google.com/maps/documentation/javascript/get-api-key)
2. Enable the following APIs in your Google Cloud project:
    - Maps JavaScript API
    - Geocoding API (if you need address lookup)
    - Places API (if you need place suggestions or search)
3. Add your API key to the `.env` file:
    ```
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    ```
4. Restart your development server if it's running

**Note**: Keep your API key private and set appropriate API key restrictions in the Google Cloud Console.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e2579399-88e3-4127-bffb-dee8523e634d) and start prompting.

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

-   Navigate to the desired file(s).
-   Click the "Edit" button (pencil icon) at the top right of the file view.
-   Make your changes and commit the changes.

**Use GitHub Codespaces**

-   Navigate to the main page of your repository.
-   Click on the "Code" button (green button) near the top right.
-   Select the "Codespaces" tab.
-   Click on "New codespace" to launch a new Codespace environment.
-   Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

-   Vite
-   TypeScript
-   React
-   shadcn-ui
-   Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e2579399-88e3-4127-bffb-dee8523e634d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
