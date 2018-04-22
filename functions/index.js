const functions = require('firebase-functions')
const admin = require('firebase-admin')
const secureCompare = require('secure-compare')

admin.initializeApp()

exports.enableDoubleXP = functions.https.onRequest((req, res) => {
    const key = req.query.key
    const db = admin.database()

    const doubleXPRef = 'options/doublexplink'
    const newsImageRef = 'options/newsimage'
    const pointsRef = 'options/pointsPerQuestion'    

    if (!secureCompare(key, functions.config().cron.key)) {
        console.log('The key provided in the request does not match the key set in the environment. Check that', key,
            'matches the cron.key attribute in `firebase env:get`')
        res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.')
        return null
    }

    return db.ref(doubleXPRef).once('value').then( (snapshot) => {
        const doubleXPImage = snapshot.val()
        console.log(doubleXPImage)
        db.ref(newsImageRef).set(doubleXPImage)
        db.ref(pointsRef).set(2)
        res.send('Double XP enabled')
        return null
    })
        
})

exports.disableDoubleXP = functions.https.onRequest((req, res) => {
    const key = req.query.key
    const db = admin.database()

    const doubleXPRef = 'options/doublexpLink'
    const newsImageRef = 'options/newsimage'
    const pointsRef = 'options/pointsPerQuestion'    

    if (!secureCompare(key, functions.config().cron.key)) {
        console.log('The key provided in the request does not match the key set in the environment. Check that', key,
            'matches the cron.key attribute in `firebase env:get`')
        res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.')
        return null
    }

    db.ref(newsImageRef).set('')
    db.ref(pointsRef).set(1)
    res.send('Double XP disabled')

    return null
        
})

exports.resetWeeklyLeaderboard = functions.https.onRequest((req, res) => {
    const key = req.query.key    
    /*
    if (!secureCompare(key, functions.config().cron.key)) {
        console.log('The key provided in the request does not match the key set in the environment. Check that', key,
            'matches the cron.key attribute in `firebase env:get`')
        res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.')
        return null
    }
    */
    awardWeeklyWinners(res)
    
})

function awardWeeklyWinners(res) {
    const db = admin.database()
    const weeklyLeaderboardRef = 'weeklyLeaderboard'
    const userRef = 'users'
    const schoolRef = 'schools'
    const lastWipeRef = 'options/lastWipeTime'

    let getLastWipe = db.ref(lastWipeRef).once('value').then( (snapshot) => {
        return snapshot.val()
    })
    
    let getServerTime = db.ref("/.info/serverTimeOffset").once('value').then( (offset) => {
          return offset.val() || 0                        
    })
    
    let getUsers = db.ref(userRef).once('value').then( (snapshot) => {
        return snapshot.val()
    })
    
    let getLeaderboard = db.ref(weeklyLeaderboardRef).once('value').then( (snapshot) => {
        return snapshot.val()
    })

    return Promise.all([getLastWipe, getServerTime, getUsers, getLeaderboard]).then ( (results) => {
        const lastWipe = results[0]
        const serverTimeOffset = results[1]
        const userDB = results[2]
        const weeklyLeaderboard = results[3]

        if ( checkLastWipeTime(lastWipe) ) {
            for (subjectKey in weeklyLeaderboard) {            
                subjectBoard = weeklyLeaderboard[subjectKey]
                for (topic in subjectBoard) {
                    let path = [subjectKey, topic]
                    var topicBoard = subjectBoard[topic]
                    addUserInformation(topicBoard, userDB)
                    awardTopicStar( path, topicBoard )                
                }
            }

            res.send('Awards have been given and the DB has been wiped')
        } else {
            res.status(403).send("Last wipe was done too short a time ago")
        }    

        db.ref(lastWipeRef).set(admin.database.ServerValue.TIMESTAMP)
        return null
    })  
}

function checkLastWipeTime(lastWipe) {

    let currentDate = new Date()
    let wipeDate = new Date(lastWipe)    

    let daysDifference = currentDate.getDate() - wipeDate.getDate()

    return daysDifference >= 6
}

function addUserInformation (topicBoard, userDB) {
    for (person in topicBoard) {
        let user = userDB[person]
        topicBoard[person] = {
            key: person,
            name: user.displayName,
            score: topicBoard[person],
            school: user.school }
    }
}

function awardTopicStar (path, topicBoard) {

    let topic = path[1]
    let subject = path[0]

    // Change the topic object into an array
    topicArray = Object.values(topicBoard)

    // Get all the unique schools from the users of the topic array
    const schools = [...new Set(topicArray.map(topicArray => topicArray.school))];

    for (i in schools) {
        let school = schools[i]
        schoolTopicArray = topicArray.filter( (user) => user.school === school ? true : false)                

        schoolTopicArray.sort( (a,b) => b.score-a.score )

        let topScore = schoolTopicArray[0].score
        let winners = schoolTopicArray.filter( (user) => user.score === topScore )

        for (let j in winners ) {
            let winnerKey = "weeklyRewards/" + winners[j].key + "/" + path.join("/") + "/rewardLevel"
               //console.log(winnerKey)     
               /*                                  
               db.ref(winnerKey).transaction( (rewardLevel) => {
                   if (rewardLevel) {
                     rewardLevel = rewardLevel + 1
                   }
                   else {
                     rewardLevel = 1;
                   }
                   return rewardLevel;
               });
               */
                                                                                                                   
           
            if (topic === "Overall" && subject === "Computer Science") {              
              let overallWinnerKey = "weeklyRewards/" + winners[j].key + "/winner"
              console.log("Overall winner:", school, winners[j].name)
              console.log(overallWinnerKey)
             //winnerPromiseArray.push( db.ref(overallWinnerKey).set("school") )
            }
                                                                                                  
        }        
    }
}
