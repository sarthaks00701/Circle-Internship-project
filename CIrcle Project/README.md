# Monitor URLs(Internship Project)

Install and Start monitoring using `npm`.

```
npm install
npm start
```
* Routes defined in `index.js`

 - `/`          :Root page for the service.
 - `/add`       :Send a POST request to the route with the body having a parameter URL,DATA1,DATA2. The response will contain the ID associated with the url.
 - `/responses` :Send a POST request with ID in the body. The response contains last 100 response times of the url.
 - `/edit`      :Send a POST request with ID and URL in the body which Patches the existing URL in the database.
 - `/stop`      :Send a POST request with ID in the body and it removes the existing database records of the url associated with the id.
 - `/check`     :Send a POST request with ID in the body and it checks it's existence in the existing database records of the url associated with the id.

Database name : `monitor_urls` in `models`
