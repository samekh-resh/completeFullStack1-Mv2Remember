//creating an app that searches movies by genre, bringing you a list of movies, then when you click the save button, it saves it to your 'to watch' list
//how do I indicate a user has added a movie to my app


// let backButton = document.querySelector('.toSearchPage')
var saveMovie = document.getElementsByClassName("fa-ticket");
let likedMovie = document.getElementsByClassName("fa-heart")
let dislikedMovie = document.getElementsByClassName("fa-times")
// backButton.addEventListener('click', ()=>{
//   console.log('well..')
//   fetch('toSearchPage', {
//     method: 'get',
//     headers: {'Content-Type': 'application/json'}

//   })
//   // .then(response => {
//   //   if (response.ok) return response.json()
//   // })
//   console.log('well')

// })

// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
// var trash = document.getElementsByClassName("fa-trash");

Array.from(saveMovie).forEach(function(element) {
      element.addEventListener('click', function(){
        const title = this.parentNode.parentNode.childNodes[1].innerText //the variables need to change
        const genre = this.parentNode.parentNode.childNodes[3].innerText
        const year = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        const email = document.querySelector('.email').innerText
        console.log(email)
        fetch('saveMovie', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'email': email,
            'title': title,
            'genre': genre,
            'year': year

          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});//show it by the email that's showing up
//you want the information to be an array of objects, instead of it's won separate objects

//like button, i'm not too sure I understand what to do here with the like button, an app.put request? 
  //what do you want to happen, it turns a shade of green when it's clicked. 
Array.from(likedMovie).forEach(function(element) {
  element.addEventListener('click', function(){
    const title = this.parentNode.parentNode.childNodes[1].innerText //the variables need to change
    const genre = this.parentNode.parentNode.childNodes[3].innerText
    const year = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('watchedMovies', {//not sure I understand where this route goes
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'title': title,
        'genre': genre,
        'year': year,
        'liked': true
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

//dislike button//same with this one, i'm confused between an app.delete or an app.post. 
//turns a shade of red, I would actually like to have a page of movies liked vs movies disliked? 
Array.from(dislikedMovie).forEach(function(element) {
  element.addEventListener('click', function(){
    const title = this.parentNode.parentNode.childNodes[1].innerText //the variables need to change
    const genre = this.parentNode.parentNode.childNodes[3].innerText
    const year = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)

    fetch('watchedMovies', {//not sure I understand where this route goes
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'title': title,
        'genre': genre,
        'year': year,
        'liked': false
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});



// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     fetch('thumbDown', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbUp':thumbUp,
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
