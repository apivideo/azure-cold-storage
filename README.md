[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video)
&nbsp; [![badge](https://img.shields.io/github/stars/apivideo/api.video-android-live-stream?style=social)](https://github.com/apivideo/api.video-android-live-stream)
&nbsp; [![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)
![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)
<h1 align="center">api.video videos backup to Azure Storage account</h1>

[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast
video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in
your app.

# Project description

api.video provides you with a convenient way of sending your transcoded videos to your preferred file storage solution. With the current script you'll be able to backup your transcoded videos on Azure Storage account.

## Preparation

**What we will need to run the script?**

1. [**api.video](http://api.video) API key**, you can find the information on how to retrieve the [API key in the Retrieve your api.video API key guide](https://docs.api.video/reference/authentication-guide#retrieve-your-apivideo-api-key)
2. [Azure Account Key](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal), or use any other credential system that Azure provides
3. Azure storage account name
4. [api.video](http://api.video) Cold Storage script
5. **Node.js** and **npm**, you can find the installation instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
6. **Typescript**, you can find the installation instructions [here](https://www.npmjs.com/package/typescript)

### Getting the Azure Storage Account name

- Navigate to your Azure portal
- Click on Storage Account  
- You’ll find the Storage Account in the list
  
    

## Getting Started

After you’ve got all the keys and installed node.js, npm and typescript, you can proceed with cloning the script from GitHub.

### Setting up the script

Once you are in the script directory, install the dependancies

```bash
$ npm install
```

After the dependancies are installed, we will need to enter the credentials we have copied in the preparation phase.

Edit the `.env` file and replace the following with the keys you've received from Azure and [api.video](http://api.video/). 

```bash
APIVIDEO_API_KEY = "apivideo_api_key"
AZURE_ACCOUNT_KEY = "Azure_account_key"
AZURE_STORAGE_ACCOUNT = "Your_azure_storage_account"
```

Don’t forget to save the file. 

## Running the backup

Once we got all the keys in place in the `.env` file, it's time to run the script. As we are running the script on TypeScript, we will need to build it first, hence, the first command you need to run in the script folder is:

```bash
$ npm run build
```

After the script was built, it’s time to run it:

# FAQ

If you have any questions, ask us in the [community](https://community.api.video)
