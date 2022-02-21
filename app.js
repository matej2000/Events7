var app = new Vue({
    el: '#app',
    components: { Multiselect: window.VueMultiselect.default },
    data () {
      return {
        events: [
            { id:"1", name:"click-event", description:"blablabala",type:"app",priority:"0", related_events: ""},
            { id:"2", name:"click-event2", description:"blablabala",type:"app",priority:"0", related_events: "assa"}
          ],
        related: [],
        searchEvents: [
            { id:"1", name:"click-event", description:"blablabala",type:"app",priority:"0", related_events: ""},
            { id:"2", name:"click-event2", description:"blablabala",type:"app",priority:"0", related_events: "assa"}
          ],
        search: "",
        priority: 5,
        priorities: [0,1,2,3,4,5,6,7,8,9,10]
        


      };
    },
    methods: {
      containsId(id){
        for (let event of this.related){
          if(event==id){
            return true;
          }
        }
        return false;
      },

      addRelated(id){
        console.log(id);
        this.related.push(id);
      },

      getEvent(id){
        for (let event of this.events){
          if(event.id==id){
            return event;
          }
        }
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

      remove(id){
        for(let i = 0; i < this.related.length; i++){
          if(id == this.related[i]){
            this.related.splice(i, 1);
            return;
          }
        }
      }

    }
  })