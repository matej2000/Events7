// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { collection, addDoc, getFirestore, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
import {firebaseHelper} from "./firebaseHelper.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let fire = new firebaseHelper();

// Initialize Firebase
const app2 = initializeApp(fire.firebaseConfig);
const analytics = getAnalytics(app2);
const db = getFirestore();

let ref = collection(db,"Event");
let myId = doc(ref).id;

const querySnapshot = await getDocs(collection(db, "Event"));
let events = [];
querySnapshot.forEach((doc) => {
  let event = doc.data();
  event["id"] = doc.id;
  events.push(event);
});

var app = new Vue({
    el: '#app',
    components: { Multiselect: window.VueMultiselect.default },
    data () {
      return {
        events: events,
        related: [],
        searchEvents: [
            { id:"1", name:"click-event", description:"blablabala",type:"app",priority:"0", related_events: ""},
            { id:"2", name:"click-event2", description:"blablabala",type:"app",priority:"0", related_events: "assa"}
          ],
        search: "",
        priority: 5,
        priorities: [0,1,2,3,4,5,6,7,8,9,10],
        type: "app",
        types: ["crosspromo", "liveops", "app", "ads"],
        dbV: db,
        id: myId,
        name: "",
        description: "",
        idErr: " ",
        nameErr: " ",
        descriptionErr: " "   
      };
    },

    methods: {

      checkInputs(){
        const check = [this.id, this.name, this.description, this.type, this.priority];
        let index = [];
        for (let i = 0; i < check.length; i++) {
          if(this.isEmpty(check[i])){
            index.push(i);
          }
        }
        for(let i of index) {
          switch(i){
            case 0: this.idErr = "Invalid id"; break;
            case 1: this.nameErr = "Invalid name"; break;
            case 2: this.descriptionErr = "Invalid description"; break;
          }
        }
        if(!this.uniqueId()){
          this.idErr = "Id not unique";
        }
        return index.length == 0;
      },

      async insertEventDB(){
        if(this.checkInputs()){
          let related_events2 ="";
          if (this.related.length >0 ){
            related_events2 = this.related[0].name;
            for (let i = 1; i < this.related.length; i++){
              related_events2 += "," + this.related[i].name;
            }
          }
          try {
            let a = collection(db, "Event");
            let b = doc( a, this.id);
            const docRef = await setDoc(b, {
              name: this.name,
              description: this.description,
              type: this.type,
              priority: this.priority,
              related_events: related_events2
            });
            alert("Event created");
            location.reload();
          } catch (e) {
            alert("Error: " + e);
            console.error("Error adding document: ", e);
          }
        }
      },

      isEmpty(str){
        return !str || str.length === 0 ;
      },
      
      uniqueId(){
        for(let event of this.events){
          if(event.id == this.id){
            return false;
          }
        }
        return true;
      }
    }
  });

