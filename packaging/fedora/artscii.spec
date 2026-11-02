# SPDX-License-Identifier: MIT
#
# COPR/Fedora spec for the ArtSCII CLI.
#
# This builds from source and links the distribution's ffmpeg and ALSA
# libraries; nothing is bundled (Fedora does not allow bundling). The crates
# from crates.io are fetched at build time, so the COPR project needs
# "enable internet access during builds" turned on. Use the `srpm` target in
# the Makefile next to this file for COPR's `--method make_srpm` builds.

%global forgeurl https://github.com/4ster-light/artscii
# `prerelease`/`rc` are empty for stable builds. Release candidates are built
# from a generated copy of this spec that hardcodes them (see the "Build SRPM"
# step of the release workflow): COPR re-runs `rpmbuild -bs` on the spec found
# inside the uploaded SRPM, so command-line defines would be lost there.
%global git_tag      v%{version}%{?prerelease}
%global archive_name %{name}-%{version}%{?prerelease}

Name:           artscii
Version:        2.1.0
Release:        %{?rc:0.%{rc}}%{!?rc:1}%{?dist}
Summary:        Convert images and videos to ASCII art

License:        MIT
URL:            %{forgeurl}
Source0:        %{forgeurl}/archive/%{git_tag}/%{archive_name}.tar.gz

BuildRequires:  cargo
BuildRequires:  rust
BuildRequires:  gcc
BuildRequires:  pkgconf-pkg-config
BuildRequires:  clang-devel
BuildRequires:  ffmpeg-free-devel
BuildRequires:  alsa-lib-devel

# The video feature (default upstream) needs ffmpeg and ALSA at runtime; those
# come in automatically through the generated soname dependencies.
%description
ArtSCII turns images and videos into ASCII art for the terminal, plain text,
HTML, GIF or MP4. It supports several dithering strategies (none,
Floyd-Steinberg, Atkinson, Riemersma), color and brightness/contrast control,
and resizing.

%prep
%autosetup -n %{archive_name}

%build
# Keep the crates.io registry cache inside the build directory so it is not
# written to an unwritable $HOME.
export CARGO_HOME=%{_builddir}/cargo-home
export CARGO_NET_RETRY=10
cargo build --release --locked -p artscii-cli --features video,audio

%check
export CARGO_HOME=%{_builddir}/cargo-home
# Only the pure-Rust crates are tested: the video crate's tests need media
# files that are not shipped in the release tarball.
cargo test --offline --release --locked -p artscii-core -p artscii-img

%install
install -Dpm0755 target/release/artscii %{buildroot}%{_bindir}/artscii

%files
%license LICENSE
%doc README.md
%{_bindir}/artscii

%changelog
* Mon Nov 02 2026 4ster-light <4ster.dev@proton.me> - 2.1.0-1
- Update to 2.1.0 (audio playback split into an "audio" feature).

* Sat Oct 31 2026 4ster-light <4ster.dev@proton.me> - 2.0.1-1
- Initial COPR package.
