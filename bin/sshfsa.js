#!/usr/bin/env node

/**
 * 05-02-2018
 * SSHFS assistant for mounting a remote filesystem using SFTP.
 * ~~ Scott Johnson
 */


/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

var Q = require( 'q' );
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );
const parse_ssh_config = require( '../lib/parse-ssh-config' );
const child_process = require('child_process');
const spawn = child_process.spawn;
const process_args = require('minimist');
const HOME_DIR = os.homedir();

var readFile = ( Q.denodeify( fs.readFile ) );
var exec = ( Q.denodeify( child_process.exec ) );

main( process.argv.slice( 2 ) );

function main( args ){
   const oArgs = process_args( args, {
      alias: {
         u: 'unmount'
      }
   } );
   const cHost = oArgs._[0];

   if( !cHost ) {
      console.log( 'Host is missing or invalid.' );
      process.exit( 1 );
   }

   read_ssh_config( cHost )
   .then( parse_ssh_config )
   .then(function( aHosts ){
      const aHost = aHosts.filter( function( o ){
         return o.Host == cHost;
      });

      if( aHost.length < 1 ) {
         console.log( `Host ${cHost} not found in ssh config file.` );
         process.exit( 1 );
      }

      return aHost[0];
   })
   .then(function( oHost ){
      
      if( oArgs.unmount === true ) {
         return unmount_host( oHost );
      }

      return mount_host( oHost );

   })
   .done(function( cResult ){
      cResult && console.log( cResult );
      process.exit( 0 );
   });

}// /main()


function read_ssh_config( cHost ){
   //const deferred = Q.defer();
   const path_config = path.join( HOME_DIR, '.ssh', 'config' );

   return readFile( path_config, {
      encoding: 'utf8',
      flag: 'r'
   } );

   //return deferred.promise;
}// /read_ssh_config()


function mount_host( oHost ){
   const deferred = Q.defer();
   const cMountPoint = expand_tilde( oHost.sshfs_mount_point );
   const cRemoteDir = oHost.sshfs_remote_directory || '/';
   const cHost = oHost.Host;
   const cHostAndPath = `${cHost}:${cRemoteDir}`;

   if( !cMountPoint ) {
      console.log( 'Local mount point is missing or invalid.' );
      process.exit( 1 );
   }

   get_sshfs_mounts()
   .then(function( aMounts ){

      // Check to see if this host is already mounted.
      if( aMounts.filter(function( cMount ){
         return cMount.indexOf( cHostAndPath ) > -1;
      }).length > 0 ) {
         console.log( cHostAndPath, 'is already mounted.' );
         deferred.resolve( cMountPoint );
         process.exit( 0 );
      }
   })
   .then(function(){
      const child = spawn( 'sshfs', [ cHostAndPath, cMountPoint ] );

      child.stdin.setEncoding('utf-8');
      process.stdin.pipe(child.stdin);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stdout);
      child.on( 'close',function(){
         deferred.resolve( cMountPoint );
      });
   })
   .done();

   return deferred.promise;
}// /mount_host()


function unmount_host( oHost ){
   const deferred = Q.defer();
   const cMountPoint = expand_tilde( oHost.sshfs_mount_point );

   if( !cMountPoint ) {
      console.log( 'Local mount point is missing or invalid.' );
      process.exit( 1 );      
   }

   const child = spawn( 'fusermount', [ '-u', cMountPoint ] );

   child.stdin.setEncoding('utf-8');
   process.stdin.pipe(child.stdin);
   child.stdout.pipe(process.stdout);
   child.stderr.pipe(process.stdout);
   child.on( 'close',function(){
      deferred.resolve();
   });

   return deferred.promise;
}// /unmount_host()

function get_sshfs_mounts() {
   const deferred = Q.defer();

   exec( 'mount | grep fuse.sshfs' )
   //exec( 'mount | grep fuse' )
   .then(function( aResult ){
      return deferred.resolve( aResult[ 0 ].split( '\n' ) );
   }, function(){
      return deferred.resolve( [] );
   }).done();

   return deferred.promise;
}// /get_sshfs_mounts()


function expand_tilde( cPath ){
   return cPath.replace( /^~/, HOME_DIR );
}// /expand_tilde()
