CREATE TABLE IF NOT EXISTS post_views (
  path TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS post_view_events (
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  viewed_at TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (path, visitor_hash)
);

CREATE INDEX IF NOT EXISTS post_view_events_expires_at_idx
  ON post_view_events (expires_at);
