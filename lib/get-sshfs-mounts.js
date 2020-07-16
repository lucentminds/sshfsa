const exec = require( './exec-promise' );

const get_sshfs_mounts = module.exports = function() {
   return new Promise(function( resolve, reject ){

      exec( 'mount | grep fuse.sshfs' )
      //exec( 'mount | grep fuse' )
      .then(function( o_result ){
         if( o_result.stderr ){
            return reject( o_result.stderr );
         }

         const a_results = o_result.stdout.split( '\n' );
         const a_mounts = [];

         a_results.map(function( c_mount ){
            if( !c_mount.trim() ){
               return;
            }
            const a_mount = c_mount.split( / on | type | /g );
            a_mounts.push({
               host: a_mount[0].split( ':' )[0],
               local_path: a_mount[1],
               options: a_mount[3],
               remote_path: a_mount[0].split( ':' )[1],
               type: a_mount[2],
            });
         });
         resolve( a_mounts );
      }, function(){
         return resolve( [] );
      });

   });

};// /get_sshfs_mounts()

get_sshfs_mounts.properties = [
   'host',
   'local_path',
   'options',
   'remote_path',
   'type',
];
