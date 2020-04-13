// Your web app's Firebase configuration
var firebaseConfig = 
{
	apiKey: "AIzaSyDxV4yqlAmYT8tw8LqTtYlMQngYs10795o",
	authDomain: "pcsocialfly.firebaseapp.com",
	databaseURL: "https://pcsocialfly.firebaseio.com",
	projectId: "pcsocialfly",
	storageBucket: "pcsocialfly.appspot.com",
	messagingSenderId: "504886406716",
	appId: "1:504886406716:web:cfa353851c80e9b1625d39",
	measurementId: "G-9K0EP0RX5E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

try {
  let app = firebase.app();
  let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
  document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
} catch (e) {
  console.error(e);
  document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
}