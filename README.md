# Web based scouting app
Basically just google forms, but you can assign forms out to different scouts. Very unfinished

## Setup
Git clone this repository, then run `npm install`. Ensure you have mongodb installed, then run `npm run dev` to start the dev server. You may need to initiate a replica set on your mongodb instance. Do this by running the dev server, and in a different terminal run `mongosh`. In the mongo shell instance run `rs.initiate()`.
