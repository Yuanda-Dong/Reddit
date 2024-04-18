set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.reply(pid bigint, reply text)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
  cid bigint;
  begin

  insert into comments(content,is_root)
  values(reply, false)
  returning id into cid;

  insert into comments_relation
  values (pid,cid);

  return cid;
  end;
$function$
;


