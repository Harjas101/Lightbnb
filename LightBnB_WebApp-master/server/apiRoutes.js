module.exports = function(router, database) {

  router.get('/properties', (req, res) => {
    console.log('/properties')
    database.getAllProperties(req.query, 20)
    .then(properties => {
      console.log('This is my properties', properties)
      res.send({properties})
    })
    .catch(e => {
      console.error(e);
      res.send(e)
    }); 
  });

  router.get('/reservations', (req, res) => {
    console.log('/reservations')
    const userId = req.session.userId;
    if (!userId) {
      res.error("💩");
      return;
    }
    database.getAllReservations(userId)
    .then(reservations => {
      console.log('this is my reserv', reservations)
      res.send({reservations})
    } 

    )
    .catch(e => {
      console.error(e);
      res.send(e)
    });
  });

  router.post('/properties', (req, res) => {
    const userId = req.session.userId;
    console.log(req.body)
    database.addProperty({...req.body, owner_id: userId})
      .then(property => {
        res.send(property);
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
  });

  return router;
}