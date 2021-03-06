import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { collection, addDoc, getFirestore, doc, setDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
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

const querySnapshot = await getDocs(collection(db, "Event"));
let events = [];
let changes = {};
let names = [];
querySnapshot.forEach((doc) => {
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
            events: events,
            searchEvents: events,
            priorities: [0,1,2,3,4,5,6,7,8,9,10],
            types: ["crosspromo", "liveops", "app", "ads"],
            names: names,
            search: "",
            pageNumber: 1,
            eventsOnPage: 10,
            page: events.slice(0, 10),
            pageSelect: [5,10,25,50,100]
        
        };
    },
    
    methods: {
        edit(id){
            this.changes[id] = true;
        },

        confirm(event){
            this.updateEventDB(event);
            this.changes[event.id] = false;
        },

        updateSearchEvents(){
            this.searchEvents = [];
            for (let event of this.events){
              if(event.name.toLowerCase().includes(this.search.toLowerCase())){
                this.searchEvents.push(event);
              }
            }
            this.eventsOnPageChange();
        },

        validRelatedNames(event){
            let newEvents = [];
            for(let i = 0; i < this.events.length; i++){
                if(this.names[i] != event.name && !this.events[i].related_events.includes(event.name)){
                    newEvents.push(this.names[i]);
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
            } catch (e) {
                alert("Error: " + e);
                console.error("Error adding document: ", e);
            }
        },

        async deleteEventDB(id){
            try{
                await deleteDoc(doc(db, "Event", id));
                this.removeEventFromArray(id);
            } catch (e){
                alert("Error: " + e);
                console.error("Error deleting document: ", e);
            }
        },

        removeEventFromArray(id){
            for(let i = 0; i < this.events.length; i++){
                if(this.events[i].id === id){
                    this.events.splice(i, 1);
                    delete this.changes[i];
                    this.updateSearchEvents();
                    return;
                }
            }
        },

        eventsOnPageChange(){
            this.pageNumber = 1;
            this.updatePage();
        },

        updatePage(){
            let firstEvent = (this.pageNumber-1) * this.eventsOnPage;
            this.page = this.searchEvents.slice(firstEvent, firstEvent + this.eventsOnPage);
        },

        nextPage(){
            this.pageNumber++;
            this.updatePage();
        },

        previousPage(){
            this.pageNumber -= 1;
            this.updatePage();
        },

        maxPages(){
            return Math.ceil(this.searchEvents.length/this.eventsOnPage);
        }

    }
});