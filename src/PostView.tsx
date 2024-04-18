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
			const content = (
				await supaClient.from("comments").select("*").filter("id", "eq", id).single()
			).data?.content!;
			const children =
				(await supaClient.from("comments_relation").select("cid").eq("pid", id)).data ?? [];
			const childrenNodes = await Promise.all(children.map(async (c) => await getNode(c.cid)));
			return { id, content, children: childrenNodes };
		}
		async function go() {
			setNode(await getNode(Number(postId)));
		}
		go();
	});

	function display(node: Node, indent: number): ReactElement {
		return (
			<Box ml={indent} border="solid" my="1em">
				<Box>
					{node?.content}
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
						clicked.current?.children.push({ id: rid!, children: [], content: reply });
						setNode(node);
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
