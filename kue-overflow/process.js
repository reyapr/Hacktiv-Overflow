const kue = require('kue')
    , queue = kue.createQueue()


queue.process('email',function(job,done){
    email(job.data,done)
})

function email(job,done){
    return done()
}