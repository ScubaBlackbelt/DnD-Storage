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
rhit.itemManager = null;

function HTMLToListElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;

};

rhit.LoginPageController = class {
	constructor() {
		rhit.loginManager.beginListening(this.updateList.bind(this));
	}

	_createCard(character) {
		return HTMLToListElement(`
        <div>${character.name}</div>`
			
		);
	}

	updateList() {

		const newList = HTMLToListElement('<div id="characters"></div>');
		for (let i =0; i < rhit.loginManager.length; i++){
			const char = rhit.loginManager.getCharacter(i);
			const newCard = this._createCard(char);

			newCard.onclick = (event) => {
				//console.log(`You Clicked on ${mq.id}`);
				// rhit.storage.setMovieQuoteId(mq.id);

				window.location.href= `/stats1.html`;
			};


			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#characters");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
};
  
rhit.Chracter = class {
	constructor(id, name) {
	  this.id = id;
	  this.name = name;
	}
};
   
rhit.LoginManager = class {
	constructor() {
	  this._documentSnapshots = [];
	  this._ref = firebase.firestore().collection("users/Pd1xguqc5bQ1UmgTbfZw/characters");
	}
	add(name) {  
		//console.log(`${quote} ${movie}`);
		this._ref.add({
		["name"]: name})
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.log("Error adding to doc: ", error);
		});
	}
	beginListening(changeListener) {   
		
		let query = this._ref.orderBy("name", "desc").limit(50);
		



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
			window.location.href= `/stats2.html`;
		}
	}



	updateList() {
		const docSnapshot = rhit.stats1Manager._documentSnapshots[0];
		let classObject = docSnapshot.get("class");
		let className = Object.getOwnPropertyNames(classObject);
		document.getElementById("inputClass").value = `${className} ${classObject[className]}`;
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
	  this._documentSnapshots = [];
	  this._ref = firebase.firestore().collection("users/Pd1xguqc5bQ1UmgTbfZw/characters");
	}
	beginListening(changeListener) {   
		let query = this._ref.orderBy("name", "desc").limit(50);
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

	update(){
		this._ref.doc("BXAYxDYVRdgAXjmuErQT").update({
		["EXP"]: document.getElementById("inputEXP").value,
		["alignment"]:document.getElementById("inputAlignment").value,
		["background"]: document.getElementById("inputBackGround").value,
		["HP"]: document.getElementById("inputHP").value,
		["maxHP"]: document.getElementById("inputMaxHP").value,
		["tempHP"]: document.getElementById("inputTempHP").value,
		["AC"]: document.getElementById("inputAC").value,
		["hitDice"]: document.getElementById("inputHitDice").value,
		["speed"]: document.getElementById("inputSpeed").value,
		["hitDiceMax"]: document.getElementById("inputMaxHitDice").value
		});
	}

};

rhit.Stats2PageController = class {
	constructor() {
		rhit.stats2Manager.beginListening(this.updateList.bind(this));
		document.getElementById("right").onclick = (event) => {
			rhit.stats2Manager.update();
			window.location.href= `/stats3.html`;
		}
		document.getElementById("left").onclick = (event) => {
			rhit.stats2Manager.update();
			window.location.href= `/stats1.html`;
		}
	}



	updateList() {
		const docSnapshot = rhit.stats2Manager._documentSnapshots[0];
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
	  this._documentSnapshots = [];
	  this._ref = firebase.firestore().collection("users/Pd1xguqc5bQ1UmgTbfZw/characters");
	}
	beginListening(changeListener) {   
		let query = this._ref.orderBy("name", "desc").limit(50);
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


rhit.Item = class {
	constructor(id, name, quantity) {
	  this.id = id;
	  this.name = name;
	  this.quantity= quantity;
	}
};

rhit.ItemsPageController = class {
	constructor() {
		rhit.itemManager.beginListening(this.updateList.bind(this));
	}

	_createCard(item) {
		return HTMLToListElement(`
        <div>${item.name} ${item.quantity}</div>`
			
		);
	}

	updateList() {

		const newList = HTMLToListElement('<div id="items"></div>');
		for (let i =0; i < rhit.itemManager.length; i++){
			const item = rhit.itemManager.getItem(i);
			const newCard = this._createCard(item);
			newList.appendChild(newCard);
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
	  this._ref = firebase.firestore().collection("users/Pd1xguqc5bQ1UmgTbfZw/characters/BXAYxDYVRdgAXjmuErQT/items");
	}
	add(name) {  
		//console.log(`${quote} ${movie}`);
		this._ref.add({
		["name"]: name})
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.log("Error adding to doc: ", error);
		});
	}
	beginListening(changeListener) {   
		
		let query = this._ref.orderBy("name", "desc").limit(50);
		



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

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#characters")){
		rhit.loginManager = new rhit.LoginManager();
		new rhit.LoginPageController();
	}
	if (document.querySelector("#inputClass")){
		rhit.stats1Manager = new rhit.Stats1Manager();
		new rhit.Stats1PageController();
	}
	if (document.querySelector("#inputStr")){
		rhit.stats2Manager = new rhit.Stats2Manager();
		new rhit.Stats2PageController();
	}

	if (document.querySelector("#items")){
		rhit.itemManager = new rhit.ItemsManager();
		new rhit.ItemsPageController();
	}

	document.querySelector("#menuShowAllQuotes").addEventListener("click", (event) => {
		window.location.href = "/items.html";
	});

	document.querySelector("#menuShowMyQuotes").addEventListener("click", (event) => {
		window.location.href = `/stats1.html`;
	});

	document.querySelector("#menuSignOut").addEventListener("click", (event) => {
		window.location.href = `/`;
	});
};

rhit.main();
