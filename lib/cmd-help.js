'use strict';

module.exports = function( o_args ){

const c_help_text = `
Useage: sshfsa [OPTION]... HOST_NAME
    or: sshfsa [OPTION]...
   
Options:
   -a, --all         See option --unmount.
   -l, --list        Show a list of all current sshfs mounts.
   -h, --help        Show this help.
   -p, --path        Show the sshfs mount for a given HOST_NAME if mounted.
   -u, --unmount     Attempt to disconnect a sshfs mount for a given HOST_NAME 
                     if mounted. If the --all option is provided HOST_NAME is
                     ignored and an attempt is made to all disconnect all
                     current mounts.
`;
console.log( c_help_text );

return Promise.resolve( c_help_text );

};
