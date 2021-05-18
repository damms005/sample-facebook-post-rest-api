import express from "express";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded());

/************************************************************
 ******* S T A R T:  R O U T E  D E F I N I T I O N S *******
 ************************************************************/
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
/************************************************************
 ********* E N D:  R O U T E  D E F I N I T I O N S *********
 ************************************************************/

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));


/*
-hot reload
*/

/*
1. Efficacy of your submission: Fundamentally how well your solution is able to achieve the assignment objective and solve the stated problem.
2. System Design: How well your application will perform at scale
3. Code quality
	a. Code modularity
	b. Code documentation - balancing between self-documenting code and comments
	c. Unit and integration testing
	d. Adherence to REST standards
3. Documentation: Readme and Postman/Swagger
*/

/*
Next stage:
-implement token refresh
-registration should ensure email unique
-reduce collision in image uploads by including user ID in filename
*/
