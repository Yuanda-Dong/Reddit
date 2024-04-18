import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Messageboard from "./Messageboard";
import AllPosts from "./AllPosts";
import { createContext } from "react";
import { RedditUserInfo, useSession } from "./use-session";
import Welcome, { welcomeLoader } from "./Welcome";
import PostView from "./PostView";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "",
				element: <Messageboard />,
			},
			{
				path: ":pageNumber",
				element: <AllPosts />,
			},
			{
				path: "post/:postId",
				element: <PostView />,
			},
			{
				path: "welcome",
				element: <Welcome />,
				loader: welcomeLoader,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;

export const UserContext = createContext<RedditUserInfo>({ session: null, profile: null });

function Layout() {
	const redditUserInfo = useSession();
	return (
		<Box bg="lightsteelblue" minHeight="100vh">
			<UserContext.Provider value={redditUserInfo}>
				<Navbar />
				<Outlet />
			</UserContext.Provider>
		</Box>
	);
}
