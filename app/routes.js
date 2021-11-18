
module.exports = function (app, passport, db) {

  const ObjectID = require('mongodb').ObjectID
  const fetch = require('node-fetch')
  //routes
  const api_key = process.env.API_KEY
  const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate%27&with_genres=`


  // normal routes ===

  //renders homepage
  app.get('/', (req, res) => {
    res.render('index.ejs', { users: req.users })

  })
  // app.get('/', (req, res) => {
  //   res.render('index.ejs')
  // })

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // app.get('/')

  //how do we add infinite movies?
  //route to render the search pages and movie searches
  app.get('/search', isLoggedIn, (req, res) => {
    fetch(`${movieUrl}${req.query.genre}`)
      .then(response => response.json())
      .then(movies => {

        // console.log(movies)
        // console.log(movies.length)
        console.log('this is the movie result', movies.results)
        console.log(req.user)
        res.render('searchResults.ejs', {movies: movies.results, user: req.user })
      })
  })

  app.get('/savedMovies', (req, res) => {
        console.log(req.user)
        res.render('moviesSaved.ejs', { user: req.user})
      
  })

  app.put('/saveMovie', isLoggedIn, (req, res) => {
    const { title, genre, year } = req.body
    console.log(req.body)
    db.collection('users').findOneAndUpdate({ _id: req.user._id }, {
      $push: {
        savedMovies: {
          // email: email,
          title: title,
          genre: genre,
          year: year
        }
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })
  
  app.put('/watchedMovies', isLoggedIn, (req, res) => {
    const { title, genre, year, liked } = req.body
    console.log(req.body)
    db.collection('users').findOneAndUpdate({ _id: req.user._id }, {
      $push: {
        likedMovies: {
          // email: email,
          title: title,
          genre: genre,
          year: year,
          like: liked
        }
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    })

  })
  

  app.get('/movieSearchPage', isLoggedIn, (req, res) => {
    res.render('movieSearchPage.ejs')
  })

  //route for the like button
  app.put('/watchedMovies', (req, res) => {
    const { title, genre, year, liked } = req.body
    db.collection('users')
      .findOneAndUpdate({ title: title, genre: genre, year: year }, {
        $set: {
          // "likedMovies.$[likedMovies]": liked
          liked: liked
          // thumbDown:req.body.thumbDown - 1
        }
      }, {
        sort: { _id: -1 },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
      // res.render('moviesSaved.ejs', {users:results} )
  })
  

  // app.post('/messages', (req, res) => {
  //   db.collection('messages').insertOne({ name: req.body.name, msg: req.body.msg, thumbUp: 0 }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/')
  //   })
  // })

  // app.put('/messages', (req, res) => {
  //   db.collection('messages')
  //     .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
  //       $set: {
  //         thumbUp: req.body.thumbUp + 1
  //         // thumbDown:req.body.thumbDown - 1
  //       }
  //     }, {
  //       sort: { _id: -1 },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })

  // app.put('/thumbDown', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp - 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/movieSearchPage');
    });
  });

}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
