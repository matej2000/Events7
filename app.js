import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { collection, addDoc, getFirestore, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvfMup52PvgCmOkM-g8q3qKWLyUc-Upwg",
    authDomain: "events7-746d1.firebaseapp.com",
    projectId: "events7-746d1",
    storageBucket: "events7-746d1.appspot.com",
    messagingSenderId: "947986393601",
    appId: "1:947986393601:web:81a5920705a0b84bbd2e00",
    measurementId: "G-4QF94GN2TZ"
};

// Initialize Firebase
const app2 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app2);
const db = getFirestore();

const querySnapshot = await getDocs(collection(db, "Event"));
let events = [];
let changes = {};
let names = [];
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    let event = doc.data();
    event["related_events"] = event["related_events"].split(",");
    
    event["id"] = doc.id;
    events.push(event);
    changes[doc.id] = false;
    names.push(event.name);
});

var app = new Vue({
    el: '#app',
    components: { Multiselect: window.VueMultiselect.default },
    data () {
      return {
    changes: changes,
    /*events: [
        { id:"1", name:"click-event", description:"blablabala",type:"app",priority:"0", related_events: ""},
        { id:"2", name:"click-event2", description:"blablabala",type:"app",priority:"0", related_events: "assa"}
    ],*/
    events: events,
    searchEvents: events,
    priorities: [0,1,2,3,4,5,6,7,8,9,10],
    types: ["crosspromo", "liveops", "app", "ads"],
    names: names,
    search: ""
        
        };
    },
    methods: {
        edit(id){
            console.log(id);
            this.changes[id] = true;
        },

        confirm(event){
            // TODO: show error, check if data was changed and update database
            this.updateEventDB(event);
            this.changes[event.id] = false;
        },

        updateSearchEvents(){
            this.searchEvents = [];
            console.log(this.search);
            for (let event of this.events){
              if(event.name.includes(this.search)){
                this.searchEvents.push(event);
              }
            }
        },

        /*relatedNames(event){
            return event.related_events.split(",");
        }*/

        vlidRelatedNames(event){
            let newEvents = [];
            for(let name of this.names){
                if(name != event.name){
                    newEvents.push(name);
                }
            }
            return newEvents;
        },
        
        async updateEventDB(event){
            
            try {
                let a = collection(db, "Event");
                let b = doc( a, event.id);
                const docRef = await setDoc(b, {
                    name: event.name,
                    description: event.description,
                    type: event.type,
                    priority: event.priority,
                    related_events: event.related_events.join(',')
                });
                console.log("Document written with ID: ", event.id);
            } catch (e) {
                alert("Error: " + e);
                console.error("Error adding document: ", e);
            }
            
        }

    }
});