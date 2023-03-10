<h1 align="center"> 
<img src="public/article/left.png" alt="brand"> <img width="200" height="auto" src="public/article/brand.jpg" alt="brand"> <img src="public/article/right.png" alt="brand">
</h1>

<br>
<p align="center">
Vote is a mobile voter website that allows users to create a personal account and log in to vote, and gives admins the additional ability to add, update, or delete new positions. </p>

---
<h2 align="center">Creators:</h2>
<p align="center">
Peter Riesing 
&nbsp; & &nbsp;
Meg Divringi 
<br>
(<a href="https://github.com">Blog</a>, <a href="https://github.com/peterriesing">GitHub</a>) 
&ensp; &ensp;
(<a href="https://dev.to/megdiv">Blog</a>, <a href="https://github.com/Meg-Div">GitHub</a>)
</p>
<p align="center">Peter and Meg created Vote while enrolled within the Web Developer program at DigitalCrafts. </p>
<p align="center">Peter’s focus was primarily on UX Design and Frontend and Meg’s focus was primarily on Project Management and Backend.</p>

---
<h2 align="center">Languages/ Technologies:</h2>
<p align="center">
Javascript
* Node.js
* Express
* Sequelize
* EJS Template
* ElephantSQL
* HTML/CSS
* Bcrypt
</p>

---
<h2 align="center">Use/View:</h2>
To view the project, head to their portfolios: (Peter’s Portfolio, <a href="https://meg-div.github.io/">Meg's Portfolio</a>)
<br><br>
To read the project blog, head to: <a href="https://dev.to/megdiv/vote-58eb"> Project Blog</a>
<br><br>
To use the project, follow the steps below:
<br>
<br>

1. Clone the repository
2. Install node.js and npm
3. Run the command npm update
4. You will need to create a database, we used a free web service called ElephantSQL
5. Create a config directory
6. Create a file called config.json
7. Create a file called .gitignore (this will secure any files included by not uploading them to GitHub)
8. Add config.json to .gitignore (this will prevent your password from being visible)
9. Add in your ElephantSQL information in the below format:
```js
{ 
    "development": {
        "username": username,
        "password": password,
        "database": username,
        "host": url,
        "dialect": "postgres"
    },
    "test": {
        "username": username,
        "password": password,
        "database": username,
        "host": url,
        "dialect": "postgres"
    },
    "production": { 
        "username": username,
        "password": password,
        "database": username,
        "host": url,
        "dialect": "postgres"
    },
}
```
10. Run your server by typing in ‘node index.js’ to the terminal
11. To use Vote, navigate to http://localhost:3009/home
---
<br>
<p align="center"> 
<img src="public/article/left.png" alt="brand"> <img src="public/article/right.png" alt="brand">
</p>
