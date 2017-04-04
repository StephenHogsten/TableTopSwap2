This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Description
1. User Story: I can view all books posted by every user.
2. User Story: I can add a new book.
3. User Story: I can update my settings to store my full name, city, and state.
4. User Story: I can propose a trade and wait for the other user to accept the trade.

[FCC link](https://www.freecodecamp.com/challenges/manage-a-book-trading-club)

I'll have mine based no board games instead (use the board game geek api: https://boardgamegeek.com/wiki/page/BGG_XML_APIf)

# What I want to learn in this project
1. React-router.  this lets you specify paging within a single page app (?)
2. Material Design.  This project has to have big lists of stuff, so I can really imitate things like the music player.  I should make more specifically how it should look / behave ahead of time, and then actually hold myself to that design.
3. Prototyping for React components
4. Passport Local
4. After it's build I should figure out exactly how it's initially serving the files. Right now I just want to build

# To Do
- [ ] read up & add minimal version 
  - [X] react-router
  - [ ] jest - this is tough with actually getting dynamic data. may only be possible for smaller pieces?
  - [X] material design / pre-built components
  - [X] React prototypes
- [X] how can you use create-react-app with an API server / mongoose connection
  - [X] create a test API endpoint
  - [X] make a viable start command with concurrently
  - [X] test accessing the endpoint from the client
- [X] when back online
  - [X] mongoose
  - [X] create mock-up data for some games sought / offered
  - [X] how to restrict a mongoose schema to enum (trade.js)
- [X] set-up gulp / the basic server
- [X] decide how data / trades will be structured
- [X] userless shell
  - [X] paper sketch out the pages
  - [X] decide on components 
  - [X] where does the state live?
  - [X] build out unstyled pages for games
  - [X] rely on router instead of state
  - [X] build out unstyled pages for trades
  - [X] build page for initiating a new trade
  - [X] build page for adding a new game
    - [X] create fake API to test it
  - [X] added login/profile to app bar
  - [X] build profile page
  - [X] connect them together
  - [X] is the only problem with proxying being offline?
- [X] build user shell
  - [X] how do you log in with single page react?
  - [X] implement logging in locally
  - [X] implement failed logins
  - [X] implement logging out
  - [X] make all the pages treat being logged in appropriately
  - [X] have the home page check for an active session if the user is empty
- [ ] Add server APIs / DB interaction
  - [X] how do you convert xml to json
  - [ ] search for game titles
  - [ ] retrieve all current games (note that i'll filter within the app to reduce API calls)
    - [ ] start with static games list
  - [ ] create new user
  - [ ] retrieve all trades
  - [ ] interact with trades (*this will be creating new 'sought' games if they don't already exist*)
  - [ ] make new games
- [ ] create something to check if they're logged in properly periodically
- [ ] Add Buttons
  - [ ] add a button to the trade page to create a new trade
  - [ ] add a button when viewing someone else's game to start a trade (make it select their game already)
  - [ ] add a button when viewing your games to start a trade (make it select your game already)
  - [ ] remove the testing menu options
- [ ] style everything in the shell
  - [ ] replace things like text fields with the appropriate material components
- [ ] jest
  - [ ] for react components
  - [ ] for server endpoints?
- [ ] fiddle with all the wording

## Bonuses
- [ ] paginate
- [ ] messaging
- [ ] email notification
- [ ] require an email on login
- [ ] automatically match people
- [ ] more validators for the game model