import { RealtimeChannel, Session, User } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { supaClient } from "./supa-client";
import { useNavigate } from "react-router-dom";

export interface UserProfile {
	username: string;
	avatarUrl?: string;
}

export interface RedditUserInfo {
	session: Session | null;
	profile: UserProfile | null;
}

export function useSession(): RedditUserInfo {
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const channel: MutableRefObject<null> | MutableRefObject<RealtimeChannel> = useRef(null);
	const navigate = useNavigate();

	async function onSessionChange(session: Session | null) {
		// if loggin in
		if (session?.user) {
			const { data } = await supaClient
				.from("user_profiles")
				.select("*")
				.filter("user_id", "eq", session.user.id);

			if (data?.[0]) {
				setProfile(data?.[0]);
			} else {
				navigate("/welcome");
			}
			channel.current?.unsubscribe();
			channel.current = null;
			channel.current = supaClient
				.channel("public:user_profiles")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "user_profiles",
						filter: `user_id=eq.${session.user.id}`,
					},
					(payload) => {
						console.log("im here");
						setProfile(payload.new as UserProfile);
					}
				)
				.subscribe();
		} else {
			// logging out
			channel.current?.unsubscribe();
			channel.current = null;
		}
	}

	useEffect(() => {
		supaClient.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			onSessionChange(session);
			supaClient.auth.onAuthStateChange((_event, session) => {
				setSession(session);
				onSessionChange(session);
			});
		});
	}, []);

	return { profile, session };
}
