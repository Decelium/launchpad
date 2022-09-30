<img src="../images/Logo.png" alt="Decelium Logo" width="50" />

# A Simple Unity Scene

In this tutorial we will create a simple scene with Unity.

## Prerequisites

Before you start this tutorial you should have done the following:

1. Installed Decelium.
2. Created a Decelium wallet, added a user to the wallet, and added some CPU to the user's account.
3. Installed Unity.  


## Create the scene in Unity

from the Unity Hub, create a new project by clicking "New Project"
select "3D" from the list
select "Create Project"
select GameObject > 3D Object > Cube 
select File > Save
select File > Build Settings
under "Platform" select "WebGL"
under "IL2CPP Code Generation" select "Faster (smaller) builds"
click "Player Settings" button
under "Other Settings" change "Color Map" from "Linear" to "Gamma" 
click the "Change to gamma" button in the dialogue box to confirm
close the "Project Settings" window
press Add Open Scenes in the Build Settings window
select Build and Run in the Build Settings window
click New Folder. Name the new folder Build. Select the Build folder and press Select Folder
wait for the build to complete
A copy of the website will have been built into the directory Build

## Deploy the website to Decelium

1. `cd` to your `decelium/commands` directory. Deploy your website to Decelium with the command

    <pre> 
    python3 deploy.py <i>wallet_address</i> test.paxfinancial.ai <i>dest_path</i> <i>/[PATH_TO_PROJECT]</i>/Build/
    </pre>
The third argument, `dest_path` is a path that needs to begin with a slash and end with a `.ipfs` filename.     
Note that the trailing slash in the last argument is necessary.      
2.  Your website should be deployed to Decelium. If it has successfully deployed, you will see a line like `deployed...  obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  as  [filename]` where the `xxxx...` represents hexadecimal digits. This is an identifier unique to your deployment.
You should be able to view your website deployed on Decelium at `https://test.paxfinancial.ai/obj/obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/` (note the trailing slash).  




