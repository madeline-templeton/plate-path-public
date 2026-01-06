# term-project-metemple-eestienn-esessa
term-project-metemple-eestienn-esessa created by GitHub Classroom


### Design Choices
For this project, as some of the user was quite sensitive, we decided to use protected endpoints in order to make sure that the user was authenticated before they were allowed to edit or add personal information. While we did not add this functionality for "GET" endpoints, these use the user Id field from the AuthRequest interface, which means that users calling these endpoints must be authenticated or they will not be able to access the data. As such, while this is not perfect and certainly could be exploited, for the scope of this project we believe this to be sufficient. When calling a protected endpoint, the frontend must provided an authorisation token, that is then checked by firebase to be legitimate. If an incorrect token is provided, the user is not authenticated properly and an error is thrown. 

When it comes to data storage, we decided that we would default to always saving non-sensitive user information (planner, meal preferences), but ask the user to store their personal information that they input themselves. We decided to do this to personalise the user experience, and as we don't share this data with anyone else, we felt this would personalise the website enough, while also respecting user privacy. Users may also choose to revoke all of their data storage consent in the Account section at anytime. We also felt it was important for users to be able to delete their personal data at any time, and hence we have such functionality in the account section as well.

In addition, when storing all of the user information in the backend, we decided to index it by user ID to, firstly, facilitate lookup and, secondly, to ensure there were no duplicate entries. This way each user only has one planner and set of information in storage. This is mainly because we wanted to limit our scope for this project and hence restricting each user to only one planner made sense.

Next, when calling the actual algorithm, we pass in the raw data to the backend for it to run a few normalisations on it (mostly getting everything into metric to ensure that our equations work), before this data is then passed to a few equations to compute the total number of calories that the user should consuming a day based on their requirements. This was left up to the backend, so that this information can then be passed directly to the algorithm, which then uses it to generate the planner based on all of the constraints. On the frontend, we give our users a choice of units and instead of having users do extra maths, we instead handle all of the conversions in the backend.

In order to ensure coherence across outputs and inputs in the backend, we implemented a global variables file. In it, we store the various interfaces and schemas that we use in our code. This all means that all of our data is normalised and we can easily spot problems when they arise and pinpoint what the problem was. 

On the calendar page, the meals are displayed with just the titles showing, then when a user clicks on one, the sidebar comes up displaying more information as well the voting functionality. We did this to have a display that is less cluttered and have the user select which meal they want to see at each point, making it easier to navigate and more intuitive to spot which meal corresponds to which day. This Sidebar is also where we display the ingredients and recipe list. One of the trickier parts here was designing the up and downvoting functionality. We decided that the user should be able to up and downvote a meal, but also be able to return to neutral if they so choose. This allows the user greater and means they are not locked into making a decision, if they choose not to. 

We also thought it was important for users to be able to use our services without creating an account, this way, they would be able to retain their privacy while also allowing them to generate a meal plan (although they won't get any of the perks that come with creating an account).

In order to facilitate user navigation, we added a header which allows users to easily switch between pages and also access their account at any time, in order to update their consent settings or check the status of their data in storage. 


<Algorithm>

<Accessibility>

<Error Handling>

<CSV File>



#### Errors/Bugs:




#### Tests:
Unit tests for endpoints can be run using "npm run playwrightTest". However, the user must first make sure to start the backend server using "npm run test:server", which bypasses the authentication, thus allowing these tests to pass without needing to use any actual Firebase authentication.



#### Team members and contributions (include cs logins):
eestienn - Erik Estienne 
metemple - Madeline Templeton
esessa - Elizabeth Sessa

#### Collaborators (cslogins of anyone you worked with on this project or generative AI):

Erik Estienne Used LLM for:
- Generate endpoint tests before manually checking and editing these to ensure they were sufficiently detailed and passed
- Help with design of protected endpoints to ensure that these could not be accessed unless the user was properly authenticated
- Help with meal preferences endpoint storage functionality


Elizabeth Sessa Used LLM for:
- Connecting the frontend and backend after we changed the backend (mostly pinpointing where we needed to change things in the frontend to accomodate and error navigation with that)
- Explaining how accessibility requirements will look for those who use them and implementing those into our frontend application

#### Total estimated time it took to complete project: 
#### Link to GitHub Repo: https://github.com/cs0320-f25/term-project-metemple-eestienn-esessa