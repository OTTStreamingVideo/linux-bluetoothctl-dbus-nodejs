### README.md

Subject:	Bluetooth and D-Bus Tool for Linux

Date:			05-05-2022

Author:		[OTTStreamingVideo.net](https://OTTStreamingVideo.net)

License:	This software is provided free of charge in accordance with [GNU General Public License version 3](https://opensource.org/licenses/GPL-3.0).

Support:	This software is provided without any warranty or guarantee of any kind, and without any promise of support.

Note:			This software was written on an Ubuntu 22.04 desktop workstation and may also operate on other Linux distributions (e.g. Debian and Raspberry Pi OS).

### Overview

For a detailed explaination of how bluetooth operates in Linux, please download the [study guide](https://www.bluetooth.com/bluetooth-resources/bluetooth-for-linux/).

This tool provides a method to interact with the Linux bluetoothctl and dbus functions in NodeJs by spawning bash shells as child processes.

This tool is intended for development use on a single computer and does ***not*** include the normal public web security functions such as:

- firewall (e.g. ufw)

- https SSL certificate (e.g. [Let's Encrypt](https://letsencrypt.org))

- key file with password for secure SSH access

- domain name

The web interface uses a very simple Single Page Architecture ("SPA") for the HOME and README (i.e. this file rendered as HTML) content areas.

### Prerequistes

1. For Ubuntu 22.04, install NodeJS and NPM from the standard repositories:

		sudo apt install nodejs npm

2. Verify:

		node -v
		# expected version is 12.22.9 later

		npm -v
		# expected version is 8.5.1 or later


3. Earlier versions of NodeJS and NPM may likely operate also.


### Installation

1. Choose your preferred installation directory (e.g. $HOME):

		cd ~

2. Clone the repository:

		git clone hhttps://github.com/OTTStreamingVideo/linux-bluetoothctl-dbus-nodejs.git

3. Change directory to the repo directory:

		cd linux-bluetoothctl-dbus-nodejs

4. Install the required NodeJS packages:

		npm install ip
		npm install util
		npm install md5
		npm install https
		npm install url
		npm install body-parser
		npm install express
		npm install ws
		npm install markdown-it

5. Start the server.js app:

		node server.js
		# the shell terminal will display NodeJS console output

6. Open a web browser (e.g. Chrome, Chromium, Firefox, Opera):

		http://localhost:3000/

7. Click on the "bluetoothctl" and/or "dbus" button to see the bash shell outputs as they occur.

8. Modify the code as desired. Please fork the project and submit a pull request if you write code that could be useful to other developers.

### PulseAudio and GStreamer

Bluetooth audio functions can be written with [PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/) and [Gstreamer](https://gstreamer.freedesktop.org).

In Ubuntu 22, you can see what PulseAudio packages are installed with:

		apt list --installed | grep pulse 
		# not all PulseAudio packages contain "pulse"
		
You can see what packages are available in the repository with:

		apt list | grep pulse
		# not all PulseAudio packages contain "pulse"

Some useful PulseAudio commands are:

		pactl list
		pactl list short

A very useful PulseAudio tool that is not installed in Ubuntu 22 desktop by default is [pavacontrol](https://freedesktop.org/software/pulseaudio/pavucontrol/).

In Ubuntu 22, you can see what GStreamer packages are installed with:

		apt list --installed | grep gst
		# not all GStreamer packages contain "gst"
		
You can see what packages are available in the repository with:

		apt list | grep gst
		# not all GStreamer packages contain "gst"

Some useful Gstreamer commands are:

		gst-inspect-1.0
		# with no argument all available elements and plugins are listed
		
		gst-discoverer-1.0 --help
		
		gst-launch-1.0 --help
		
### Mobile Phone Bluetooth Experiment

1. Connect a mobile phone to your Ubuntu computer with the desktop Settings-Bluetooth control.

2. Monitor the dbus output for messages indicating that the phone has connected.

3. Call the connected mobile phone from a different mobile phone.

4. Monitor the dbus output for messages indicating that the phone call has been received.

5. View the Ubuntu Settings-Sound control (or pavucontrol) to see what bluetooth profile is in use (e.g. Headset Audio Gateway).

6. Execute a Gstreamer command to output audio from the bluetooth connection to a speaker attached to your Ubuntu desktop workstation, e.g.:

		GST_DEBUG=3 gst-launch-1.0 pulsesrc device=bluez_source.XX_XX_XX_XX_XX_XX.headset_audio_gateway volume=5.0 ! \
		queue ! \
		audioconvert ! \
		audioresample ! \
		pulsesink device=alsa_output.pci-0000_00_03.0.hdmi-stereo volume=5.0

		Note: use `pactl list` to find the pulsesrc device, and also to find the pulsesink device.

7. Write code to interact with the bluetoothctl and dbus that will execute your desired GStreaner audio functions.

		Note: You are responsible for the lawful and ethical use of audio recording and monitoring.
