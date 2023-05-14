//App.js

const data = require("./data.json");
//import  {data} from ("./data.json");
const reports= data.profiles;
/**
 * purpose - Adding a new data to the json file
 * @param {*} report - data that has to be added to the json file
 * @returns message if data is valid
 * @returns error id data pusehd is invalid
 */
const addReports = async (report) => {
    var c=0;

    for (var i =0; i < reports.length; i++)    
    {    
        if(reports[i].email===report.email)
        {    
            c++;
            return ({ 
                error: "Patient with email id already exists" 
            });
        break;
        }         
    }
    if(c==0)
    reports.push(report);          
    
}
/**
 * purpose - retriving data from the json file
 * @param {*} filters - any filters that needed to be applied to filter the data
 * @returns all the data if no filters were sent
 */
const getReports = async (filters) => {
    var response=[];
    if(filters==null)
        response=reports;
    else if(filters.age!=null && filters.type!=null)
        {
            if(filters.type==="gte")
            for(var i =0; i < reports.length; i++)    
            {
                if(reports[i].age>=filters.age)
                {    response.push(reports[i]);
                }
            }
            else if(filters.type==="lte")
            for(var i =0; i < reports.length; i++)    
            {
                if(reports[i].age<=filters.age)
                {    response.push(reports[i]);
                }
            }
            
        }
    else if(filters.gender!=null)
        {
            for(var i =0; i < reports.length; i++)    
            {
                if(reports[i].gender===filters.gender)
                {    response.push(reports[i]);
                }
            }
        }
    else{
        for(var i =0; i < reports.length; i++)    
        {
            if(reports[i].id===filters.id)
            {    response=reports[i];
                break;
            }
        }
    }
}

/**
 * purpose - calculating BMI for patients
 * @returns BMI for each patient
 */
const calculateBMI = () => {
    var arr=[];
    for(var i =0; i < reports.length; i++)
    {
        arr[i].id=reports[i].id;
        arr[i].name=reports[i].name;
        arr[i].bmi=reports[i].weight/((reports[i].height/100)*(reports[i].height/100));
        if(arr[i].bmi<19)
        {   
            arr[i].status="Under weight";
           }
        else if(arr[i].bmi>25)
        {   
            arr[i].status="Over weight";
       }
       else 
            arr[i].status="Normal";
    }
}

module.exports = {
    addReports,
    getReports,
    calculateBMI
};

//Data.json

[
    {
      "id": 1,
      "name": "Patient 1",
      "age": 47,
      "email":"patient1@abc.com",
      "password":"Patient1@123",
      "gender":"male",
      "bloodgroup":"A+",
      "report":{
        "bp":"115/75",
        "height":175,
        "weight":70,
        "heartbeatrate":75,
        "RBC":"4.40M",
        "WBC":"8500MCL"
      }  
    },
    {
        "id": 2,
        "name": "Patient 2",
        "age": 39,
        "email":"patient2@abc.com",
        "password":"Patient2@123",
        "gender":"female",
        "bloodgroup":"B+",
        "report":{
          "bp":"80/60",
          "height":158,
          "weight":47,
          "heartbeatrate":63,
          "RBC":"3.10M",
          "WBC":"5500MCL"
        }  
      },
      {
        "id": 3,
        "name": "Patient 3",
        "age": 63,
        "email":"patient3@abc.com",
        "password":"Patient3@123",
        "gender":"male",
        "bloodgroup":"AB+",
        "report":{
          "bp":"100/70",
          "height":158,
          "weight":68,
          "heartbeatrate":75,
          "RBC":"4.18M",
          "WBC":"7500MCL"
        }  
      },
      {
        "id": 4,
        "name": "Patient 4",
        "age": 24,
        "email":"patient4@abc.com",
        "password":"Patient4@123",
        "gender":"female",
        "bloodgroup":"B-",
        "report":{
          "bp":"120/80",
          "height":178,
          "weight":74,
          "heartbeatrate":72,
          "RBC":"5.03M",
          "WBC":"9500MCL"
        }  
      },
      {
        "id": 5,
        "name": "Patient 5",
        "age": 23,
        "email":"patient5@abc.com",
        "password":"Patient5@123",
        "gender":"male",
        "bloodgroup":"O+",
        "report":{
          "bp":"110/70",
          "height":160,
          "weight":58,
          "heartbeatrate":87,
          "RBC":"4.03M",
          "WBC":"8750MCL"
        }  
      }
    ]

//App.test.js

const { addReports, calculateBMI, getReports } = require("../src/app");
const data = require("../src/data.json");

const insertData = {
    "id": 6,
    "name": "Patient 6",
    "age": 50,
    "email": "patient6@abc.com",
    "password": "Patient6@123",
    "gender": "male",
    "bloodgroup": "A-",
    "report": {
        "bp": "115/75",
        "weight": 70,
        "height": 175,
        "heartbeatrate": 75,
        "RBC": "4.40M",
        "WBC": "8500MCL"
    }
}

//checking the types of data
test("Checking the data types", () => {
    expect(typeof data.profiles).toBe(typeof []);
    expect(typeof data.profiles[0].id).toBe("number");
    expect(typeof data.profiles[0].name).toBe("string");
    expect(typeof data.profiles[0].password).toBe("string");
    expect(typeof data.profiles[0].age).toBe("number");
    expect(typeof data.profiles[0].bloodgroup).toBe("string");
    expect(typeof data.profiles[0].gender).toBe("string");
    expect(typeof data.profiles[0].report).toBe("object");
    expect(typeof data.profiles[0].report.RBC).toBe("string");
    expect(typeof data.profiles[0].report.WBC).toBe("string");
    expect(typeof data.profiles[0].report.bp).toBe("string");
    expect(typeof data.profiles[0].report.heartbeatrate).toBe("number");
    expect(typeof data.profiles[0].report.height).toBe("number");
    expect(typeof data.profiles[0].report.weight).toBe("number");
});

//fetching all the details from the json
test("Fetching all the data", () => {
    const response = getReports({});
    expect(response.length).toBe(5);
    for (let i = 0; i < response.length; i++) {
        expect(response[i].id).toEqual(data.profiles[i].id);
        expect(response[i].age).toEqual(data.profiles[i].age);
        expect(response[i].bloodgroup).toEqual(data.profiles[i].bloodgroup);
        expect(response[i].email).toEqual(data.profiles[i].email);
        expect(response[i].gender).toEqual(data.profiles[i].gender);
        expect(response[i].name).toEqual(data.profiles[i].name);
        expect(response[i].password).toEqual(data.profiles[i].password);
        expect(response[i].report).toMatchObject(data.profiles[i].report);
    }
});

//fetching detail based on the id
test("fetching a particular profile using id", () => {
    const response = getReports({ id: 3 });
    expect(response.length).toBe(1);
    expect(response[0].id).toEqual(data.profiles[2].id);
    expect(response[0].age).toEqual(data.profiles[2].age);
    expect(response[0].bloodgroup).toEqual(data.profiles[2].bloodgroup);
    expect(response[0].email).toEqual(data.profiles[2].email);
    expect(response[0].gender).toEqual(data.profiles[2].gender);
    expect(response[0].name).toEqual(data.profiles[2].name);
    expect(response[0].password).toEqual(data.profiles[2].password);
    expect(response[0].report).toMatchObject(data.profiles[2].report);
});

//fetching details of patients having age greater than a value
test("Fetching profiles having with age filter", () => {
    const response = getReports({ age: 35, type: "gte" });
    expect(response.length).toBe(3);
    for( let i = 0; i < response.length; i++)
        expect(response[i].age >= 35).toBeTruthy();
});

//fetching details of patients having age greater than a value
test("Fetching profiles having with age filter", () => {
    const response = getReports({ age: 39, type: "lte" });
    expect(response.length).toBe(3);
    for( let i = 0; i < response.length; i++)
        expect(response[i].age <= 39).toBeTruthy();
});

//fetching details based on the gender of the profiles
test("Fetching profiles based on gender", () => {
    const response1 = getReports({ gender: "male" });
    const response2 = getReports({ gender: "female" });
    expect(response1.length).toBe(3);
    expect(response2.length).toBe(2);
    for ( let i = 0; i < response1.length; i++)
        expect(response1[i].gender === "male").toBeTruthy();
    for ( let i = 0; i < response2.length; i++)
        expect(response2[i].gender === "female").toBeTruthy();
});

//calculating BMI of the patients
test("Calculating EMI of the patients", () => {
    const response = calculateBMI();
    response.forEach((res) => {
        if(res.id === 1){
            expect(res.bmi).toBe("22.86");
            expect(res.status).toBe("Normal");
        }
        if(res.id === 2){
            expect(res.bmi).toBe("18.83");
            expect(res.status).toBe("Under weight");
        }
        if(res.id === 3){
            expect(res.bmi).toBe("27.24");
            expect(res.status).toBe("Over weight");
        }
        if(res.id === 4){
            expect(res.bmi).toBe("23.36");
            expect(res.status).toBe("Normal");
        }
        if(res.id === 5){
            expect(res.bmi).toBe("22.66");
            expect(res.status).toBe("Normal");
        }
    })
})

//adding new patient with an existing email
test("Adding new partient with existing email", () => {
    const response = addReports({
        "id": 6,
        "name": "Patient 6",
        "age": 50,
        "email": "patient5@abc.com",
        "password": "Patient6@123",
        "gender": "male",
        "bloodgroup": "A-",
        "report": {
            "bp": "115/75",
            "weight": 70,
            "height": 175,
            "heartbeatrate": 75,
            "RBC": "4.40M",
            "WBC": "8500MCL"
        }
    });
    const reports = getReports({});
    expect(reports.length).toBe(5);
    expect(response).toMatchObject({error: "Patient with email id already exists"});
});

//adding a new patient report
test("Adding a new patient report to the json file", () => {
    const response = addReports(insertData);
    const reports = getReports({});
    expect(reports.length).toBe(6);
    expect(response).toMatchObject({message: "Added report successfully"});
});