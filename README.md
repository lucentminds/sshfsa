# sshfsa  
05-02-2018  
SSHFS assistant for mounting a remote filesystem using SFTP.

### Installtion:
```shell
npm install -g git+https://github.com/lucentminds/sshfsa.git
```

Note: You may have to `su` as root to install. Haven't figured out how to fix this yet.

Edit your `~/.ssh/config` and add two commented out values...

```shell
  # sshfs_mount_point /path/to/mountpoint
  # sshfs_remote_directory /remote/path/to/use/as/root
```

Example config entry in `~/.ssh/config`

```shell
Host example.com
  HostName 127.0.0.1
  Port 22
  User exampleuser
  IdentityFile ~/.ssh/example.com
  # sshfs_mount_point ~/mnt/example.com
  # sshfs_remote_directory /home/exampleuser
```

To enable ssh host shell/terminal auto completion, copy the file `/usr/share/bash-completion/completions/ssh` to `/usr/share/bash-completion/completions/sshfsa` and put the following at the bottom of the copied file...
```conf
# Map ssh autocompletion to the sshfsa command.
complete -F _ssh sshfsa
```

Once this is done simply call `sshfsa Host` to mount the session.

## Mount Example

Example mount

```shell
sshfsa example.com
```

## Unmount Example

Example unmount

```shell
sshfsa example.com -u
```


## Todo

* Add shell autocompletion installation.