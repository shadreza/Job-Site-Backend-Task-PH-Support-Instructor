const express = require('express');
const port = process.env.PORT || 5055;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express()
app.use(cors());
app.use(bodyParser.json());

const addData = (url,collection) => {
  app.post(`/${url}` ,(req, res) => {
    const addData = req.body;
    collection.insertOne(addData)
    .then(result=>{
      console.log("successfully inseterd for ",result.insertedCount);
      res.send(result.insertedCount>0)
    })
    .catch(e=>{
      console.log("data could not be inserted for \n",e);
    })
  })
}

const jobsDatabseURL = `mongodb+srv://${process.env.databaseUser}:${process.env.databasePassword}@hay-store-cluster-01.coi91.mongodb.net/${process.env.courseDatabase}?retryWrites=true&w=majority`
const jobsClient = new MongoClient(jobsDatabseURL, { useNewUrlParser: true, useUnifiedTopology: true });

jobsClient.connect((err) => {
  const courseCollection = jobsClient.db(process.env.jobsDatabase).collection("dummy-jobs");
  app.get('/jobs', (req, res) => {
    courseCollection.find()
      .toArray()
      .then(items =>{
        res.send(items);
      })
  })
  
  addData('addCourse' , courseCollection);
  
  app.delete('/deleteCourse/:id' , (req,res) =>{
    courseCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then(result=>{
      console.log('removed successully');
    })
    .catch(e=>[
      console.log('could not be removed')
    ])
  })

})


app.get('/', (req, res) => {
  res.send('Job Site Locally Connected')
})

app.listen(port, () => {
  console.log(`Job Site listening at http://localhost:${port}`)
})