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
const process_args = require('minimist');
const chalk = require( 'chalk' );

main( process.argv.slice( 2 ) );

function main( args ){
   const o_args = process_args( args, {
      alias: {
         l: 'list',
         p: 'path',
         u: 'unmount'
      }
   } );

   switch( true ){
   case !!o_args.unmount:
      require( '../lib/cmd-unmount' )( o_args )
      .then(function(){
         process.exit(0);
      })
      .catch(function( a_err ){
         if( !Array.isArray( a_err ) ){
            a_err = [a_err];
         }

         a_err.forEach(( err ) => {
            console.error( chalk.red( err ) );            
         });
         process.exit(1);
      });
      break;
      
   case !!o_args.list:
      require( '../lib/cmd-list' )( o_args )
      .then(function(){
         process.exit(0);
      })
      .catch(function( err ){
         console.error( chalk.red( err ) );
         process.exit(1);
      });
      break;
      
   case !!o_args.path:
      require( '../lib/cmd-path' )( o_args )
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
         console.error( chalk.red( err ) );
         process.exit(1);
      });
   }// /switch()


}// /main()
