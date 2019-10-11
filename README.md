# **Website Status Page Using Airtable** #

[<img src="https://deploy.stdlib.com/static/images/deploy.svg" width="192">](https://deploy.stdlib.com/)

Using [Standard Library's](https://stdlib.com) task scheduling API alongside Airtable, you can quickly set up and deploy a custom status page to track the performance of your website. Just set up your workflow using [Build](https://build.stdlib.com) on Standard Library, and then click on the Deploy button above, and you will have a real-time status monitoring application like the one pictured below up and running in no time!

![Screenshot](/readme/images/completed.png)

## **Deploying this Application**

First, make sure that you have a Standard Library account, as well as an Airtable account. Once you have those, add [this base](https://airtable.com/addBaseFromShare/shrZZOaBfrbnLGGJN) to Airtable, and populate the URL and Descriptions columns accordingly. It will end up looking something like this:

![Table](/readme/images/sites.png)

Now, **Create a New Project**, and fill out the **Choose Event and APIs** dialogue page to match the following:

![NewProjects](/readme/images/new_project.png)

This will form the bulk of the logic that will be responsible for populating our Airtable Base with information surrounding our site's performance. Click on **Create Workflow** and proceed to **Link Resources**. If this is your first time linking an Airtable account, make sure that you have your Airtable email and API key on hand in order to get up and running.

Once you have linked your Airtable account and selected the Status Page base that we created earlier, you are ready to configure your workflow APIs. On the **Configure Workflow APIs** tab, click on the **Developer Mode** button, and replace the code that you are able to edit with the snippet below.

You will need to **Run with Test Event**, and then click on the blue **Next** button. In the final screen you will give your workflow a name and click **Finish**. Our workflow will now populate our Airtable base with logs every ten minutes.

## **Visualizing Our Status** ##

[<img src="https://deploy.stdlib.com/static/images/deploy.svg" width="192">](https://deploy.stdlib.com/) <br />
Now you are ready to click on the the button above to deploy our application. You will find yourself on the following page:

![StatusPage](/readme/images/statusPage.png)

From here, click on the blue **Link Resource** button and choose the Airtable base that we used previously. You will see a confirmation just below the button declaring that **Identity Generated**, and the blue **Deploy Project** button will become active. Click on that, and your project is officially live.

To access your custom status page at any time, navigate to the following URL:

```
https://<Your-StdLib-Username>.api.stdlib.com/<Project-Name>@dev/
```
For <Project-Name\> above, use whatever you named your Project after clicking on the **Deploy** button. In my example provided, this would be **buildStatus**.

That's it! You can come back and check the status of your site at any time. Hopefully your squares are nice and green! Stay up to date with the latest updates from Standard Library by following us on Twitter [@StdLibHQ](https://twitter.com/StdLibHQ), or check out our [blog here.](https://stdlib.com/blog)