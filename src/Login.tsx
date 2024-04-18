import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { supaClient } from "./supa-client";

export default function Login() {
	const { isOpen: isOpenIN, onOpen: onOpenIN, onClose: onCloseIN } = useDisclosure();
	const { isOpen: isOpenUP, onOpen: onOpenUP, onClose: onCloseUP } = useDisclosure();
	return (
		<>
			<Button onClick={onOpenIN} mr="0.5em">
        Log in
			</Button>
			<Modal isOpen={isOpenIN} onClose={onCloseIN}>
				<ModalOverlay />
				<ModalContent p="4">
          <Auth supabaseClient={supaClient} view="sign_in"/>
				</ModalContent>
			</Modal>

			<Button onClick={onOpenUP} mr="1em">
				Sign up
			</Button>
			<Modal isOpen={isOpenUP} onClose={onCloseUP}>
				<ModalOverlay />
				<ModalContent p="4">
          <Auth supabaseClient={supaClient} view="sign_up"/>
				</ModalContent>
			</Modal>
		</>
	);
}
