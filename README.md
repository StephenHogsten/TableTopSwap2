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
- [ ] userless shell
  - [X] paper sketch out the pages
  - [X] decide on components 
  - [X] where does the state live?
  - [X] build out unstyled pages for games
  - [X] rely on router instead of state
  - [X] build out unstyled pages for trades
  - [ ] build pages (steps needed) for initiating a new trade
  - [ ] build out remaining unstyled pages 
  - [ ] connect them together
  - [X] is the only problem with proxying being offline?
  - [ ] build out jest tests?
  - [ ] add action button
- [ ] build user shell
  - [ ] how do you log in with single page react?
  - [ ] implement logging in locally
  - [ ] make all the pages treat being logged in appropriately
- [ ] Add server APIs / DB interaction
  - [ ] how do you convert xml to json
  - [ ] retrieve all current games (note that i'll filter within the app to reduce API calls)
    - [ ] start with static games list
  - [ ] search for game titles
  - [ ] retrieve all trades
  - [ ] interact with trades (*this will be creating new 'sought' games if they don't already exist*)
  - [ ] make new games
- [ ] style everything in the shell
- [ ] fiddle with all the wording

## Bonuses
- [ ] email notification
- [ ] automatically match people
- [ ] more validators for the game model