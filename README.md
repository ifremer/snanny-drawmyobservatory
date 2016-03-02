# snanny-drawmyobservatory
Graphical edition of complex marine observatories. 
Packaged as an owncloud plugin for edition of file in native json format. 
Compliant with sensorML (import for single component description, export for complex systems).


## Requirements

Tested with Owncloud 8.1

Extend it with jquery-datetimepickerplugin 
Download jquery-datetimepicker from github: https://github.com/xdan/datetimepicker

Copy file jquery.datetimepicker.full.min.js in {owncloud_home}/core/vendor (tested with version 2.4.7)


## Build and Deploy



Copy the drawmyobservatory folder into your owncloud product in the folder apps


## Install 

Launch Owncloud 

Connect to your owncloud as admin : $host:$port ans select "Applications" in the menu

![alt tag](https://raw.githubusercontent.com/ifremer/snanny-drawmyobservatory/master/doc/install_01.PNG)

In the settings select "Activate experimentales apps" and Activate DrawMyObservatory

![alt tag](https://raw.githubusercontent.com/ifremer/snanny-drawmyobservatory/master/doc/install_02.PNG)

## Graphical Editor for observatories
Draw, save and export in sensorML

Done with Rappid (http://jointjs.com/about-rappid)
	
![alt tag](https://raw.githubusercontent.com/ifremer/snanny-drawmyobservatory/master/doc/draw_my_observatory.PNG)

## Development Environment

- Install VirtualBox and download the provided OVA
 https://owncloud.org/install/#instructions-server
 
- Import OVA into VirtualBox

- Mount external disk from local disk 

	Configuration > Shared Folders
	Add the path to your local folder and name unix mount to owncloud_plugins
	Select autoMount and permanent configuration
	
- Launch VM and connect as Admin

    Default keybord has english locale

- Follow the wizard of installation to change the local, and passwords

- Mount the disk by using theses commands 

   cd /mnt
   sudo mkdir plugins
   sudo mount -t vboxsf owncloud_plugins /mnt/plugins
   
- Change the folders permissions 

chmod 777 /var/www/owncloud

chmod 777 /var/www/owncloud/apps

- Create a symbolic Link to your development apps 

cd /var/www/owncloud/apps/

sudo ln -s /mnt/plugins/yourapp yourapp
