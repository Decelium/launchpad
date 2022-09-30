<img src="../images/Logo.png" alt="Decelium Logo" width="50"/>

# Your first React website on Decelium.com

Use the JavaScript UI-design library React to create a website showing the rotating React logo, and deploy it on Decelium. 

## Previous tasks

This tutorial assumes you have already done the following.

1. Created a Decelium wallet and added a user to it and added funds to the user's account.

2. Created a simple Create React App website using the instructions [here](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) .  You should have built a static website into `my-app/build` by running `npm run build`.

## Deploying the website on Decelium

1. The website has to be rebuilt using relative URLs. To do this, add the line `"homepage": "./",` to the file `my-app/package.json`. A good place to add it is after the `"name"` and `"version"` lines, like this:

        "name": "my-app",
        "version": "0.1.0",
        "homepage": "./",  <-added this line

2. Now rebuild the static website by running `npm run build` from the `my-app` directory.

3. `cd` to the `decelium/commands` directory of your Decelium installation and deploy the website to Decelium with the command

    <pre>
    python3 deploy.py <i>wallet_path</i> test.paxfinancial.ai <i>dest_path</i> <i>source_path</i>
    </pre>
    
    where 
    
    *wallet_path* is the path to your Decelium wallet
    
    *dest_path* is the destination path (on the webserver) for the website. It should start with a leading slash and end with a filename.
    
    *source path* is the location of the static website i.e. `/[path]/my-app/build/` (note the trailing slash which is necessary if the source_path is a directory). 
    
4.  Your website should be deployed to Decelium. If it has successfully deployed, you will see a line like `deployed...  obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  as  [filename]` where the `xxxx...` represents hexadecimal digits. This is an identifier unique to your deployment.
You should be able to view your website deployed on Decelium at `https://test.paxfinancial.ai/obj/obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/` (note the trailing slash). 