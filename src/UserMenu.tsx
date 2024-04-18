import { Button, Flex, Heading } from "@chakra-ui/react";
import { useContext } from "react";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
	const { profile } = useContext(UserContext);
	const navigate = useNavigate();
	return (
		<Flex flexDirection="column">
			<Heading as="h2" size="l">
				Welcome {profile?.username || "dawg"}
			</Heading>
			<Button
				onClick={() => {
					supaClient.auth.signOut();
					navigate("/");
				}}
			>
				Log out
			</Button>
		</Flex>
	);
}
