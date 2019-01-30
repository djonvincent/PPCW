# Photobook
## Running locally
1. Run `npm start` to start the server running at port 3000
2. Acesss the API at localhost:3000
3. Access the web app at localhost:3000/app/login
4. There will be a default user `doctorwhocomposer` with password `password`

## Cloud deployment
The app has been deployed on Heroku and is accessible at
https://fast-everglades-33452.herokuapp.com/

## API
### Authentication
To obtain the api key for a given user, send a GET request to the `/login`
endpoint with an Authorization header like `Basic username:password` where
`username:password` is base64 encoded.
Authenticated endpoints require an `Authorization` header with value `<apikey>`.
Note `apikey` here is NOT base64 encoded.
Certain endpoints require a system key, for these, include an `access_token`
key in the body with value `concertina`.

### Endpoints
- GET /people/
- GET /people/:username?expand=photos
- GET /people/me?expand=photos (authenticated)
- GET /people/search/:term
- POST /people/ (system)
- PUT /people/:username
- DELETE /people/:username (system)


- GET /photo/
- GET /photo/:id
- POST /photo/ (authenticated)
- PUT /photo/:id (authenticated)
- DELETE /photo/:id (authenticated)


- POST /follow/:username (authenticated)
- DELETE /follow/:username (authenticated)


- GET /login
- GET /feed (authenticated)
