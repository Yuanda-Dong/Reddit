create extension if not exists "ltree" with schema "extensions";


create table "public"."comments" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid(),
    "content" text not null
);


alter table "public"."comments" enable row level security;

create table "public"."comments_relation" (
    "pid" bigint not null,
    "cid" bigint not null
);


alter table "public"."comments_relation" enable row level security;

CREATE UNIQUE INDEX "Comments_pkey" ON public.comments USING btree (id);

CREATE UNIQUE INDEX comments_relation_pkey ON public.comments_relation USING btree (pid, cid);

alter table "public"."comments" add constraint "Comments_pkey" PRIMARY KEY using index "Comments_pkey";

alter table "public"."comments_relation" add constraint "comments_relation_pkey" PRIMARY KEY using index "comments_relation_pkey";

alter table "public"."comments" add constraint "public_Comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "public_Comments_user_id_fkey";

alter table "public"."comments_relation" add constraint "public_comments_relation_cid_fkey" FOREIGN KEY (cid) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments_relation" validate constraint "public_comments_relation_cid_fkey";

alter table "public"."comments_relation" add constraint "public_comments_relation_pid_fkey" FOREIGN KEY (pid) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments_relation" validate constraint "public_comments_relation_pid_fkey";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."comments_relation" to "anon";

grant insert on table "public"."comments_relation" to "anon";

grant references on table "public"."comments_relation" to "anon";

grant select on table "public"."comments_relation" to "anon";

grant trigger on table "public"."comments_relation" to "anon";

grant truncate on table "public"."comments_relation" to "anon";

grant update on table "public"."comments_relation" to "anon";

grant delete on table "public"."comments_relation" to "authenticated";

grant insert on table "public"."comments_relation" to "authenticated";

grant references on table "public"."comments_relation" to "authenticated";

grant select on table "public"."comments_relation" to "authenticated";

grant trigger on table "public"."comments_relation" to "authenticated";

grant truncate on table "public"."comments_relation" to "authenticated";

grant update on table "public"."comments_relation" to "authenticated";

grant delete on table "public"."comments_relation" to "service_role";

grant insert on table "public"."comments_relation" to "service_role";

grant references on table "public"."comments_relation" to "service_role";

grant select on table "public"."comments_relation" to "service_role";

grant trigger on table "public"."comments_relation" to "service_role";

grant truncate on table "public"."comments_relation" to "service_role";

grant update on table "public"."comments_relation" to "service_role";


