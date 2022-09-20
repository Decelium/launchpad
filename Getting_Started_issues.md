# “Getting Started” issues

1. Directory `examples` does not exist; it appears to have been renamed `commands`. The “Getting Started” documentation refers to it as `examples`

2. The repository should be cloned into a directory named `decelium`, not `decelium_wallet` (documentation has `decelium_wallet`)

3. `generate_a_wallet.py` has to be run from the `commands` directory in order for the import paths to be correct . This means that the wallet file will be created in `commands` (if one follows the documentation re the filename), which may not be the ideal place for it.

4. Had to install the Python package ecdsa 

5. Had to install the Python package cryptography

6. Gave name for wallet file as `.wallet.dec` but wallet file was created with name `new_wallet.dec` . This is because currently `generate_a_wallet.py` does not take command line arguments, instead the wallet filename is hard-coded into the script.

7. Got a 404 on `testfaucet.decelium.com` – Justin says this is a DNS issue (been resolved?)

8. On testfaucet website, it asks for “Your wallet address”. It hasn’t been explained what a wallet address is or where the user finds it. If I understand correctly, it’s actually the `api_key` for the user entry in the wallet. At present this is confusing.

9. The documentation references `./scripts/list_users.py all`.
There is no `scripts` directory.
There is no script `list_users.py` in any directory.

10. Under “Deploy Testnet Website/ A - Deploy website HTML File”, the list numbering is curious and needs to be fixed i.e. it repeats numbers and indents the 1’s. Actually, this happens in all the sections: the numbered lists are not formatted correctly, in a way that would not be acceptable in user-ready documentation. 

11. Under “Deploy Testnet Website/ A - Deploy website HTML File”, under the third 3, it says 
“Run `deploy.py index.html FileName`”. What `FileName` is hasn’t been explained, there’s no reference to it elsewhere. (Anyhow, this isn’t the correct usage of `deploy.py`, so see below.)

12. The instructions do not mention that a user has to be generated, or anything about how to generate users.

13. `generate_user.py`: the yes/no question has “Password:” as the prompt, which is confusing, it should probably be something like “Answer:”. 

14. `deploy.py` assumes there is a user called `admin` and that is the user that people will use. This is probably not how things should operate in the long term. We implemented a temporary workaround by hard-coding in the user name we wanted to use in place of `admin`.
Currently `deplopy.py` has no way (other than hard-coding) to indicate the user.

15. The bit “Create python file called deploy.py, and enter the following contents: 1. Upload_CONTENTS” is just plain wrong

16. The usage of deploy.py is:

    <pre>
    python3 deploy.py <i>wallet_path</i> test.paxfinancial.ai <i>dest_path</i> <i>source_path</i>
    </pre>
        
17. When using `deploy.py`, you have to add a trailing slash if the source path is a directory

18. To get `deploy.py` to work, had to have a leading slash and a filename in the `dest_path`
            I.e. we used `/test_create_react_app/index.ipfs` as `dest_path`. 


19. You have to build the React app to use relative URLs. This was done by adding a line to the package.json file:

        "name": "my-app",
        "version": "0.1.0",
        "homepage": "./",  <-added this line

20. Under “Fund your account with CPU”, the line “Websites hosted on the Decelium run on electricity, which can be bought at funding.test.decelium.com.” – ???
