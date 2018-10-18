'use strict';

var Fish = class Fish  {

  constructor(type, data) {
    this.type = type;

    if (data == undefined)
      this.data = {};
    else
      this.data = data;

  }
}

var River = class River  {
    constructor(name, data) {
      this.name = name;
      this.data = data;
      this.fishes = [];
      this.nets = [];
      this.caughtFish = [];
    }

    toString() {

      var str;

      str = "--------------------\n"

      for(var k=0; k<this.fishes.length; k++) {
          var fish = this.fishes[k];
           str += " " + fish.type + " ";
        }

      str += "\n--------------------\n"

      return str;
    }

    dropFish( type, data ) {
      var fish = new Fish(type,data);
      this.dropFishes( [fish] );
    }

    dropFishes( fish ) {

        var types = "";
        for(var i=0; i<fish.length;i++) {
          types += fish[i].type + ","
        }
       this.fishes = this.fishes.concat( fish );

       this.checkNets();
    }

    addNet( requiredFish, callback ) {
       this.nets.push( { requiredFish : requiredFish, callback: callback } );
       this.checkNets();
    }

    isEmpty() {
      return (this.caughtFish.length == 0);
    }

    fishRemaining() {
      return this.caughtFish.length ;
    }

    release( fish ) {
      if (!Array.isArray(fish)) {
        var index = this.caughtFish.indexOf(fish);
        if (index>=0)
          this.caughtFish.splice( index,1 );

        return;
      }

      for(var i=0; i<fish.length;i++) {

        var index = this.caughtFish.indexOf(fish[i]);
        if (index>=0)
          this.caughtFish.splice( index,1 );
      }
    }


    checkNets() {

      // have any nets caught anything?
      for(var i=0; i<this.nets.length; i++) {
           var net = this.nets[i];

           var matchedFish = [];

           for(var j=0; j<net.requiredFish.length; j++) {
             var requiredFish = net.requiredFish[j];

             for(var k=0; k<this.fishes.length; k++) {
                 var fish = this.fishes[k];

                 if (fish.type == requiredFish && matchedFish.indexOf(fish)==-1) {
                    matchedFish.push( fish );
                    break;
                 }
             }

           }

           if (matchedFish.length == net.requiredFish.length) {

               // remove the caughtFish from the river
               for( var i=0; i<matchedFish.length; i++) {
                 var fish = matchedFish[i];
                 this.caughtFish.push(fish);

                 this.fishes.splice( this.fishes.indexOf(fish),1 );
               }

               if (matchedFish.length == 1)
                 net.callback( this, matchedFish[0] );
               else
                 net.callback( this, matchedFish );



           }
      }

    }
}

try {
  window.River = River;
  window.Fish = Fish;
} catch(e) {
}

try {
  module.exports.River = River;
  module.exports.Fish = Fish;
} catch(e) {
}
