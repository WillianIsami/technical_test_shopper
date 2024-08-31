# Shopper Technical Test

# Measure API
This project is an API for handling measurements, including image uploads, confirmation, and listing. It uses Express.js with TypeScript and integrates with Google's Generative AI.

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Google Generative AI
- TypeORM
- PostgreSQL
- Multer for file uploads
- Various utility libraries (uuid, date-fns, etc.)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (create a `.env` file in the root directory): `GEMINI_API_KEY=your_google_api_key`
4. Run the server with npm: `npm run dev` or `npm start`
5. Run with docker: `docker compose up -d`

## API Endpoints

### Upload Measure

- **URL:** `/upload`
- **Method:** `POST`
- **Request Body:** 
```json
{
 "image": "base64",
 "customer_code": "string",
 "measure_datetime": "datetime",
 "measure_type": "WATER" || "GAS"
}
```
- **Description:** Read a Base64-encoded image and upload it to the Gemini API to extract water or gas values from the meter.

### Confirm Measure

- **URL:** `/confirm`
- **Method:** `PATCH`
- **Content-Type:** `application/json`
- **Request Body:** `application/json`
```json
{
 "measure_uuid": "string",
 "confirmed_value": "integer"
}
```
- **Description:** Confirms a previously uploaded measurement.

### List Measures

- **URL:** `/:customer_code/list`
- **Method:** `GET`
- **Description:** Lists all measurements for a specific customer code.

## Development

This project uses ESLint and Prettier for code formatting and linting. To run the linter: `npm run lint`

To format the code: `npm run format`
