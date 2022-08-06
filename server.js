/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Mohammed Muzakkir Ahmed Student ID: 128158219 Date: 23/07/2022
*
*  Online (Heroku) Link: https://limitless-stream-55363.herokuapp.com/
*
*  Github link: https://github.com/Mechatron01/web_assign6.git
********************************************************************************/ 
const Sequelize = require('sequelize');
var collegedata= require('./modules/collegeData')
var express= require('express')
var app= express()
var multer=require('multer')
const exphbs = require('express-handlebars');
var path=require('path');
const { mainModule } = require('process');
var upload = multer();




app.use(upload.array()); 

// Add middleware for static contents
app.use(express.static('views'))
app.use(express.static('modules'))


// //to let the server know how to use the handlebars add the below code
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// set up sequelize to point to our postgres database
var sequelize = new Sequelize('ddo0uol4j2ramd', 'xtwwgdnqwymlon', '35674956f2b0655bf5680d5ed4637316bd8ecd641244f80f573b2fa436ab7273', {
    host: 'ec2-52-71-23-11.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});



var HTTP_PORT = process.env.PORT || 8080;
// Define a "Project" model

// var Project = sequelize.define('Project', {
//     title: Sequelize.STRING,
//     description: Sequelize.TEXT
// });

// synchronize the Database with our models and automatically add the 
// table if it does not exist

// sequelize.sync().then(function () {

//     // create a new "Project" and add it to the database
//     Project.create({
//         title: 'Project1',
//         description: 'First Project'
//     }).then(function (project) {
//         // you can now access the newly created Project via the variable project
//         console.log("success!")
//     }).catch(function (error) {
//         console.log("something went wrong!");
//     });
// });

// var BlogEntry = sequelize.define('BlogEntry', {
//     title: Sequelize.STRING,  // entry title
//     author: Sequelize.STRING, // author of the entry
//     entry: Sequelize.TEXT, // main text for the entry
//     views: Sequelize.INTEGER, // number of views
//     postDate: Sequelize.DATE // Date the entry was posted
// });


// Define our "User" and "Task" models

// var User = sequelize.define('User', {
//     fullName: Sequelize.STRING, // the user's full name (ie: "Jason Bourne")
//     title: Sequelize.STRING // the user's title within the project (ie, developer)
// });

// var Task = sequelize.define('Task', {
//     title: Sequelize.STRING, // title of the task
//     description: Sequelize.TEXT // main text for the task
// });

// Associate Tasks with user & automatically create a foreign key
// relationship on "Task" via an automatically generated "UserId" field

// User.hasMany(Task);

// sequelize.sync().then(function () {
    
//     // Create user "Jason Bourne"
//     User.create({
//         fullName: "Jason Bourne",
//         title: "developer"
//     }).then(function (user) {

//         console.log("user created");
        
//             // Create "Task 1" for the new user
//         Task.create({
//             title: "Task 1",
//             description: "Task 1 description",
//             UserId: user.id // set the correct Userid foreign key
//         }).then(function(){ console.log("Task 1 created")});

//         // Create "Task 2" for the new user
//         Task.create({
//             title: "Task 2",
//             description: "Task 2 description",
//             UserId: user.id // set the correct Userid foreign key
//         }).then(function(){ console.log("Task 2 created")});
//     });

// });









app.use(express.urlencoded({ extended: true }));

// // setup a 'route' to listen on the default url path
// // app.get('/',(req,res)=>
// // {
// //     res.send("Hello World!")
// // })


app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

//adding a helper
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    ,
    
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 2 ){
            throw new Error("Handlebars Helper equal needs 2 parameters");
        }
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
}

    
}));

// Get request for student details
app.get('/students', (req, res) => {

    if( req.query.course &&  req.query.course !== undefined){
        let courseParas = req.query.course;
        console.log(courseParas);

         collegedata.getStudentsByCourse(courseParas).then(course => {
                res.render('students',{
                    data: course,
                    layout: "main"
                })
                console.log("courses data retrieved")
            }).catch(err => {
                err = {
                message : "no results"}
                res.render("students", {message: "no results"})})
           
        }
        else {
            collegedata.getAllStudents().then(students => {
            // res.send(students)
            if(students.length>0){
                res.render("students", {
                    data: students,
                    layout: "main"});
            }
            else{
                res.render("students", {message: "no results"}); 
            }
            }).catch(err => {
                err = {
                message : "no results"}
            // res.send()
            
        })
    
}});


// // app.get("/tas", (req, res) => {
// //         collegedata.getTAs().then(tas => {
// //         res.send(tas)
// //         console.log("TAs Loaded successfully" )
// //         }).catch(err => {
// //         err = {
// //             message : "no results"}
// //         res.send()
// //     })
// // })

app.get("/courses", (req, res) => {
        collegedata.getCourses().then(courses => {
        // res.send(courses)
        if (courses.length>0){
            res.render('courses',{
                data: courses,
                layout: "main"
            })
            console.log("Get courses called successfully" )
        }
        else{
            res.render("courses", {message: "no results"})
        }
        
        }).catch(err => {
        // err = {
        //     message : "no results"}
            res.render("courses", {message: "no results"})
    })
});


// app.get("/student/:studentnum", (req, res) => {
//     console.log("Entering student num")
//     let studentnumber = req.params.studentnum
//             collegedata.getStudentByNum(studentnumber).then(student => {
//                 // res.send(students)
//                 console.log(student)
//                 res.render("student", { 
                
//                 data: student ,
//                 layout: "main"}); 
//                 console.log("Student found")
//             }).catch(err => {
//                 console.log(err)
//             })
           
//         });


app.get("/student/:studentNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    collegedata.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student= (data); //store student data in the "viewData" object as "student"
        console.log(viewData)
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    })
    .then(collegedata.getCourses())
    .then((data) => {
        viewData.courses = data; // store course data in the "viewData" object as "courses"

        // loop through viewData.courses and once we have found the courseId that matches
        // the student's "course" value, add a "selected" property to the matching 
        // viewData.courses object

        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.courses = []; // set courses to empty if there was an error
    })
    .then(() => {
        console.log(viewData)
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            
            res.render('student', 
            {   
                viewData: viewData, 
            layout: "main"}); // render the "student" view
        }
    });
});


app.get("/student/delete/:studentNum",(req,res)=>{
    console.log('student delete called');
    collegedata.deleteStudentByNum(req.params.studentNum).then(()=>{
        collegedata.getAllStudents().then((students)=>{
            res.render('students',{
                data: students,
                layout:"main"
            })
       
        }).catch(()=>{
            res.status(500).send("Unable to Remove Student / Student not found")
    })
})})



app.get("/course/:courseId",(req,res)=>{
    console.log("getting courses by id ")
    let coursenum=req.params.courseId
    console.log(coursenum)
        collegedata.getCourseById(coursenum).then(cours =>{
            console.log(cours)
                if(cours.length>0){
                res.render('course',{
                data: cours,
                layout: 'main'
            })
                }
                else{
                    res.status(404).send("Course Not Found")
                }
           
        }).catch(err=>
            {
                //res.render('courses',{message:err})
                console.log('no course found: error')
            })
}) ;

    app.get("/course/delete/:id",(req,res)=>{
        collegedata.deleteCourseById(req.params.id).then(()=>{
            collegedata.getCourses().then((courses)=>{
                console.log(courses)
                res.render('courses',{
                    data: courses,
                    layout:"main"
                })
            }).catch(()=>{
                res.render("courses", {message: "no results"})
            
            
            
            
        })
    })})

app.get("/students/add",(req,res)=>
{
    console.log('student add called')
    // res.sendFile(path.join(__dirname,"./views/addStudent.html"))
    collegedata.getCourses().then((courses)=>{
        if(courses.length>0){
            console.log(courses)
            res.render('addStudent',{
                data: courses,
                layout:"main"
            })
        }
        else{
            res.render('addStudent',{
                data: [],
                layout:"main"
            })  
        }
       
    }).catch(()=>
    {
        res.render("addStudent", {message: "no results"}) 
    })

}) ;

app.get("/courses/add",(req,res)=>
{
    console.log('course add called')
    // res.sendFile(path.join(__dirname,"./views/addStudent.html"))
    res.render('addCourse',{
        layout:"main"
    })
}) ;

app.get("/courses/:courseid",(req,res)=>{
    console.log("getting courses by id ")
    let coursenum=req.params.courseid
        collegedata.getCourseById(coursenum).then(courses =>{   
            res.render('course',{
                data: cours,
                layout: 'main'
            })
        }).catch(err=>
            {
                res.render('courses',{message:err})
            })
}) 


app.post("/students/add",(req,res)=>{
    console.log('student add called')
    collegedata.addStudent(req.body).then(()=>{
        res.redirect("/students")  
    }
    ).catch(err=>{
        res.send(err)
    })
})

app.post("/courses/add",(req,res)=>{
    console.log('course add called')
    collegedata.addCourse(req.body).then(()=>{
        res.redirect("/courses")  
    }
    ).catch(err=>{
        res.send(err)
    })
})

app.post("/student/update",(req,res)=>{
    //calling /student/update
    console.log("calling student update")
    console.log(JSON.stringify(req.body))
    collegedata.updateStudent(req.body).then(()=>{
        
        res.redirect("/students")
    }).catch(err=>{
        res.send(err)
    })

})

app.post("/course/update",(req,res)=>{
    //calling /course/update
    console.log("calling course update")
    console.log(JSON.stringify(req.body))
    collegedata.updateCourse(req.body).then(()=>{
        
        res.redirect("/courses")
    }).catch(err=>{
        res.send(err)
    })

})

app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname,"./views/home.html"));
    res.render('home', {
        // data: someData,
        layout: "main" // do not use the default Layout (main.hbs)
    });
});

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname,"./views/home.html"));
// });

app.get("/home", (req, res) => {
    // res.sendFile(path.join(__dirname,"./views/home.html"));
    res.render('home', {
        // data: someData,
        layout: "main" // do not use the default Layout (main.hbs)
    });
});

app.get("/about", (req, res) => {
    //res.sendFile(path.join(__dirname,"./views/about.html"));
    res.render('about',{
        layout:"main"
    })
});

app.get("/htmlDemo", (req, res) => {
    //res.sendFile(path.join(__dirname,"./views/htmlDemo.html"));
    res.render('htmlDemo',{
        layout:"main"
    })
});


app.get('*', function(req, res){
    res.send('Page Not Found');
});

// setup http server to listen on HTTP_PORT
collegedata.initialize()
.then(app.listen(HTTP_PORT, ()=>{
    
    console.log("server listening on port: " + HTTP_PORT)
}))
.catch(err => {
    console.log("Error: Can't intialize the json files")
})



