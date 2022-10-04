<img src="../Logo.png" alt="Decelium Logo" width="50" />

# A Simple Unity Scene

In this tutorial we will use the Unity 3D editor to create a simple scene showing a cube on a landscape, build it in a format suitable for deployment on Decelium, and deploy it on Decelium. 

## Prerequisites

Before you start this tutorial you should have done the following:

1. Installed Decelium.
2. Created a Decelium wallet, added a user to the wallet, and added some CPU to the user's account.
3. Installed Unity.  

## Create the scene in Unity

1. From the Unity Hub, create a new project by clicking **New Project**
2. select **3D** from the list
3. select **Create Project**
4. select **GameObject > 3D Object > Cube** 
5. select **File > Save**
6. select **File > Build Settings**
7. under **Platform** select **WebGL**
8. under **IL2CPP Code Generation** select **Faster (smaller) builds**
9. click **Player Settings** button
10. under **Other Settings** change **Color Map** from **Linear** to **Gamma** 
11. click the **Change to gamma** button in the dialogue box to confirm
12. close the **Project Settings** window
13. press **Add Open Scenes** in the **Build Settings** window
14. select **Build and Run** in the **Build Settings** window
15. click **New Folder**. Name the new folder `Build`. Select the `Build` folder and press **Select Folder**.
16. Wait for the build to complete. A copy of the website will have been built into the directory Build.

## Deploy the website to Decelium

1. `cd` to your `decelium/commands` directory. Deploy your website to Decelium with the command

    <pre> 
    python3 deploy.py <i>wallet_address</i> test.paxfinancial.ai <i>dest_path</i> <i>/[PATH_TO_PROJECT]</i>/Build/
    </pre>
The third argument, `dest_path` is a path that needs to begin with a slash and end with a `.ipfs` filename.     
Note that the trailing slash in the last argument is necessary.      
2.  Your website should be deployed to Decelium. If it has successfully deployed, you will see a line like `deployed...  obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  as  [filename]` where the `xxxx...` represents hexadecimal digits. This is an identifier unique to your deployment.
You should be able to view your website deployed on Decelium at `https://test.paxfinancial.ai/obj/obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/` (note the trailing slash).  




