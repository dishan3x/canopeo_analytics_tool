(function(){
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAdVcNf7qD6xYm5VGAJS3qOJ-5hodXiTTY",
        authDomain: "canopeo-62727.firebaseapp.com",
        databaseURL: "https://canopeo-62727.firebaseio.com",
        projectId: "canopeo-62727",
        storageBucket: "canopeo-62727.appspot.com",
        messagingSenderId: "304996425996"
    };
    firebase.initializeApp(config);

    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');

    // Event listener for Login button
    btnLogin.addEventListener('click', function(e){
      firebase.auth().signInAnonymously();
    })

    // Event listener for Logout button
    // btnLogout.addEventListener('click', function(e){
    //   firebase.auth().signOut();
    // })

      // Event listener for Login button
      // btnGoUser.addEventListener('click', function(e){
      //   window.location.href = 'user.html';
      // })

    firebase.auth().onAuthStateChanged(function(firebaseUser){
      console.log(firebaseUser);
      if(firebaseUser){
        btnLogin.classList.add('is-invisible');
        window.location.href = 'user.html';
        //btnLogout.classList.remove('is-invisible');
        //btnGoUser.classList.remove('is-invisible');
       
      } else {
        //btnLogin.classList.remove('is-invisible')
        //btnLogout.classList.add('is-invisible');
        //btnGoUser.classList.add('is-invisible');
      }
    })
})();

