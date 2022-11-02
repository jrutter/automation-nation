
<h3 align="center">automated-lp-test</h3>

# App flow


    - An email comes in from ax with response codes (450 to be exact)
    - postmark parses the file, calls a webook
    - posts to heroku, a node app takes the file, filters it down, 
    - creates a json from results, 
    - creates a csv,
    - uploads to ghost inspector, triggers  cart lang tests
    - then sends results in an email to Jake R.


## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Write about 1-2 paragraphs describing the purpose of your project.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running.


```
npm install
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo.

## We have two servers

- Heroku Master - for production (this includes a different inbound server at Postmark - bd38792468f2474ab1271e722181b33f@inbound.postmarkapp.com)
- Heroku Staging - for testing (this includes a different inbound server at Postmark - 21dcba09d9d95d6a41156d63dbe4c8bc@inbound.postmarkapp.com)

heroku git:remote -a automated-xyz-staging


### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## 🎈 Usage <a name="usage"></a>

Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>

Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [VueJs](https://vuejs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

