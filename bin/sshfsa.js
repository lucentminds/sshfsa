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
const process_args = require('minimist');

main( process.argv.slice( 2 ) );

function main( args ){
   var c_host;

   const o_args = process_args( args, {
      alias: {
         l: 'list',
         u: 'unmount'
      }
   } );

   switch( true ){
   case !!o_args.unmount:
      require( '../lib/cmd-unmount' )( o_args )
      .then(function(){
         process.exit(0);
      })
      .catch(function( err ){
         console.error( err );
         process.exit(1);
      });
      break;
   case !!o_args.list:
      require( '../lib/cmd-list' )( o_args )
      .then(function(){
         process.exit(0);
      })
      .catch(function( err ){
         console.error( err );
         process.exit(1);
      });
      break;

   default:
      require( '../lib/cmd-mount' )( o_args )
      .then(function(){
         process.exit(0);
      })
      .catch(function( err ){
         console.error( err );
         process.exit(1);
      });
   }// /switch()


}// /main()
