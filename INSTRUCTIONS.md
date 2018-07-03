# Instructions for Use

The following are the instructions for running and using the messenger frontend and backend.

## Getting started

### Technology used

1. ReactJS for the frontend (latest version; 16.4);
2. NodeJS and MongoDB for the backend;

### Prerequisites

1. Git
2. Node: install version 6.10 or greater (8.10 preferred)
3. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
4 and npm.
5. A clone of the repo.
6. a MongoDB database (localhost or something like mongodb atlas(https://www.mongodb.com/cloud/atlas)

### Install backend-end
 goto backend folder
 ```
 cd backend
 ```
 
 make sure you're using node v6.10 or greater; install via nvm if neccessary
 ```
 nvm install 6.10
 ```
```
 npm install
 ```
 or use yarn
 ```
 yarn
 ```
 
 edit the .env environment variables if needed. 
 default port is 3100; change as needed.
 allows you to change to your MONGO_DEV_URI other settings leave as is; experimental
 run the app on port 3100 by default.
 yarn start

console: listening at http://localhost:3100

### Install front-end
 go to frontend folder
 ```
 cd frontend
 ```
 
 ```
 npm install
 ```
 or
 ```
 yarn
 ```
 runs on port 3000; uses create-react-app the standard right now for creating the boostrap.
 yarn start

Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.1.208:3000/

navigate to the urls above.


# API
The Images API can be found in:
```
backend/src/controllers/Images.js
```

#### Clear the image moderations to default:
GET http://localhost:3100/api/v1/image/clear

#### List the images
GET http://localhost:3100/api/v1/image/list/:filter
filter can be: all, pending, rejected, and approved; leave off the filter for all.

brings back the list of moderated or unmoderated images.
If an image was moderated then the updatedAt, moderatorId, and approved boolean are added.
```
{
    "status": 200,
    "data": {
        "message": [
            {
                "_id": "5b39f808092498601a985f80",
                "ts": 1455123632,
                "url": "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.01.jpeg",
                "updatedAt": "2018-07-03T14:28:47.267Z",
                "moderatorId": 1,
                "approved": true
            },
            {
                "_id": "5b39f808092498601a985f81",
                "ts": 1455123633,
                "url": "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.02.jpeg",
                "updatedAt": "2018-07-03T14:28:47.939Z",
                "moderatorId": 1
            },
 ```
#### Next image to moderate
GET http://localhost:3100/api/v1/image/next?user=user1
this returns the next single image for a particular user.
user querystring param is required.
the db document will be statused with the moderatorId so another user won't get the same image.

#### Moderated images
user querystring param is required.
GET http://localhost:3100/api/v1/moderated/next?user=user1
returns the last 5 moderated images from a particular user

#### Moderate an image
PUT http://localhost:3100/api/v1/moderate/next?user=user1
user querystring param is required.
you must put the following paramters:
```
    const params = {
      imageId: "5b39f808092498601a985f80"
      user: "user1",
      approved: true,
    };
```

# Pages

There is an api and a frontend.

It's a good idea to clear the image moderation before starting if you are using my db or in general.
This url will reset all images to unmoderated and give you the counts returned from mongodb:
http://localhost:3100/api/v1/image/clear

There are two pages:
### Dashboard
```
http://localhost:3000/dashboard
```

This page shows all the current images and allows a filter to change all, pending, rejected, approved.
I didn't have time to spice up the dashboard in the time allotted, but I did add a red or green color to image
to denote rejected or approved.

Also, the page does not refresh automatically. This was not in the specs I believe, but a refresh timer could easily be added to display an updated screen as the images are moderated. That would be a nice to have.

### Moderation
```
http://localhost:3000/moderator?user=user1
http://localhost:3000/moderator?user=user2
```

You can have mulliple windows open at the same time and see that users can only moderate their next image
and there is no overlap between.

Make sure you add the ?user=user1 or ?user=user2 as these are the only 2 users
(the edge cases of no users has not been added/asked to this example)

### Moderation workflow
each user will see a unique next image to moderate.
Approve or reject the image. The last 5 user's moderations in order from left to right are displayed.
Users can change their mind on the last 5 entries and reverse their moderation.


We want to start with a prototype that has just two pages. The real system will require moderators to login before they can start work, but for now we can just do something hacky like put `?user=user1` or `?user=user2` in the URL to save time.

### Test Dataset

there are two collections: user and image.

user collection:
```
{ 
    "_id" : ObjectId("5b3a1cc867e9e6b98f154ca2"), 
    "userId" : 1.0, 
    "user" : "user1"
}
{ 
    "_id" : ObjectId("5b3a1ccd67e9e6b98f154ca3"), 
    "userId" : 2.0, 
    "user" : "user2"
}
```

image collection:
```
{ 
    "_id" : ObjectId("5b39f808092498601a985f80"), 
    "ts" : 1455123632, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.01.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f81"), 
    "ts" : 1455123633, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.02.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f82"), 
    "ts" : 1455123634, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.03.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f83"), 
    "ts" : 1455123635, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.04.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f84"), 
    "ts" : 1455123636, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.05.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f85"), 
    "ts" : 1455123637, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.06.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f86"), 
    "ts" : 1455123638, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.07.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f87"), 
    "ts" : 1455123639, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.1.08.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f88"), 
    "ts" : 1455123640, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.01.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f89"), 
    "ts" : 1455123641, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.02.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f8a"), 
    "ts" : 1455123642, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.03.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f8b"), 
    "ts" : 1455123643, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.04.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f8c"), 
    "ts" : 1455123644, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.05.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f8d"), 
    "ts" : 1455123645, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.06.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f8e"), 
    "ts" : 1455123646, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/4.2.07.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f8f"), 
    "ts" : 1455123647, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.1.09.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f90"), 
    "ts" : 1455123648, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.1.10.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f91"), 
    "ts" : 1455123649, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.1.11.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f92"), 
    "ts" : 1455123650, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.1.12.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f93"), 
    "ts" : 1455123651, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.1.13.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f94"), 
    "ts" : 1455123652, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.1.14.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f95"), 
    "ts" : 1455123653, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.2.08.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f96"), 
    "ts" : 1455123654, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.2.09.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f97"), 
    "ts" : 1455123655, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.2.10.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f98"), 
    "ts" : 1455123656, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.3.01.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f99"), 
    "ts" : 1455123657, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/5.3.02.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f9a"), 
    "ts" : 1455123658, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.01.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f9b"), 
    "ts" : 1455123659, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.02.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f9c"), 
    "ts" : 1455123660, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.03.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f9d"), 
    "ts" : 1455123661, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.04.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f9e"), 
    "ts" : 1455123662, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.05.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985f9f"), 
    "ts" : 1455123663, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.06.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa0"), 
    "ts" : 1455123664, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.07.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa1"), 
    "ts" : 1455123665, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.08.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa2"), 
    "ts" : 1455123666, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.09.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa3"), 
    "ts" : 1455123667, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.1.10.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa4"), 
    "ts" : 1455123668, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/7.2.01.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa5"), 
    "ts" : 1455123669, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/boat.512.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa6"), 
    "ts" : 1455123670, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/elaine.512.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa7"), 
    "ts" : 1455123671, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/gray21.512.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa8"), 
    "ts" : 1455123672, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/house.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fa9"), 
    "ts" : 1455123673, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/numbers.512.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985faa"), 
    "ts" : 1455123674, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/ruler.512.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
{ 
    "_id" : ObjectId("5b39f808092498601a985fab"), 
    "ts" : 1455123675, 
    "url" : "https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images/testpat.1k.jpeg", 
    "updatedAt" : ISODate("2018-07-03T14:29:11.620+0000")
}
```

Note: you can directly import the above data into your own two mongodb collections.
I took the default CSV file and added an objectID, to avoide race conditions on the image timestamp.
The timestamp field is denoted as 'ts'.

I created a mongodb database for this example.
Find the URL in the .env file!

## NOTES
If there are no users in the user document, then this will not work.
The data files are in the root of the project: image.json and user.json.
If creating your own mongodb database import these two files before running.

The moderation will add a moderatorId (userId) and an approved boolean upon moderation.
When a user gets a new image, there moderationId is added to that image record.
Multiple users will not receive the same image to moderate.
When a user requests a new image, their moderationId is added to the image document to prevent a race condition.

