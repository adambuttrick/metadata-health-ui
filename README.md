# Metadata Health Reports UI

Demo/example UI for Metadata Health Reports.


## Setup

1. Start the [Metadata Health Report API](https://github.com/adambuttrick/metadata-health-api) by following its setup instructions in the API repository.

2. Create a `.env.local` file in the root directory (mandatory):

```
# Required - URL of your Metadata Health API instance
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

3. Install the packages:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to the URL shown in the terminal (typically http://localhost:3000) to see the dashboard.