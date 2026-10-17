{ inputs, ... }:
{
  perSystem =
    {
      pkgs,
      lib,
      system,
      ...
    }:
    let
      crane = import ./crane.nix {
        inherit
          inputs
          pkgs
          lib
          system
          ;
      };
      inherit (crane)
        artscii
        artscii-web
        binName
        cliPackage
        webPackage
        ;
    in
    {
      packages = {
        default = artscii;
        artscii = artscii;
        artscii-cli = artscii;
        artscii-web = artscii-web;
      };

      apps = {
        default = {
          type = "app";
          program = "${artscii}/bin/${binName}";
          meta.description = cliPackage.description;
        };
        artscii = {
          type = "app";
          program = "${artscii}/bin/${binName}";
          meta.description = cliPackage.description;
        };
        artscii-web = {
          type = "app";
          program = "${pkgs.writeShellScriptBin "artscii-web" ''
            exec ${pkgs.python3}/bin/python3 -m http.server --directory ${artscii-web} "''${1:-8080}"
          ''}/bin/artscii-web";
          meta.description = "Serve the ${webPackage.name} web app locally";
        };
      };
    };
}
