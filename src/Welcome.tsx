import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { supaClient } from "./supa-client";
import { useContext } from "react";
import { UserContext } from "./App";
import { redirect, useNavigate } from "react-router-dom";

export async function welcomeLoader() {
  const {
    data: { user },
  } = await supaClient.auth.getUser();
  if (!user) {
    return redirect("/");
  }
  const { data } = await supaClient
    .from("user_profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single();
  if (data?.username) {
    return redirect("/");
  }
	return null;
}

export default function Welcome() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { session } = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<>
			<Modal isOpen={true} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					as="form"
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						supaClient
							.from("user_profiles")
							.insert({ user_id: session?.user.id!, username: formData.get("name") as string })
							.then((res) => {
								if (res.error) {
									alert(res.error.message);
								} else {
									navigate('/');
								}
							});
					}}
				>
					<ModalHeader>Welcome, name yourself!</ModalHeader>
					<ModalBody pb={6}>
						<FormControl>
							<FormLabel>Username:</FormLabel>
							<Input placeholder="#superuser2233" name="name" />
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
