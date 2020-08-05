'use strict';
const parse_ssh_config = require( './parse-ssh-config/parse-ssh-config' );
const read_ssh_config = require( './read-ssh-config' );
const expand_tilde = require( './expand-tilde' );

module.exports = function( o_args ){
   const c_host = o_args._[0];


   if( !c_host ) {
      console.error( 'Host is missing or invalid.' );
      process.exit( 1 );
   }

   return read_ssh_config()
   .then( parse_ssh_config )
   .then(function( a_hosts ){
      const a_possible_hosts = a_hosts.filter( function( o ){
         return o.Host == c_host;
      });

      if( a_possible_hosts.length < 1 ) {
         console.error( `Host ${c_host} not found in ssh config file.` );
         process.exit( 1 );
      }

      return a_possible_hosts[0];
   })
   .then(function( o_host ){
      const c_config_mount_point = o_host.sshfs_mount_point;

      if( !c_config_mount_point ) {
         console.error( 'Local mount point is missing or invalid.' );
         process.exit( 1 );
      }

      const c_resolved_mount_point = expand_tilde( c_config_mount_point );

      return new Promise(function( resolve ){

         switch( true ){
         case !!o_args.json:
            console.log( JSON.stringify( c_resolved_mount_point ) );
            break;

         default:
            console.log( c_resolved_mount_point );
         }// /switch()

         resolve();
      });
   });

};
