// firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         var user = firebase.auth().currentUser
//         if(user != null){
//             console.log(user)
//         }
//     } else {
//         // No user is signed in.
//     }
// });

// function login() {
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password").value;

//     firebase.auth().signInWithEmailAndPassword(email, password)
//         .then(function (result) {
//             console.log(result)
//         })
//         .catch(function (error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             // ...
//             console.log(errorCode, errorMessage)
//         });
// }