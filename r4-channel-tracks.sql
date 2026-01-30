DROP VIEW IF EXISTS "public"."channel_tracks";
 SELECT tracks.id,
    tracks.created_at,
    tracks.updated_at,
    tracks.url,
    tracks.discogs_url,
    tracks.title,
    tracks.description,
    tracks.tags,
    tracks.mentions,
    tracks.fts,
    channels.slug,
    tracks.duration,
    tracks.playback_error
   FROM ((tracks
     JOIN channel_track ON ((tracks.id = channel_track.track_id)))
     JOIN channels ON ((channels.id = channel_track.channel_id)));


