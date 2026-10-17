# Expose the CLI as a Nixpkgs overlay so downstream users can consume it as
# `pkgs.artscii` on any Nixpkgs instance.
{ self, ... }:
{
  flake.overlays.default = _final: prev: {
    artscii = self.packages.${prev.stdenv.hostPlatform.system}.artscii;
  };
}
