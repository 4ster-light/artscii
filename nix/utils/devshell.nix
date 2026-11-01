{ inputs, ... }:
{
  perSystem =
    {
      pkgs,
      lib,
      system,
      config,
      ...
    }:
    let
      crane = import ../crane.nix {
        inherit
          inputs
          pkgs
          lib
          system
          ;
      };
      inherit (crane) artscii;
    in
    {
      devShells.default = crane.craneLib.devShell {
        checks = config.checks;
        inputsFrom = [ artscii ];
        packages = with pkgs; [
          trunk
          wasm-bindgen-cli_0_2_126
          lld
          cargo-binstall
          wrangler
        ];
        LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
      };
    };
}
