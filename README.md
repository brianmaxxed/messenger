# Challenge

Build a thumbs-up/thumbs-down image moderation service.

## Background

We are working on a project that makes use of user-generated images from around the web. Before an image can be used, it needs to be approved by a human to ensure it isn't inappropriate.

Our task is to build a simple web interface that allows a team of moderators to efficiently review the images.

## Requirements

The main requirement is that we can process these images as fast as possible. We want to minimize the turnaround time between a user submitting their image and one of our moderators making a decision. We also want to minimize "wasted moderations" i.e. an image should generally only be reviewed once. Images should be reviewed on a first-come first-served basis, more or less.

### Pages

We want to start with a prototype that has just two pages. The real system will require moderators to login before they can start work, but for now we can just do something hacky like put `?user=user1` or `?user=user2` in the URL to save time.

#### /moderator

This is the page where moderators will approve/reject images. It should appear as follows:

* When the queue is not empty:
  * Show the image to be reviewed with approve/reject buttons

* When the queue is empty:
  * Show message saying the queue is empty.

* Always:
  * Show this moderator's past 5 moderations with buttons to toggle their decision (so they can undo a mistake)
  * Possible to use keyboard-only for all interactions

Example Layout:

![Example Layout](example_layout_moderator_page.png)

#### /dashboard

This is the page where we can see the state of the system, how well the moderators are performing, etc.

* Show all the images the system knows about.
* Filter by: all, pending, approved, rejected.
* Sort by: time the image entered the system.
* Show the size of the filtered set of images currently being viewed.
* Optional: Show some statistics, e.g. the average time spent in queue, number of moderators active, or whatever you think might be useful to the administrator.

Example Layout:

![Example Layout](example_layout_dashboard_page.png)

## Test Dataset

You can use this [CSV of test data](https://d3ous0vnp05zqm.cloudfront.net/manual_uploads/moderation_challenge/images.csv) to build your service. It's a two-column CSV. The first column is the timestamp when the image was added to the system. The second column is the image URL.

## Deliverables

* Python or JavaScript app (any framework)
* Quick and easy to get running locally on Linux or OSX
* Any docs required for operating

## Tips

* Write readable, quality code.
* Styling is not important.
* Include tests if you want to.
* Include commit history if you want to.
