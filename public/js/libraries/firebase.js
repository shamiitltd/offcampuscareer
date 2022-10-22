const firebaseConfig = {
    apiKey: "AIzaSyCHRMXf_TMZ1X9mL4T19webOcAj9B_p_NQ",
    authDomain: "offcampuscareer-oc2.firebaseapp.com",
    projectId: "offcampuscareer-oc2",
    storageBucket: "offcampuscareer-oc2.appspot.com",
    messagingSenderId: "533951297836",
    appId: "1:533951297836:web:9f96fb353d14e486a31489",
    measurementId: "G-TX79223E11"
};

// Initialize Firebase
const offcampuscareerProject = firebase.initializeApp( firebaseConfig );

const login_button = document.querySelectorAll( ".login_b" );
// firebase.auth().onAuthStateChanged((user) => {
//     // console.log(location);
//     if (user) {
//         // User is signed in, see docs for a list of available properties
//         // https://firebase.google.com/docs/reference/js/firebase.User
//         let uid = user.uid;
//         login_button[0].textContent = "Sign Out"
//         login_button[1].textContent = "Sign Out"
//         if (location.pathname === "/signin" || location.pathname === "/signin/") {
//             location.pathname = "/";
//         }
//     } else {
//         if (location.pathname !== "/signin" && location.pathname !== "/signin/") {
//             location.pathname = "/signin";
//         }
//         // User is signed out
//     }
// });
login_button[ 0 ].addEventListener( 'click', ( event ) => {
    signOutUser();
} )
login_button[ 1 ].addEventListener( 'click', ( event ) => {
    signOutUser();
} )

function signOutUser() {
    // signOut();
    firebase.auth().signOut().then( () => {
        // Sign-out successful.
    } ).catch( ( error ) => {
        // An error happened.
    } );
}