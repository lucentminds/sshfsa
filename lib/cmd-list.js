
const get_sshfs_mounts = require( './get-sshfs-mounts' );

module.exports = function( o_args ){

   return get_sshfs_mounts()
   .then(function( a_mounts ){
      return new Promise(function( resolve ){

         switch( true ){
         case !!o_args.json:
            console.log( JSON.stringify( a_mounts ) );
            break;

         case !!o_args.csv:
            console.log( get_sshfs_mounts.properties.join( ',' ) );
            a_mounts.map(function( o_mount ){
               const a_line = [];
               for( var n in o_mount ){
                  a_line.push( `"${o_mount[n]}"` );
               }

               console.log( a_line.join( ',' ), '\n' );
            });
            break;

         default:
            a_mounts.map(function( o_mount ){
               console.log( o_mount.local_path );
            });
         }// /switch()

         resolve();
      });
   });

};
