alter table "public"."comments" add column "is_root" boolean not null;

alter table "public"."comments" disable row level security;

alter table "public"."comments_relation" disable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_posts()
 RETURNS TABLE(id bigint, user_id uuid, created_at timestamp with time zone, content text, username text)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    select comments.id, comments.user_id, comments.created_at, comments.content, user_profiles.username
    from comments
    join user_profiles on comments.user_id = user_profiles.user_id
    where comments.is_root = true
    order by comments.created_at;
end;$function$
;

