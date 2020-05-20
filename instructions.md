# Unit 17 Sequelize Homework: Workout Tracker

For this assignment, you'll create a workout tracker that tracks daily workout activities. You have already been provided with `MOST` of the client-side functionality, with the front end code in the `/Develop/public` folder. This assignment will require you to create MySQL database with a Sequelize schema and handle routes with Express.

#### The app will consist of these three core elements:

- Workouts, each of which has a name and date associated with it; as well as an unlimited amount of Activities.

- Activities: these are the parts of each workout. Each activity consists of an Exercise (Barbell Curl, Lateral Curl, Bench Press, Treadmill, Stairmaster, etc.) and then info about Duration, Weight, Sets, Reps, and Distance.

```
Example: Bob's workout for Feb 20 consisted of these Activities:

Barbell Curl, Weight: 50 Sets: 5 Reps: 5
Stairmaster: Duration: 30 minutes Distance: 50 flights
```

The list of Exercises can be entered directly into your database using Sequelize.

`MOST` of the client side functionality will be provided. Focus on the back-end.

`You will NOT` be reloading the index.html page in order to update state. You'll be dynamically updating the DOM, but most of this will be done for you.

`You'll be using Express Router` this time, and you'll map your routes to controllers, which will then reference Sequelize models. You'll be provided with one example of this.


#### Requirements:
- Node
- MySQL - Database
- Sequelize - ORM
- Express & Express Router
- jQuery and Bootstrap


## User Story

- As a user, I want to be able to view create and track daily workouts. I want to be able to log multiple exercises in a workout on a given day. I should also be able to track the name, type, weight, sets, reps, and duration of exercise. If the exercise is a cardio exercise, I should be able to track my distance traveled.

## Business Context

A consumer will reach their fitness goals quicker when they track their workout progress.


## Acceptance Criteria

When the user loads the page, they should be given the option to create a new workout, or continue with their last workout.

The user should be able to:

- Add exercises to a previous workout plan.

- Add new exercises to a new workout plan.

- View multiple the combined weight of multiple exercises on the `stats` page.

## Commit Early and Often

One of the most important skills to master as a web developer is version control. Building the habit of committing via Git is important for two reasons:

1. Your commit history is a signal to employers that you are actively working on projects and learning new skills

2. Your commit history allows you to revert your code base in the event that you need to return to a previous state

Follow these guidelines for committing:

- Make single purpose commits for related changes to ensure a clean, manageable history. If you are fixing two issues, make two commits

- Write descriptive, meaningful commit messages so that you and anyone else looking at your repository can easily understand its history

- Don't commit half done work, for the sake of your collaborators (and your future self!)

- Test your application before you commit to ensure functionality at every step in the development process

We would like you to have well over 200 commits by graduation, so commit early and often!

## Submission on BCS

You are required to submit the following:

- The URL to the deployed application

- The URL to the Github repository


## Bonus (*Optional Section)

#### Bonus Points:
Develop a seeder file that seeds the exercises instead of you putting them in manually.

#### More Bonus Points:
Your seeder file can also seed a few initial workouts.
