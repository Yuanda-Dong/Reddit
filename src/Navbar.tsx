import { Box, Center, Flex, Spacer } from "@chakra-ui/react";
import reddit from "./assets/reddit-svgrepo-com.svg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./App";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function Navbar() {
	const { session } = useContext(UserContext);

	return (
		<Flex bg="blue.300">
			<Box
				ml="30"
				p="4"
				cursor="pointer"
				w="5rem"
				_hover={{
					transform: "scale(1.2)",
					transitionDuration: "0.2s",
					transitionTimingFunction: "ease-in-out",
				}}
			>
				<Link to="/">
					<img src={reddit} />
				</Link>
			</Box>
			<Spacer />
			<Center>
				<Box
					mr="0.5em"
					p="4"
					cursor="pointer"
					_hover={{
						transform: "scale(1.2)",
						transitionDuration: "0.2s",
						transitionTimingFunction: "ease-in-out",
					}}
				>
					<Link to="/1">Posts</Link>
				</Box>
					{session?.user ? <UserMenu/> : <Login />}
			</Center>
		</Flex>
	);
}
