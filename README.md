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
    - [X] forgot about trades and maybe my games?
  - [X] have the home page check for an active session if the user is empty
- [X] Add server APIs / DB interaction
  - [X] how do you convert xml to json
  - [X] search for game titles
  - [X] make new games
  - [X] create new user
  - [X] retrieve all current games (note that i'll filter within the app to reduce API calls)
  - [X] retrieve all trades
  - [X] switch around to not pass the user id through a parameter
  - [X] interact with trades 
- [X] link client code to real API endpoints 
  - [X] add all games to state
  - [X] add all trades to state
  - [X] adding new game
  - [X] fix clicking on gamecard
  - [X] add new trade
  - [X] advance trade
- [X] Add Buttons
  - [X] add a button to the main page to add either games or trades (trades only if logged in)
  - [X] add a button to the trade page to create a new trade
  - [X] add buttons to my games pages to add a new game
  - [X] add a button when viewing someone else's game to start a trade (make it select their game already)
  - [X] add a button when viewing your games to start a trade (make it select your game already)
  - [X] remove the testing menu options
- [X] check that it's always _id when it should be (and vice versa?)
- [X] style everything in the shell
  - [X] add game screen
  - [X] profile
  - [X] login screen
  - [X] 'none'
  - [X] replace things like text fields with the appropriate material components
- [X] deploy to heroku
  
------

- [X] fix refreshing never having a user
- [X] create sign up button
- [X] retrigger getting trades and games when appropriate
  - [X] make a sidebar for trades
- search cleanup
  - [X] add loading when getting search results back
  - [X] handle delayed BGG search results (multiple things) - pretty sure did it w/ closures
  - [X] add instant search with enter or click button
- [X] add owner to game card
  - [X] create server api to take a list of userIDs and return details
  - [X] pass game instead of BGG_info and ID
  - [X] restyle the card
- [X] add a color status bar to trade card
  - [X] blue when waiting on others, yellow when waiting on you, grey when cancelled, green when done
  - [X] add color to status thing as well
- [X] indicate in GameList if they have more than four
- [X] sort GameList by most recent first
  - [X] sort TradeList by most recent first
- [X] for saving, does done need to be in componentwillmount?
    - answer: no
  - [X] add spinner to everything that waits?
- [X] fiddle with the linking within trades
  - [X] make sure recipient sought is being added on creation
  - [X] create sender sought on creation
  - [X] link to recipient sought on accept
  - [X] create recipient sought on accept
  - [X] mark complete on complete
  - [X] my games aren't being defaulted when coming from my gamecard (the other is)
- [X] fiddle with all the wording
- [X] remove unnecessary logging
- [X] add City/State to profile
  - [X] add to User.js
  - [X] add to the profile page as editable
  - [X] add to the game card
- [X] reload games after updating profile (for the current user)
- [X] get a handle on when completed games are filtered
  - [X] filter from everywhere by my/owned & my/sought
  - [X] make it grayscale and put trade completed on it
- [X] add error / loading for trade workflow
  - [X] make modified trade workflow
  - [X] don't allow trades with completed games to progress
- [ ] minor visual tweaks
  - [X] Game card should be sought by: for not owned
  - [X] the buttons / fields on login should line up better
  - [X] sent should be recieved to recipients
  - [X] City and state are aligned weirdly
    - [X] Can state open by typing - no
  - [X] fix scrolling (make it scroll to top)
  - [X] more padding above OneGame
  - [X] Trade Card layout just isn't very good
    - [X] too tall
    - [X] too similar to onetrade 
    - [X] show date
  - [X] indicate traded games
  - [X] sort the trades by date
  - [X] close icon menu when navigating to profile
- [X] default focus where it belongs
  - [X] enter should submit for login
  - [X] search bar for add game
  - [X] notes for trade steps
- [ ] take user to the trade you just created or home (not back to the game)
- [ ] mobile friendly
- [ ] AddButton.js "iconButton.setKeyboardFocus is not a fn" on ESC
- [ ] Some sort of splash page before login (use material-ui as a guide)
## Bonuses
- [ ] can't go straight to trade IDs?
- [ ] make the thing that is a flat div and turns into an app bar for splash page
- [ ] add a badge with trades to act on
- [ ] jest
  - [ ] test more advancing scenarios if possible
  - [ ] for react components
  - [ ] for server endpoints?
- [ ] filter button for trades
- [ ] style the add buttons better 
  - [ ] make them show more plus buttons with text to the left instead of a menu
  - [ ] make text to the left show on hover for the just trade mode
- [ ] indicate games sought by the person you're sending too
- [ ] link to twitter for profile pics
- [ ] require an email on login
- [ ] messaging
- [ ] email notification
- [ ] handle trades with no owned games better
- [ ] paginate
- [ ] automatically match people
- [ ] more validators for mongoose models
  - [ ] user fields should check that the user actually exists (not sure how to do this)
- [ ] scale to too many games to fit in client cache