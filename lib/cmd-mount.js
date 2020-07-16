#!/usr/bin/env node

/**
 * 05-02-2018
 * SSHFS assistant for mounting a remote filesystem using SFTP.
 * ~~ Scott Johnson
 */


/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* eslint-env es6 */

const fs = require( 'fs' ).promises;
const os = require( 'os' );
const path = require( 'path' );
const parse_ssh_config = require( './parse-ssh-config/parse-ssh-config' );
const child_process = require('child_process');
const spawn = child_process.spawn;
const get_sshfs_mounts = require( './get-sshfs-mounts' );
const HOME_DIR = os.homedir();

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
      return new Promise(function( resolve ){
         const c_config_mount_point = o_host.sshfs_mount_point;
         const c_path_remote = o_host.sshfs_remote_directory || '/';
         const c_host = o_host.Host;
         const c_sshfs_mount_path = `${c_host}:${c_path_remote}`;

         if( !c_config_mount_point ) {
            console.error( 'Local mount point is missing or invalid.' );
            process.exit( 1 );
         }

         const c_resolved_mount_point = expand_tilde( c_config_mount_point );

         get_sshfs_mounts()
         .then(function( a_mounts ){

            // Check to see if this host is already mounted.
            const a_matching_mounts = a_mounts.filter(function( o_mount ){
               return o_mount.local_path == c_resolved_mount_point;
            });

            if( a_matching_mounts.length > 0 ) {
               console.log( c_resolved_mount_point, 'is already mounted.' );
               process.exit( 1 );
            }
         })
         .then(function(){
            const child = spawn( 'sshfs', [ c_sshfs_mount_path, c_resolved_mount_point ] );

            child.stdin.setEncoding('utf-8');
            process.stdin.pipe(child.stdin);
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stdout);
            child.on( 'close',function(){
               console.log( c_resolved_mount_point );
               resolve();
            });
         });

      });// /new Promise()

   });

};// /main()


function read_ssh_config(){
   //const deferred = Q.defer();
   const path_config = path.join( HOME_DIR, '.ssh', 'config' );

   return fs.readFile( path_config, {
      encoding: 'utf8',
      flag: 'r'
   } );

   //return deferred.promise;
}// /read_ssh_config()




function expand_tilde( cPath ){
   return cPath.replace( /^~/, HOME_DIR );
}// /expand_tilde()