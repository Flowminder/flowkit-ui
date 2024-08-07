# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added an initial implementation of data downloading, which gets CSVs for the currently selected indicator and time range.
- Added a plan type option to registration, so users can indicate whether they want to sign up for premium access at registration.
- Added Google analytics tracking of page views and CSV downloads where the env vars `GA_ID` (google analytics property id) and `REACT_COOKIEBANNER` (script tag which produces a cookie banner) are set
- Added an out-of-order sign to `/dashboard`, toggleable by setting `REACT_APP_MAINTAINENCE_MODE` to anything other than `""`.

### Changed
- Banner bar is now still available even if a dashboard modal is active - moving off the dashboard dismisses the modal.
- Update plans page to show that free accounts get access to all indicators, but over a limited time period.
- Flow indicators now display dates ranges on timeline pickers
- Disabled variable size bubbles in OD visualisations

### Removed
- Removed demo mode indicators from plans page and top bar

### Fixed
- Scales with fixed bounds now correctly use the bounds

## [0.1.1]
### Added
- A changelog

## [0.1.0]
### Changed
- Comms with the backend - using new and changed endpoints

[Unreleased]: https://github.com/Flowminder/FlowKit-UI/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Flowminder/FlowKit-UI/releases/tag/v0.1.1
[0.1.0]: https://github.com/Flowminder/FlowKit-UI/releases/tag/v0.1.0

