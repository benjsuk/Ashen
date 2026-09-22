# Versioning

> This applies to all versions after `0.1.0`

Standard semver system of `major.minor.patch` to be used with minor additions:

- All pre-prod versions to be `0.x.x`.
- Any references to future versions must be labelled as `x.x.x-proactive`. (-proactive is a planning and docs label only, never to be tagged, added to `package.json`, etc)
- `0.x.x` versions have no need for -beta or -alpha suffixes, any pre-release after `1.0.0` will.
- All systems will share the same versioning system, regardless of the amount of updates in betweeen.
  - i.e. if the api undergoes 5 updates from `1.0.0` to `1.5.0`, and in the same span of time the iOS version only has one update after `1.5.0`'s release, iOS will jump to `1.5.0` in that update.
- API version is canonical.
