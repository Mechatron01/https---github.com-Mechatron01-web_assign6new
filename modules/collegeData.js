// const { json } = require("express");
// const fs = require("fs");
// const { resolve } = require("path");

// class Data{
//     constructor(students, courses){
//         this.students = students;
//         this.courses = courses;
//     }
// }

// var dataCollection= null

const Sequelize = require('sequelize');
var sequelize = new Sequelize('ddo0uol4j2ramd', 'xtwwgdnqwymlon', '35674956f2b0655bf5680d5ed4637316bd8ecd641244f80f573b2fa436ab7273', {
    host: 'ec2-52-71-23-11.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});

var initialize = function () {
    return new Promise( (resolve, reject) => {
        // fs.readFile('./data/courses.json','utf8', (err, courseData) => {
        //     if (err) {
        //         reject("unable to load courses"); return;
        //     }

        //     fs.readFile('./data/students.json','utf8', (err, studentData) => {
        //         if (err) {
        //             reject("unable to load students"); return;
        //         }

        //         dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
        //         resolve(dataCollection);
        //     });
        // });
        sequelize.sync().then(function(){
            resolve(console.log('connected to database'))
        }).catch(function(){
            reject(console.log('not connected'))
        })
    }
    );
}


var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    firstName: Sequelize.STRING, 
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course',{
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, {foreignKey: 'course'});

var getAllStudents = function(){
    let data=null
    return new Promise((resolve,reject)=>{
        
    //     initialize().then(dataCollect=>{
    //         data=dataCollect
    //         //console.log(data)
    //         if (data.students.length == 0) {
    //             reject("query returned 0 results"); return;
        
        
    //     }

    //     resolve(dataCollect.students);
    // })

    sequelize.sync().then(()=>{
        Student.findAll().then((data)=>{
                console.log('data collected successfully')
                resolve(data)
        }).catch((err)=>{
            reject('no results returned')
        })
    })
}
)}

var getTAs = function () {
    let data =null
    return new Promise(function (resolve, reject) {
    //     var filteredStudents = [];
    //     initialize().then(dataCollect=>{
    //         data=dataCollect
    //         //console.log(data)

    //     for (let i = 0; i < data.students.length; i++) {
    //         if (dataCollection.students[i].TA == true) {
    //             filteredStudents.push(data.students[i]);
    //         }
    //     }

    //     if (filteredStudents.length == 0) {
    //         reject("query returned 0 results"); return;
    //     }

    //     resolve(filteredStudents);
    // })
    reject();
    }
    );
};

var getCourses = function(){
   return new Promise((resolve,reject)=>{
//     initialize().then(dataCollect=>{
//         data=dataCollect
//         //console.log(data)
//     if (data.courses.length == 0) {
//         reject("query returned 0 results"); return;
//     }

//     resolve(dataCollect.courses);
//    });
sequelize.sync().then(()=>{
    Course.findAll().then((data)=>{
        resolve(data)
    }).catch((err)=>{
        reject('no results returned')
    })
})
}
)
}

var getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
    //     var foundStudent = null;
    //     initialize().then(dataCollection=>{
    //         //data=dataCollection
    //         //console.log(data)

    //     for (let i = 0; i < dataCollection.students.length; i++) {
    //         if (dataCollection.students[i].studentNum == num) {
    //             foundStudent = dataCollection.students[i];
    //         }
    //     }

    //     if (!foundStudent) {
    //         reject("query returned 0 results"); return;
    //     }

    //     resolve(foundStudent);
    // })
    sequelize.sync().then(()=>{
        Student.findAll({
            where:{
                studentNum:num
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err)=>{
            reject('no results returned')
        })
    })
    }
    );
};

var getCourseById= function(id){
    console.log(id+'here1')
    return new Promise(function(resolve, reject){
        // var getcourse=null;
        // console.log(id+'here2')
        // initialize().then(datacollect=>{
        //     console.log(id+ ' here 3')
        //     for (let i=0; i < datacollect.courses.length; i++){
                
        //         if (datacollect.courses[i].courseId==id){
        //             console.log(id)
        //             getcourse= datacollect.courses[i];
        //         }
                
        //     }

        //     if (!getcourse){
        //         reject("query returned 0 results "); return;

        //     }
        //     resolve(getcourse);

        // })

        sequelize.sync().then(()=>{
            Course.findAll({
                where:{
                    courseId:id
                }
            }).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                reject('no results returned')
            })
        })
    }
    )
}

var getStudentsByCourse = function (courseid) {
    return new Promise(function (resolve, reject) {
    //     var filteredStudents = [];
    //     initialize().then(dataCollection=>{
    //         //data=dataCollection
    //         //console.log(data)
    //     for (let i = 0; i < dataCollection.students.length; i++) {
    //         if (dataCollection.students[i].course == course) {
    //             filteredStudents.push(dataCollection.students[i]);
    //         }
    //     }

    //     if (filteredStudents.length == 0) {
    //         reject("query returned 0 results"); return;
    //     }

    //     resolve(filteredStudents);
    // })

    sequelize.sync().then(()=>{
        Student.findAll({
            where:{
                course:courseid
            }
        }).then((data)=>{
            resolve(data)
        }).catch((err)=>{
            reject('no results returned')
        })
    })
    reject();
    }
    );
};


var addStudent=function(studentData){
    return new Promise ((resolve,reject)=>{
        studentData.TA = (studentData.TA) ? true : false;

        for (const prop in studentData){
            if(studentData[prop]==''){
                studentData[prop]=null
            }
        };

        Student.create({
            firstName: studentData.firstName, 
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA,
            status: studentData.status
        }).then(()=>{
            resolve('student created successfully')
        }).catch(()=>{
            reject('unable to create student')
        })
        // let stunum=null;
        // let str={}
        // console.log("adding student")
        // console.log(studentData)
        // str=studentData
        // console.log(str)
        // if (studentData.TA !=true){
        //     studentData.TA=false
        // }

        // getAllStudents().then(studata=>{
        //     // console.log(studata.length)
        //     stunum=studata.length+1
        //     str = Object.assign({studentNum:stunum},str)
        //     console.log(str)
        // }).catch(err=>{
        //     console.log("error occured getting students"+err)})

        // initialize().then(dataCollection=>{
        //    console.log('the length of the list is '+ dataCollection.students.length)
        //    dataCollection.students.push(str)
        //    console.log(JSON.stringify(str))
        //    console.log('the length of the updated list is '+ dataCollection.students.length)
        //    try {
        //         fs.writeFileSync('./data/students.json', JSON.stringify(dataCollection.students));
        //         console.log("JSON data is saved.");
        //     } catch (error) {
        //         console.log(error);
        //     }
        // })
               
        // resolve("created data")   
      
    }
    )
};

var addCourse = (courseData)=>{
    return new Promise ((resolve,reject)=>{
        Course.create({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription
        }).then(()=>{
            resolve('Course created successfully')
        }).catch(()=>
        {
            reject('Unable to create course')
        })
    })
}


var updateCourse=(courseData)=>{
    return new Promise ((resolve,reject)=>{
        for (const prop in courseData){
            if(courseData[prop]==''){
                courseData[prop]=null
            }
        };
        Course.update({
            where:{courseId:courseData.courseId}
        }).then(()=>
        {
            resolve('course updated successfully')
        }).catch(()=>{
            reject('unable to update course')
        })
    })
};

var deleteCourseById=(id)=>{
    return new Promise ((resolve,reject)=>{
        Course.destroy({
            where:{courseId: id}
        }).then(()=>
        {
            resolve('course deleted successfully')
        }).catch(()=>{
            reject('unable to delete course')
        })
    })
}

var deleteStudentByNum = (studentNum)=>{
    return new Promise ((resolve,reject)=>{
        sequelize.sync().then(()=>{
            Student.destroy({
                where:{studentNum:studentNum}
            }).then(()=>{
                console.log('student deleted successfully')
                resolve('success')
            }).catch(()=>
            {
                console.log('error deleting the student')
                reject('error while deleting the student')
            })
        })
    })
}

var updateStudent=function(studentData){
    return new Promise ((resolve,reject)=>{
    
        studentData.TA = (studentData.TA) ? true : false;

        for (const prop in studentData){
            if(studentData[prop]==''){
                studentData[prop]=null
            }
        };

        Student.update({
            firstName: studentData.firstName, 
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA,
            status: studentData.status
        },
        {
            where:{
                studentNum:studentData.studentNum
            }
        }).then(()=>{
            resolve('Student Updated successfully')
        }).catch(()=>{
            reject('Unable to update the student')
        }
        )
        // var cnt =0
        // initialize().then(data=>{
        //     for (let i=0; i<data.students.length ; i++){
        //         if (data.students[i].studentNum==studentData.studentNum){
        //             cnt=cnt+1
        //             data.students[i].firstName=studentData.firstName
        //             data.students[i].lastName=studentData.lastName
        //             data.students[i].email=studentData.email
        //             data.students[i].addressStreet=studentData.addressStreet
        //             data.students[i].addressCity=studentData.addressStreet
        //             data.students[i].addressStreet=studentData.addressStreet
        //             data.students[i].addressProvince=studentData.addressProvince
        //             data.students[i].TA=studentData.TA
        //             data.students[i].status=studentData.status
        //             data.students[i].course=studentData.course
        //             console.log(data.students[i])
        //             try {
        //                 fs.writeFileSync('./data/students.json', JSON.stringify(dataCollection.students));
        //                 console.log("JSON data is saved.");
        //             } catch (error) {
        //                 console.log(error);
        //             }
        //         }
        //     }
        //     if (cnt>0){
        //         resolve(console.log("done with the update"))
        //     }
        //     else{
        //         reject("no student found with the student num")
        //     }
            
        // })
    }
    )
}




module.exports={initialize,
                getAllStudents,
                getTAs,
                getCourses,               
                getStudentByNum,
                getStudentsByCourse,
                addStudent,
                getCourseById,
                addCourse,
                updateStudent,
                updateCourse,
                deleteCourseById,
                deleteStudentByNum}

 