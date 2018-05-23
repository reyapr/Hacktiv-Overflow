const kue = require('kue')
    , queue = kue.createQueue()
    
    
    let job = queue.create('email', {
        title: 'coba kue',
        to:'rey@gmail.com',
        template:'hai'
    }).save(err=>{
        process.exit()
    })