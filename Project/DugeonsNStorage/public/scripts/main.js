/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

rhit.loginManager = null;
rhit.stats1Manager = null;
rhit.stats2Manager = null;
rhit.stats3Manager = null;
rhit.itemManager = null;
rhit.fbAuthManager = null;
rhit.characterPageController = null;
rhit.itemPageController = null;
rhit.FB_KEY_AUTHOR = "author";

function HTMLToListElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;

};

rhit.CharacterPageController = class {
	constructor() {
		rhit.loginManager.beginListening(this.updateList.bind(this));
		document.querySelector("#newCharacterButton").addEventListener("click", (event) => {
			rhit.loginManager.add(document.querySelector("#inputChar").value);
			this.updateList();
	
		});
	}

	_createCard(character) {
		return HTMLToListElement(`
        <div>${character.name}</div>`
			
		);
	}

	updateList(contains="") {

		const newList = HTMLToListElement('<div id="characters"></div>');
		for (let i =0; i < rhit.loginManager.length; i++){
			const char = rhit.loginManager.getCharacter(i);
			if (char.name.includes(contains)){
			const newCard = this._createCard(char);
			newCard.onclick = (event) => {
				//console.log(`You Clicked on ${mq.id}`);
				// rhit.storage.setMovieQuoteId(mq.id);

				window.location.href= `/stats1.html?id=${char.id}`;
			};


			newList.appendChild(newCard);
			}

			
		}

		const oldList = document.querySelector("#characters");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
};

rhit.updateList = function(contains) {
	rhit.characterPageController.updateList(contains);
}



rhit.Chracter = class {
	constructor(id, name) {
	  this.id = id;
	  this.name = name;
	}
};
   
rhit.LoginManager = class {
	constructor() {
	  this._documentSnapshots = [];
	  this._ref = firebase.firestore().collection("characters");
	}
	add(name) {  
		//console.log(`${quote} ${movie}`);
		this._ref.add({
			["class"]: "fighter 1",
			["author"]: rhit.fbAuthManager.uid,
			["EXP"]: 0,
			["alignment"]:'CN',
			["background"]: 'Soldier',
			["HP"]: 10,
			["maxHP"]: 10,
			["tempHP"]: 0,
			["AC"]: 12,
			["hitDice"]: '1d10',
			["speed"]: '30 ft',
			["hitDiceMax"]: '1d10',
			["strength"]: 	10,
			["dexterity"]:	10,
			["constitution"]:	10,
			["intelligence"]:	10,
			["wisdom"]:	10,
			["charisma"]:	10,
			["name"]: name}
			)
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.log("Error adding to doc: ", error);
		});
	}
	beginListening(changeListener) {   
		
		let query = this._ref.orderBy("name", "desc").limit(50);
		query = query.where(rhit.FB_KEY_AUTHOR, "==", rhit.fbAuthManager.uid);
		console.log(query);



		this._unsubscribe = query.onSnapshot((querySnapshot) => {
		this._documentSnapshots = querySnapshot.docs;
        // querySnapshot.forEach((doc) =>{
        //     console.log(doc.data());
		// });
		
		changeListener();
    });
	}
	stopListening() {    
		this._unsubscribe();
	}
	// update(id, quote, movie) {    }
	// delete(id) { }
	get length() { 
		return this._documentSnapshots.length;
	   }
	   getCharacter(index) {    
		const docSnapshot = this._documentSnapshots[index];
		const char = new rhit.Chracter(
			docSnapshot.id,
			docSnapshot.get("name"),
		);
		return char;
	}
};


rhit.Stats1PageController = class {
	constructor() {
		rhit.stats1Manager.beginListening(this.updateList.bind(this));
		document.getElementById("right").onclick = (event) => {
			rhit.stats1Manager.update();
			const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
			window.location.href= `/stats2.html?id=${urlParms.get("id")}`;
		}
		this.index = 0;
		document.querySelector("#delete").addEventListener("click", (event) => {
			console.log("test");
			console.log(rhit.stats1Manager);
			rhit.stats1Manager.delete();
	
		});
	}

	updateList(){
		const docSnapshot = rhit.stats1Manager._documentSnapshot;
		document.getElementById("inputClass").value = docSnapshot.get("class");;
		document.getElementById("inputEXP").value = docSnapshot.get("EXP");
		document.getElementById("inputAlignment").value = docSnapshot.get("alignment");
		document.getElementById("inputBackGround").value = docSnapshot.get("background");
		document.getElementById("inputHP").value = docSnapshot.get("HP");
		document.getElementById("inputMaxHP").value = docSnapshot.get("maxHP");
		document.getElementById("inputTempHP").value = docSnapshot.get("tempHP");
		document.getElementById("inputAC").value = docSnapshot.get("AC");
		document.getElementById("inputHitDice").value = docSnapshot.get("hitDice");
		document.getElementById("inputSpeed").value = docSnapshot.get("speed");
		document.getElementById("inputMaxHitDice").value = docSnapshot.get("hitDiceMax");
		rhit.stats1Manager.update();
	}


};
   
rhit.Stats1Manager = class {
	constructor() {
	  this._documentSnapshot = null;
	  const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
	  console.log(urlParms.get('id'));
	  this._ref = firebase.firestore().collection("characters").doc(urlParms.get('id'));
	// this._ref = firebase.firestore().collection("characters").doc("i9YTJ3Ipe2mAgZlLbTSp");

	  console.log(this._ref);
	}
	beginListening(changeListener) {   
		let query = this._ref;
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Current state: " + doc.data());
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		
		
		changeListener();
    });
	}
	stopListening() {    
		this._unsubscribe();
	}

	update(){
		this._ref.update({
		["EXP"]: document.getElementById("inputEXP").value,
		["alignment"]:document.getElementById("inputAlignment").value,
		["background"]: document.getElementById("inputBackGround").value,
		["HP"]: document.getElementById("inputHP").value,
		["maxHP"]: document.getElementById("inputMaxHP").value,
		["tempHP"]: document.getElementById("inputTempHP").value,
		["AC"]: document.getElementById("inputAC").value,
		["hitDice"]: document.getElementById("inputHitDice").value,
		["speed"]: document.getElementById("inputSpeed").value,
		["hitDiceMax"]: document.getElementById("inputMaxHitDice").value,
		["class"]: document.getElementById("inputClass").value
		});
	}

	delete(){
		this._ref.delete();
		window.location.href = `/characters.html`;

	}

};

rhit.Stats2PageController = class {
	constructor() {
		rhit.stats2Manager.beginListening(this.updateList.bind(this));
		document.getElementById("right").onclick = (event) => {
			rhit.stats2Manager.update();
			const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
			window.location.href= `/stats3.html?id=${urlParms.get("id")}`;
		}
		document.getElementById("left").onclick = (event) => {
			rhit.stats2Manager.update();
			const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
			window.location.href= `/stats1.html?id=${urlParms.get("id")}`;
		}
	}



	updateList() {
		const docSnapshot = rhit.stats2Manager._documentSnapshot;
		document.getElementById("inputStr").value = docSnapshot.get("strength");
		document.getElementById("inputDex").value = docSnapshot.get("dexterity");
		document.getElementById("inputCon").value = docSnapshot.get("constitution");
		document.getElementById("inputInt").value = docSnapshot.get("intelligence");
		document.getElementById("inputWis").value = docSnapshot.get("wisdom");
		document.getElementById("inputCha").value = docSnapshot.get("charisma");
		rhit.stats2Manager.update();
	}
};
   
rhit.Stats2Manager = class {
	constructor() {
	  this._documentSnapshot = null;
	  const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
	  this._ref = firebase.firestore().collection("characters").doc(urlParms.get('id'));
	// this._ref = firebase.firestore().collection("characters").doc("i9YTJ3Ipe2mAgZlLbTSp");

	  console.log(this._ref);
	}
	beginListening(changeListener) {   
		let query = this._ref;
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Current state: " + doc.data());
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		
		
		changeListener();
    });
	}
	stopListening() {    
		this._unsubscribe();
	}

	update(){
		this._ref.update({
		["strength"]: 	document.getElementById("inputStr").value,
		["dexterity"]:	document.getElementById("inputDex").value,
		["constitution"]:	document.getElementById("inputCon").value,
		["intelligence"]:	document.getElementById("inputInt").value,
		["wisdom"]:	document.getElementById("inputWis").value,
		["charisma"]:	document.getElementById("inputCha").value
		});
	}

};


rhit.Stats3PageController = class {
	constructor() {
		rhit.stats3Manager.beginListening(this.updateList.bind(this));
		document.getElementById("right").onclick = (event) => {
//			rhit.stats2Manager.update();
const queryString = window.location.search;
const urlParms = new URLSearchParams(queryString);
			window.location.href= `/stats4.html?id=${urlParms.get("id")}`;
		}
		document.getElementById("left").onclick = (event) => {
//			rhit.stats2Manager.update();
const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
			window.location.href= `/stats2.html?id=${urlParms.get("id")}`;
		}
	}



	updateList() {
		const docSnapshot = rhit.stats3Manager._documentSnapshot;
		document.getElementById("ath").value = rhit.toBonus(docSnapshot.get("strength"));
		document.getElementById("acro").value = rhit.toBonus(docSnapshot.get("dexterity"));
		document.getElementById("hist").value = rhit.toBonus(docSnapshot.get("intelligence"));
		document.getElementById("Arc").value = rhit.toBonus(docSnapshot.get("intelligence"));
		document.getElementById("inv").value = rhit.toBonus(docSnapshot.get("intelligence"));
		document.getElementById("Animal").value = rhit.toBonus(docSnapshot.get("wisdom"));
		document.getElementById("ins").value = rhit.toBonus(docSnapshot.get("wisdom"));
		document.getElementById("med").value = rhit.toBonus(docSnapshot.get("wisdom"));
		document.getElementById("des").value = rhit.toBonus(docSnapshot.get("charisma"));
		document.getElementById("intim").value = rhit.toBonus(docSnapshot.get("charisma"));
//		rhit.stats3Manager.update();
	}
};
   
rhit.Stats3Manager = class {
	constructor() {
	  this._documentSnapshot = null;
	  const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
	  this._ref = firebase.firestore().collection("characters").doc(urlParms.get('id'));
	// this._ref = firebase.firestore().collection("characters").doc("i9YTJ3Ipe2mAgZlLbTSp");

	  console.log(this._ref);
	}
	beginListening(changeListener) {   
		let query = this._ref;
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Current state: " + doc.data());
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		
		
		changeListener();
    });
	}
	stopListening() {    
		this._unsubscribe();
	}

	update(){
		this._ref.doc("BXAYxDYVRdgAXjmuErQT").update({
		["strength"]: 	document.getElementById("inputStr").value,
		["dexterity"]:	document.getElementById("inputDex").value,
		["constitution"]:	document.getElementById("inputCon").value,
		["intelligence"]:	document.getElementById("inputInt").value,
		["wisdom"]:	document.getElementById("inputWis").value,
		["charisma"]:	document.getElementById("inputCha").value
		});
	}

};


rhit.Stats4PageController = class {
	constructor() {
		rhit.stats4Manager.beginListening(this.updateList.bind(this));
// 		document.getElementById("right").onclick = (event) => {
// 			rhit.stats2Manager.update();
// 			window.location.href= `/stats4.html`;
// 		}
		document.getElementById("left").onclick = (event) => {
//			rhit.stats2Manager.update();
const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
			window.location.href= `/stats3.html?id=${urlParms.get("id")}`;
		}
	}



	updateList() {
		const docSnapshot = rhit.stats4Manager._documentSnapshot;
		document.getElementById("stl").value = rhit.toBonus(docSnapshot.get("dexterity"));
		document.getElementById("soh").value = rhit.toBonus(docSnapshot.get("dexterity"));
		document.getElementById("nat").value = rhit.toBonus(docSnapshot.get("intelligence"));
		document.getElementById("reg").value = rhit.toBonus(docSnapshot.get("intelligence"));
		document.getElementById("per").value = rhit.toBonus(docSnapshot.get("wisdom"));
		document.getElementById("ser").value = rhit.toBonus(docSnapshot.get("wisdom"));
		document.getElementById("perf").value = rhit.toBonus(docSnapshot.get("charisma"));
		document.getElementById("pers").value = rhit.toBonus(docSnapshot.get("charisma"));
//		rhit.stats3Manager.update();
	}
};
   
rhit.Stats4Manager = class {
	constructor() {
	  this._documentSnapshot = null;
	  const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
	  this._ref = firebase.firestore().collection("characters").doc(urlParms.get('id'));
	// this._ref = firebase.firestore().collection("characters").doc("i9YTJ3Ipe2mAgZlLbTSp");

	  console.log(this._ref);
	}
	beginListening(changeListener) {   
		let query = this._ref;
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Current state: " + doc.data());
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		
		
		changeListener();
    });
	}
	stopListening() {    
		this._unsubscribe();
	}

	update(){
		this._ref.doc("BXAYxDYVRdgAXjmuErQT").update({
		["strength"]: 	document.getElementById("inputStr").value,
		["dexterity"]:	document.getElementById("inputDex").value,
		["constitution"]:	document.getElementById("inputCon").value,
		["intelligence"]:	document.getElementById("inputInt").value,
		["wisdom"]:	document.getElementById("inputWis").value,
		["charisma"]:	document.getElementById("inputCha").value
		});
	}

};


rhit.toBonus = function(value){
	return (value % 2 == 1? (value-11)/2 : (value-10)/2 );
};



rhit.Item = class {
	constructor(id, name, quantity) {
	  this.id = id;
	  this.name = name;
	  this.quantity= quantity;
	}
};

rhit.updateItemList = function(contains){
	rhit.itemPageController.updateList(contains);
}

rhit.ItemsPageController = class {
	constructor() {
		rhit.itemManager.beginListening(this.updateList.bind(this));
		document.querySelector("#newItemButton").addEventListener("click", (event) => {
			rhit.itemManager.add(document.querySelector("#inputName").value, document.querySelector("#inputQnt").value);
			this.updateList();
	
		});
	}

	_createCard(item) {
		return HTMLToListElement(`
        <div>${item.name} ${item.quantity}</div>`
			
		);
	}

	updateList(contains="") {

		const newList = HTMLToListElement('<div id="items"></div>');
		for (let i =0; i < rhit.itemManager.length; i++){
			const item = rhit.itemManager.getItem(i);
			if (item.name.includes(contains)){
			const newCard = this._createCard(item);
			newList.appendChild(newCard);
			}
		}

		const oldList = document.querySelector("#items");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
};



rhit.ItemsManager = class {
	constructor() {
	  this._documentSnapshots = [];
	  this._ref = firebase.firestore().collection("items");
	}
	add(name, quantity) {  
		//console.log(`${quote} ${movie}`);
		const queryString = window.location.search;
	  	const urlParms = new URLSearchParams(queryString);
		this._ref.add({
		["name"]: name,
		["quantity"]: quantity,
		["owner"]: urlParms.get('id')})
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.log("Error adding to doc: ", error);
		});
	}
	beginListening(changeListener) {   
		const queryString = window.location.search;
	  	const urlParms = new URLSearchParams(queryString);
		let query = this._ref.orderBy("name", "desc").limit(50);
		query = query.where("owner", "==", urlParms.get('id'));
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
		this._documentSnapshots = querySnapshot.docs;
        // querySnapshot.forEach((doc) =>{
        //     console.log(doc.data());
		// });
		
		changeListener();
    });
	}
	stopListening() {    
		this._unsubscribe();
	}
	// update(id, quote, movie) {    }
	// delete(id) { }
	get length() { 
		return this._documentSnapshots.length;
	   }
	   getItem(index) {    
		const docSnapshot = this._documentSnapshots[index];
		const item = new rhit.Item(
			docSnapshot.id,
			docSnapshot.get("name"),
			docSnapshot.get("quantity")
		);
		return item;
	}
};

rhit.startFirebaseUI = function(){
	var uiConfig = {signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
	  ui.start('#firebaseui-auth-container', uiConfig);
	};

	rhit.LoginPageController = class {
		constructor(){
			document.querySelector("#rosefireButton").onclick = (event) => {
				rhit.fbAuthManager.signIn();
			};
		}
	}
	
	rhit.FbAuthManager = class {
		constructor() {
		  this._user = null;
		}
		beginListening(changeListener) {
	
	
			firebase.auth().onAuthStateChanged((user) => {
				console.log("test");
				this._user = user;
				changeListener();
				 
			  });
		}
		signIn() {
			console.log("sign in to rosefire");
			Rosefire.signIn("4c0020c3-7b63-4fff-b62a-17388b252d2a", (err, rfUser) => {
				if (err) {
				  console.log("Rosefire error!", err);
				  return;
				}
				console.log("Rosefire success!", rfUser);
				console.log("test1");
				console.log(" ",rfUser.token);
				console.log("test2");
	
	
	  firebase.auth().signInWithCustomToken(rfUser.token).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode === 'auth/invalid-custom-token') {
		  alert('The token you provided is not valid.');
		} else {
		  console.error(error);
		  console.log("Custom auth error ", errorCode, errorMessage);
		}
			  });
				// TODO: Use the rfUser.token with your server.
			  });
			  
		}
		signOut() {
			firebase.auth().signOut().then(() => {
				console.log("Sign-out successful.");
			  }).catch((error) => {
				console.log("An error happened.");
			  });
		}
		get isSignedIn() {
			return !!this._user;
		}
		get uid() {
			return this._user.uid;
		}
	   }
	   
	   rhit.checkForRedirect = function() {
		if(document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
			console.log("test");
			window.location.href = "/characters.html";
		}
		if(!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
			window.location.href = "/";
		}
	};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("auth change callback fired");
		rhit.checkForRedirect();
		if (document.querySelector("#loginPage")){
			new rhit.LoginPageController();
			rhit.startFirebaseUI();
		}
		if (document.querySelector("#characters")){
			rhit.loginManager = new rhit.LoginManager();
			rhit.characterPageController = new rhit.CharacterPageController();
		}
		if (document.querySelector("#inputClass")){
			rhit.stats1Manager = new rhit.Stats1Manager();
			new rhit.Stats1PageController();
		}
		if (document.querySelector("#inputStr")){
			rhit.stats2Manager = new rhit.Stats2Manager();
			new rhit.Stats2PageController();
		}
	
		if (document.querySelector("#ath")){
			rhit.stats3Manager = new rhit.Stats3Manager();
			new rhit.Stats3PageController();
		}
	
		if (document.querySelector("#nat")){
			rhit.stats4Manager = new rhit.Stats4Manager();
			new rhit.Stats4PageController();
		}
	
		if (document.querySelector("#items")){
			rhit.itemManager = new rhit.ItemsManager();
			rhit.itemPageController = new rhit.ItemsPageController();
		}
		
		if(!document.querySelector("#loginPage") && !document.querySelector("#characters")){
			
		document.querySelector("#menuShowAllQuotes").addEventListener("click", (event) => {
			const queryString = window.location.search;
	  		const urlParms = new URLSearchParams(queryString);
			window.location.href = `/items.html?id=${urlParms.get("id")}`;
		});
	
		document.querySelector("#menuShowMyQuotes").addEventListener("click", (event) => {
			const queryString = window.location.search;
	  const urlParms = new URLSearchParams(queryString);
			window.location.href = `/stats1.html?id=${urlParms.get("id")}`;
		});
	
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			const queryString = window.location.search;
	  		const urlParms = new URLSearchParams(queryString);
			window.location.href = `/characters.html`;
		});
		document.querySelector("#signOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			window.location.href = `/`;
		});
	}
		
	});
	
};

rhit.main();
