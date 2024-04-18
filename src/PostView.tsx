import { ReactElement, useEffect, useRef, useState } from "react";
import { supaClient } from "./supa-client";
import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// interface Node {
// 	id: number;
// 	content: string;
// 	children: Node[];
// }

export default function PostView() {
	const { postId } = useParams();
	const [post, setPost] = useState<ReactElement>();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const clicked = useRef<number>();

	// useEffect(()=>{

	// 	async function getNode(){

	// 	}


	// })

	useEffect(() => {
		async function display(id: number, indent: number): Promise<ReactElement> {
			indent += 2;
			let content = (await supaClient.from("comments").select("*").filter("id", "eq", id).single())
				.data?.content;
			let children =
				(await supaClient.from("comments_relation").select("cid").eq("pid", id)).data ?? [];
			const childElements = await Promise.all(
				children.map(async (c) => (
					<Box ml={indent} key={c.cid} border="solid" m="1em">
						{await display(c.cid, indent + 2)}
					</Box>
				))
			);
			return (
				<>
					<Box>
						{content}
						<Button
							size="xs"
							ml="1em"
							onClick={() => {
								onOpen();
								clicked.current = id;
							}}
						>
							Reply
						</Button>
					</Box>
					{childElements}
				</>
			);
		}
		async function go() {
			setPost(await display(Number(postId!), 2));
		}
		go();
	}, []);

	return (
		<>
			<Box w="100%" border="solid" m="1em">
				{post}
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					as="form"
					onSubmit={async (e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const reply = formData.get("reply") as string;
						await supaClient.rpc("reply", { pid: clicked.current!, reply });
						onClose();
					}}
				>
					<ModalHeader>Enter your reply!</ModalHeader>
					<ModalBody pb={6}>
						<FormControl>
							<Input placeholder="#superuser2233" name="reply" />
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} type="submit">
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
