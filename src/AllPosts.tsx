import {
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supaClient } from "./supa-client";
import moment from "moment";
import { Link } from "react-router-dom";

export default function AllPosts() {
	const [posts, setPosts] = useState<
		{
			id: number;
			user_id: string;
			created_at: string;
			content: string;
			username: string;
		}[]
	>([]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	async function f() {
		const resp = (await supaClient.rpc("get_posts").select("*")).data;
		setPosts(resp ?? []);
	}

	useEffect(() => {
		f();
	}, []);

	return (
		<Container maxW="90%" m="auto" mt="1em">
			<Button mb="1em" onClick={onOpen}>
				New post
			</Button>
			{posts?.map((p) => (
				<Box
					padding="4"
					bg="gray.100"
					w="100%"
					cursor="pointer"
					_hover={{
						bg: "pink",
					}}
					my="1em"
				>
					<Link to={`/post/${p.id}`}>
						<Flex flexDir="row" alignItems="center">
							{" "}
							<VStack mr="1em">
								<Box>{moment(p.created_at).fromNow()}</Box>
								<Box>{`by ${p.username}`}</Box>
							</VStack>
							<Box>{p.content}</Box>
						</Flex>
					</Link>
				</Box>
			))}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					as="form"
					onSubmit={async (e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const post = formData.get("post") as string;
						await supaClient.from("comments").insert({ content: post, is_root: true });
						onClose();
						await f();
					}}
				>
					<ModalHeader>Enter your post!</ModalHeader>
					<ModalBody pb={6}>
						<FormControl>
							<Input placeholder="This is a new post!" name="post" />
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} type="submit">
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	);
}
