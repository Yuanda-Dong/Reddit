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

interface Node {
	author: string;
	id: number;
	content: string;
	children: Node[];
}

export default function PostView() {
	const { postId } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const clicked = useRef<Node>();
	const [node, setNode] = useState<Node>();

	useEffect(() => {
		async function getNode(id: number): Promise<Node> {
			const resp = await supaClient.from("comments").select("*").filter("id", "eq", id).single();
			const content = resp.data?.content!;
			const author = (
				await supaClient.from("user_profiles").select("username").eq("user_id", resp.data?.user_id!)
			).data?.[0].username!;
			const children =
				(await supaClient.from("comments_relation").select("cid").eq("pid", id)).data ?? [];
			const childrenNodes = await Promise.all(children.map(async (c) => await getNode(c.cid)));
			return { author, id, content, children: childrenNodes };
		}
		async function go() {
			setNode(await getNode(Number(postId)));
		}
		go();
	}, []);

	function display(node: Node, indent: number): ReactElement {
		return (
			<Box ml={indent} border="solid" my="1em">
				<Box>
					{node?.author}: {node?.content}
					<Button
						size="xs"
						ml="1em"
						onClick={() => {
							onOpen();
							clicked.current = node;
						}}
					>
						Reply
					</Button>
				</Box>
				{node?.children.map((e) => display(e, indent + 4))}
			</Box>
		);
	}

	return (
		<>
			{node ? display(node, 4) : <>Loading...</>}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					as="form"
					onSubmit={async (e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						const reply = formData.get("reply") as string;
						const rid = (await supaClient.rpc("reply", { pid: clicked.current?.id!, reply })).data;

						if (rid) {
							clicked.current?.children.push({
								author: "you",
								id: rid!,
								children: [],
								content: reply,
							});
						setNode(node);
						}
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
