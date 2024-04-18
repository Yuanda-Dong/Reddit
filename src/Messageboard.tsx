import { Heading, useConst } from "@chakra-ui/react";
import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "./App";
import PostView from "./PostView";

export default function Messageboard() {
	const { session } = useContext(UserContext);

	return (
		<>
			<center>
				<Link to="/1">
					<Heading as="h2" size="2xl" mt="0.5rem">
						Welcome to Reddit
					</Heading>
				</Link>
				{!session?.user && <>You need to Log in to join in the discussion</>}
			</center>
			<Outlet />
		</>
	);
}
