# VidyaVichara
vidhyavichara project --

# Problem statement: 

# Tech stack : 

    Frontend : React
    Backend : Express, Node.js
    Database : Monogb
    Web sockets for realtime communicatoin.



# Requirements : 



# Approach  (Techical): 

    1. Created A server with Nodejs backend. 
    2. Connected websockets with the same server for realtime communcation.
    3. Integrated mongodb backend for persistent storage
    4. Used react for Front-end and fetching/pushing updates from backend server.

  ---------------- Functionalities ---Teacher 

    Teacher can post answers , create lectures , and changes pushed through http request and client can listen for changes using websockets on different events. 
    (Post answer, Listen question, Add resource, Add lecture)
    Resources are stored physically on server . metadata is stored in mongodb.


 ---------------   Functionalities-- Student: 
    Student can join lectures,
    post questions in lectures using socket,
    see the resources and answers added by teachers .. 
    
# Limitations: 
