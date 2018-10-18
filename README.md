# fish
Ultra-simple Javascript async library


Fish allows you to do (almost!) everything you can with Promises, but in an amazingly simple way.

The idea is simple.  Imagine a river with different types of fish swimming in it.  There are nets in the river designed to catch different types of fish.  Each type of fish represents a different task required in your code. When a fish is caught by a net, the task represented by the fish is performed. At any time you can drop more fish into the river to represent more tasks to be performed.

## Hello World
Let's start with a simple example:

```
var river = new River();

river.addNet( [ "printHello" ], function( river, fish) {
    console.log( "Hello!" );
})

river.dropFish( "printHello" );
```

The first thing to do is create a river, then add a net to catch a certain type of fish, in this case "printHello".

When you drop a fish into the river, this fish will be caught by the net and it will print hello.

## Sequential tasks

To perform a sequence of tasks, for example getting data from a url, then outputting the result. In this example, the `getData` function is asynchronous, and returns the response via a callback.

```
var river = new River();

river.dropFish( "getData" );

river.addNet( [ "getData" ], function( river, fish) {
    getData( url, function(response) {
        river.dropFish( "printOutput", { json: response } );
    })
})

river.addNet( [ "printOutput" ], function( river, fish) {
    console.log( fish.data.json );
})

```

This example also demonstrates how you can attach data to the fish.  When the "printOutput" fish is dropped, the response is added. This response is referenced in the "printOutput" net, by `fish.data`.

## Concurrent tasks

```
var river = new River();

river.dropFish( "getUser", { uid: "123" } );
river.dropFish( "getProduct", { pid: "456" } );

river.addNet( [ "getUser" ], function( river, fish) {
    getUser( fish.data.uid, function(user) {
        river.dropFish( "user", { user: user } );
    })
})

river.addNet( [ "getProduct" ], function( river, fish) {
    getProduct( fish.data.pid, function(user) {
        river.dropFish( "product", { product: product } );
    })
})

river.addNet( [ "user", "product" ], function( river, fish) {
    var userFish = fish[0].user;
    var productFish = fish[1].user;

    console.log(  "User:",userFish.data.user, "Product:", productFish.data.product );
})
```

This example demonstrates dropping two fish at the same time (getUser and getProduct). This will cause both nets to catch the fish and perform the tasks concurrently. As each one completes, each drops a fish.  The last net *only* catches both fish (i.e. it waits for both tasks to complete).  The result here is that the user and product are only output after both the async requests have completed.

## For-loops

```
var river = new River();

river.dropFish( "getUserList" );

river.users = [];

river.addNet( ["getUserList"], function(river, fish) {

   getUidList()

   .then( function(users) {
      for(var i=0; i<users.length; i++) {
         river.dropFish("getUser", { uid : users[i] }  )
      }
      river.release(fish);
    })
})

river.addNet( ["getUser"], function(river, fish) {
   getUser( fish.data.uid , function(user) {
      river.users.push( user );
      river.release(fish);

      if (river.fishRemaining()==0) {
         console.log( river.users );
      }
   })
})

```

This example demonstrates how a for-loop can be used to drop many fish of the same type. The net will catch each one and concurrently perform the tasks. This also demonstrates how functions that return Promises can be used.

In this example is the use of `release` and `fishRemaining`. These are used to control when series of tasks are completed. When a fish is caught in a net, it hangs around until it is released. By asking the river how many fish are remaining, when this reaches zero it shows that there are no more tasks pending.

# Usage

## Webpage
```
<script src="/js/fish.js"></script>
<script>

  var river = new River();

  river.addNet( [ "printHello" ], function( river, fish) {
      console.log( "Hello!" );
  })

  river.dropFish( "printHello" );

</script>
```

## Node
```
import {River,Fish} from "fish.js"

var river = new River();

river.addNet( [ "printHello" ], function( river, fish) {
    console.log( "Hello!" );
})

river.dropFish( "printHello" );

```
