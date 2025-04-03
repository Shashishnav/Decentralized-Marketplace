import { initializeApp } from 'firebase/app';
import {FacebookAuthProvider,GithubAuthProvider, GoogleAuthProvider,getAuth, TwitterAuthProvider} from 'firebase/auth'
 const firebaseConfig = {
    apiKey: "AIzaSyBiCRK69avbm0A1wU0dOnbXLYqWQqEp08o",
    authDomain: "dekart-d71d1.firebaseapp.com",
    databaseURL: "https://dekart-d71d1-default-rtdb.firebaseio.com",
    projectId: "dekart-d71d1",
    storageBucket: "dekart-d71d1.appspot.com",
    messagingSenderId: "372537643662",
    appId: "1:372537643662:web:64a4c54a92de68f051afdf",
    measurementId: "G-PLSJFEEGGW"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const Gprovider = new GoogleAuthProvider
  const Fbprovider = new FacebookAuthProvider
  const Gitprovider = new GithubAuthProvider
  const Twprovider = new TwitterAuthProvider
  export {auth, Gprovider, Fbprovider, Gitprovider,Twprovider}
