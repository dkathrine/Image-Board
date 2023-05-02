# Image Board
## Backend
​
1. Set up a Node.js server using a framework like Express and establish a connection to a MongoDB database.
​
2. Create a route for registering new users. Make sure to hash and salt their passwords before storing them in the database.
​
3. Allow users to upload profile pictures, limiting the file types to images and gifs only (no video files, etc.). Use a package like Multer to handle file uploads and store the images on a cloud.
​
4. Create a route for user posts and establish a relationship with the users either by nesting the posts under the user object or using unique identifiers like user IDs.
​
5. Posts should have a title, description, and optional image or video attachments. Use a package like Cloudinary to handle image and video uploads, and store the resulting URLs in the database. Allow users to comment on and like posts.
​
6. Allow users to Edit their profile. Change their name, nickname and profile picture(Note: only one profile picture so it must be rewritten)
​
## Frontend
​
```
Frontend isn't your priority don't spend too much time on it focus more on backend. In short it doesn't need to be pretty or responsive
```
​
1. Use React to build a frontend interface for your image board.
​
2. Allow users to register for new accounts and log in to existing ones.
​
3. Allow users to create new posts, including titles, descriptions, and image or video attachments.
​
4. Display posts in a feed, along with their titles, descriptions, and image or video attachments.
​
5. Allow users to comment on and like posts, and update the post information in real time.
​
### Additional **must**
​
1. Implement authentication and authorization for user actions such as creating, editing, and deleting posts.
​
2. Allow users to follow other users and display a feed of posts from the users they follow.
​
3. Implement search functionality to allow users to search for posts based on keywords or tags.
​
### Bonus Challenges **optional**
​
1. Implement real-time updates using WebSockets(socket.io) to display new posts and comments in real-time without the need for a page refresh.
​
2. Implement a recommendation engine to suggest posts to users based on their past activity and interests.
  * By implementing a recommendation engine, you can suggest posts to users based on their past activity and interests. For example, if a user has previously liked or commented on posts related to photography, the recommendation engine can suggest similar posts that are likely to be of interest to that user. This can be done using machine learning algorithms or by analyzing user behavior data. The aim is to improve user engagement by suggesting relevant content and increasing the likelihood of users returning to the site.
​
3. Allow users to create and join groups based on interests and display a feed of posts from members of their group.
​
4. Implement a feature to allow users to save and bookmark posts for later viewing.
​
5. Implement pagination to improve performance when displaying a large number of posts.
