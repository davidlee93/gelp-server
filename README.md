# Gelp API [![Build Status](https://travis-ci.org/chang-steven/strong-heart-api.svg?branch=master)](https://travis-ci.org/chang-steven/strong-heart-api)

### introduction:

Gelp - It's a take on Yelp using Google Places Library and Google Maps Javascript API v3. Much like it's predecessor, Gelp provides users the ability to explore local businesses and leave reviews. Start searching for local businesses and write some reviews. The review system is a bit unique in that you rate a place on 3 criteria - Quantity, Quality, and Pricing.

### technologies:

/ <a href="https://nodejs.org/">Node.js</a> / <a href="https://expressjs.com/">Express</a> / <a href="http://mongoosejs.com/">Mongoose</a> / <a href="https://docs.mongodb.com/">MongoDB</a> / <a href="http://www.passportjs.org/">Passport</a> / bcryptjs / <a href="https://mochajs.org/">Mocha</a> + <a href="http://chaijs.com/">Chai</a> (testing) / <a href="https://travis-ci.org/">Travis CI</a> / <a href="https://www.heroku.com/">Heroku</a> /

The Gelp API is an Express application using Node.js

<ul>
  <li>Implements RESTful architecture style</li>
  <li>Mongoose for object modeling for the MongoDB database.</li>
  <li>Passwords are encrypted with bcryptjs</li>
  <li>JWT authentication is session-based and does not persist</li>
  <li>API endpoints are tested with Mocha, Chai, Faker</li>
</ul>

### live site:

https://gelp.netlify.com/

### front end client repository:

https://github.com/davidlee93/gelp-client

### Screenshots

Landing Page:
![Landing Page screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/Landing%20Page.png)

Signup Page:
![Signup Page screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/signup-page.png)

Login/Demo Page:
![Login/Demo Page screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/login%3Ademo-page.png)

Search Page:
![Search Page screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/Search%20Page.png)

Findings Page:
![Findings Page screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/findings-page.png)

Place Page:
![Place Page screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/place-page.png)

Rate Page:
![Rate Page: screenshot](https://github.com/davidlee93/gelp-client/blob/master/public/Rate%20Page.png)
