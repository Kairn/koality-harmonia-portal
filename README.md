# Koality Harmonia Portal
[![Build Status](https://travis-ci.org/Kairn/koality-harmonia-portal.svg?branch=master)](https://travis-ci.org/Kairn/koality-harmonia-portal)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Portal](https://img.shields.io/badge/Portal-Open-green)](http://esoma-sekh.s3-website.us-east-2.amazonaws.com/)

Koality Harmonia Portal is the front-end project for Koality Harmonia. This user interface is built with the Angular 7 framework which has full support for all of the RESTful APIs exposed by the back-end Java project. Please visit the server-side repository for a brief introduction of the application. Here is [the link](https://github.com/Kairn/koality-harmonia-rest). The design of the website features an anime/vocaloid theme (an unexpected choice :four_leaf_clover:), and Angular Material is heavily leveraged for building UI elements.

**Update: The back-end service for this project has been shut down. Although the portal is still viewable, none of the services are functional at this point.**

*Disclaimer: This application is created for learning purposes only. It is the end user's responsibility to ensure that he/she does not share any illegal content on this open platform, and I reserve the right to remove posts or resources that may be considered controversial or lead to personal financial losses.*

## Build Project
### Prerequisites
* [Node.js](https://nodejs.org/en/)
* [Angular 7 or higher](https://angular.io/)
* [howler.js](https://howlerjs.com/)
* [Google Chrome](https://www.google.com/chrome/) (Recommended)
* [Visual Studio Code](https://code.visualstudio.com/) (Recommended)

### Build
1. Clone or download the repository and change into the project's root directory (where `package.json` is located).
2. Install the Angular CLI if you don't have it already using the command `npm install -g @angular/cli` (Node.js is required in order to use npm).
3. Run `npm install` to download all dependencies.
4. Configure the server's endpoint in `src/app/core/services/auth.service`. It is highly recommended to use a different server deployment.
5. To launch the app in development mode in your browser, run `ng serve -o`. (4200 is the default port)
6. For production deployment, run `ng build --prod` and the built artifact will be generated in the `dist/` folder.

**In this current iteration of the project, `ng test` will fail due to Angular Material elements not being recognized as legal by the testing framework. CUSTOM_ELEMENTS_SCHEMA needs to be imported in every .spec.ts file if you wish to build and run unit tests.*

## Features and Rules
*The in-app [about page](http://esoma-sekh.s3-website.us-east-2.amazonaws.com/about) could answer some of your queries.*

### User Account
* A user must register an account in order to use the application.
* A unique email address is required for registration.
* A registered user (also referred to as a koalibee) may change his/her account details or update login credentials at any time.
* Only the system administrator can delete a user's account.
* Each login session will only last for a maximum of 30 minutes.

### Economy
* This term is a little bit misleading because Koality Harmonia is not a real business application and shall never be used for commercial purposes. But it does feature a virtual currency named ETA coin to manage in-app credit transfers.
* ETA coins are fake currency tokens created to incentivize user participation and add a market flavor to the application.
* Every koalibee starts with 100 ETA coins upon successful registration.
* Some ETA coins are awarded for basic user actions such as posting daily moments, submitting album reviews, or publishing albums.
* Users can only transfer ETA coins amongst themselves through album purchasing.

### Publishing
* A koalibee can create as many albums as he/she wishes in the workshop.
* There is no limit to the number of tracks that an album can contain, but it must have at least one track in order to be considered publishable.
* Only .mp3 and .ogg files are supported (other formats have not been tested).
* A cover image is required before publishing.
* Publisher can set a price (in ETA coins) for his/her published albums. (Or they can be free)
* Individual tracks cannot be published. (Just do a single album instead)
* If a track is set as a demo, it can be played by anyone visiting the store without buying the album.
* Publisher can spend 100 ETA coins to promote an album he/she has published, which will then be highlighted in the store.

### Consuming
* A koalibee can browse published albums by visiting the store.
* Albums listed in the store can be filtered by genre and price range.
* A potential consumer has access to all of the reviews posted on any album.
* A koalibee must have sufficient ETA balance in order to purchase an album, and such transaction cannot be reversed.
* Publisher can get his/her own albums free of charge.
* Once an album is purchased, the buyer owns all the tracks and can play them online at any time.
* A koalibee may leave one (and only one) review for each album he/she has purchased, but the review cannot be edited or deleted once submitted (unless it is done by the system administrator).

## Issues
This project has no automated tests, but it has gone through many rounds of thorough manual testing during development. The application currently runs without any known defects. Please contact me directly should any bug or issue arises.