# URL Shortener API Documentation

## Overview
This is a URL shortener service built with NestJS that provides URL shortening, redirection, and analytics capabilities.

## Project Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables (create a `.env` file):
```
DATABASE_URL=your_mongodb_connection_string
PORT=3000
```
4. Start the development server:
```bash
npm run start:dev
```

## Project Structure

The application follows a modular architecture with two main features:
- URL shortening and management (`/src/url`)
- Analytics tracking (`/src/analytics`)

Key directories:
- `/src/config`: Configuration files including database setup
- `/src/url`: URL shortening module
- `/src/analytics`: Analytics tracking module
- `/test`: End-to-end tests

## API Endpoints

### URL Shortening

#### Create Short URL
```
POST /shorten
```
Creates a shortened version of a provided URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response (201):**
```json
{
  "shortUrl": "http://yourdomain.com/abc123"
}
```

**Error Responses:**
- 400: Invalid URL format

#### Redirect to Original URL
```
GET /:shortId
```
Redirects to the original URL associated with the short ID.

**Parameters:**
- `shortId`: The shortened URL identifier (e.g., "abc123")

**Responses:**
- 302: Redirects to original URL
- 404: Short ID not found

#### Get URL Analytics
```
GET /analytics/:shortId
```
Retrieves analytics data for a specific shortened URL.

**Parameters:**
- `shortId`: The shortened URL identifier

**Response (200):**
```json
{
  "clicks": number,
  "lastAccessed": Date,
  "referrers": string[],
  "browsers": string[],
  "devices": string[]
}
```

**Error Responses:**
- 404: Short ID not found

#### Get URL History
```
GET /url/histories
```
Retrieves a list of all shortened URLs.

**Response (200):**
```json
[
  {
    "shortId": string,
    "originalUrl": string,
    "createdAt": Date,
    "clicks": number
  }
]
```

### Analytics

#### Get Detailed Analytics
```
GET /analytics/:urlId
```
Retrieves detailed analytics for a specific URL.

**Parameters:**
- `urlId`: The shortened URL identifier

**Response (200):**
```json
{
  "urlId": string,
  "totalClicks": number,
  "timeSeriesData": {
    "date": Date,
    "clicks": number
  }[],
  "demographics": {
    "countries": Record<string, number>,
    "devices": Record<string, number>,
    "browsers": Record<string, number>
  }
}
```

**Error Responses:**
- 404: URL not found

## Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

## OpenAPI/Swagger Documentation

The API is documented using Swagger. Access the Swagger UI at:
```
http://localhost:3000/api
```

## Error Handling

All endpoints follow a consistent error response format:
```json
{
  "statusCode": number,
  "message": string,
  "error": string
}
```