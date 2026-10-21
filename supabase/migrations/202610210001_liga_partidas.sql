-- La Liga del Saber · Backend optativo (no desplegado)
-- Progreso anónimo: solamente las Edge Functions con service_role pueden leer o escribir.
create extension if not exists pgcrypto with schema extensions;
create table if not exists public.liga_games (
 id uuid primary key default gen_random_uuid(),
 progress jsonb not null default '{"math":null,"lang":null}'::jsonb,
 revision bigint not null default 0 check (revision >= 0),
 owner_epoch bigint not null default 1,
 active_token_hash text not null,
 recovery_hash text not null unique,
 transfer_code_hash text unique,
 transfer_expires_at timestamptz,
 last_operation uuid,
 updated_at timestamptz not null default now()
);
create index if not exists liga_games_transfer_code_idx on public.liga_games(transfer_code_hash)
 where transfer_code_hash is not null;
create table if not exists public.liga_attempt_limits(
 bucket_hash text primary key,
 bucket_started timestamptz not null default now(),
 attempts integer not null default 0
);
alter table public.liga_games enable row level security;
alter table public.liga_attempt_limits enable row level security;
revoke all on public.liga_games, public.liga_attempt_limits from public, anon, authenticated;
grant select,insert,update,delete on public.liga_games, public.liga_attempt_limits to service_role;

create or replace function public.liga_rate(p_bucket text,p_max integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if p_max < 1 or p_window_seconds < 1 then return false; end if;
 insert into public.liga_attempt_limits(bucket_hash,attempts) values(p_bucket,1)
 on conflict(bucket_hash) do update
 set attempts=case when public.liga_attempt_limits.bucket_started < now()-make_interval(secs=>p_window_seconds)
              then 1 else public.liga_attempt_limits.attempts+1 end,
     bucket_started=case when public.liga_attempt_limits.bucket_started < now()-make_interval(secs=>p_window_seconds)
              then now() else public.liga_attempt_limits.bucket_started end
 returning attempts into n;
 return n <= p_max;
end $$;

create or replace function public.liga_create(p_progress jsonb,p_token_hash text,p_recovery_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.liga_games;
begin
 insert into public.liga_games(progress,active_token_hash,recovery_hash)
 values(p_progress,p_token_hash,p_recovery_hash) returning * into row;
 return jsonb_build_object('id',row.id,'revision',row.revision,'owner_epoch',row.owner_epoch);
end $$;

create or replace function public.liga_read(p_id uuid,p_token_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.liga_games;
begin
 select * into row from public.liga_games where id=p_id and active_token_hash=p_token_hash;
 if not found then return jsonb_build_object('ok',false,'reason','control_revoked'); end if;
 return jsonb_build_object('ok',true,'progress',row.progress,'revision',row.revision,'owner_epoch',row.owner_epoch);
end $$;

create or replace function public.liga_save(p_id uuid,p_token_hash text,p_base_revision bigint,p_operation uuid,p_progress jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.liga_games;
begin
 select * into row from public.liga_games where id=p_id for update;
 if not found or row.active_token_hash<>p_token_hash then
  return jsonb_build_object('ok',false,'reason','control_revoked');
 end if;
 if row.last_operation=p_operation then
  return jsonb_build_object('ok',true,'revision',row.revision,'duplicate',true);
 end if;
 if row.revision<>p_base_revision then
  return jsonb_build_object('ok',false,'reason','revision_conflict','revision',row.revision);
 end if;
 update public.liga_games set progress=p_progress,revision=revision+1,last_operation=p_operation,updated_at=now()
 where id=p_id returning * into row;
 return jsonb_build_object('ok',true,'revision',row.revision);
end $$;

create or replace function public.liga_issue(p_id uuid,p_token_hash text,p_code_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.liga_games;
begin
 select * into row from public.liga_games where id=p_id for update;
 if not found or row.active_token_hash<>p_token_hash then
  return jsonb_build_object('ok',false,'reason','control_revoked');
 end if;
 update public.liga_games set transfer_code_hash=p_code_hash,
  transfer_expires_at=now()+interval '10 minutes',updated_at=now()
 where id=p_id;
 return jsonb_build_object('ok',true,'expires_in_seconds',600);
end $$;

create or replace function public.liga_cancel(p_id uuid,p_token_hash text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.liga_games set transfer_code_hash=null,transfer_expires_at=null
 where id=p_id and active_token_hash=p_token_hash;
 return found;
end $$;

create or replace function public.liga_redeem(p_code_hash text,p_new_token_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.liga_games;
begin
 select * into row from public.liga_games
 where transfer_code_hash=p_code_hash and transfer_expires_at>now() for update;
 if not found then return jsonb_build_object('ok',false,'reason','invalid_or_expired'); end if;
 update public.liga_games set active_token_hash=p_new_token_hash,
  transfer_code_hash=null,transfer_expires_at=null,owner_epoch=owner_epoch+1,updated_at=now()
 where id=row.id returning * into row;
 return jsonb_build_object('ok',true,'id',row.id,'progress',row.progress,
   'revision',row.revision,'owner_epoch',row.owner_epoch);
end $$;

create or replace function public.liga_recover(p_recovery_hash text,p_new_token_hash text,p_new_recovery_hash text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.liga_games;
begin
 select * into row from public.liga_games where recovery_hash=p_recovery_hash for update;
 if not found then return jsonb_build_object('ok',false,'reason','invalid_recovery'); end if;
 update public.liga_games set active_token_hash=p_new_token_hash,recovery_hash=p_new_recovery_hash,
 transfer_code_hash=null,transfer_expires_at=null,owner_epoch=owner_epoch+1,updated_at=now()
 where id=row.id returning * into row;
 return jsonb_build_object('ok',true,'id',row.id,'progress',row.progress,
   'revision',row.revision,'owner_epoch',row.owner_epoch);
end $$;

-- Los RPC no pueden invocarse desde navegadores con claves públicas.
revoke all on function
 public.liga_rate(text,integer,integer),
 public.liga_create(jsonb,text,text),
 public.liga_read(uuid,text),
 public.liga_save(uuid,text,bigint,uuid,jsonb),
 public.liga_issue(uuid,text,text),
 public.liga_cancel(uuid,text),
 public.liga_redeem(text,text),
 public.liga_recover(text,text,text)
 from public,anon,authenticated;
grant execute on function
 public.liga_rate(text,integer,integer),
 public.liga_create(jsonb,text,text),
 public.liga_read(uuid,text),
 public.liga_save(uuid,text,bigint,uuid,jsonb),
 public.liga_issue(uuid,text,text),
 public.liga_cancel(uuid,text),
 public.liga_redeem(text,text),
 public.liga_recover(text,text,text)
 to service_role;
