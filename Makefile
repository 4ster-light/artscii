# COPR SCM builds (`copr-cli buildscm --method make_srpm`) check out the
# repository and run `make srpm` from the root, expecting the resulting SRPM to
# appear next to this file. The real work lives next to the spec.

.PHONY: srpm clean

srpm:
	$(MAKE) -C packaging/fedora srpm
	cp -f packaging/fedora/*.src.rpm .
	$(MAKE) -C packaging/fedora clean

clean:
	rm -f *.src.rpm
	$(MAKE) -C packaging/fedora clean
