import { Box, Container, Flex, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supaClient } from "./supa-client";
import moment from "moment";
import { Link } from "react-router-dom";

export default function AllPosts() {
	// const { pageNumber } = useParams();
	const [posts, setPosts] = useState<
		{
			id: number;
			user_id: string;
			created_at: string;
			content: string;
			username: string;
		}[]
	>();

	useEffect(() => {
		async function f() {
			const resp = (await supaClient.rpc("get_posts").select("*")).data;
			setPosts(resp ?? []);
		}
		f();
	}, []);

	return (
		<Container maxW="90%" m="auto" mt="1em">
			{posts?.map((p) => (
				<Box
					padding="4"
					bg="gray.100"
					w="100%"
					cursor="pointer"
					_hover={{
						bg: "pink",
					}}
				>
					<Link to={`/post/${p.id}`}>
					<Flex flexDir="row" alignItems="center"> <VStack mr="1em">
							<Box>{moment(p.created_at).fromNow()}</Box>
							<Box>{`by ${p.username}`}</Box>
						</VStack>
						<Box>{p.content}</Box>
					</Flex>
					</Link>
				</Box>
			))}
		</Container>
	);
}
