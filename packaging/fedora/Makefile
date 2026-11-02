# Helper for COPR SCM builds.
#
# COPR checks out the repository and runs `make srpm` (build method
# "make_srpm"), so this target downloads the release tarball referenced by
# Source0 and writes an SRPM into the current directory. Run it from this
# directory:
#
#   make srpm
#
# The resulting artscii-<version>-<release>.src.rpm can also be uploaded with
# `copr-cli build 4ster-light/artscii <srpm>`.
#
# `dist` is cleared when the SRPM is created so the same NVR is built in every
# COPR chroot instead of inheriting the dist tag of the machine that created
# the SRPM (the spec still uses `%{?dist}` for dist-git style builds).

SPEC    := artscii.spec
NAME    := $(shell rpmspec -q --qf '%{name}\n' $(SPEC) | head -n1)
VERSION := $(shell rpmspec -q --qf '%{version}\n' $(SPEC) | head -n1)
SOURCES := $(CURDIR)/SOURCES

# Take the archive from the spec's Source0, so stable and generated
# release-candidate specs (v2.1.0 vs v2.1.0-rc.1) always agree.
SRCURL  := $(shell rpmspec -P $(SPEC) | sed -n 's/^Source0:[[:space:]]*//p' | head -n1)
TARBALL := $(notdir $(SRCURL))

.PHONY: srpm tarball clean

srpm: tarball
	rpmbuild -bs \
		--define "_sourcedir $(SOURCES)" \
		--define "_srcrpmdir $(CURDIR)" \
		--define 'dist %{nil}' \
		$(SPEC)

tarball:
	mkdir -p $(SOURCES)
	test -s $(SOURCES)/$(TARBALL) || curl -fsSL -o $(SOURCES)/$(TARBALL) $(SRCURL)

clean:
	rm -f *.src.rpm
