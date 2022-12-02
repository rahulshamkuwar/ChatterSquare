# ChatterSquare

##  Description
ChatterSquare is a messaging application. Each message sent is 10 points. The more you talk, the more points your get. Points can be used to redeem perks such as custom name colors, border, and more!

## Contributors
- Slater O’Brien: slob2062@colorado.edu; slaterob
- Sam Jansen: saja2752@colorado.edu; TiiLeaf
- Rahul Shamkuwar: rash6973@colorad.edu; rahulshamkuwar
- Raleigh Darcy: rada2150@colorado.edu; raleighjd
- Rachel Lam: rala5772@colorado.edu; rachelmlam
- Gabriel Khabner: gakh9214@colorado.edu; gabek25

## Tech Stack Used
**Backend**
- Socket.io
- PostgreSQL
- Node.js
- CU Boulder Private IaaS

**Frontend**
- Javascript
- CSS
- HTML
- Bootstrap

## Prerequisites
deployed - must be on 'CU Wireless' or CU's VPN

locally - docker

## Running the Application Locally
*must have docker installed and running*
- clone this GitHub repository
```
// for ssh
git clone git@github.com:rahulshamkuwar/ChatterSquare.git

// for https
git clone https://github.com/rahulshamkuwar/ChatterSquare.git
```
- If on windows, make sure the `./src/wait-for-it.sh` file is using `LF` for the End of Line Sequence. On Linux use `CRLF`.
- run the docker instance
```
docker-compose up
```
- wait for the following message log then open site using localhost:3000
```
chattersquare-web-1  | Server is listening on port 3000
chattersquare-web-1  | Database connection successful
```
- you will be directed to the login page. if the sesison is new, you must register and account or you will be automatically redirected to the register page when trying to sign into an account that does not exist. 
- after you have successfully created an account, you are redirected back to the login page to sign in.
- after signing in, you will be shown the 'general' section of the Square
- using the navigation bar, you can view your profile or log out
- on the lefthand side, there are different channels you can chat in, each with its predetermined topic

## How to run the tests
*must be able to access the site, preferably locally when doing tests*  
**after opening the site, there are a few things to test with register/login that should lead to the proper error message**
- logging in with a username that is not in the db will redirect user to register
- trying to logging in with a valid username but incorrect password
- trying to logging in with a valid username but empty password
- trying to register with an empty username field
- trying to register with an empty password field
- trying to register with an empty confirm password field
- trying to register with passwords that do not match

**login/register normally**
- registering successfully will lead you to the login page
- logging in successfully will lead you to the 'general' Square page  

**The Square**
- message history should be displayed in their respective chats
- you can type your message in the bottom text bar and send the message for others to see
- successfully switch through different chats
- each chat should display its own chat history
- log out from the navigation bar dropdown
- access square from other pages by pressing the logo/home button from the nav bar  

**Profile**
- view profile from navigation dropdown
- profile should display the client's username, profile picture, and current amount of points
- there are options to change your username, profile picture, and password - each prompting a modal popup when the button is clicked
- changes are seen imediately after a successful change
- perks can be viewed and purchased from the bottom portion of the profile, each costing 100 points
- when a user does not have enough points or the they have already purchased the perk, the purchase button is disabled
- logout from logout button

## Link to the deployed application
http://csci3308.int.colorado.edu:49167/

